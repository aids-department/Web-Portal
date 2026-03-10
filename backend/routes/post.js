const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const cloudinary = require('cloudinary').v2;

const { Post, Comment, Reply } = require('../models/Post');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// ── Multer (images on posts) ─────────────────────────────────────────────────
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ── Small helper: upload one file to Cloudinary then remove temp ─────────────
async function uploadToCloudinary(filePath, originalName) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'posts',
    public_id: `${Date.now()}-${path.parse(originalName).name}`,
    resource_type: 'image',
    transformation: [{ width: 1200, crop: 'limit' }, { quality: 'auto' }],
  });
  fs.unlinkSync(filePath);
  return { url: result.secure_url, publicId: result.public_id };
}

// ── Helper: build a soft-delete update payload ───────────────────────────────
function softDeletePayload(userId) {
  return { isDeleted: true, deletedAt: new Date(), deletedBy: userId };
}

// ============================================================
// POST ROUTES
// ============================================================

// ── GET /api/posts ───────────────────────────────────────────────────────────
// Fetch all posts (paginated). Comments are NOT included here — they load
// only when a user clicks into a post (see GET /api/posts/:postId).
//
// Query params:
//   ?limit=10          how many posts per page  (default 10, max 50)
//   ?cursor=<postId>   last post id from previous page (cursor pagination)
//   ?sort=new|top      new = by date, top = by upvote count  (default: new)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 100, 50);
    const sort   = req.query.sort === 'top' ? { upvotesCount: -1, createdAt: -1 } : { createdAt: -1 };
    const cursor = req.query.cursor; // last seen postId

    // Base filter: only non-deleted posts
    const filter = { isDeleted: false };

    // Cursor: only return posts older than the cursor post (for "new" sort)
    // For simplicity we use createdAt-based cursor for the "new" feed
    if (cursor) {
      const cursorPost = await Post.findById(cursor).select('createdAt upvotes');
      if (cursorPost) {
        if (req.query.sort === 'top') {
          // for top feed, continue from where we left off using createdAt as tiebreaker
          filter.$or = [
            { 'upvotes.length': { $lt: cursorPost.upvotes.length } },
            {
              'upvotes.length': cursorPost.upvotes.length,
              createdAt: { $lt: cursorPost.createdAt },
            },
          ];
        } else {
          filter.createdAt = { $lt: cursorPost.createdAt };
        }
      }
    }

    const posts = await Post.find(filter)
      .populate('author', 'username fullName')   // only expose safe fields
      .select('-comments')                        // exclude comment array (heavy)
      .sort(sort)
      .limit(limit + 1);                         // fetch one extra to know if there's a next page

    // Determine if there's a next page
    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop(); // remove the extra item

    // Mask anonymous authors
    const sanitized = posts.map(maskAnonymous);

    res.json({
      posts: sanitized,
      hasNextPage,
      nextCursor: hasNextPage ? posts[posts.length - 1]._id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/posts/:postId ───────────────────────────────────────────────────
// Fetch a single post with ALL its comments and replies (full thread view)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    }).populate('author', 'username fullName');

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Fetch non-deleted comments for this post, newest first
    // We fetch them separately (not via .populate on post.comments) so we can
    // filter out deleted ones while still showing "[deleted]" placeholders
    const comments = await Comment.find({ parentPost: post._id })
      .populate('author', 'username fullName')
      .sort({ createdAt: -1 });

    // For each comment, fetch its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Reply.find({ parentComment: comment._id })
          .populate('author', 'username fullName')
          .sort({ createdAt: 1 }); // replies: oldest first (chronological)

        return {
          ...formatComment(comment),
          replies: replies.map(formatReply),
        };
      })
    );

    res.json({
      post: maskAnonymous(post),
      comments: commentsWithReplies,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/posts ──────────────────────────────────────────────────────────
// Create a new post. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, isAnonymous } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Upload any attached images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.path, file.originalname);
        images.push(uploaded);
      }
    }

    const post = await Post.create({
      title,
      content,
      author:      req.user.id,          // from JWT — no need to trust client-sent authorId
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      images,
    });

    const populated = await Post.findById(post._id).populate('author', 'username fullName');

    res.status(201).json({ success: true, post: maskAnonymous(populated) });
  } catch (err) {
    // Clean up temp files if something went wrong after multer but before cloudinary
    if (req.files) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/posts/:postId ───────────────────────────────────────────────────
// Edit a post. Only the original author can do this.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:postId', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId, isDeleted: false });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Ownership check — compare JWT userId with post.author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const { title, content } = req.body;
    if (title)   post.title   = title;
    if (content) post.content = content;

    post.isEdited = true;
    post.editedAt = new Date();

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/posts/:postId ────────────────────────────────────────────────
// SOFT delete a post. Author or admin can do this.
// The post stays in DB with isDeleted: true.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId, isDeleted: false });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Allow if: the requester is the author OR is an admin
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Soft delete the post
    Object.assign(post, softDeletePayload(req.user.id));
    await post.save();

    // Soft delete all comments and their replies under this post
    await Comment.updateMany(
      { parentPost: post._id, isDeleted: false },
      softDeletePayload(req.user.id)
    );
    await Reply.updateMany(
      { parentPost: post._id, isDeleted: false },
      softDeletePayload(req.user.id)
    );

    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/posts/:postId/hard ──────────────────────────────────────────
// HARD delete — admin only. Permanently removes from DB + Cloudinary images.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:postId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      await Promise.all(post.images.map(img => cloudinary.uploader.destroy(img.publicId)));
    }

    // Hard delete all replies and comments under this post
    const comments = await Comment.find({ parentPost: post._id });
    const commentIds = comments.map(c => c._id);

    await Reply.deleteMany({ parentComment: { $in: commentIds } });
    await Comment.deleteMany({ parentPost: post._id });
    await Post.findByIdAndDelete(post._id);

    res.json({ success: true, message: 'Post permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/posts/:postId/upvote ───────────────────────────────────────────
// Toggle upvote on a post. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:postId/upvote', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId, isDeleted: false });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.id;
    const idx    = post.upvotes.findIndex(id => id.toString() === userId);

    if (idx > -1) {
      post.upvotes.splice(idx, 1); // already upvoted → remove (toggle off)
    } else {
      post.upvotes.push(userId);   // not upvoted → add
    }

    await post.save();
    res.json({ success: true, upvotes: post.upvotes.length, upvotedByMe: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// COMMENT ROUTES
// ============================================================

// ── POST /api/posts/:postId/comments ────────────────────────────────────────
// Add a comment to a post. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:postId/comments', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId, isDeleted: false });

    if (!post) return res.status(404).json({ error: 'Post not found or deleted' });

    const { content, isAnonymous } = req.body;

    if (!content) return res.status(400).json({ error: 'Comment content is required' });

    const comment = await Comment.create({
      content,
      author:      req.user.id,
      parentPost:  post._id,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
    });

    // Push comment reference to post
    post.comments.push(comment._id);
    await post.save();

    const populated = await Comment.findById(comment._id).populate('author', 'username fullName');

    res.status(201).json({ success: true, comment: formatComment(populated) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/comments/:commentId ────────────────────────────────────────────
// Edit a comment. Only the author can do this.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, isDeleted: false });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    comment.content  = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    res.json({ success: true, comment: formatComment(comment) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/comments/:commentId ─────────────────────────────────────────
// SOFT delete a comment. Author or admin.
// Replies under this comment survive but will show "[deleted]" as parent.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, isDeleted: false });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    Object.assign(comment, softDeletePayload(req.user.id));
    await comment.save();

    // Soft delete all replies under this comment too
    await Reply.updateMany(
      { parentComment: comment._id, isDeleted: false },
      softDeletePayload(req.user.id)
    );

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/comments/:commentId/hard ────────────────────────────────────
// HARD delete a comment — admin only.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/comments/:commentId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await Reply.deleteMany({ parentComment: comment._id });
    await Comment.findByIdAndDelete(comment._id);

    // Remove reference from parent post
    await Post.updateOne(
      { _id: comment.parentPost },
      { $pull: { comments: comment._id } }
    );

    res.json({ success: true, message: 'Comment permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/comments/:commentId/upvote ────────────────────────────────────
// Toggle upvote on a comment. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/comments/:commentId/upvote', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, isDeleted: false });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userId = req.user.id;
    const idx    = comment.upvotes.findIndex(id => id.toString() === userId);

    if (idx > -1) {
      comment.upvotes.splice(idx, 1);
    } else {
      comment.upvotes.push(userId);
    }

    await comment.save();
    res.json({ success: true, upvotes: comment.upvotes.length, upvotedByMe: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// REPLY ROUTES
// ============================================================

// ── POST /api/comments/:commentId/replies ───────────────────────────────────
// Add a reply to a comment. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/comments/:commentId/replies', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId });

    // Allow replying even to soft-deleted comments (thread context preserved)
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const { content, isAnonymous } = req.body;
    if (!content) return res.status(400).json({ error: 'Reply content is required' });

    const reply = await Reply.create({
      content,
      author:        req.user.id,
      parentComment: comment._id,
      parentPost:    comment.parentPost,  // propagate post reference for user activity
      isAnonymous:   isAnonymous === 'true' || isAnonymous === true,
    });

    // Push reply reference into the comment's replies array
    comment.replies.push(reply._id);
    await comment.save();

    const populated = await Reply.findById(reply._id).populate('author', 'username fullName');

    res.status(201).json({ success: true, reply: formatReply(populated) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/replies/:replyId ────────────────────────────────────────────────
// Edit a reply. Only the author.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const reply = await Reply.findOne({ _id: req.params.replyId, isDeleted: false });

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    if (reply.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own replies' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    reply.content  = content;
    reply.isEdited = true;
    reply.editedAt = new Date();
    await reply.save();

    res.json({ success: true, reply: formatReply(reply) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/replies/:replyId ─────────────────────────────────────────────
// SOFT delete a reply. Author or admin.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const reply = await Reply.findOne({ _id: req.params.replyId, isDeleted: false });

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const isOwner = reply.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this reply' });
    }

    Object.assign(reply, softDeletePayload(req.user.id));
    await reply.save();

    res.json({ success: true, message: 'Reply deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/replies/:replyId/hard ───────────────────────────────────────
// HARD delete a reply — admin only.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/replies/:replyId/hard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    // Remove reference from parent comment
    await Comment.updateOne(
      { _id: reply.parentComment },
      { $pull: { replies: reply._id } }
    );

    await Reply.findByIdAndDelete(reply._id);

    res.json({ success: true, message: 'Reply permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/replies/:replyId/upvote ───────────────────────────────────────
// Toggle upvote on a reply. Requires auth.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/replies/:replyId/upvote', verifyToken, async (req, res) => {
  try {
    const reply = await Reply.findOne({ _id: req.params.replyId, isDeleted: false });

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const userId = req.user.id;
    const idx    = reply.upvotes.findIndex(id => id.toString() === userId);

    if (idx > -1) {
      reply.upvotes.splice(idx, 1);
    } else {
      reply.upvotes.push(userId);
    }

    await reply.save();
    res.json({ success: true, upvotes: reply.upvotes.length, upvotedByMe: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// USER ACTIVITY ROUTES
// ============================================================

// ── GET /api/posts/user/:userId ──────────────────────────────────────────────
// All posts made by a specific user (public profile view)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/user/:userId', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const filter = {
      author:      req.params.userId,
      isDeleted:   false,
      isAnonymous: false,   // don't expose anonymous posts on profile
    };

    if (cursor) {
      const cursorPost = await Post.findById(cursor).select('createdAt');
      if (cursorPost) filter.createdAt = { $lt: cursorPost.createdAt };
    }

    const posts = await Post.find(filter)
      .populate('author', 'username fullName')
      .select('-comments')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    res.json({ posts, hasNextPage, nextCursor: hasNextPage ? posts[posts.length - 1]._id : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/posts/user/:userId/comments ────────────────────────────────────
// All comments AND replies made by a specific user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/user/:userId/comments', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const filter = {
      author:      req.params.userId,
      isDeleted:   false,
      isAnonymous: false,
    };

    if (cursor) {
      const cursorDoc = await Comment.findById(cursor).select('createdAt')
        || await Reply.findById(cursor).select('createdAt');
      if (cursorDoc) filter.createdAt = { $lt: cursorDoc.createdAt };
    }

    // Fetch both comments and replies in parallel
    const [comments, replies] = await Promise.all([
      Comment.find(filter)
        .populate('author', 'username fullName')
        .populate('parentPost', 'title')          // show which post it was on
        .sort({ createdAt: -1 })
        .limit(limit),

      Reply.find(filter)
        .populate('author', 'username fullName')
        .populate('parentPost', 'title')
        .populate('parentComment', 'content')     // show which comment was replied to
        .sort({ createdAt: -1 })
        .limit(limit),
    ]);

    // Merge and sort by date so the feed is chronological
    const merged = [
      ...comments.map(c => ({ type: 'comment', ...formatComment(c) })),
      ...replies.map(r  => ({ type: 'reply',   ...formatReply(r) })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);

    res.json({ activity: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/posts/user/:userId/upvoted ─────────────────────────────────────
// All posts that the user has upvoted
// ─────────────────────────────────────────────────────────────────────────────
router.get('/user/:userId/upvoted', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const filter = {
      upvotes:   req.params.userId,   // MongoDB checks if the value is in the array
      isDeleted: false,
    };

    if (cursor) {
      const cursorPost = await Post.findById(cursor).select('createdAt');
      if (cursorPost) filter.createdAt = { $lt: cursorPost.createdAt };
    }

    const posts = await Post.find(filter)
      .populate('author', 'username fullName')
      .select('-comments')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    res.json({
      posts: posts.map(maskAnonymous),
      hasNextPage,
      nextCursor: hasNextPage ? posts[posts.length - 1]._id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// FORMATTING HELPERS
// These shape what the API sends to the client so that:
//  - anonymous posts never leak author info
//  - soft-deleted content shows "[deleted]" placeholder
//  - we never send internal fields like deletedBy to clients
// ============================================================

// Masks the author field on anonymous documents
function maskAnonymous(doc) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj.isAnonymous) {
    const realId = obj.author?._id || obj.author;
    obj.author = { _id: realId, username: 'Anonymous', fullName: 'Anonymous' };
  }
  return obj;
}

// Formats a comment for API response, handles soft-deleted state
function formatComment(comment) {
  const obj = comment.toObject ? comment.toObject() : { ...comment };

  if (obj.isDeleted) {
    // Preserve structure but scrub content + author (Reddit-style)
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

// Formats a reply for API response
function formatReply(reply) {
  const obj = reply.toObject ? reply.toObject() : { ...reply };

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

module.exports = router;