import React, { useState, useEffect, useCallback } from 'react';
import { X, XCircle, FileText, Search, PenSquare, ImagePlus, Send, MessagesSquare, MessageSquare, Bookmark, Share2, PencilLine, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import { Spotlight } from '../components/ui/SpotlightCard';
import { useSpotlight } from '../components/ui/useSpotlight';
import { LoadingState, EmptyState } from '../components/ui/States';
import { Reveal } from '../components/ui/Reveal';
import { EASE } from '../components/ui/motion';
import { UpvoteButton, ActionLink } from '../components/PostActions';
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
      <div className="container-ln">
        <LoadingState label="Loading posts" />
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="relative">
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
    <div className="container-ln flex flex-col gap-5 pb-8">
      <PageHeader
        eyebrow="Student board"
        title="Posts"
        description="Ask questions, share wins and start discussions with the department."
        spacing="pt-14 pb-4 sm:pt-20 sm:pb-6 lg:pt-24"
        actions={
          <div className="tabs" role="group" aria-label="Sort posts">
            {SORT_OPTIONS.map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                aria-pressed={sortBy === val}
                className={`tab ${sortBy === val ? 'tab-active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[220px] max-w-sm flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VIEW_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setViewFilter(val)}
              aria-pressed={viewFilter === val}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-[background-color,color,box-shadow] duration-200 ${
                viewFilter === val
                  ? 'bg-accent/15 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.45)]'
                  : 'text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/[0.04] hover:text-fg'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* New post composer */}
      <Reveal>
        <form onSubmit={handleCreatePost} className="surface edge-highlight flex flex-col gap-3.5 p-5 focus-within:border-line-accent">
          <span className="eyebrow flex items-center gap-2">
            <PenSquare size={12} />
            New post
          </span>
          <input
            required
            value={composerTitle}
            onChange={(e) => setComposerTitle(e.target.value)}
            placeholder="Title"
            className="field py-3 text-[15px] font-medium"
          />
          <textarea
            required
            value={composerContent}
            onChange={(e) => setComposerContent(e.target.value)}
            placeholder="Say what you want to say."
            rows={3}
            className="field resize-none py-3 leading-[1.6]"
          />

          {composerImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {composerImages.map((img, i) => (
                <div key={i} className="group/img relative overflow-hidden rounded-lg border border-line">
                  <img src={img.preview} className="h-20 w-full object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => removeComposerImage(i)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-canvas/80 text-fg backdrop-blur transition-colors hover:text-rose-300"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-line pt-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-ghost btn-sm cursor-pointer">
                <ImagePlus size={15} />
                Attach images
                <input type="file" multiple accept="image/*" onChange={handleComposerFiles} className="hidden" />
              </label>
              <label className="flex cursor-pointer items-center gap-2 px-2 text-[13px] text-fg-muted">
                <input
                  type="checkbox"
                  checked={composerAnonymous}
                  onChange={(e) => setComposerAnonymous(e.target.checked)}
                  className="h-3.5 w-3.5 rounded accent-[#5E6AD2]"
                />
                Post anonymously
              </label>
            </div>
            <button type="submit" className="btn-primary">
              Publish
              <Send size={14} />
            </button>
          </div>
        </form>
      </Reveal>

      {/* Feed */}
      <div className="flex flex-col gap-3">
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={MessagesSquare}
            title={
              viewFilter === 'mine'
                ? "You haven't posted anything yet."
                : viewFilter === 'saved'
                ? "You haven't saved any posts yet."
                : 'No posts yet. Be the first to post!'
            }
          />
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
  const { ref, onMouseMove } = useSpotlight();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={onOpen}
      className="group surface edge-highlight surface-interactive grid cursor-pointer grid-cols-[44px_1fr] gap-3 p-4 hover:translate-y-0 sm:grid-cols-[56px_1fr] sm:gap-4 sm:p-5"
    >
      <Spotlight />
      <div className="relative flex flex-col items-center gap-1 pt-0.5">
        <UpvoteButton active={hasUpvoted} count={post.upvotes?.length || 0} onClick={onUpvote} />
      </div>
      <div className="relative flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
          {!post.isAnonymous ? (
            <button onClick={(e) => onProfileClick(post.author, e)} className="font-medium text-fg transition-colors hover:text-accent-bright">
              {displayName}
            </button>
          ) : (
            <span className="text-fg-muted">{displayName}</span>
          )}
          <span className="text-fg-muted">· {when}</span>
        </div>
        <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-fg">{post.title}</h3>
        <p className="line-clamp-2 max-w-[88ch] text-[13.5px] leading-[1.65] text-fg-muted">
          {post.content}
        </p>
        <div className="-ml-2 flex flex-wrap items-center gap-1 pt-1">
          <span className="flex items-center gap-1.5 px-2 py-1 font-mono text-[12px] tabular-nums text-fg-muted">
            <MessageSquare size={13} />
            {post.comments?.length || 0} replies
          </span>
          <ActionLink onClick={onSave} active={isSaved}>
            <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
            {isSaved ? 'Saved' : 'Save'}
          </ActionLink>
          <ActionLink onClick={onShare}>
            <Share2 size={13} />
            Share
          </ActionLink>
          {isOwner && (
            <>
              <ActionLink onClick={onEdit}>
                <PencilLine size={13} />
                Edit
              </ActionLink>
              <ActionLink onClick={onDelete} danger>
                <Trash2 size={13} />
                Delete
              </ActionLink>
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
    <div className="container-ln pb-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 pt-8 text-[13px]">
        <button onClick={onBack} className="btn-ghost btn-sm -ml-3">
          <ArrowLeft size={14} />
          Posts
        </button>
        <ChevronRight size={14} className="text-fg-muted/60" />
        <span className="max-w-[40ch] truncate text-fg-muted">{post.title}</span>
      </nav>

      <div className="mx-auto mt-5 flex max-w-[900px] flex-col gap-5">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="surface edge-highlight grid grid-cols-[44px_1fr] gap-3 p-5 sm:grid-cols-[60px_1fr] sm:gap-4 sm:p-7"
        >
          <div className="flex flex-col items-center gap-1">
            <UpvoteButton active={hasUpvoted} count={post.upvotes?.length || 0} onClick={onUpvote} size="lg" />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
              {!post.isAnonymous ? (
                <button onClick={(e) => onProfileClick(post.author, e)} className="font-medium text-fg transition-colors hover:text-accent-bright">
                  {displayName}
                </button>
              ) : (
                <span className="text-fg-muted">{displayName}</span>
              )}
              <span className="text-fg-muted">· {when}</span>
              {post.isEdited && <span className="pill-neutral text-[10.5px]">edited</span>}
            </div>
            <h1 className="max-w-[28ch] text-2xl font-semibold leading-[1.2] tracking-tight sm:text-3xl">
              <span className="text-gradient">{post.title}</span>
            </h1>
            <p className="max-w-[76ch] whitespace-pre-line text-[15px] leading-[1.75] text-fg/85">
              {post.content}
            </p>

            {post.images?.length > 0 && (
              <div className={`grid gap-1.5 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-video overflow-hidden rounded-xl border border-line bg-canvas-elevated">
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                    {i === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 grid place-items-center bg-canvas/75 backdrop-blur-sm">
                        <span className="text-xl font-semibold text-fg">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="-ml-2 flex flex-wrap gap-1 border-t border-line pt-3">
              <ActionLink onClick={onShare}>
                <Share2 size={13} />
                Share
              </ActionLink>
              <ActionLink onClick={onSave} active={isSaved}>
                <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
                {isSaved ? 'Saved' : 'Save'}
              </ActionLink>
              {isOwner && (
                <>
                  <ActionLink onClick={onEdit}>
                    <PencilLine size={13} />
                    Edit
                  </ActionLink>
                  <ActionLink onClick={onDelete} danger>
                    <Trash2 size={13} />
                    Delete
                  </ActionLink>
                </>
              )}
            </div>
          </div>
        </motion.article>

        <form onSubmit={handleNewComment} className="surface flex flex-col gap-3 p-4 focus-within:border-line-accent">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a reply"
            className="field py-3"
          />
          <div className="flex flex-wrap items-center justify-between gap-3.5">
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-fg-muted">
              <input
                type="checkbox"
                checked={mode === 'Anonymous'}
                onChange={(e) => setMode(e.target.checked ? 'Anonymous' : 'Public')}
                className="h-3.5 w-3.5 rounded accent-[#5E6AD2]"
              />
              Reply anonymously
            </label>
            <button type="submit" className="btn-primary btn-sm">
              Reply
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-1">
          <span className="eyebrow mb-2 mt-2">
            {post.comments?.length || 0} {post.comments?.length === 1 ? 'reply' : 'replies'}
          </span>
          {!post.comments || post.comments.length === 0 ? (
            <p className="pt-2 text-[13px] text-fg-muted">No comments yet. Be the first!</p>
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
    <Modal onBackdropClick={onClose} onEscape={onClose} z="z-[9999]" className="max-w-[480px]">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-[15px] font-semibold text-fg">Edit post</h2>
        <button onClick={onClose} aria-label="Close" className="btn-icon h-8 w-8">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <label className="flex flex-col">
          <span className="field-label">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
        </label>
        <label className="flex flex-col">
          <span className="field-label">Content</span>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="field resize-none leading-[1.6]"
          />
        </label>
        <div className="flex gap-2.5 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTHOR PROFILE POPOVER
// ─────────────────────────────────────────────────────────────────────────────
const ProfileModal = ({ position, selectedProfile, onClose }) => (
  <>
    <div className="fixed inset-0 z-[999] bg-canvas-deep/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="edge-highlight absolute z-[1000] max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-canvas-elevated/95 shadow-popover backdrop-blur-xl"
      style={{
        top: Math.min(position.top, window.innerHeight - 500),
        left: window.innerWidth < 768 ? '50%' : Math.min(position.left, window.innerWidth - 320),
        // framer-motion owns `transform`, so the mobile centering offset goes through `x`
        x: window.innerWidth < 768 ? '-50%' : 0,
      }}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="eyebrow">Profile</h3>
          <button onClick={onClose} aria-label="Close" className="btn-icon h-8 w-8"><X size={16} /></button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-2 rounded-full bg-accent/30 blur-xl" />
            <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-accent/60 to-accent/20 text-2xl font-semibold text-white">
              {selectedProfile.profileImage?.url ? (
                <img src={selectedProfile.profileImage.url} alt="" className="h-full w-full object-cover" />
              ) : (
                selectedProfile.name?.[0]?.toUpperCase() || selectedProfile.username?.[0]?.toUpperCase() || 'U'
              )}
            </div>
          </div>
          <h4 className="mt-1 text-[17px] font-semibold tracking-tight text-fg">
            {selectedProfile.name || selectedProfile.username}
          </h4>
          <p className="text-[12.5px] text-fg-muted">
            {selectedProfile.year ? `${selectedProfile.year} Year Student` : 'Student'}
          </p>
        </div>

        {selectedProfile.bio && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">About</span>
            <p className="rounded-xl border border-line bg-white/[0.03] p-3 text-[13px] leading-[1.6] text-fg/85">{selectedProfile.bio}</p>
          </div>
        )}

        {selectedProfile.skills?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedProfile.skills.map((skill, i) => (
                <span key={i} className="pill-neutral">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {selectedProfile.socialLinks && (
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Connect</span>
            {selectedProfile.socialLinks.github && (
              <a href={selectedProfile.socialLinks.github} target="_blank" rel="noreferrer" className="text-[13px] text-accent-bright hover:text-indigo-300">GitHub profile</a>
            )}
            {selectedProfile.socialLinks.leetcode && (
              <a href={selectedProfile.socialLinks.leetcode} target="_blank" rel="noreferrer" className="text-[13px] text-accent-bright hover:text-indigo-300">LeetCode profile</a>
            )}
            {selectedProfile.socialLinks.linkedin && (
              <a href={selectedProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[13px] text-accent-bright hover:text-indigo-300">LinkedIn profile</a>
            )}
          </div>
        )}

        {selectedProfile.achievements?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Achievements</span>
            <div className="flex flex-col gap-2">
              {selectedProfile.achievements.slice(0, 3).map((a) => (
                <div key={a._id} className="rounded-xl border border-line bg-white/[0.02] p-3">
                  <h6 className="mb-1 text-[13px] font-semibold text-fg">{a.title}</h6>
                  {a.description && <p className="mb-1.5 text-[12px] text-fg-muted">{a.description}</p>}
                  {a.certificate?.url && (
                    <a href={a.certificate.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] text-accent-bright">
                      <FileText size={11} /> View certificate
                    </a>
                  )}
                </div>
              ))}
              {selectedProfile.achievements.length > 3 && (
                <p className="text-center text-[11.5px] text-fg-muted">
                  +{selectedProfile.achievements.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {selectedProfile.resume?.url && (
          <a href={selectedProfile.resume.url} target="_blank" rel="noreferrer" className="btn-primary w-full">
            <FileText size={14} /> View resume
          </a>
        )}
      </div>
    </motion.div>
  </>
);

export default PostsPage;
