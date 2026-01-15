import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowUp, MessageCircle, Share2, X, Upload, XCircle, Filter, Bookmark, BookmarkCheck, FileText } from 'lucide-react';

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ top: 0, left: 0 });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch posts from MongoDB
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://web-portal-760h.onrender.com/api/posts');
      const data = await response.json();
      console.log('Posts data:', data.slice(0, 2)); // Log first 2 posts for debugging
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

      const response = await fetch('https://web-portal-760h.onrender.com/api/posts', {
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
      const response = await fetch(`https://web-portal-760h.onrender.com/api/posts/${postId}/upvote`, {
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
      const response = await fetch(`https://web-portal-760h.onrender.com/api/posts/${postId}/comments`, {
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
          const updatedPosts = await fetch('https://web-portal-760h.onrender.com/api/posts').then(r => r.json());
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
      const response = await fetch(`https://web-portal-760h.onrender.com/api/comments/${commentId}/replies`, {
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
          const updatedPosts = await fetch('https://web-portal-760h.onrender.com/api/posts').then(r => r.json());
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
      const response = await fetch(`https://web-portal-760h.onrender.com/api/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        fetchPosts();
        if (selectedPost) {
          const updatedPosts = await fetch('https://web-portal-760h.onrender.com/api/posts').then(r => r.json());
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
  ).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'popular') return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
    if (sortBy === 'discussed') return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  });

  const handleSavePost = (postId) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleSharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


const handleProfileClick = async (author, event) => {
  try {
    const rect = event.currentTarget.getBoundingClientRect();

    setProfilePosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });

    const profileResponse = await fetch(
      `https://web-portal-760h.onrender.com/api/profile/${author._id || author.id}`
    );
    const profile = await profileResponse.json();

    // Fetch achievements for this user
    const achievementsResponse = await fetch(
      `https://web-portal-760h.onrender.com/api/achievements/user/${author._id || author.id}`
    );
    const achievements = await achievementsResponse.json();

    setSelectedProfile({ 
      ...profile, 
      username: author.username,
      achievements: achievements.filter(a => a.status === 'approved') // Only show approved achievements
    });
    setIsProfileModalOpen(true);
  } catch (err) {
    console.error('Failed to fetch profile:', err);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
  <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-4 md:p-8 overflow-hidden min-h-[80vh]">
    {/* Decorative orbs */}
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

    <div className="relative z-10">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 md:mb-4 font-cursive leading-tight">
          Community Posts
        </h1>
        <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-3 md:mb-4"></div>
        <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto px-4">
          Discuss, share, and connect with the community
        </p>
      </div>

      <div className="flex justify-center gap-8">
        {/* Main Feed */}
        <div className="w-full max-w-2xl flex flex-col">
          <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base shadow-sm"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 md:py-4 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base shadow-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Upvoted</option>
              <option value="discussed">Most Discussed</option>
            </select>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg text-sm md:text-base"
            >
              <Plus size={20} /> Create Post
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto space-y-4 md:space-y-5 pb-8">
            {filteredPosts.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 md:p-20 text-center shadow-lg border border-white/40">
                <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4 md:mb-6" />
                <p className="text-lg md:text-xl font-semibold text-gray-700">
                  No posts yet. Be the first to post!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onOpen={() => setSelectedPost(post)}
                  onUpvote={() => handleUpvote(post._id)}
                  onShare={() => handleSharePost(post)}
                  onSave={() => handleSavePost(post._id)}
                  isSaved={savedPosts.includes(post._id)}
                  currentUserId={currentUser.id}
                  onProfileClick={handleProfileClick}
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
    </div>

    {/* Create Post Modal */}
    {isPostModalOpen && (
      <PostModal
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
      />
    )}

    {/* Profile Modal */}
    {isProfileModalOpen && selectedProfile && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 z-[999] bg-black/50"
      onClick={() => setIsProfileModalOpen(false)}
    />

    {/* Popup */}
    <div
      className="absolute z-[1000] bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
      style={{
        top: Math.min(profilePosition.top, window.innerHeight - 500),
        left: window.innerWidth < 768 
          ? '50%' 
          : Math.min(profilePosition.left, window.innerWidth - 320),
        transform: window.innerWidth < 768 
          ? 'translateX(-50%)' 
          : 'none',
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Profile</h3>
          <button 
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Image and Basic Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {selectedProfile.profileImage?.url ? (
              <img
                src={selectedProfile.profileImage.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              selectedProfile.name?.[0]?.toUpperCase() || selectedProfile.username?.[0]?.toUpperCase() || "U"
            )}
          </div>

          <h4 className="font-bold text-xl text-gray-900 mb-1">
            {selectedProfile.name || selectedProfile.username}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {selectedProfile.year ? `${selectedProfile.year} Year Student` : "Student"}
          </p>
          
          {selectedProfile.registerNumber && (
            <p className="text-xs text-gray-500 mb-2">
              Reg: {selectedProfile.registerNumber}
            </p>
          )}
          
          {selectedProfile.dob && (
            <p className="text-xs text-gray-500">
              DOB: {new Date(selectedProfile.dob).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Bio */}
        {selectedProfile.bio && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-2">About</h5>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
              {selectedProfile.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {selectedProfile.skills && selectedProfile.skills.length > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-3">Skills</h5>
            <div className="flex flex-wrap gap-2">
              {selectedProfile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {selectedProfile.socialLinks && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-3">Connect</h5>
            <div className="space-y-2">
              {selectedProfile.socialLinks.github && (
                <a
                  href={selectedProfile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">GH</span>
                  </div>
                  GitHub Profile
                </a>
              )}
              
              {selectedProfile.socialLinks.leetcode && (
                <a
                  href={selectedProfile.socialLinks.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">LC</span>
                  </div>
                  LeetCode Profile
                </a>
              )}
              
              {selectedProfile.socialLinks.linkedin && (
                <a
                  href={selectedProfile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">in</span>
                  </div>
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        )}

        {/* Achievements */}
        {selectedProfile.achievements && selectedProfile.achievements.length > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-3">Achievements</h5>
            <div className="space-y-3">
              {selectedProfile.achievements.slice(0, 3).map((achievement) => (
                <div key={achievement._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                  <h6 className="font-semibold text-gray-900 text-sm mb-1">{achievement.title}</h6>
                  {achievement.description && (
                    <p className="text-xs text-gray-700 mb-2">{achievement.description}</p>
                  )}
                  {achievement.certificate?.url && (
                    <a
                      href={achievement.certificate.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <FileText size={12} /> View Certificate
                    </a>
                  )}
                </div>
              ))}
              {selectedProfile.achievements.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{selectedProfile.achievements.length - 3} more achievements
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resume */}
        {selectedProfile.resume?.url && (
          <div className="border-t pt-4">
            <a
              href={selectedProfile.resume.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-sm"
            >
              <FileText size={16} /> View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  </>
)}

  </div>
);
};

// Post Card Component
const PostCard = ({ post, onOpen, onUpvote, onShare, onSave, isSaved, currentUserId, onProfileClick }) => {
  const displayName = post.isAnonymous ? 'Anonymous' : post.author?.username || 'Unknown';
  const hasUpvoted = post.upvotes?.includes(currentUserId);
  const createdAt = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Debug logging
  console.log('Post author data:', post.author);
  console.log('Profile image URL:', post.author?.profile?.profileImage?.url || post.author?.profileImage?.url);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-lg shrink-0 overflow-hidden">
            {(post.author?.profile?.profileImage?.url || post.author?.profileImage?.url) ? (
              <img 
                src={post.author?.profile?.profileImage?.url || post.author?.profileImage?.url} 
                alt={displayName} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">${displayName[0].toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!post.isAnonymous ? (
                <button
  onClick={(e) => onProfileClick(post.author, e)}
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
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Images */}
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

      {/* Stats */}
      <div className="px-5 py-3 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <ArrowUp size={14} />
            {post.upvotes?.length || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} />
            {post.comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-2 border-t border-gray-200 flex items-center">
        <button
          onClick={onUpvote}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium ${hasUpvoted ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <ArrowUp size={18} /> Upvote
        </button>
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-600"
        >
          <MessageCircle size={18} /> Comment
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-600"
        >
          <Share2 size={18} /> Share
        </button>
        <button
          onClick={onSave}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-100 transition text-sm font-medium ${isSaved ? 'text-blue-600' : 'text-gray-600'}`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={28} /></button>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setMode('Public')} className={`px-5 py-2.5 rounded-xl font-semibold transition ${mode === 'Public' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Public</button>
          <button onClick={() => setMode('Anonymous')} className={`px-5 py-2.5 rounded-xl font-semibold transition ${mode === 'Anonymous' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Anonymous</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none transition text-sm md:text-base" />
          <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl h-32 mb-4 focus:border-blue-500 focus:outline-none transition resize-none text-sm md:text-base" />

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

          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center cursor-pointer mb-6 hover:border-blue-400 hover:bg-blue-50/30 transition">
            <Upload size={36} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm md:text-base text-gray-600 font-medium">Click or drag images</p>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg text-sm md:text-base">
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-6 flex justify-between items-center z-10 shadow-lg rounded-t-3xl shrink-0">
          <h2 className="text-lg md:text-2xl font-bold text-white">Comments</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X size={24} className="md:w-7 md:h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Post Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 md:p-5 mb-5 border border-blue-100">
            <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">{post.title}</h3>
            <p className="text-sm md:text-base text-gray-700 mb-2 line-clamp-3">{post.content}</p>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              — {post.isAnonymous ? 'Anonymous' : post.author?.username}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('Public')} className={`flex-1 px-4 py-2 rounded-xl font-semibold transition text-sm ${mode === 'Public' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Public</button>
            <button onClick={() => setMode('Anonymous')} className={`flex-1 px-4 py-2 rounded-xl font-semibold transition text-sm ${mode === 'Anonymous' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Anonymous</button>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleNewComment} className="flex gap-2 mb-6">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-sm"
            />
            <button type="submit" className="px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-md font-semibold text-sm">Send</button>
          </form>

          {/* Comments List */}
          <div>
            {!post.comments || post.comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium text-sm">No comments yet. Be the first!</p>
              </div>
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
    <div className={depth > 0 ? "ml-4 md:ml-8 mt-5 border-l-2 border-gray-200 pl-3 md:pl-4" : "mt-6"}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-5 border border-gray-200">
        <p className="font-medium text-sm md:text-base text-gray-800 mb-2">{comment.content}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{displayName}</span>
          <span>•</span>
          <span>{comment.upvotes?.length || 0} upvote{comment.upvotes?.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
          <button
            onClick={() => onUpvoteComment(comment._id)}
            className={`flex items-center gap-1.5 font-semibold transition ${hasUpvoted ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <ArrowUp size={16} className="md:w-[18px] md:h-[18px]" /> Upvote
          </button>
          <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1.5 font-semibold text-gray-600 hover:text-purple-600 transition">
            <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" /> Reply
          </button>
        </div>

        {showReply && (
          <div className="mt-5">
            <div className="flex gap-2 mb-3">
              <button onClick={() => setMode('Public')} className={`px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold ${mode === 'Public' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Public</button>
              <button onClick={() => setMode('Anonymous')} className={`px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold ${mode === 'Anonymous' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Anonymous</button>
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-sm"
              />
              <button type="submit" className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-sm">Send</button>
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