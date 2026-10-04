import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import CommentThread from '../components/CommentThread';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Share2, MessageSquare } from 'lucide-react';
import { LoadingState, Alert } from '../components/ui/States';
import { EASE } from '../components/ui/motion';
import { UpvoteButton } from '../components/PostActions';

const BASE_URL = 'https://web-portal-760h.onrender.com';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [mode, setMode] = useState('Public');

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        setError('Post not found');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPost({ ...data.post, comments: data.comments });
      setLoading(false);
    } catch (err) {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content: commentText, isAnonymous: mode === 'Anonymous' }),
    });
    setCommentText('');
    fetchPost();
  };

  const handleUpvote = async () => {
    await fetch(`${BASE_URL}/api/posts/${postId}/upvote`, { method: 'POST', headers: authHeaders() });
    fetchPost();
  };

  const handleAddReply = async (commentId, reply) => {
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}/replies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(reply),
    });
    fetchPost();
  };

  const handleUpvoteComment = async (commentId) => {
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}/upvote`, { method: 'POST', headers: authHeaders() });
    fetchPost();
  };

  // Was missing entirely — replies were previously (incorrectly) upvoted
  // through the comment endpoint. Fixed to match PostsPage.jsx's inline thread.
  const handleUpvoteReply = async (replyId) => {
    await fetch(`${BASE_URL}/api/posts/replies/${replyId}/upvote`, { method: 'POST', headers: authHeaders() });
    fetchPost();
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}`, { method: 'DELETE', headers: authHeaders() });
    fetchPost();
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    await fetch(`${BASE_URL}/api/posts/replies/${replyId}`, { method: 'DELETE', headers: authHeaders() });
    fetchPost();
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container-ln">
        <LoadingState label="Loading post" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-ln flex flex-col items-start gap-4 py-16">
        <Alert>{error}</Alert>
        <button onClick={() => navigate('/posts')} className="btn-secondary">
          <ArrowLeft size={14} />
          Back to Posts
        </button>
      </div>
    );
  }

  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted = post.upvotes?.includes(currentUser.id);
  const when = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="container-ln pb-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 pt-8 text-[13px]">
        <button onClick={() => navigate('/posts')} className="btn-ghost btn-sm -ml-3">
          <ArrowLeft size={14} />
          Posts
        </button>
        <ChevronRight size={14} className="text-fg-muted/60" />
        <span className="max-w-[40ch] truncate text-fg-muted">{post.title}</span>
        <button onClick={handleShare} className="btn-secondary btn-sm ml-auto">
          <Share2 size={13} />
          Share
        </button>
      </nav>

      <div className="mx-auto mt-5 flex max-w-[900px] flex-col gap-5">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="surface edge-highlight grid grid-cols-[44px_1fr] gap-3 p-5 sm:grid-cols-[60px_1fr] sm:gap-4 sm:p-7"
        >
          <div className="flex flex-col items-center gap-1">
            <UpvoteButton active={hasUpvoted} count={post.upvotes?.length || 0} onClick={handleUpvote} size="lg" />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-fg-muted">
              <span className={post.isAnonymous ? '' : 'font-medium text-fg'}>{displayName}</span>
              <span>· {when}</span>
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
                {post.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-line bg-canvas-elevated">
                    <img src={img.url} alt="" className="max-h-96 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 border-t border-line pt-3">
              <span className="flex items-center gap-1.5 font-mono text-[12px] tabular-nums text-fg-muted">
                <MessageSquare size={13} />
                {post.comments?.length || 0} replies
              </span>
            </div>
          </div>
        </motion.article>

        <form onSubmit={handleAddComment} className="surface flex flex-col gap-3 p-4 focus-within:border-line-accent">
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
          {!post.comments || post.comments.length === 0 ? (
            <p className="pt-2 text-[13px] text-fg-muted">No comments yet. Be the first!</p>
          ) : (
            post.comments.map((comment) => (
              <CommentThread
                key={comment._id}
                comment={comment}
                onAddReply={handleAddReply}
                onUpvoteComment={handleUpvoteComment}
                onDeleteComment={handleDeleteComment}
                onDeleteReply={handleDeleteReply}
                onUpvoteReply={handleUpvoteReply}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
