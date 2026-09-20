const express = require('express');
const router  = express.Router();
const multer  = require('multer');

const supabase = require('../config/supabaseClient');
const { uploadFile, deleteFile } = require('../lib/storage');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { serializePost, serializeComment, serializeReply } = require('../lib/serializers');

// `posts`/`comments`/`replies` each have two FKs into `users` (author_id and
// deleted_by), so PostgREST can't infer which one to embed without a hint.
const AUTHOR_SELECT = 'author:users!author_id(id, username, full_name)';

// ── Multer (images on posts, buffered in memory then pushed to Storage) ──────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

async function uploadPostImage(file) {
  const uploaded = await uploadFile('post-images', file.buffer, file.originalname, {
    folder: 'posts',
    contentType: file.mimetype,
  });
  return { url: uploaded.url, path: uploaded.path };
}

function softDeletePayload(userId) {
  return { is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: userId };
}

// Batch-fetches upvoter ids for many entities at once — one query per page
// instead of one per row — and groups them by entity id.
async function attachUpvoteArrays(joinTable, fkColumn, ids) {
  if (!ids || ids.length === 0) return {};
  const { data, error } = await supabase.from(joinTable).select(`${fkColumn}, user_id`).in(fkColumn, ids);
  if (error) throw error;
  const map = {};
  for (const row of data) {
    (map[row[fkColumn]] ||= []).push(row.user_id);
  }
  return map;
}

// Toggles a single user's upvote row and keeps the denormalized count column
// on the parent table in sync (used for feed sorting).
async function toggleUpvote(joinTable, fkColumn, entityId, userId, countTable) {
  const { data: existing } = await supabase
    .from(joinTable)
    .select('*')
    .eq(fkColumn, entityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    await supabase.from(joinTable).delete().eq(fkColumn, entityId).eq('user_id', userId);
  } else {
    await supabase.from(joinTable).insert({ [fkColumn]: entityId, user_id: userId });
  }

  const { count } = await supabase
    .from(joinTable)
    .select('*', { count: 'exact', head: true })
    .eq(fkColumn, entityId);

  await supabase.from(countTable).update({ upvotes_count: count }).eq('id', entityId);

  return { upvoted: !existing, count };
}

// ============================================================
// FORMATTING HELPERS
// Operate on already-serialized (camelCase, `_id`) objects — same
// contract the old Mongoose `.toObject()`-based helpers produced.
// ============================================================

function maskAnonymous(obj) {
  if (obj.isAnonymous) {
    const realId = obj.author?._id || obj.author;
    obj.author = { _id: realId, username: 'Anonymous', fullName: 'Anonymous' };
  }
  return obj;
}

function formatComment(obj) {
  if (obj.isDeleted) {
    return {
      _id:        obj._id,
      content:    '[deleted]',
      author:     { username: '[deleted]', fullName: '[deleted]' },
      parentPost: obj.parentPost,
      upvotes:    [],
      replies:    obj.replies || [],
      isDeleted:  true,
      isEdited:   false,
      createdAt:  obj.createdAt,
      updatedAt:  obj.updatedAt,
    };
  }
  if (obj.isAnonymous) {
    const realId = obj.author?._id || obj.author;
    obj.author = { _id: realId, username: 'Anonymous', fullName: 'Anonymous' };
  }
  return obj;
}

function formatReply(obj) {
  if (obj.isDeleted) {
    return {
      _id:           obj._id,
      content:       '[deleted]',
      author:        { username: '[deleted]', fullName: '[deleted]' },
      parentComment: obj.parentComment,
      parentPost:    obj.parentPost,
      upvotes:       [],
      isDeleted:     true,
      isEdited:      false,
      createdAt:     obj.createdAt,
      updatedAt:     obj.updatedAt,
    };
  }
  if (obj.isAnonymous) {
    const realId = obj.author?._id || obj.author;
    obj.author = { _id: realId, username: 'Anonymous', fullName: 'Anonymous' };
  }
  return obj;
}

