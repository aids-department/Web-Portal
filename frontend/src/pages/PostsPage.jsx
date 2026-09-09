import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, ArrowUp, MessageCircle, Share2, X,
  Upload, XCircle, Bookmark, BookmarkCheck, FileText,
  Pencil, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
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
        <div className="text-xl text-ds-ink-soft">Loading posts...</div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="relative bg-white border border-ds-edge overflow-hidden min-h-[80vh]">
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
              className="absolute z-[1000] bg-white border-2 border-navy w-full max-w-sm max-h-[90vh] overflow-y-auto"
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
      <div className="relative bg-white border border-ds-edge p-4 md:p-8 min-h-[80vh]">

        <div className="relative z-10">
          <div className="text-center mb-6 md:mb-8 pt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-2 leading-tight">Community Posts</h1>
            <div className="w-16 h-1 bg-navy mx-auto  mb-3" />
            <p className="text-sm text-ds-ink-soft max-w-xl mx-auto">Discuss, share, and connect with the community</p>
          </div>

          <div className="flex gap-6 items-start w-full">
            {/* LEFT: Feed */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-ink-faint" size={18} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-ds-edge focus:outline-none focus:border-navy text-sm"
                  />
                </div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white  font-semibold hover:bg-navy-deep transition  text-sm shrink-0"
                >
                  <Plus size={16} /> Create Post
                </button>
              </div>

              <div className="space-y-3 pb-8">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white  p-16 text-center  border border-ds-edge">
                    <MessageCircle className="w-12 h-12 mx-auto text-ds-ink-faint mb-4" />
                    <p className="text-base font-semibold text-ds-ink-soft">
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
              <div className="bg-white  border border-ds-edge  p-4">
                <h4 className="text-xs font-bold text-ds-ink-soft uppercase tracking-wider mb-3">View</h4>
                <div className="space-y-1">
                  {[
                    [false, 'All Posts'],
                    [true,  'My Posts'],
                  ].map(([val, label]) => (
                    <button
                      key={label}
                      onClick={() => setShowMyPosts(val)}
                      className={`w-full text-left px-3 py-2  text-sm font-medium transition ${showMyPosts === val ? 'bg-navy text-white' : 'text-ds-ink-soft hover:bg-ds-ground'}`}
                    >
                      {label}
                      {val && showMyPosts && (
                        <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 ">{filteredPosts.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white  border border-ds-edge  p-4">
                <h4 className="text-xs font-bold text-ds-ink-soft uppercase tracking-wider mb-3">Sort By</h4>
                <div className="space-y-1">
                  {[['newest','Newest'],['popular','Most Upvoted'],['discussed','Most Discussed']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setSortBy(val)}
                      className={`w-full text-left px-3 py-2  text-sm font-medium transition ${sortBy === val ? 'bg-navy text-white' : 'text-ds-ink-soft hover:bg-ds-ground'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {savedPosts.length > 0 && (
                <div className="bg-white  border border-ds-edge  p-4">
                  <h4 className="text-xs font-bold text-ds-ink-soft uppercase tracking-wider mb-3">Saved Posts</h4>
                  <div className="space-y-2">
                    {posts.filter(p => savedPosts.includes(p._id)).slice(0, 3).map(p => (
                      <button
                        key={p._id}
                        onClick={() => handleOpenPost(p)}
                        className="w-full text-left text-xs text-ds-ink hover:text-navy font-medium truncate block hover:underline"
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
            className="absolute z-[1000] bg-white   w-full max-w-sm max-h-[90vh] overflow-y-auto"
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
    <div className="bg-white   border border-ds-edge hover: transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12  bg-ds-edge flex items-center justify-center text-ds-ink font-semibold text-lg shrink-0 overflow-hidden">
            {(post.author?.profile?.profileImage?.url || post.author?.profileImage?.url) ? (
              <img
                src={post.author?.profile?.profileImage?.url || post.author?.profileImage?.url}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-navy flex items-center justify-center text-white font-bold">${displayName[0].toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-navy flex items-center justify-center text-white font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!post.isAnonymous ? (
                <button
                  onClick={e => onProfileClick(post.author, e)}
                  className="font-semibold text-navy text-sm hover:text-ds-blue transition-colors text-left"
                >
                  {displayName}
                </button>
              ) : (
                <h4 className="font-semibold text-navy text-sm">{displayName}</h4>
              )}
              {post.isAnonymous && <span className="text-xs text-ds-ink-soft">• Anonymous</span>}
            </div>
            <p className="text-xs text-ds-ink-soft">{createdAt}</p>
          </div>

          {/* Edit / Delete — shown for owner including anonymous posts */}
          {isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5  hover:bg-ds-blue-tint text-ds-blue transition"
                title="Edit post"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5  hover:bg-ds-red-tint text-ds-red transition"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-base font-semibold text-navy mb-2">{post.title}</h3>
        <p className="text-sm text-ds-ink leading-relaxed">{post.content}</p>
      </div>

      {post.images && post.images.length > 0 && (
        <div className="px-5 pb-4">
          <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative aspect-video bg-ds-ground  overflow-hidden border border-ds-edge">
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

      <div className="px-3 py-2 border-t border-ds-edge flex items-center">
        <button
          onClick={onUpvote}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5  hover:bg-ds-ground transition text-sm font-medium ${hasUpvoted ? 'text-navy' : 'text-ds-ink-soft'}`}
        >
          <ArrowUp size={18} />
          {(post.upvotes?.length ?? 0) > 0 && <span className="text-xs font-semibold">{post.upvotes.length}</span>}
        </button>
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-2 py-2.5  hover:bg-ds-ground transition text-sm font-medium text-ds-ink-soft"
        >
          <MessageCircle size={18} />
          {(post.comments?.length ?? 0) > 0 && <span className="text-xs font-semibold">{post.comments.length}</span>}
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5  hover:bg-ds-ground transition text-sm font-medium text-ds-ink-soft"
        >
          <Share2 size={18} /> Share
        </button>
        <button
          onClick={onSave}
          className={`flex items-center justify-center gap-2 py-2.5 px-3  hover:bg-ds-ground transition text-sm font-medium ${isSaved ? 'text-navy' : 'text-ds-ink-soft'}`}
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
      <div onClick={onClose} className="fixed inset-0 z-[9998] bg-navy/60" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[520px] max-h-[88vh] flex flex-col bg-white border-2 border-navy overflow-hidden">
        <div className="bg-navy px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-card-title text-white">Edit post</h2>
            <p className="text-label text-on-navy-muted mt-1">Update your post details</p>
          </div>
          <button onClick={onClose} className="text-on-navy-muted hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Field.Label htmlFor="edit-title">Title</Field.Label>
              <Field.Input id="edit-title" required value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <Field.Label htmlFor="edit-content">Content</Field.Label>
              <Field.Textarea id="edit-content" required value={content} onChange={e => setContent(e.target.value)} rows={5} />
            </div>
            <div className="flex gap-2.5">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
                Cancel
              </Button>
              <Button type="submit" variant="navy" className="flex-1 justify-center">
                Save changes
              </Button>
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
      <div onClick={onClose} className="fixed inset-0 z-[9998] bg-navy/60" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[520px] max-h-[88vh] flex flex-col bg-white border-2 border-navy overflow-hidden">
        <div className="bg-navy px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-card-title text-white">Create post</h2>
            <p className="text-label text-on-navy-muted mt-1">Share something with the community</p>
          </div>
          <button onClick={onClose} className="text-on-navy-muted hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex border border-ds-edge mb-5">
            {['Public','Anonymous'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-label font-medium ${mode === m ? 'bg-navy text-white' : 'bg-white text-ds-ink-faint'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Field.Label htmlFor="post-title">Title</Field.Label>
              <Field.Input id="post-title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your post a title…" />
            </div>
            <div>
              <Field.Label htmlFor="post-content">Content</Field.Label>
              <Field.Textarea id="post-content" required value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" rows={4} />
            </div>
            <div>
              <Field.Label>Images</Field.Label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {images.map((img,i) => (
                    <div key={i} className="relative">
                      <img src={img.preview} className="w-full h-20 object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-ds-red text-white w-5 h-5 flex items-center justify-center"
                      >
                        <XCircle size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2.5 border-2 border-dashed border-ds-edge px-4 py-3.5 cursor-pointer">
                <Upload size={16} className="text-ds-ink-faint" />
                <span className="text-body text-ds-ink-soft">Click to attach images</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="flex gap-2.5">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 justify-center">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 justify-center">
                Publish post
              </Button>
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
      <div className="px-4 md:px-8 py-4 border-b border-ds-edge bg-white/60  flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-ds-ink-soft hover:text-ds-blue transition px-3 py-1.5  hover:bg-ds-ground">
          <ArrowUp size={16} className="rotate-[-90deg]" /> Back to Posts
        </button>
        <span className="text-ds-ink-faint">|</span>
        <span className="text-xs text-ds-ink-faint">
          <span className="text-navy font-semibold">Community Posts</span> • Posted by <span className="font-semibold text-ds-ink">{displayName}</span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* LEFT: Post */}
        <div className="lg:w-[42%] lg:sticky lg:top-4 lg:self-start">
          <div className="bg-white   border border-ds-edge overflow-hidden">
            <div className="flex gap-3 p-5">
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <button onClick={onUpvote} className={`p-2  hover:bg-ds-red-tint transition ${hasUpvoted ? 'text-ds-red' : 'text-ds-ink-faint hover:text-ds-red'}`}>
                  <ArrowUp size={22} />
                </button>
                <span className={`text-sm font-bold ${hasUpvoted ? 'text-ds-red' : 'text-ds-ink'}`}>{post.upvotes?.length || 0}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7  overflow-hidden bg-navy flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(post.author?.profile?.profileImage?.url || post.author?.profileImage?.url)
                      ? <img src={post.author?.profile?.profileImage?.url || post.author?.profileImage?.url} alt={displayName} className="w-full h-full object-cover" />
                      : displayName[0].toUpperCase()}
                  </div>
                  {!post.isAnonymous
                    ? <button onClick={e => onProfileClick(post.author, e)} className="text-xs font-semibold text-ds-ink hover:text-ds-blue transition">{displayName}</button>
                    : <span className="text-xs font-semibold text-ds-ink">{displayName}</span>}
                  <span className="text-xs text-ds-ink-faint">• {createdAt}</span>
                </div>
                <h2 className="text-xl font-bold text-navy mb-3 leading-snug">{post.title}</h2>
                <p className="text-sm text-ds-ink leading-relaxed mb-4">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-1 mb-4  overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-video bg-ds-ground overflow-hidden">
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
            <div className="px-3 py-2 border-t border-ds-edge flex items-center">
              <button className="flex-1 flex items-center justify-center gap-2 py-2  hover:bg-ds-ground transition text-xs font-semibold text-ds-ink-soft">
                <MessageCircle size={15} /> {post.comments?.length || 0} Comments
              </button>
              <button onClick={onShare} className="flex-1 flex items-center justify-center gap-2 py-2  hover:bg-ds-ground transition text-xs font-semibold text-ds-ink-soft">
                <Share2 size={15} /> Share
              </button>
              <button onClick={onSave} className={`flex-1 flex items-center justify-center gap-2 py-2  hover:bg-ds-ground transition text-xs font-semibold ${isSaved ? 'text-ds-blue' : 'text-ds-ink-soft'}`}>
                {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Comments */}
        <div className="lg:w-[58%] mt-4 lg:mt-0 flex flex-col" style={{ height:'50vh' }}>
          {/* Comment composer */}
          <div className="bg-white   border border-ds-edge p-4 mb-4 shrink-0">
            <p className="text-xs text-ds-ink-soft mb-3 font-medium">
              Comment as <span className="text-navy font-semibold">{currentUser.username || 'You'}</span>
            </p>
            <div className="flex gap-2 mb-3">
              {['Public','Anonymous'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1.5  text-xs font-semibold transition ${mode===m ? 'bg-navy text-white shadow' : 'bg-ds-ground text-ds-ink-soft hover:bg-ds-edge'}`}>
                  {m}
                </button>
              ))}
            </div>
            <form onSubmit={handleNewComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                className="flex-1 px-4 py-2.5 border-2 border-ds-edge  focus:outline-none focus:border-navy transition text-sm"
              />
              <button type="submit" className="px-5 py-2.5 bg-navy text-white  hover:bg-navy-deep transition font-semibold text-sm shadow">
                Comment
              </button>
            </form>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {!post.comments || post.comments.length === 0 ? (
              <div className="bg-white  border border-ds-edge text-center py-16">
                <MessageCircle className="w-10 h-10 mx-auto text-ds-ink-faint mb-3" />
                <p className="text-ds-ink-soft text-sm font-medium">No comments yet. Be the first!</p>
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
      <div className={depth > 0 ? 'ml-4 border-l-2 border-ds-edge pl-3 mt-2' : 'mt-2'}>
        <div className="bg-ds-ground  px-3 py-2 border border-ds-edge">
          <p className="text-xs text-ds-ink-faint italic">[deleted]</p>
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
    <div className={depth > 0 ? 'ml-4 border-l-2 border-ds-edge pl-3 mt-2' : 'mt-2'}>
      <div className="bg-white  px-3 py-2 border border-ds-edge hover:border-ds-edge transition">
        {/* Author row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ds-blue">{displayName}</span>
            <span className="text-xs text-ds-ink-faint">•</span>
            <span className="text-xs text-ds-ink-faint">{comment.upvotes?.length || 0} upvotes</span>
            {comment.isEdited && <span className="text-xs text-ds-ink-faint italic">(edited)</span>}
          </div>

          {isOwner && (
            <button
              onClick={() => depth === 0 ? onDeleteComment(comment._id) : onDeleteReply(comment._id)}
              className="flex items-center gap-1.5 px-3 py-1.5  bg-ds-red-tint hover:bg-ds-red-tint text-ds-red hover:text-ds-red-deep transition text-xs font-semibold border border-ds-red/30"
              title="Delete"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        <p className="text-sm text-ds-ink mb-2 leading-snug">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => depth === 0 ? onUpvoteComment(comment._id) : onUpvoteReply(comment._id)}
            className={`flex items-center gap-1 text-xs font-semibold transition ${hasUpvoted ? 'text-ds-blue' : 'text-ds-ink-faint hover:text-ds-blue'}`}
          >
            <ArrowUp size={13} /> {hasUpvoted ? 'Upvoted' : 'Upvote'}
          </button>
          {/* Only top-level comments can be replied to (1 level of nesting) */}
          {depth === 0 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs font-semibold text-ds-ink-faint hover:text-navy transition"
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
                  className={`px-2.5 py-1  text-xs font-semibold ${mode===m ? 'bg-navy text-white' : 'bg-ds-ground text-ds-ink-soft'}`}>
                  {m}
                </button>
              ))}
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 border border-ds-edge  focus:outline-none focus:border-navy transition text-xs"
              />
              <button type="submit" className="px-3 py-1.5 bg-navy text-white  hover:bg-navy-deep transition font-semibold text-xs">
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
      <h3 className="font-bold text-navy text-lg">Profile</h3>
      <button onClick={onClose} className="p-1 hover:bg-ds-ground  transition"><X size={20} /></button>
    </div>
    <div className="text-center mb-6">
      <div className="w-24 h-24  bg-navy mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-3xl font-bold ">
        {selectedProfile.profileImage?.url
          ? <img src={selectedProfile.profileImage.url} alt="" className="w-full h-full object-cover" />
          : selectedProfile.name?.[0]?.toUpperCase() || selectedProfile.username?.[0]?.toUpperCase() || 'U'}
      </div>
      <h4 className="font-bold text-xl text-navy mb-1">{selectedProfile.name || selectedProfile.username}</h4>
      <p className="text-sm text-ds-ink-soft mb-2">{selectedProfile.year ? `${selectedProfile.year} Year Student` : 'Student'}</p>
      {selectedProfile.registerNumber && <p className="text-xs text-ds-ink-soft mb-2">Reg: {selectedProfile.registerNumber}</p>}
      {selectedProfile.dob && <p className="text-xs text-ds-ink-soft">DOB: {new Date(selectedProfile.dob).toLocaleDateString()}</p>}
    </div>
    {selectedProfile.bio && (
      <div className="mb-6">
        <h5 className="font-semibold text-navy mb-2">About</h5>
        <p className="text-sm text-ds-ink leading-relaxed bg-ds-ground p-3 ">{selectedProfile.bio}</p>
      </div>
    )}
    {selectedProfile.skills?.length > 0 && (
      <div className="mb-6">
        <h5 className="font-semibold text-navy mb-3">Skills</h5>
        <div className="flex flex-wrap gap-2">
          {selectedProfile.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-ds-blue-tint text-ds-blue text-xs font-medium ">{skill}</span>
          ))}
        </div>
      </div>
    )}
    {selectedProfile.socialLinks && (
      <div className="mb-6">
        <h5 className="font-semibold text-navy mb-3">Connect</h5>
        <div className="space-y-2">
          {selectedProfile.socialLinks.github && (
            <a href={selectedProfile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-ds-ink hover:text-ds-blue transition p-2 hover:bg-ds-ground ">
              <div className="w-8 h-8 bg-ds-ground  flex items-center justify-center"><span className="text-xs font-bold">GH</span></div>GitHub Profile
            </a>
          )}
          {selectedProfile.socialLinks.leetcode && (
            <a href={selectedProfile.socialLinks.leetcode} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-ds-ink hover:text-ds-blue transition p-2 hover:bg-ds-ground ">
              <div className="w-8 h-8 bg-ds-red-tint  flex items-center justify-center"><span className="text-xs font-bold text-ds-red-deep">LC</span></div>LeetCode Profile
            </a>
          )}
          {selectedProfile.socialLinks.linkedin && (
            <a href={selectedProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-ds-ink hover:text-ds-blue transition p-2 hover:bg-ds-ground ">
              <div className="w-8 h-8 bg-ds-blue-tint  flex items-center justify-center"><span className="text-xs font-bold text-ds-blue">in</span></div>LinkedIn Profile
            </a>
          )}
        </div>
      </div>
    )}
    {selectedProfile.achievements?.length > 0 && (
      <div className="mb-6">
        <h5 className="font-semibold text-navy mb-3">Achievements</h5>
        <div className="space-y-3">
          {selectedProfile.achievements.slice(0, 3).map(a => (
            <div key={a._id} className="bg-ds-red-tint p-3 border-t-2 border-ds-red">
              <h6 className="font-semibold text-navy text-sm mb-1">{a.title}</h6>
              {a.description && <p className="text-xs text-ds-ink mb-2">{a.description}</p>}
              {a.certificate?.url && (
                <a href={a.certificate.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-ds-blue hover:underline">
                  <FileText size={12} /> View Certificate
                </a>
              )}
            </div>
          ))}
          {selectedProfile.achievements.length > 3 && (
            <p className="text-xs text-ds-ink-soft text-center">+{selectedProfile.achievements.length - 3} more achievements</p>
          )}
        </div>
      </div>
    )}
    {selectedProfile.resume?.url && (
      <div className="border-t pt-4">
        <a href={selectedProfile.resume.url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-navy text-white  hover:bg-navy-deep transition font-semibold text-sm">
          <FileText size={16} /> View Resume
        </a>
      </div>
    )}
  </div>
);

export default PostsPage;