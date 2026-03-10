import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, ArrowUp, MessageCircle, Share2, X,
  Upload, XCircle, Bookmark, BookmarkCheck, FileText,
  Pencil, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
//http://localhost:5173/
const BASE_URL = 'https://web-portal-760h.onrender.com';
//const BASE_URL = 'https://web-portal-760h.onrender.com';
// ─── helper: always send JWT from localStorage ───────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const PostsPage = () => {
  const [searchQuery,        setSearchQuery]        = useState('');
  const [selectedPost,       setSelectedPost]        = useState(null);
  const [isPostModalOpen,    setIsPostModalOpen]     = useState(false);
  const [editingPost,        setEditingPost]         = useState(null);
  const [posts,              setPosts]               = useState([]);
  const [loading,            setLoading]             = useState(true);
  const [sortBy,             setSortBy]              = useState('newest');
  const [showMyPosts,        setShowMyPosts]         = useState(false);
  const [savedPosts,         setSavedPosts]          = useState([]);
  const [selectedProfile,    setSelectedProfile]     = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen]  = useState(false);
  const [profilePosition,    setProfilePosition]     = useState({ top: 0, left: 0 });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate    = useNavigate();
  // ── FETCH ALL POSTS ─────────────────────────────────────────────────────────
  // FIX 1: new backend returns { posts, hasNextPage, nextCursor }
  // old code did setPosts(data) which set an object, not an array
  const fetchPosts = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/posts`);
      const data = await res.json();
      setPosts(data.posts ?? data); // handles both old flat array and new shape
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setLoading(false);
    }
  }, []);

  // ── FETCH SINGLE POST (used to refresh selectedPost after actions) ──────────
  // FIX 2: instead of fetching ALL posts just to find one, hit the single-post
  // endpoint which also returns fully populated comments + replies
  const fetchSinglePost = useCallback(async (postId) => {
    try {
      const res  = await fetch(`${BASE_URL}/api/posts/${postId}`);
      const data = await res.json();
      // data = { post, comments }  — merge them so the UI gets comments inline
      const merged = { ...data.post, comments: data.comments };
      setSelectedPost(merged);
      return merged;
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── CREATE POST ─────────────────────────────────────────────────────────────
  // FIX 3: add Authorization header — backend reads author from JWT, not body
  const handleCreatePost = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append('title',       newPost.title);
      formData.append('content',     newPost.content);
      formData.append('isAnonymous', newPost.isAnonymous);

      if (newPost.images?.length > 0) {
        newPost.images.forEach(img => formData.append('images', img.file));
      }

      const res = await fetch(`${BASE_URL}/api/posts`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        // NOTE: do NOT set Content-Type when using FormData — browser sets it with boundary
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchPosts();
        setIsPostModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  // ── UPVOTE POST ──────────────────────────────────────────────────────────────
  // FIX 4: send JWT, not userId in body
  const handleUpvote = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/upvote`, {
        method:  'POST',
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

  // ── ADD COMMENT ──────────────────────────────────────────────────────────────
  // FIX 5: send JWT, correct URL, refresh via single-post endpoint
  const handleAddComment = async (postId, comment) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
        method:  'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          content:     comment.content,
          isAnonymous: comment.isAnonymous,
          // authorId removed — backend reads from JWT now
        }),
      });
      if (res.ok) {
        fetchPosts();
        fetchSinglePost(postId);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // ── ADD REPLY ────────────────────────────────────────────────────────────────
  // FIX 6: correct URL (/api/posts/comments/:id/replies, not /api/comments/:id/replies)
  const handleAddReply = async (commentId, reply) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}/replies`, {
        method:  'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          content:     reply.content,
          isAnonymous: reply.isAnonymous,
        }),
      });
      if (res.ok && selectedPost) {
        fetchSinglePost(selectedPost._id);
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  // ── UPVOTE COMMENT ───────────────────────────────────────────────────────────
  // FIX 7: correct URL (/api/posts/comments/:id/upvote), send JWT not userId
  const handleUpvoteComment = async (commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}/upvote`, {
        method:  'POST',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) {
        fetchSinglePost(selectedPost._id);
      }
    } catch (err) {
      console.error('Failed to upvote comment:', err);
    }
  };

  // ── DELETE COMMENT ───────────────────────────────────────────────────────────
  // NEW: soft-delete a comment — only visible to the comment's author
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}`, {
        method:  'DELETE',
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

  // ── DELETE REPLY ─────────────────────────────────────────────────────────────
  // NEW: soft-delete a reply — only visible to the reply's author
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/replies/${replyId}`, {
        method:  'DELETE',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) {
        fetchSinglePost(selectedPost._id);
      }
    } catch (err) {
      console.error('Failed to delete reply:', err);
    }
  };

  // ── DELETE POST ──────────────────────────────────────────────────────────────
  // FIX 8: send JWT, not userId in body
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method:  'DELETE',
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

  // ── UPDATE POST ──────────────────────────────────────────────────────────────
  // FIX 9: send JWT, not userId in body
  const handleUpdatePost = async (updatedPost) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${editingPost._id}`, {
        method:  'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          title:   updatedPost.title,
          content: updatedPost.content,
        }),
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

  // ── UPVOTE REPLY ─────────────────────────────────────────────────────────────
  // NEW: was missing entirely
  const handleUpvoteReply = async (replyId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/replies/${replyId}/upvote`, {
        method:  'POST',
        headers: authHeaders(),
      });
      if (res.ok && selectedPost) fetchSinglePost(selectedPost._id);
    } catch (err) {
      console.error('Failed to upvote reply:', err);
    }
  };

  const handleSharePost = (post) => {
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSavePost = (postId) => {
    setSavedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleProfileClick = async (author, event) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      setProfilePosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });

      const [profileRes, achRes] = await Promise.all([
        fetch(`${BASE_URL}/api/profile/${author._id || author.id}`),
        fetch(`${BASE_URL}/api/achievements/user/${author._id || author.id}`),
      ]);
      const profile      = await profileRes.json();
      const achievements = await achRes.json();

      setSelectedProfile({
        ...profile,
        username:     author.username,
        achievements: achievements.filter(a => a.status === 'approved'),
      });
      setIsProfileModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  // ── FILTER + SORT (client-side) ───────────────────────────────────────────────
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const authorId    = p.author?._id?.toString() || p.author?.id?.toString();
    const matchesMine = showMyPosts ? authorId === currentUser.id?.toString() : true;
    return matchesSearch && matchesMine;
  }).sort((a, b) => {
    if (sortBy === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'popular')  return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
    if (sortBy === 'discussed') return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  });

  // ── OPEN A POST ──────────────────────────────────────────────────────────────
  // FIX 11: fetch full post data (with comments) instead of using stale feed data
  const handleOpenPost = async (post) => {
    await fetchSinglePost(post._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden min-h-[80vh]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <PostDetailPage
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
          />
        </div>

        {isProfileModalOpen && selectedProfile && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/50" onClick={() => setIsProfileModalOpen(false)} />
            <div
              className="absolute z-[1000] bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
              style={{
                top:       Math.min(profilePosition.top, window.innerHeight - 500),
                left:      window.innerWidth < 768 ? '50%' : Math.min(profilePosition.left, window.innerWidth - 320),
                transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none',
              }}
            >
              <ProfileModalContent selectedProfile={selectedProfile} onClose={() => setIsProfileModalOpen(false)} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-4 md:p-8 min-h-[80vh]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-6 md:mb-8 pt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#111828] mb-2 leading-tight">Community Posts</h1>
            <div className="w-16 h-1 bg-[#111828] mx-auto rounded-full mb-3" />
            <p className="text-sm text-gray-500 max-w-xl mx-auto">Discuss, share, and connect with the community</p>
          </div>

          <div className="flex gap-6 items-start w-full">
            {/* LEFT: Feed */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111828]/20 text-sm shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#111828] text-white rounded-xl font-semibold hover:bg-[#1e2a3a] transition shadow-sm text-sm shrink-0"
                >
                  <Plus size={16} /> Create Post
                </button>
              </div>

              <div className="space-y-3 pb-8">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-200">
                    <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-base font-semibold text-gray-500">
                      {showMyPosts ? "You haven't posted anything yet." : 'No posts yet. Be the first to post!'}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onOpen={() => handleOpenPost(post)}
                      onUpvote={() => handleUpvote(post._id)}
                      onShare={() => handleSharePost(post)}
                      onSave={() => handleSavePost(post._id)}
                      isSaved={savedPosts.includes(post._id)}
                      currentUserId={currentUser.id}
                      onProfileClick={handleProfileClick}
                      onEdit={() => setEditingPost(post)}
                      onDelete={() => handleDeletePost(post._id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="w-72 shrink-0 hidden lg:flex flex-col gap-4 sticky top-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">View</h4>
                <div className="space-y-1">
                  {[
                    [false, 'All Posts'],
                    [true,  'My Posts'],
                  ].map(([val, label]) => (
                    <button
                      key={label}
                      onClick={() => setShowMyPosts(val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${showMyPosts === val ? 'bg-[#111828] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {label}
                      {val && showMyPosts && (
                        <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{filteredPosts.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sort By</h4>
                <div className="space-y-1">
                  {[['newest','Newest'],['popular','Most Upvoted'],['discussed','Most Discussed']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setSortBy(val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${sortBy === val ? 'bg-[#111828] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {savedPosts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Saved Posts</h4>
                  <div className="space-y-2">
                    {posts.filter(p => savedPosts.includes(p._id)).slice(0, 3).map(p => (
                      <button
                        key={p._id}
                        onClick={() => handleOpenPost(p)}
                        className="w-full text-left text-xs text-gray-700 hover:text-[#111828] font-medium truncate block hover:underline"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
          currentUser={currentUser}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSubmit={handleUpdatePost}
        />
      )}

      {isProfileModalOpen && selectedProfile && (
        <>
          <div className="fixed inset-0 z-[999] bg-black/50" onClick={() => setIsProfileModalOpen(false)} />
          <div
            className="absolute z-[1000] bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
            style={{
              top:       Math.min(profilePosition.top, window.innerHeight - 500),
              left:      window.innerWidth < 768 ? '50%' : Math.min(profilePosition.left, window.innerWidth - 320),
              transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none',
            }}
          >
            <ProfileModalContent selectedProfile={selectedProfile} onClose={() => setIsProfileModalOpen(false)} />
          </div>
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST CARD
// FIX: edit/delete now shown for own posts always, not only when showMyPosts=true
// ─────────────────────────────────────────────────────────────────────────────
const PostCard = ({ post, onOpen, onUpvote, onShare, onSave, isSaved, currentUserId, onProfileClick, onEdit, onDelete }) => {
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted  = post.upvotes?.includes(currentUserId);
  const isOwner     = post.author?._id === currentUserId || post.author?.id === currentUserId;
  const createdAt   = new Date(post.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-lg shrink-0 overflow-hidden">
            {(post.author?.profile?.profileImage?.url || post.author?.profileImage?.url) ? (
              <img
                src={post.author?.profile?.profileImage?.url || post.author?.profileImage?.url}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-[#111828] flex items-center justify-center text-white font-bold">${displayName[0].toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#111828] flex items-center justify-center text-white font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!post.isAnonymous ? (
                <button
                  onClick={e => onProfileClick(post.author, e)}
                  className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors text-left"
                >
                  {displayName}
                </button>
              ) : (
                <h4 className="font-semibold text-gray-900 text-sm">{displayName}</h4>
              )}
              {post.isAnonymous && <span className="text-xs text-gray-500">• Anonymous</span>}
            </div>
            <p className="text-xs text-gray-500">{createdAt}</p>
          </div>

          {/* Edit / Delete — shown for owner including anonymous posts */}
          {isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                title="Edit post"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {post.images && post.images.length > 0 && (
        <div className="px-5 pb-4">
          <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative aspect-video bg-gray-100 rounded overflow-hidden border border-gray-200">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {i === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">+{post.images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 py-2 border-t border-gray-200 flex items-center">
        <button
          onClick={onUpvote}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium ${hasUpvoted ? 'text-[#111828]' : 'text-gray-600'}`}
        >
          <ArrowUp size={18} />
          {(post.upvotes?.length ?? 0) > 0 && <span className="text-xs font-semibold">{post.upvotes.length}</span>}
        </button>
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-600"
        >
          <MessageCircle size={18} />
          {(post.comments?.length ?? 0) > 0 && <span className="text-xs font-semibold">{post.comments.length}</span>}
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-600"
        >
          <Share2 size={18} /> Share
        </button>
        <button
          onClick={onSave}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-100 transition text-sm font-medium ${isSaved ? 'text-[#111828]' : 'text-gray-600'}`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT POST MODAL — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────
const EditPostModal = ({ post, onClose, onSubmit }) => {
  const [title,   setTitle]   = useState(post.title   || '');
  const [content, setContent] = useState(post.content || '');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = e => { e.preventDefault(); onSubmit({ title, content }); };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(17,24,40,0.6)', backdropFilter:'blur(6px)' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:9999, width:'90vw', maxWidth:'520px', maxHeight:'88vh', display:'flex', flexDirection:'column', background:'#fff', borderRadius:'18px', boxShadow:'0 40px 100px rgba(0,0,0,0.3)', overflow:'hidden' }}>
        <div style={{ background:'#111828', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ color:'#fff', fontSize:'16px', fontWeight:700, margin:0 }}>Edit Post</h2>
            <p style={{ color:'#6b7280', fontSize:'12px', margin:'3px 0 0' }}>Update your post details</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#9ca3af' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding:'24px' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)}
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111828', background:'#f9fafb', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                onFocus={e => { e.target.style.borderColor='#111828'; e.target.style.background='#fff'; }}
                onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#f9fafb'; }}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Content</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} rows={5}
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111828', background:'#f9fafb', outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                onFocus={e => { e.target.style.borderColor='#111828'; e.target.style.background='#fff'; }}
                onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#f9fafb'; }}
              />
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button type="button" onClick={onClose}
                style={{ flex:1, padding:'12px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', fontWeight:600, color:'#374151', background:'#fff', cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit"
                style={{ flex:1, padding:'12px', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, color:'#fff', background:'#111828', cursor:'pointer' }}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE POST MODAL — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────
const PostModal = ({ onClose, onSubmit }) => {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [mode,    setMode]    = useState('Public');
  const [images,  setImages]  = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFileChange = e => {
    const files     = Array.from(e.target.files);
    const newImages = files.map(f => ({ preview: URL.createObjectURL(f), file: f }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage  = i => setImages(prev => prev.filter((_, idx) => idx !== i));
  const handleSubmit = e => { e.preventDefault(); onSubmit({ title, content, isAnonymous: mode === 'Anonymous', images }); };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(17,24,40,0.6)', backdropFilter:'blur(6px)' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:9999, width:'90vw', maxWidth:'520px', maxHeight:'88vh', display:'flex', flexDirection:'column', background:'#fff', borderRadius:'18px', boxShadow:'0 40px 100px rgba(0,0,0,0.35)', overflow:'hidden' }}>
        <div style={{ background:'#111828', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <h2 style={{ color:'#fff', fontSize:'16px', fontWeight:700, margin:0 }}>Create Post</h2>
            <p style={{ color:'#6b7280', fontSize:'12px', margin:'3px 0 0' }}>Share something with the community</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#9ca3af' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'24px' }}>
          <div style={{ display:'flex', background:'#f3f4f6', borderRadius:'12px', padding:'4px', marginBottom:'20px' }}>
            {['Public','Anonymous'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:'9px', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: mode===m ? '#111828' : 'transparent', color: mode===m ? '#fff' : '#9ca3af' }}>
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your post a title..."
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111828', background:'#f9fafb', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                onFocus={e => { e.target.style.borderColor='#111828'; e.target.style.background='#fff'; }}
                onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#f9fafb'; }}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Content</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" rows={4}
                style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111828', background:'#f9fafb', outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                onFocus={e => { e.target.style.borderColor='#111828'; e.target.style.background='#fff'; }}
                onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#f9fafb'; }}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Images</label>
              {images.length > 0 && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'10px' }}>
                  {images.map((img,i) => (
                    <div key={i} style={{ position:'relative', borderRadius:'8px', overflow:'hidden' }}>
                      <img src={img.preview} style={{ width:'100%', height:'80px', objectFit:'cover' }} alt="" />
                      <button type="button" onClick={() => removeImage(i)}
                        style={{ position:'absolute', top:'4px', right:'4px', background:'#ef4444', border:'none', borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', padding:0 }}>
                        <XCircle size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label style={{ display:'flex', alignItems:'center', gap:'10px', border:'1.5px dashed #d1d5db', borderRadius:'10px', padding:'13px 16px', cursor:'pointer' }}>
                <Upload size={17} color="#9ca3af" />
                <span style={{ fontSize:'13px', color:'#6b7280' }}>Click to attach images</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display:'none' }} />
              </label>
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button type="button" onClick={onClose}
                style={{ flex:1, padding:'12px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', fontWeight:600, color:'#374151', background:'#fff', cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit"
                style={{ flex:1, padding:'12px', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, color:'#fff', background:'#111828', cursor:'pointer' }}>
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST DETAIL PAGE
// Added: onDeleteComment, onDeleteReply, onUpvoteReply props
// ─────────────────────────────────────────────────────────────────────────────
const PostDetailPage = ({
  post, onBack, onAddComment, onAddReply,
  onUpvoteComment, onDeleteComment,
  onDeleteReply, onUpvoteReply,
  currentUser, onUpvote, onShare, onSave, isSaved, onProfileClick
}) => {
  const [mode,        setMode]        = useState('Public');
  const [commentText, setCommentText] = useState('');
  const hasUpvoted  = post.upvotes?.includes(currentUser.id);
  const createdAt   = new Date(post.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';

  const handleNewComment = e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post._id, { content: commentText, isAnonymous: mode === 'Anonymous' });
    setCommentText('');
  };

  return (
    <div className="min-h-[80vh] bg-transparent">
      <div className="px-4 md:px-8 py-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
          <ArrowUp size={16} className="rotate-[-90deg]" /> Back to Posts
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-400">
          <span className="text-[#111828] font-semibold">Community Posts</span> • Posted by <span className="font-semibold text-gray-700">{displayName}</span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* LEFT: Post */}
        <div className="lg:w-[42%] lg:sticky lg:top-4 lg:self-start">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex gap-3 p-5">
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <button onClick={onUpvote} className={`p-2 rounded-full hover:bg-orange-50 transition ${hasUpvoted ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}>
                  <ArrowUp size={22} />
                </button>
                <span className={`text-sm font-bold ${hasUpvoted ? 'text-orange-500' : 'text-gray-700'}`}>{post.upvotes?.length || 0}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#111828] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(post.author?.profile?.profileImage?.url || post.author?.profileImage?.url)
                      ? <img src={post.author?.profile?.profileImage?.url || post.author?.profileImage?.url} alt={displayName} className="w-full h-full object-cover" />
                      : displayName[0].toUpperCase()}
                  </div>
                  {!post.isAnonymous
                    ? <button onClick={e => onProfileClick(post.author, e)} className="text-xs font-semibold text-gray-700 hover:text-blue-600 transition">{displayName}</button>
                    : <span className="text-xs font-semibold text-gray-700">{displayName}</span>}
                  <span className="text-xs text-gray-400">• {createdAt}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{post.title}</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-1 mb-4 rounded-xl overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-video bg-gray-100 overflow-hidden">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {i === 3 && post.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white font-semibold text-xl">+{post.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-3 py-2 border-t border-gray-100 flex items-center">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-xs font-semibold text-gray-500">
                <MessageCircle size={15} /> {post.comments?.length || 0} Comments
              </button>
              <button onClick={onShare} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-xs font-semibold text-gray-500">
                <Share2 size={15} /> Share
              </button>
              <button onClick={onSave} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-xs font-semibold ${isSaved ? 'text-blue-600' : 'text-gray-500'}`}>
                {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Comments */}
        <div className="lg:w-[58%] mt-4 lg:mt-0 flex flex-col" style={{ height:'50vh' }}>
          {/* Comment composer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 shrink-0">
            <p className="text-xs text-gray-500 mb-3 font-medium">
              Comment as <span className="text-[#111828] font-semibold">{currentUser.username || 'You'}</span>
            </p>
            <div className="flex gap-2 mb-3">
              {['Public','Anonymous'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mode===m ? 'bg-[#111828] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {m}
                </button>
              ))}
            </div>
            <form onSubmit={handleNewComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-sm"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#111828] text-white rounded-xl hover:bg-[#1e2a3a] transition font-semibold text-sm shadow">
                Comment
              </button>
            </form>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {!post.comments || post.comments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 text-center py-16">
                <MessageCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-medium">No comments yet. Be the first!</p>
              </div>
            ) : (
              post.comments.map(comment => (
                <CommentCard
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
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMENT CARD
// NEW: delete button shown only to the comment's author
// NEW: reply delete button shown only to the reply's author
// NEW: upvote reply wired up
// ─────────────────────────────────────────────────────────────────────────────
const CommentCard = ({
  comment, onAddReply, onUpvoteComment,
  onDeleteComment, onDeleteReply, onUpvoteReply,
  currentUser, depth = 0
}) => {
  const [showReply, setShowReply] = useState(false);
  const [mode,      setMode]      = useState('Public');
  const [replyText, setReplyText] = useState('');

  const displayName = comment.isAnonymous ? 'Anonymous' : comment.author?.username || 'Unknown';
  const hasUpvoted  = comment.upvotes?.includes(currentUser.id);

  // Owner check — _id is preserved even for anonymous comments/replies
  const isOwner = (
    comment.author?._id?.toString() === currentUser.id?.toString() ||
    comment.author?.id?.toString()  === currentUser.id?.toString()
  );

  const handleReply = e => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(comment._id, { content: replyText, isAnonymous: mode === 'Anonymous' });
    setReplyText('');
    setShowReply(false);
  };

  // "[deleted]" placeholder — content was soft-deleted on backend
  if (comment.content === '[deleted]') {
    return (
      <div className={depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3 mt-2' : 'mt-2'}>
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <p className="text-xs text-gray-400 italic">[deleted]</p>
          {/* Still render replies so the thread isn't broken */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map(reply => (
                <CommentCard
                  key={reply._id}
                  comment={reply}
                  onAddReply={onAddReply}
                  onUpvoteComment={onUpvoteReply}
                  onDeleteComment={onDeleteReply}
                  onDeleteReply={onDeleteReply}
                  onUpvoteReply={onUpvoteReply}
                  currentUser={currentUser}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3 mt-2' : 'mt-2'}>
      <div className="bg-white rounded-lg px-3 py-2 border border-gray-100 hover:border-gray-200 transition">
        {/* Author row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600">{displayName}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{comment.upvotes?.length || 0} upvotes</span>
            {comment.isEdited && <span className="text-xs text-gray-400 italic">(edited)</span>}
          </div>

          {isOwner && (
            <button
              onClick={() => depth === 0 ? onDeleteComment(comment._id) : onDeleteReply(comment._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition text-xs font-semibold border border-red-100"
              title="Delete"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        <p className="text-sm text-gray-800 mb-2 leading-snug">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => depth === 0 ? onUpvoteComment(comment._id) : onUpvoteReply(comment._id)}
            className={`flex items-center gap-1 text-xs font-semibold transition ${hasUpvoted ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
          >
            <ArrowUp size={13} /> {hasUpvoted ? 'Upvoted' : 'Upvote'}
          </button>
          {/* Only top-level comments can be replied to (1 level of nesting) */}
          {depth === 0 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#111828] transition"
            >
              <MessageCircle size={13} /> Reply
            </button>
          )}
        </div>

        {showReply && (
          <div className="mt-2">
            <div className="flex gap-1.5 mb-2">
              {['Public','Anonymous'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${mode===m ? 'bg-[#111828] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {m}
                </button>
              ))}
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-xs"
              />
              <button type="submit" className="px-3 py-1.5 bg-[#111828] text-white rounded-lg hover:bg-[#1e2a3a] transition font-semibold text-xs">
                Send
              </button>
            </form>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => (
              <CommentCard
                key={reply._id}
                comment={reply}
                onAddReply={onAddReply}
                onUpvoteComment={onUpvoteReply}
                onDeleteComment={onDeleteReply}
                onDeleteReply={onDeleteReply}
                onUpvoteReply={onUpvoteReply}
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

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MODAL — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────
const ProfileModalContent = ({ selectedProfile, onClose }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-gray-900 text-lg">Profile</h3>
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
    </div>
    <div className="text-center mb-6">
      <div className="w-24 h-24 rounded-full bg-[#111828] mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-lg">
        {selectedProfile.profileImage?.url
          ? <img src={selectedProfile.profileImage.url} alt="" className="w-full h-full object-cover" />
          : selectedProfile.name?.[0]?.toUpperCase() || selectedProfile.username?.[0]?.toUpperCase() || 'U'}
      </div>
      <h4 className="font-bold text-xl text-gray-900 mb-1">{selectedProfile.name || selectedProfile.username}</h4>
      <p className="text-sm text-gray-600 mb-2">{selectedProfile.year ? `${selectedProfile.year} Year Student` : 'Student'}</p>
      {selectedProfile.registerNumber && <p className="text-xs text-gray-500 mb-2">Reg: {selectedProfile.registerNumber}</p>}
      {selectedProfile.dob && <p className="text-xs text-gray-500">DOB: {new Date(selectedProfile.dob).toLocaleDateString()}</p>}
    </div>
    {selectedProfile.bio && (
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-2">About</h5>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedProfile.bio}</p>
      </div>
    )}
    {selectedProfile.skills?.length > 0 && (
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3">Skills</h5>
        <div className="flex flex-wrap gap-2">
          {selectedProfile.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{skill}</span>
          ))}
        </div>
      </div>
    )}
    {selectedProfile.socialLinks && (
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3">Connect</h5>
        <div className="space-y-2">
          {selectedProfile.socialLinks.github && (
            <a href={selectedProfile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold">GH</span></div>GitHub Profile
            </a>
          )}
          {selectedProfile.socialLinks.leetcode && (
            <a href={selectedProfile.socialLinks.leetcode} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-orange-600">LC</span></div>LeetCode Profile
            </a>
          )}
          {selectedProfile.socialLinks.linkedin && (
            <a href={selectedProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-blue-600">in</span></div>LinkedIn Profile
            </a>
          )}
        </div>
      </div>
    )}
    {selectedProfile.achievements?.length > 0 && (
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3">Achievements</h5>
        <div className="space-y-3">
          {selectedProfile.achievements.slice(0, 3).map(a => (
            <div key={a._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
              <h6 className="font-semibold text-gray-900 text-sm mb-1">{a.title}</h6>
              {a.description && <p className="text-xs text-gray-700 mb-2">{a.description}</p>}
              {a.certificate?.url && (
                <a href={a.certificate.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <FileText size={12} /> View Certificate
                </a>
              )}
            </div>
          ))}
          {selectedProfile.achievements.length > 3 && (
            <p className="text-xs text-gray-500 text-center">+{selectedProfile.achievements.length - 3} more achievements</p>
          )}
        </div>
      </div>
    )}
    {selectedProfile.resume?.url && (
      <div className="border-t pt-4">
        <a href={selectedProfile.resume.url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#111828] text-white rounded-lg hover:bg-[#1e2a3a] transition font-semibold text-sm">
          <FileText size={16} /> View Resume
        </a>
      </div>
    )}
  </div>
);

export default PostsPage;