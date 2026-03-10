import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = 'https://web-portal-760h.onrender.com';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const PostDetailPage = () => {
  const { postId }   = useParams();   // reads the ID from the URL
  const navigate     = useNavigate();
  const currentUser  = JSON.parse(localStorage.getItem('user') || '{}');

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [commentText, setCommentText] = useState('');
  const [mode,    setMode]    = useState('Public');

  // Fetch the post by ID from URL
  const fetchPost = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!res.ok) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      const data = await res.json();
      // merge post + comments into one object
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
      method:  'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        content:     commentText,
        isAnonymous: mode === 'Anonymous',
      }),
    });

    setCommentText('');
    fetchPost(); // refresh
  };

  const handleUpvote = async () => {
    await fetch(`${BASE_URL}/api/posts/${postId}/upvote`, {
      method:  'POST',
      headers: authHeaders(),
    });
    fetchPost();
  };

  const handleAddReply = async (commentId, reply) => {
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}/replies`, {
      method:  'POST',
      headers: authHeaders(),
      body: JSON.stringify(reply),
    });
    fetchPost();
  };

  const handleUpvoteComment = async (commentId) => {
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}/upvote`, {
      method:  'POST',
      headers: authHeaders(),
    });
    fetchPost();
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    await fetch(`${BASE_URL}/api/posts/comments/${commentId}`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    fetchPost();
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    await fetch(`${BASE_URL}/api/posts/replies/${replyId}`, {
      method:  'DELETE',
      headers: authHeaders(),
    });
    fetchPost();
  };

  const handleShare = () => {
    const url = window.location.href; // this is now the unique post URL
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading post...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-500 text-lg">{error}</p>
      <button onClick={() => navigate('/posts')} className="px-4 py-2 bg-[#111828] text-white rounded-lg">
        Back to Posts
      </button>
    </div>
  );

  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted  = post.upvotes?.includes(currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/posts')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back to Posts
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-400 truncate">
          <span className="font-semibold text-[#111828]">Community Posts</span> • {post.title}
        </span>

        {/* Share button — shares the current URL which is unique per post */}
        <button
          onClick={handleShare}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[#111828] text-white rounded-lg text-xs font-semibold hover:bg-[#1e2a3a] transition"
        >
          Share Post
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Post content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#111828] flex items-center justify-center text-white text-xs font-bold">
              {displayName[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-700">{displayName}</span>
            <span className="text-xs text-gray-400">
              • {new Date(post.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
            </span>
            {post.isEdited && <span className="text-xs text-gray-400 italic">(edited)</span>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

          {post.images?.length > 0 && (
            <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {post.images.map((img, i) => (
                <img key={i} src={img.url} alt="" className="rounded-xl w-full object-cover max-h-96" />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition ${hasUpvoted ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              ▲ {post.upvotes?.length || 0} Upvotes
            </button>
            <span className="text-sm text-gray-400">
              💬 {post.comments?.length || 0} Comments
            </span>
          </div>
        </div>

        {/* Comment composer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">
            Comment as <span className="text-[#111828] font-semibold">{currentUser.username || 'You'}</span>
          </p>
          <div className="flex gap-2 mb-3">
            {['Public', 'Anonymous'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mode === m ? 'bg-[#111828] text-white' : 'bg-gray-100 text-gray-600'}`}>
                {m}
              </button>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition"
            />
            <button type="submit"
              className="px-5 py-2.5 bg-[#111828] text-white rounded-xl font-semibold text-sm hover:bg-[#1e2a3a] transition">
              Comment
            </button>
          </form>
        </div>

        {/* Comments list */}
        <div className="space-y-3">
          {post.comments?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 text-center py-12">
              <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
            </div>
          ) : (
            post.comments?.map(comment => (
              <CommentCard
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                onAddReply={handleAddReply}
                onUpvoteComment={handleUpvoteComment}
                onDeleteComment={handleDeleteComment}
                onDeleteReply={handleDeleteReply}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Comment card — same logic as before
const CommentCard = ({ comment, currentUser, onAddReply, onUpvoteComment, onDeleteComment, onDeleteReply, depth = 0 }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [mode,      setMode]      = useState('Public');

  const displayName = comment.isAnonymous ? 'Anonymous' : comment.author?.username || 'Unknown';
  const hasUpvoted  = comment.upvotes?.includes(currentUser.id);
  const isOwner     = !comment.isAnonymous && (
    comment.author?._id === currentUser.id ||
    comment.author?.id  === currentUser.id
  );

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(comment._id, { content: replyText, isAnonymous: mode === 'Anonymous' });
    setReplyText('');
    setShowReply(false);
  };

  if (comment.content === '[deleted]') {
    return (
      <div className={depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-3' : ''}>
        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-xs text-gray-400 italic">[deleted]</p>
          {comment.replies?.map(reply => (
            <CommentCard key={reply._id} comment={reply} currentUser={currentUser}
              onAddReply={onAddReply} onUpvoteComment={onUpvoteComment}
              onDeleteComment={onDeleteComment} onDeleteReply={onDeleteReply}
              depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-3 mt-2' : ''}>
      <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-gray-200 transition">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600">{displayName}</span>
            <span className="text-xs text-gray-400">• {comment.upvotes?.length || 0} upvotes</span>
            {comment.isEdited && <span className="text-xs text-gray-400 italic">(edited)</span>}
          </div>
          {isOwner && (
            <button
              onClick={() => depth === 0 ? onDeleteComment(comment._id) : onDeleteReply(comment._id)}
              className="text-xs text-red-400 hover:text-red-600 transition px-1"
            >
              🗑
            </button>
          )}
        </div>

        <p className="text-sm text-gray-800 mb-2">{comment.content}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpvoteComment(comment._id)}
            className={`text-xs font-semibold transition ${hasUpvoted ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
          >
            ▲ {hasUpvoted ? 'Upvoted' : 'Upvote'}
          </button>
          {depth === 0 && (
            <button onClick={() => setShowReply(!showReply)}
              className="text-xs font-semibold text-gray-400 hover:text-[#111828] transition">
              💬 Reply
            </button>
          )}
        </div>

        {showReply && (
          <div className="mt-2">
            <div className="flex gap-1.5 mb-2">
              {['Public', 'Anonymous'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${mode === m ? 'bg-[#111828] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {m}
                </button>
              ))}
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500" />
              <button type="submit"
                className="px-3 py-1.5 bg-[#111828] text-white rounded-lg text-xs font-semibold">
                Send
              </button>
            </form>
          </div>
        )}

        {comment.replies?.map(reply => (
          <CommentCard key={reply._id} comment={reply} currentUser={currentUser}
            onAddReply={onAddReply} onUpvoteComment={onUpvoteComment}
            onDeleteComment={onDeleteComment} onDeleteReply={onDeleteReply}
            depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};

export default PostDetailPage;