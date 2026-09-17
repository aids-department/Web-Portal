import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import CommentThread from '../components/CommentThread';

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
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading post…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10 flex flex-col items-start gap-4">
        <p className="text-brand-red-deep text-[13.5px]">{error}</p>
        <button onClick={() => navigate('/posts')} className="px-[18px] py-2.5 bg-brand-navy text-white text-[12.5px] font-semibold">
          Back to Posts
        </button>
      </div>
    );
  }

  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted = post.upvotes?.includes(currentUser.id);
  const when = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="font-brand">
      <div className="px-5 sm:px-8 lg:px-12 py-4 border-b border-brand-edge flex items-center gap-2 flex-wrap">
        <button onClick={() => navigate('/posts')} className="text-[12px] font-medium text-brand-blue hover:underline">
          Posts
        </button>
        <span className="text-[12px] text-brand-ink-faint">/</span>
        <span className="text-[12px] text-brand-ink-soft truncate max-w-[40ch]">{post.title}</span>
        <button
          onClick={handleShare}
          className="ml-auto px-3.5 py-1.5 bg-brand-navy text-white text-[11.5px] font-semibold"
        >
          Share
        </button>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-8 lg:py-9 max-w-[900px] flex flex-col gap-6">
        <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleUpvote}
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
              <span className="text-[11.5px] text-brand-ink-soft">{displayName}</span>
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
                {post.images.map((img, i) => (
                  <div key={i} className="border border-brand-edge overflow-hidden">
                    <img src={img.url} alt="" className="w-full object-cover max-h-96" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 flex-wrap border-t border-brand-row pt-3">
              <span className="text-[12px] font-medium text-brand-blue tabular-nums">
                {post.comments?.length || 0} replies
              </span>
            </div>
          </div>
        </div>

        <div className="border border-brand-edge p-4 flex flex-col gap-3">
          <form onSubmit={handleAddComment} className="flex flex-col gap-2.5">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a reply"
              className="border border-brand-ink-faint px-3.5 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy placeholder:text-brand-ink-faint"
            />
            <div className="flex justify-between items-center gap-3.5 flex-wrap">
              <label className="flex items-center gap-2 text-[12.5px] text-[#3a3838]">
                <input
                  type="checkbox"
                  checked={mode === 'Anonymous'}
                  onChange={(e) => setMode(e.target.checked ? 'Anonymous' : 'Public')}
                  className="w-3.5 h-3.5"
                />
                Reply anonymously
              </label>
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