// ============================================================
// POST ROUTES
// ============================================================

// ── GET /api/posts ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 100, 50);
    const isTop  = req.query.sort === 'top';
    const cursor = req.query.cursor;

    let query = supabase.from('posts').select(`*, ${AUTHOR_SELECT}`).eq('is_deleted', false);

    if (cursor) {
      const { data: cursorPost } = await supabase
        .from('posts')
        .select('created_at, upvotes_count')
        .eq('id', cursor)
        .maybeSingle();

      if (cursorPost) {
        if (isTop) {
          const iso = new Date(cursorPost.created_at).toISOString();
          query = query.or(
            `upvotes_count.lt.${cursorPost.upvotes_count},and(upvotes_count.eq.${cursorPost.upvotes_count},created_at.lt.${iso})`
          );
        } else {
          query = query.lt('created_at', cursorPost.created_at);
        }
      }
    }

    query = isTop
      ? query.order('upvotes_count', { ascending: false }).order('created_at', { ascending: false })
      : query.order('created_at', { ascending: false });

    const { data: posts, error } = await query.limit(limit + 1);
    if (error) throw error;

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    const upvoteMap = await attachUpvoteArrays('post_upvotes', 'post_id', posts.map((p) => p.id));
    const sanitized = posts.map((p) =>
      maskAnonymous(serializePost(p, { author: p.author, upvotes: upvoteMap[p.id] || [] }))
    );

    res.json({
      posts: sanitized,
      hasNextPage,
      nextCursor: hasNextPage ? sanitized[sanitized.length - 1]._id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/posts/:postId ───────────────────────────────────────────────────
router.get('/:postId', async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`*, ${AUTHOR_SELECT}`)
      .eq('id', req.params.postId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) throw error;
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { data: commentsRows, error: cErr } = await supabase
      .from('comments')
      .select(`*, ${AUTHOR_SELECT}`)
      .eq('parent_post_id', post.id)
      .order('created_at', { ascending: false });
    if (cErr) throw cErr;

    const commentIds = commentsRows.map((c) => c.id);

    const { data: repliesRows, error: rErr } = commentIds.length
      ? await supabase
          .from('replies')
          .select(`*, ${AUTHOR_SELECT}`)
          .in('parent_comment_id', commentIds)
          .order('created_at', { ascending: true })
      : { data: [], error: null };
    if (rErr) throw rErr;

    const replyIds = repliesRows.map((r) => r.id);

    const [postUpvoteMap, commentUpvoteMap, replyUpvoteMap] = await Promise.all([
      attachUpvoteArrays('post_upvotes', 'post_id', [post.id]),
      attachUpvoteArrays('comment_upvotes', 'comment_id', commentIds),
      attachUpvoteArrays('reply_upvotes', 'reply_id', replyIds),
    ]);

    const repliesByComment = {};
    for (const r of repliesRows) {
      (repliesByComment[r.parent_comment_id] ||= []).push(r);
    }

    const commentsWithReplies = commentsRows.map((c) => {
      const replies = (repliesByComment[c.id] || []).map((r) =>
        formatReply(serializeReply(r, { author: r.author, upvotes: replyUpvoteMap[r.id] || [] }))
      );
      const formatted = formatComment(
        serializeComment(c, { author: c.author, upvotes: commentUpvoteMap[c.id] || [] })
      );
      formatted.replies = replies;
      return formatted;
    });

    const serializedPost = serializePost(post, {
      author: post.author,
      upvotes: postUpvoteMap[post.id] || [],
      comments: commentsRows.map((c) => c.id),
    });

    res.json({
      post: maskAnonymous(serializedPost),
      comments: commentsWithReplies,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/posts ──────────────────────────────────────────────────────────
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, isAnonymous } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push(await uploadPostImage(file));
      }
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        author_id:   req.user.id,
        is_anonymous: isAnonymous === 'true' || isAnonymous === true,
        images,
      })
      .select(`*, ${AUTHOR_SELECT}`)
      .single();

    if (error) throw error;

    const serialized = serializePost(post, { author: post.author, upvotes: [] });
    res.status(201).json({ success: true, post: maskAnonymous(serialized) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/posts/:postId ───────────────────────────────────────────────────
router.put('/:postId', verifyToken, async (req, res) => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.postId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const updates = { is_edited: true, edited_at: new Date().toISOString() };
    if (req.body.title)   updates.title   = req.body.title;
    if (req.body.content) updates.content = req.body.content;

    const { data: updated, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', post.id)
      .select(`*, ${AUTHOR_SELECT}`)
      .single();
    if (error) throw error;

    const upvoteMap = await attachUpvoteArrays('post_upvotes', 'post_id', [post.id]);
    const serialized = serializePost(updated, { author: updated.author, upvotes: upvoteMap[post.id] || [] });

    res.json({ success: true, post: serialized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/posts/:postId ────────────────────────────────────────────────
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.postId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isOwner = post.author_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    const payload = softDeletePayload(req.user.id);
    await supabase.from('posts').update(payload).eq('id', post.id);
    await supabase.from('comments').update(payload).eq('parent_post_id', post.id).eq('is_deleted', false);
    await supabase.from('replies').update(payload).eq('parent_post_id', post.id).eq('is_deleted', false);

    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/posts/:postId/hard ──────────────────────────────────────────
// Comments/replies cascade-delete automatically via FK ON DELETE CASCADE.
router.delete('/:postId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { data: post } = await supabase.from('posts').select('*').eq('id', req.params.postId).maybeSingle();
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.images && post.images.length > 0) {
      await Promise.all(post.images.map((img) => deleteFile('post-images', img.path)));
    }

    await supabase.from('posts').delete().eq('id', post.id);

    res.json({ success: true, message: 'Post permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/posts/:postId/upvote ───────────────────────────────────────────
router.post('/:postId/upvote', verifyToken, async (req, res) => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', req.params.postId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const result = await toggleUpvote('post_upvotes', 'post_id', post.id, req.user.id, 'posts');
    res.json({ success: true, upvotes: result.count, upvotedByMe: result.upvoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// COMMENT ROUTES
// ============================================================

router.post('/:postId/comments', verifyToken, async (req, res) => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', req.params.postId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!post) return res.status(404).json({ error: 'Post not found or deleted' });

    const { content, isAnonymous } = req.body;
    if (!content) return res.status(400).json({ error: 'Comment content is required' });

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content,
        author_id:     req.user.id,
        parent_post_id: post.id,
        is_anonymous:  isAnonymous === 'true' || isAnonymous === true,
      })
      .select(`*, ${AUTHOR_SELECT}`)
      .single();
    if (error) throw error;

    const formatted = formatComment(serializeComment(comment, { author: comment.author, upvotes: [] }));
    res.status(201).json({ success: true, comment: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('*')
      .eq('id', req.params.commentId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const { data: updated, error } = await supabase
      .from('comments')
      .update({ content, is_edited: true, edited_at: new Date().toISOString() })
      .eq('id', comment.id)
      .select(`*, ${AUTHOR_SELECT}`)
      .single();
    if (error) throw error;

    const upvoteMap = await attachUpvoteArrays('comment_upvotes', 'comment_id', [comment.id]);
    const formatted = formatComment(
      serializeComment(updated, { author: updated.author, upvotes: upvoteMap[comment.id] || [] })
    );
    res.json({ success: true, comment: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('*')
      .eq('id', req.params.commentId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const isOwner = comment.author_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    const payload = softDeletePayload(req.user.id);
    await supabase.from('comments').update(payload).eq('id', comment.id);
    await supabase.from('replies').update(payload).eq('parent_comment_id', comment.id).eq('is_deleted', false);

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Replies cascade-delete automatically via FK.
router.delete('/comments/:commentId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('id')
      .eq('id', req.params.commentId)
      .maybeSingle();

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await supabase.from('comments').delete().eq('id', comment.id);

    res.json({ success: true, message: 'Comment permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/comments/:commentId/upvote', verifyToken, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('id')
      .eq('id', req.params.commentId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const result = await toggleUpvote('comment_upvotes', 'comment_id', comment.id, req.user.id, 'comments');
    res.json({ success: true, upvotes: result.count, upvotedByMe: result.upvoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// REPLY ROUTES
// ============================================================

router.post('/comments/:commentId/replies', verifyToken, async (req, res) => {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('id, parent_post_id')
      .eq('id', req.params.commentId)
      .maybeSingle();

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const { content, isAnonymous } = req.body;
    if (!content) return res.status(400).json({ error: 'Reply content is required' });

    const { data: reply, error } = await supabase
      .from('replies')
      .insert({
        content,
        author_id:         req.user.id,
        parent_comment_id: comment.id,
        parent_post_id:    comment.parent_post_id,
        is_anonymous:      isAnonymous === 'true' || isAnonymous === true,
      })
      .select(`*, ${AUTHOR_SELECT}`)
      .single();
    if (error) throw error;

    const formatted = formatReply(serializeReply(reply, { author: reply.author, upvotes: [] }));
    res.status(201).json({ success: true, reply: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const { data: reply } = await supabase
      .from('replies')
      .select('*')
      .eq('id', req.params.replyId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!reply) return res.status(404).json({ error: 'Reply not found' });
    if (reply.author_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own replies' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const { data: updated, error } = await supabase
      .from('replies')
      .update({ content, is_edited: true, edited_at: new Date().toISOString() })
      .eq('id', reply.id)
      .select(`*, ${AUTHOR_SELECT}`)
      .single();
    if (error) throw error;

    const upvoteMap = await attachUpvoteArrays('reply_upvotes', 'reply_id', [reply.id]);
    const formatted = formatReply(
      serializeReply(updated, { author: updated.author, upvotes: upvoteMap[reply.id] || [] })
    );
    res.json({ success: true, reply: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const { data: reply } = await supabase
      .from('replies')
      .select('*')
      .eq('id', req.params.replyId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const isOwner = reply.author_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this reply' });
    }

    await supabase.from('replies').update(softDeletePayload(req.user.id)).eq('id', reply.id);

    res.json({ success: true, message: 'Reply deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/replies/:replyId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { data: reply } = await supabase.from('replies').select('id').eq('id', req.params.replyId).maybeSingle();
    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    await supabase.from('replies').delete().eq('id', reply.id);

    res.json({ success: true, message: 'Reply permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/replies/:replyId/upvote', verifyToken, async (req, res) => {
  try {
    const { data: reply } = await supabase
      .from('replies')
      .select('id')
      .eq('id', req.params.replyId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const result = await toggleUpvote('reply_upvotes', 'reply_id', reply.id, req.user.id, 'replies');
    res.json({ success: true, upvotes: result.count, upvotedByMe: result.upvoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// USER ACTIVITY ROUTES
// ============================================================

router.get('/user/:userId', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    let query = supabase
      .from('posts')
      .select(`*, ${AUTHOR_SELECT}`)
      .eq('author_id', req.params.userId)
      .eq('is_deleted', false)
      .eq('is_anonymous', false);

    if (cursor) {
      const { data: cursorPost } = await supabase.from('posts').select('created_at').eq('id', cursor).maybeSingle();
      if (cursorPost) query = query.lt('created_at', cursorPost.created_at);
    }

    const { data: posts, error } = await query.order('created_at', { ascending: false }).limit(limit + 1);
    if (error) throw error;

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    const upvoteMap = await attachUpvoteArrays('post_upvotes', 'post_id', posts.map((p) => p.id));
    const serialized = posts.map((p) => serializePost(p, { author: p.author, upvotes: upvoteMap[p.id] || [] }));

    res.json({
      posts: serialized,
      hasNextPage,
      nextCursor: hasNextPage ? serialized[serialized.length - 1]._id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId/comments', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    let cursorDate = null;
    if (cursor) {
      const { data: c } = await supabase.from('comments').select('created_at').eq('id', cursor).maybeSingle();
      const { data: r } = c ? { data: null } : await supabase.from('replies').select('created_at').eq('id', cursor).maybeSingle();
      cursorDate = c?.created_at || r?.created_at || null;
    }

    let commentsQuery = supabase
      .from('comments')
      .select(`*, ${AUTHOR_SELECT}, parent_post:posts(id, title)`)
      .eq('author_id', req.params.userId)
      .eq('is_deleted', false)
      .eq('is_anonymous', false);

    let repliesQuery = supabase
      .from('replies')
      .select(`*, ${AUTHOR_SELECT}, parent_post:posts(id, title), parent_comment:comments(id, content)`)
      .eq('author_id', req.params.userId)
      .eq('is_deleted', false)
      .eq('is_anonymous', false);

    if (cursorDate) {
      commentsQuery = commentsQuery.lt('created_at', cursorDate);
      repliesQuery  = repliesQuery.lt('created_at', cursorDate);
    }

    const [{ data: commentsRows, error: cErr }, { data: repliesRows, error: rErr }] = await Promise.all([
      commentsQuery.order('created_at', { ascending: false }).limit(limit),
      repliesQuery.order('created_at', { ascending: false }).limit(limit),
    ]);
    if (cErr) throw cErr;
    if (rErr) throw rErr;

    const [commentUpMap, replyUpMap] = await Promise.all([
      attachUpvoteArrays('comment_upvotes', 'comment_id', commentsRows.map((c) => c.id)),
      attachUpvoteArrays('reply_upvotes', 'reply_id', repliesRows.map((r) => r.id)),
    ]);

    const merged = [
      ...commentsRows.map((c) => ({
        type: 'comment',
        ...formatComment(
          serializeComment(c, {
            author: c.author,
            upvotes: commentUpMap[c.id] || [],
            parentPost: c.parent_post ? { _id: c.parent_post.id, title: c.parent_post.title } : c.parent_post_id,
          })
        ),
      })),
      ...repliesRows.map((r) => ({
        type: 'reply',
        ...formatReply(
          serializeReply(r, {
            author: r.author,
            upvotes: replyUpMap[r.id] || [],
            parentPost: r.parent_post ? { _id: r.parent_post.id, title: r.parent_post.title } : r.parent_post_id,
            parentComment: r.parent_comment
              ? { _id: r.parent_comment.id, content: r.parent_comment.content }
              : r.parent_comment_id,
          })
        ),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({ activity: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId/upvoted', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const { data: upvoteRows, error: uErr } = await supabase
      .from('post_upvotes')
      .select('post_id')
      .eq('user_id', req.params.userId);
    if (uErr) throw uErr;

    const postIds = upvoteRows.map((r) => r.post_id);
    if (postIds.length === 0) {
      return res.json({ posts: [], hasNextPage: false, nextCursor: null });
    }

    let query = supabase.from('posts').select(`*, ${AUTHOR_SELECT}`).in('id', postIds).eq('is_deleted', false);

    if (cursor) {
      const { data: cursorPost } = await supabase.from('posts').select('created_at').eq('id', cursor).maybeSingle();
      if (cursorPost) query = query.lt('created_at', cursorPost.created_at);
    }

    const { data: posts, error } = await query.order('created_at', { ascending: false }).limit(limit + 1);
    if (error) throw error;

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    const upvoteMap = await attachUpvoteArrays('post_upvotes', 'post_id', posts.map((p) => p.id));
    const sanitized = posts.map((p) =>
      maskAnonymous(serializePost(p, { author: p.author, upvotes: upvoteMap[p.id] || [] }))
    );

    res.json({
      posts: sanitized,
      hasNextPage,
      nextCursor: hasNextPage ? sanitized[sanitized.length - 1]._id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
