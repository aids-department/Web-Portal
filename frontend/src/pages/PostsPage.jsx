import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowUp, MessageCircle, Share2, X, Upload, XCircle } from 'lucide-react';

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch posts from MongoDB
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setLoading(false);
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('authorId', currentUser.id);
      formData.append('isAnonymous', newPost.isAnonymous);

      // Append images
      if (newPost.images && newPost.images.length > 0) {
        newPost.images.forEach(img => {
          formData.append('images', img.file);
        });
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        fetchPosts(); // Refresh posts
        setIsPostModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        fetchPosts(); // Refresh to get updated upvotes
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment.content,
          authorId: currentUser.id,
          isAnonymous: comment.isAnonymous,
        }),
      });

      if (response.ok) {
        fetchPosts();
        // Update selected post if sidebar is open
        if (selectedPost && selectedPost._id === postId) {
          const updatedPosts = await fetch('http://localhost:5000/api/posts').then(r => r.json());
          const updated = updatedPosts.find(p => p._id === postId);
          setSelectedPost(updated);
        }
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddReply = async (commentId, reply) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reply.content,
          authorId: currentUser.id,
          isAnonymous: reply.isAnonymous,
        }),
      });

      if (response.ok) {
        fetchPosts();
        if (selectedPost) {
          const updatedPosts = await fetch('http://localhost:5000/api/posts').then(r => r.json());
          const updated = updatedPosts.find(p => p._id === selectedPost._id);
          setSelectedPost(updated);
        }
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        fetchPosts();
        if (selectedPost) {
          const updatedPosts = await fetch('http://localhost:5000/api/posts').then(r => r.json());
          const updated = updatedPosts.find(p => p._id === selectedPost._id);
          setSelectedPost(updated);
        }
      }
    } catch (err) {
      console.error('Failed to upvote comment:', err);
    }
  };

  const filteredPosts = posts.filter(p =>
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 rounded-2xl mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Posts</h2>
        <p className="text-gray-500 mt-1">Discuss, share, and connect with the community</p>
      </div>

      <div className="flex-1 flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 px-6 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              <Plus size={20} /> Create Post
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto space-y-5 pb-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onOpen={() => setSelectedPost(post)}
                  onUpvote={() => handleUpvote(post._id)}
                  currentUserId={currentUser.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Comment Sidebar */}
        {selectedPost && (
          <CommentSidebar
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onUpvoteComment={handleUpvoteComment}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Create Post Modal */}
      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onOpen, onUpvote, currentUserId }) => {
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted = post.upvotes?.includes(currentUserId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
        <span className="text-sm text-gray-500">{displayName}</span>
      </div>

      <p className="text-gray-600 mb-4">{post.content}</p>

      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 my-4">
          {post.images.map((img, i) => (
            <img key={i} src={img.url} alt="" className="rounded-lg max-h-64 object-cover w-full" />
          ))}
        </div>
      )}

      <div className="flex gap-6 text-gray-600">
        <button
          onClick={onUpvote}
          className={`flex items-center gap-2 font-medium ${hasUpvoted ? 'text-blue-600' : 'hover:text-blue-600'}`}
        >
          <ArrowUp size={20} /> {post.upvotes?.length || 0}
        </button>
        <button onClick={onOpen} className="flex items-center gap-2 hover:text-blue-600 font-medium">
          <MessageCircle size={20} /> {post.comments?.length || 0}
        </button>
        <button className="flex items-center gap-2 hover:text-blue-600 font-medium">
          <Share2 size={20} /> Share
        </button>
      </div>
    </div>
  );
};

// Post Modal Component
const PostModal = ({ onClose, onSubmit, currentUser }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('Public');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(f => ({
      preview: URL.createObjectURL(f),
      file: f
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      isAnonymous: mode === 'Anonymous',
      images
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Post</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setMode('Public')} className={`px-4 py-2 rounded-xl ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-100'}`}>Public</button>
          <button onClick={() => setMode('Anonymous')} className={`px-4 py-2 rounded-xl ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-100'}`}>Anonymous</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 border rounded-xl mb-4" />
          <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" className="w-full px-4 py-3 border rounded-xl h-32 mb-4" />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.preview} className="rounded-lg w-full h-32 object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer mb-6">
            <Upload size={40} className="mx-auto mb-2 text-gray-400" />
            <p>Click or drag images</p>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

// Comment Sidebar Component
const CommentSidebar = ({ post, onClose, onAddComment, onAddReply, onUpvoteComment, currentUser }) => {
  const [mode, setMode] = useState('Public');
  const [commentText, setCommentText] = useState('');

  const handleNewComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post._id, {
      content: commentText,
      isAnonymous: mode === 'Anonymous'
    });
    setCommentText('');
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-50">
      <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
        <h2 className="text-2xl font-bold">Comments</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={28} />
        </button>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>
          <p className="text-sm text-gray-500">
            — {post.isAnonymous ? 'Anonymous' : post.author?.username}
          </p>
        </div>

        <div className="flex gap-3 mb-5">
          <button onClick={() => setMode('Public')} className={`px-5 py-2 rounded-xl font-medium ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>Public</button>
          <button onClick={() => setMode('Anonymous')} className={`px-5 py-2 rounded-xl font-medium ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>Anonymous</button>
        </div>

        <form onSubmit={handleNewComment} className="flex gap-2 mb-8">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">Send</button>
        </form>

        <div className="mt-8">
          {!post.comments || post.comments.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No comments yet. Be the first!</p>
          ) : (
            post.comments.map(comment => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onAddReply={onAddReply}
                onUpvoteComment={onUpvoteComment}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Comment Card Component
const CommentCard = ({ comment, onAddReply, onUpvoteComment, currentUser, depth = 0 }) => {
  const [showReply, setShowReply] = useState(false);
  const [mode, setMode] = useState('Public');
  const [replyText, setReplyText] = useState('');

  const displayName = comment.isAnonymous ? 'Anonymous' : comment.author?.username || 'Unknown';
  const hasUpvoted = comment.upvotes?.includes(currentUser.id);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddReply(comment._id, {
      content: replyText,
      isAnonymous: mode === 'Anonymous'
    });
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div className={depth > 0 ? "ml-8 mt-5 border-l-2 border-gray-200 pl-4" : "mt-6"}>
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="font-medium text-gray-800 mb-2">{comment.content}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{displayName}</span>
          <span>•</span>
          <span>{comment.upvotes?.length || 0} upvote{comment.upvotes?.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex gap-6 text-sm">
          <button
            onClick={() => onUpvoteComment(comment._id)}
            className={`flex items-center gap-1.5 font-medium transition ${hasUpvoted ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <ArrowUp size={18} /> Upvote
          </button>
          <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-800 transition">
            <MessageCircle size={18} /> Reply
          </button>
        </div>

        {showReply && (
          <div className="mt-5">
            <div className="flex gap-2 mb-3">
              <button onClick={() => setMode('Public')} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>Public</button>
              <button onClick={() => setMode('Anonymous')} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>Anonymous</button>
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">Send</button>
            </form>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-5">
            {comment.replies.map(reply => (
              <CommentCard
                key={reply._id}
                comment={reply}
                onAddReply={onAddReply}
                onUpvoteComment={onUpvoteComment}
                currentUser={currentUser}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;