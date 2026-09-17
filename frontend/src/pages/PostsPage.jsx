import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, XCircle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import CommentThread from '../components/CommentThread';

const BASE_URL = 'https://web-portal-760h.onrender.com';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const SORT_OPTIONS = [
  ['newest', 'Recent'],
  ['popular', 'Most upvoted'],
  ['discussed', 'Most discussed'],
];

const VIEW_OPTIONS = [
  ['all', 'All posts'],
  ['mine', 'My posts'],
  ['saved', 'Saved'],
];

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewFilter, setViewFilter] = useState('all');
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ top: 0, left: 0 });

  // Inline "new post" composer state (replaces the old modal)
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerAnonymous, setComposerAnonymous] = useState(false);
  const [composerImages, setComposerImages] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts`);
      const data = await res.json();
      setPosts(data.posts ?? data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setLoading(false);
    }
  }, []);

  const fetchSinglePost = useCallback(async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}`);
      const data = await res.json();
      const merged = { ...data.post, comments: data.comments };
      setSelectedPost(merged);
      return merged;
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', composerTitle);
      formData.append('content', composerContent);
      formData.append('isAnonymous', composerAnonymous);
      composerImages.forEach((img) => formData.append('images', img.file));

      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchPosts();
        setComposerTitle('');
        setComposerContent('');
        setComposerAnonymous(false);
        setComposerImages([]);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleComposerFiles = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => ({ preview: URL.createObjectURL(f), file: f }));
    setComposerImages((prev) => [...prev, ...newImages]);
  };
  const removeComposerImage = (i) => setComposerImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpvote = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/upvote`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        fetchPosts();
        if (selectedPost?._id === postId) fetchSinglePost(postId);
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: comment.content, isAnonymous: comment.isAnonymous }),
      });
      if (res.ok) {
        fetchPosts();
        fetchSinglePost(postId);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddReply = async (commentId, reply) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}/replies`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: reply.content, isAnonymous: reply.isAnonymous }),
      });
      if (res.ok && selectedPost) fetchSinglePost(selectedPost._id);
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) fetchSinglePost(selectedPost._id);
    } catch (err) {
      console.error('Failed to upvote comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) {
        fetchSinglePost(selectedPost._id);
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/replies/${replyId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) fetchSinglePost(selectedPost._id);
    } catch (err) {
      console.error('Failed to delete reply:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        fetchPosts();
        if (selectedPost?._id === postId) setSelectedPost(null);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ title: updatedPost.title, content: updatedPost.content }),
      });
      if (res.ok) {
        fetchPosts();
        setEditingPost(null);
        if (selectedPost?._id === editingPost._id) fetchSinglePost(editingPost._id);
      }
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handleUpvoteReply = async (replyId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/replies/${replyId}/upvote`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) fetchSinglePost(selectedPost._id);
    } catch (err) {
      console.error('Failed to upvote reply:', err);
    }
  };

  const handleSharePost = (post) => {
    const url = `${window.location.origin}/posts/${post._id}`;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSavePost = (postId) => {
    setSavedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  };

  const handleProfileClick = async (author, event) => {
    try {
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      setProfilePosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });

      const [profileRes, achRes] = await Promise.all([
        fetch(`${BASE_URL}/api/profile/${author._id || author.id}`),
        fetch(`${BASE_URL}/api/achievements/user/${author._id || author.id}`),
      ]);
      const profile = await profileRes.json();
      const achievements = await achRes.json();

      setSelectedProfile({
        ...profile,
        username: author.username,
        achievements: achievements.filter((a) => a.status === 'approved'),
      });
      setIsProfileModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const filteredPosts = posts
    .filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content?.toLowerCase().includes(searchQuery.toLowerCase());
      const authorId = p.author?._id?.toString() || p.author?.id?.toString();
      if (viewFilter === 'mine') return matchesSearch && authorId === currentUser.id?.toString();
      if (viewFilter === 'saved') return matchesSearch && savedPosts.includes(p._id);
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'popular') return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      if (sortBy === 'discussed') return (b.comments?.length || 0) - (a.comments?.length || 0);
      return 0;
    });

  const handleOpenPost = async (post) => {
    await fetchSinglePost(post._id);
  };

  const closeProfileModal = () => setIsProfileModalOpen(false);

  if (loading) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading posts…</p>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="font-brand relative">
        <PostThread
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
          onUpvoteComment={handleUpvoteComment}
          onDeleteComment={handleDeleteComment}
          onDeleteReply={handleDeleteReply}
          onUpvoteReply={handleUpvoteReply}
          currentUser={currentUser}
          onUpvote={() => handleUpvote(selectedPost._id)}
          onShare={() => handleSharePost(selectedPost)}
          onSave={() => handleSavePost(selectedPost._id)}
          isSaved={savedPosts.includes(selectedPost._id)}
          onProfileClick={handleProfileClick}
          onEdit={() => setEditingPost(selectedPost)}
          onDelete={() => handleDeletePost(selectedPost._id)}
        />

        {editingPost && (
          <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSubmit={handleUpdatePost} />
        )}
        {isProfileModalOpen && selectedProfile && (
          <ProfileModal position={profilePosition} selectedProfile={selectedProfile} onClose={closeProfileModal} />
        )}
      </div>
    );
  }

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-5.5 gap-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Student board
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Posts
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`px-3.5 py-2 text-[12px] font-semibold ${
                sortBy === val ? 'bg-brand-navy text-white' : 'border border-brand-edge text-brand-ink-soft'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-stretch border-2 border-brand-navy max-w-sm flex-1 min-w-[220px]">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts…"
            className="flex-1 px-3.5 py-2.5 text-[13px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {VIEW_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setViewFilter(val)}
              className={`px-3 py-1.5 text-[11.5px] font-medium ${
                viewFilter === val ? 'bg-brand-navy text-white' : 'border border-brand-edge text-brand-ink-soft'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* New post composer */}
      <form onSubmit={handleCreatePost} className="border border-brand-edge p-5 flex flex-col gap-3.5">
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy">New post</span>
        <input
          required
          value={composerTitle}
          onChange={(e) => setComposerTitle(e.target.value)}
          placeholder="Title"
          className="border border-brand-ink-faint px-3.5 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy placeholder:text-brand-ink-faint"
        />
        <textarea
          required
          value={composerContent}
          onChange={(e) => setComposerContent(e.target.value)}
          placeholder="Say what you want to say."
          rows={3}
          className="border border-brand-ink-faint px-3.5 py-3 text-[13.5px] leading-[1.6] text-brand-ink outline-none focus:border-brand-navy resize-none placeholder:text-brand-ink-faint"
        />

        {composerImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {composerImages.map((img, i) => (
              <div key={i} className="relative border border-brand-edge">
                <img src={img.preview} className="w-full h-20 object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeComposerImage(i)}
                  className="absolute top-1 right-1 bg-white/90 text-brand-red"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2.5 border border-dashed border-brand-ink-faint px-3.5 py-3 cursor-pointer text-[12.5px] text-brand-ink-soft w-fit">
          <Upload size={15} />
          Attach images
          <input type="file" multiple accept="image/*" onChange={handleComposerFiles} className="hidden" />
        </label>

        <div className="flex justify-between items-center gap-3.5 flex-wrap">
          <label className="flex items-center gap-2.5 text-[12.5px] text-[#3a3838]">
            <input
              type="checkbox"
              checked={composerAnonymous}
              onChange={(e) => setComposerAnonymous(e.target.checked)}
              className="w-3.5 h-3.5"
            />
            Post anonymously
          </label>
          <button type="submit" className="px-[18px] py-3 bg-brand-red text-white text-[12.5px] font-semibold">
            Publish
          </button>
        </div>
      </form>

      {/* Feed */}
      <div className="flex flex-col border-t-2 border-brand-navy">
        {filteredPosts.length === 0 ? (
          <div className="border-b border-brand-row p-10 text-center">
            <p className="m-0 text-[13.5px] text-brand-ink-soft">
              {viewFilter === 'mine'
                ? "You haven't posted anything yet."
                : viewFilter === 'saved'
                ? "You haven't saved any posts yet."
                : 'No posts yet. Be the first to post!'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostRow
              key={post._id}
              post={post}
              onOpen={() => handleOpenPost(post)}
              onUpvote={(e) => { e.stopPropagation(); handleUpvote(post._id); }}
              onShare={(e) => { e.stopPropagation(); handleSharePost(post); }}
              onSave={(e) => { e.stopPropagation(); handleSavePost(post._id); }}
              isSaved={savedPosts.includes(post._id)}
              currentUserId={currentUser.id}
              onProfileClick={handleProfileClick}
              onEdit={(e) => { e.stopPropagation(); setEditingPost(post); }}
              onDelete={(e) => { e.stopPropagation(); handleDeletePost(post._id); }}
            />
          ))
        )}
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSubmit={handleUpdatePost} />
      )}
      {isProfileModalOpen && selectedProfile && (
        <ProfileModal position={profilePosition} selectedProfile={selectedProfile} onClose={closeProfileModal} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEED ROW
// ─────────────────────────────────────────────────────────────────────────────
const PostRow = ({ post, onOpen, onUpvote, onShare, onSave, isSaved, currentUserId, onProfileClick, onEdit, onDelete }) => {
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted = post.upvotes?.includes(currentUserId);
  const isOwner = post.author?._id === currentUserId || post.author?.id === currentUserId;
  const when = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div
      onClick={onOpen}
      className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-4 border-b border-brand-row px-1.5 py-[18px] cursor-pointer hover:bg-[#f7f9fc]"
    >
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <button
          onClick={onUpvote}
          title={hasUpvoted ? "Remove upvote" : "Upvote post"}
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded transition-colors ${
            hasUpvoted
              ? 'bg-brand-red-tint text-brand-red font-semibold'
              : 'hover:bg-brand-ground text-brand-ink-soft hover:text-brand-navy'
          }`}
        >
          <span className="text-[12px] leading-none">▲</span>
          <span className="text-[13px] font-semibold tabular-nums">{post.upvotes?.length || 0}</span>
        </button>
      </div>
      <div className="min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {!post.isAnonymous ? (
            <button onClick={(e) => onProfileClick(post.author, e)} className="text-[11.5px] text-brand-blue font-medium">
              {displayName}
            </button>
          ) : (
            <span className="text-[11.5px] text-brand-ink-soft">{displayName}</span>
          )}
          <span className="text-[11.5px] text-brand-ink-soft">· {when}</span>
        </div>
        <h3 className="m-0 text-[17px] font-semibold text-brand-navy leading-[1.3]">{post.title}</h3>
        <p className="m-0 max-w-[88ch] text-[13px] leading-[1.65] text-brand-ink-soft line-clamp-2">
          {post.content}
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[11.5px] font-medium text-brand-blue tabular-nums">
            {post.comments?.length || 0} replies
          </span>
          <button onClick={onSave} className={`text-[11.5px] font-medium ${isSaved ? 'text-brand-navy' : 'text-brand-ink-soft'}`}>
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button onClick={onShare} className="text-[11.5px] font-medium text-brand-ink-soft">
            Share
          </button>
          {isOwner && (
            <>
              <button onClick={onEdit} className="text-[11.5px] font-medium text-brand-ink-soft">
                Edit
              </button>
              <button onClick={onDelete} className="text-[11.5px] font-medium text-brand-red">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// THREAD (inline detail view, no URL change — see PostDetailPage.jsx for the
// URL-addressable /posts/:postId equivalent)
// ─────────────────────────────────────────────────────────────────────────────
const PostThread = ({
  post, onBack, onAddComment, onAddReply,
  onUpvoteComment, onDeleteComment,
  onDeleteReply, onUpvoteReply,
  currentUser, onUpvote, onShare, onSave, isSaved, onProfileClick,
  onEdit, onDelete,
}) => {
  const [mode, setMode] = useState('Public');
  const [commentText, setCommentText] = useState('');
  const hasUpvoted = post.upvotes?.includes(currentUser.id);
  const when = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const isOwner = post.author?._id === currentUser.id || post.author?.id === currentUser.id;

  const handleNewComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post._id, { content: commentText, isAnonymous: mode === 'Anonymous' });
    setCommentText('');
  };

  return (
    <div>
      <div className="px-5 sm:px-8 lg:px-12 py-4 border-b border-brand-edge flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="text-[12px] font-medium text-brand-blue hover:underline">
          Posts
        </button>
        <span className="text-[12px] text-brand-ink-faint">/</span>
        <span className="text-[12px] text-brand-ink-soft truncate max-w-[40ch]">{post.title}</span>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-8 lg:py-9 max-w-[900px] flex flex-col gap-6">
        <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onUpvote}
              title={hasUpvoted ? "Remove upvote" : "Upvote post"}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded transition-colors ${
                hasUpvoted
                  ? 'bg-brand-red-tint text-brand-red font-semibold'
                  : 'hover:bg-brand-ground text-brand-ink-soft hover:text-brand-navy'
              }`}
            >
              <span className="text-[14px] leading-none">▲</span>
              <span className="text-[15px] font-semibold tabular-nums">{post.upvotes?.length || 0}</span>
            </button>
          </div>
          <div className="min-w-0 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {!post.isAnonymous ? (
                <button onClick={(e) => onProfileClick(post.author, e)} className="text-[11.5px] text-brand-blue font-medium">
                  {displayName}
                </button>
              ) : (
                <span className="text-[11.5px] text-brand-ink-soft">{displayName}</span>
              )}
              <span className="text-[11.5px] text-brand-ink-soft">· {when}</span>
              {post.isEdited && <span className="text-[11px] italic text-brand-ink-faint">(edited)</span>}
            </div>
            <h1 className="m-0 text-[24px] sm:text-[30px] leading-[1.2] font-semibold text-brand-navy max-w-[28ch]">
              {post.title}
            </h1>
            <p className="m-0 max-w-[76ch] text-[14.5px] leading-[1.75] text-[#3a3838] whitespace-pre-line">
              {post.content}
            </p>

            {post.images?.length > 0 && (
              <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-video bg-brand-ground border border-brand-edge overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/70 grid place-items-center">
                        <span className="text-white font-semibold text-xl">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 flex-wrap border-t border-brand-row pt-3">
              <button onClick={onShare} className="text-[12px] font-medium text-brand-ink-soft">Share</button>
              <button onClick={onSave} className={`text-[12px] font-medium ${isSaved ? 'text-brand-navy' : 'text-brand-ink-soft'}`}>
                {isSaved ? 'Saved' : 'Save'}
              </button>
              {isOwner && (
                <>
                  <button onClick={onEdit} className="text-[12px] font-medium text-brand-ink-soft">Edit</button>
                  <button onClick={onDelete} className="text-[12px] font-medium text-brand-red">Delete</button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border border-brand-edge p-4 flex flex-col gap-3">
          <form onSubmit={handleNewComment} className="flex flex-col gap-2.5">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a reply"
              className="border border-brand-ink-faint px-3.5 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy placeholder:text-brand-ink-faint"
            />
            <div className="flex justify-between items-center gap-3.5 flex-wrap">
              <div className="flex items-center gap-3.5">
                <label className="flex items-center gap-2 text-[12.5px] text-[#3a3838]">
                  <input
                    type="checkbox"
                    checked={mode === 'Anonymous'}
                    onChange={(e) => setMode(e.target.checked ? 'Anonymous' : 'Public')}
                    className="w-3.5 h-3.5"
                  />
                  Reply anonymously
                </label>
              </div>
              <button type="submit" className="px-[17px] py-2.5 bg-brand-navy text-white text-[12px] font-semibold">
                Reply
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col border-t-2 border-brand-navy pt-1">
          {!post.comments || post.comments.length === 0 ? (
            <p className="pt-4 text-[13px] italic text-brand-ink-soft">No comments yet. Be the first!</p>
          ) : (
            post.comments.map((comment) => (
              <CommentThread
                key={comment._id}
                comment={comment}
                onAddReply={onAddReply}
                onUpvoteComment={onUpvoteComment}
                onDeleteComment={onDeleteComment}
                onDeleteReply={onDeleteReply}
                onUpvoteReply={onUpvoteReply}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT POST MODAL
// ─────────────────────────────────────────────────────────────────────────────
const EditPostModal = ({ post, onClose, onSubmit }) => {
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ title, content }); };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[9998] bg-black/50" />
      <div className="font-brand fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[480px] bg-white border border-brand-edge">
        <div className="bg-brand-navy px-6 py-4 flex items-center justify-between">
          <h2 className="m-0 text-[15px] font-semibold text-white">Edit post</h2>
          <button onClick={onClose} className="text-brand-on-navy">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-brand-ink-faint px-3 py-2.5 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">Content</span>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="border border-brand-ink-faint px-3 py-2.5 text-[13.5px] leading-[1.6] text-brand-ink outline-none focus:border-brand-navy resize-none"
            />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-brand-ink-faint text-[13px] font-medium text-brand-ink-soft">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-navy text-white text-[13px] font-semibold">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTHOR PROFILE POPOVER
// ─────────────────────────────────────────────────────────────────────────────
const ProfileModal = ({ position, selectedProfile, onClose }) => (
  <>
    <div className="fixed inset-0 z-[999] bg-black/40" onClick={onClose} />
    <div
      className="font-brand absolute z-[1000] bg-white border border-brand-edge shadow-lg w-full max-w-sm max-h-[90vh] overflow-y-auto"
      style={{
        top: Math.min(position.top, window.innerHeight - 500),
        left: window.innerWidth < 768 ? '50%' : Math.min(position.left, window.innerWidth - 320),
        transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none',
      }}
    >
      <div className="p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="m-0 text-[15px] font-semibold text-brand-navy">Profile</h3>
          <button onClick={onClose} className="text-brand-ink-soft"><X size={17} /></button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-20 h-20 bg-brand-navy overflow-hidden grid place-items-center text-white text-2xl font-semibold">
            {selectedProfile.profileImage?.url ? (
              <img src={selectedProfile.profileImage.url} alt="" className="w-full h-full object-cover" />
            ) : (
              selectedProfile.name?.[0]?.toUpperCase() || selectedProfile.username?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <h4 className="m-0 text-[17px] font-semibold text-brand-navy">
            {selectedProfile.name || selectedProfile.username}
          </h4>
          <p className="m-0 text-[12.5px] text-brand-ink-soft">
            {selectedProfile.year ? `${selectedProfile.year} Year Student` : 'Student'}
          </p>
        </div>

        {selectedProfile.bio && (
          <div className="flex flex-col gap-2">
            <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-brand-navy">About</span>
            <p className="m-0 text-[13px] leading-[1.6] text-[#3a3838] bg-brand-ground p-3">{selectedProfile.bio}</p>
          </div>
        )}

        {selectedProfile.skills?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-brand-navy">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedProfile.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 border border-brand-ink-faint text-[11px] text-[#3a3838]">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {selectedProfile.socialLinks && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-brand-navy">Connect</span>
            {selectedProfile.socialLinks.github && (
              <a href={selectedProfile.socialLinks.github} target="_blank" rel="noreferrer" className="text-[12.5px] text-brand-blue">GitHub profile</a>
            )}
            {selectedProfile.socialLinks.leetcode && (
              <a href={selectedProfile.socialLinks.leetcode} target="_blank" rel="noreferrer" className="text-[12.5px] text-brand-blue">LeetCode profile</a>
            )}
            {selectedProfile.socialLinks.linkedin && (
              <a href={selectedProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[12.5px] text-brand-blue">LinkedIn profile</a>
            )}
          </div>
        )}

        {selectedProfile.achievements?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-brand-navy">Achievements</span>
            <div className="flex flex-col gap-2">
              {selectedProfile.achievements.slice(0, 3).map((a) => (
                <div key={a._id} className="border border-brand-edge p-2.5">
                  <h6 className="m-0 text-[12.5px] font-semibold text-brand-navy mb-1">{a.title}</h6>
                  {a.description && <p className="m-0 text-[11.5px] text-brand-ink-soft mb-1.5">{a.description}</p>}
                  {a.certificate?.url && (
                    <a href={a.certificate.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-brand-blue">
                      <FileText size={11} /> View certificate
                    </a>
                  )}
                </div>
              ))}
              {selectedProfile.achievements.length > 3 && (
                <p className="m-0 text-[11px] text-brand-ink-soft text-center">
                  +{selectedProfile.achievements.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {selectedProfile.resume?.url && (
          <a
            href={selectedProfile.resume.url}
            target="_blank"
            rel="noreferrer"
            className="border-t border-brand-row pt-3.5 flex items-center justify-center gap-2 py-2.5 bg-brand-navy text-white text-[12.5px] font-semibold"
          >
            <FileText size={14} /> View resume
          </a>
        )}
      </div>
    </div>
  </>
);

export default PostsPage;
