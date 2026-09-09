import React, { useEffect, useState } from "react";
import { 
  Trash2, Search, AlertTriangle, Calendar, 
  MapPin, User, MessageSquare, ThumbsUp, 
  Filter, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

export default function ManageContent() {
  const [activeTab, setActiveTab] = useState("events");
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postSearchQuery, setPostSearchQuery] = useState("");
  
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [commentSearchQuery, setCommentSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ 
    show: false, 
    type: "", 
    id: "", 
    name: "", 
    subType: "", 
    postId: null 
  });
  const [expandedItems, setExpandedItems] = useState(new Set());

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://web-portal-760h.onrender.com/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
      setFilteredEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://web-portal-760h.onrender.com/api/posts");
      const data = await res.json();
      const postsArray = Array.isArray(data) ? data : [];
      setPosts(postsArray);
      setFilteredPosts(postsArray);
      
      const allComments = [];
      
      const extractComments = (commentsList, postId, postTitle, parentId = null, depth = 0) => {
        if (!commentsList || !Array.isArray(commentsList)) return;
        
        commentsList.forEach(comment => {
          // FIX: Ensure we're getting the correct ID field
          const commentId = comment._id || comment.id;
          
          if (commentId) {
            allComments.push({
              ...comment,
              _id: commentId, // Ensure _id is set
              postId,
              postTitle,
              parentId,
              depth,
              isReply: depth > 0
            });
            
            if (comment.replies && comment.replies.length > 0) {
              extractComments(comment.replies, postId, postTitle, commentId, depth + 1);
            }
          }
        });
      };
      
      postsArray.forEach(post => {
        if (post.comments && Array.isArray(post.comments)) {
          extractComments(post.comments, post._id, post.title);
        }
      });
      
      setComments(allComments);
      setFilteredComments(allComments);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    if (activeTab === "events") fetchEvents();
    else if (activeTab === "posts" || activeTab === "comments") fetchPosts();
  }, [activeTab]);

  useEffect(() => {
    let filtered = events;
    
    if (eventSearchQuery) {
      const query = eventSearchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.eventName?.toLowerCase().includes(query) ||
        e.organizer?.toLowerCase().includes(query) ||
        e.venue?.toLowerCase().includes(query)
      );
    }
    
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(e => e.eventType === eventTypeFilter);
    }
    
    setFilteredEvents(filtered);
  }, [eventSearchQuery, eventTypeFilter, events]);

  useEffect(() => {
    if (postSearchQuery) {
      const query = postSearchQuery.toLowerCase();
      const filtered = posts.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.content?.toLowerCase().includes(query) ||
        p.author?.username?.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [postSearchQuery, posts]);

  useEffect(() => {
    if (commentSearchQuery) {
      const query = commentSearchQuery.toLowerCase();
      const filtered = comments.filter(c =>
        c.content?.toLowerCase().includes(query) ||
        c.author?.username?.toLowerCase().includes(query) ||
        c.postTitle?.toLowerCase().includes(query)
      );
      setFilteredComments(filtered);
    } else {
      setFilteredComments(comments);
    }
  }, [commentSearchQuery, comments]);
  
  const openDeleteModal = (type, id, name, subType = "", postId = null) => {
    console.log("Opening delete modal:", { type, id, name, subType, postId });
    
    if (!id) {
      alert("Error: Cannot delete - comment ID is missing");
      return;
    }
    
    setDeleteModal({ show: true, type, id, name, subType, postId });
  };

  const handleDelete = async () => {
    const { type, id, postId } = deleteModal;
    
    if (!id) {
      alert("Error: Cannot delete - ID is missing");
      return;
    }
    
    setLoading(true);

    try {
      let endpoint = "";
      
      if (type === "event") {
        endpoint = `https://web-portal-760h.onrender.com/api/events/${id}`;
      } else if (type === "post") {
        endpoint = `https://web-portal-760h.onrender.com/api/posts/${id}`;
      } else if (type === "comment") {
        if (!postId) {
          alert("Error: Post ID is missing for comment deletion");
          setLoading(false);
          return;
        }
        endpoint = `https://web-portal-760h.onrender.com/api/posts/${postId}/comments/${id}`;
        console.log("Deleting comment:", { postId, commentId: id, endpoint });
      }

      console.log("DELETE request to:", endpoint);
      
      const res = await fetch(endpoint, { method: "DELETE" });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      const contentType = res.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
        console.log("Response data:", result);
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        
        if (res.status === 404) {
          alert("Error: Comment or post not found. The item may have already been deleted.");
          setDeleteModal({ show: false, type: "", id: "", name: "", subType: "", postId: null });
          setLoading(false);
          return;
        }
        
        throw new Error("Invalid response from server");
      }

      if (res.ok || result.success) {
        if (type === "event") {
          setEvents(events.filter(e => e._id !== id));
        } else if (type === "post") {
          setPosts(posts.filter(p => p._id !== id));
        } else if (type === "comment") {
          console.log("Refreshing posts after comment deletion...");
          await fetchPosts();
        }
        setDeleteModal({ show: false, type: "", id: "", name: "", subType: "", postId: null });
        alert("Deleted successfully!");
      } else {
        alert(`Failed to delete: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting item: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventTypes = ["all", "Hackathon", "Cultural Fests", "Management Fests", 
    "Literary Fests", "Sports Fests", "Conferences", "Workshops", "Trainings", "Internships"];

  const renderDeleteModal = () => {
    if (!deleteModal.show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  p-4">
        <div className="bg-white   max-w-md w-full p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-ds-red-tint  text-ds-red">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy">
                Delete {deleteModal.subType || deleteModal.type}?
              </h3>
              <p className="text-ds-ink-soft text-sm mt-1">
                This will permanently delete "{truncateText(deleteModal.name, 50)}"
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setDeleteModal({ show: false, type: "", id: "", name: "", subType: "", postId: null })}
              className="px-5 py-2.5  text-ds-ink font-medium hover:bg-ds-ground transition-colors border border-ds-edge"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2.5  bg-ds-red text-white font-bold hover:bg-ds-red-deep transition-colors "
            >
              {loading ? "Deleting..." : "Yes, Delete It"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ds-ink-faint" size={20} />
          <input
            type="text"
            placeholder="Search events by name, organizer, venue..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-ds-edge    focus:border-navy outline-none"
            value={eventSearchQuery}
            onChange={(e) => setEventSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ds-ink-faint" size={20} />
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="pl-12 pr-8 py-3 bg-white border border-ds-edge    focus:border-navy outline-none appearance-none cursor-pointer min-w-[200px]"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-ds-ground  border border-dashed border-ds-edge">
          <p className="text-ds-ink-soft">No events found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const isExpanded = expandedItems.has(event._id);
            
            return (
              <div key={event._id} className="bg-white p-6  border border-ds-edge  hover: transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-navy">{event.eventName}</h3>
                      <span className="bg-ds-blue-tint text-ds-blue px-2 py-1  text-xs font-bold uppercase">
                        {event.eventType}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-ds-ink-soft mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-ds-ink-faint" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-ds-ink-faint" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center gap-1.5">
                          <User size={16} className="text-ds-ink-faint" />
                          <span>{event.organizer}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <div className="mt-3">
                        <p className="text-ds-ink-soft text-sm leading-relaxed">
                          {isExpanded ? event.description : truncateText(event.description, 200)}
                        </p>
                        {event.description.length > 200 && (
                          <button
                            onClick={() => toggleExpand(event._id)}
                            className="text-ds-blue text-sm font-medium mt-2 flex items-center gap-1 hover:text-ds-blue"
                          >
                            {isExpanded ? (
                              <>Show Less <ChevronUp size={16} /></>
                            ) : (
                              <>Show More <ChevronDown size={16} /></>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {event.poster && (
                    <img 
                      src={event.poster} 
                      alt={event.eventName}
                      className="w-24 h-32 object-cover  border border-ds-edge"
                    />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-ds-edge">
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2  text-sm font-medium text-ds-ink-soft hover:bg-ds-ground transition"
                    >
                      <ExternalLink size={16} /> View Registration
                    </a>
                  )}
                  
                  <button
                    onClick={() => openDeleteModal("event", event._id, event.eventName)}
                    className="flex items-center gap-2 px-4 py-2  text-sm font-bold text-ds-red bg-ds-red-tint hover:bg-ds-red-tint border border-ds-red/30 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ds-ink-faint" size={20} />
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-ds-edge    focus:border-navy outline-none"
          value={postSearchQuery}
          onChange={(e) => setPostSearchQuery(e.target.value)}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-ds-ground  border border-dashed border-ds-edge">
          <p className="text-ds-ink-soft">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isExpanded = expandedItems.has(post._id);
            
            return (
              <div key={post._id} className="bg-white p-6  border border-ds-edge  hover: transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-navy">{post.title}</h3>
                      {post.isAnonymous && (
                        <span className="bg-ds-ground text-ds-ink-soft px-2 py-1  text-xs font-bold">
                          Anonymous
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-ds-ink-soft mb-3">
                      <div className="flex items-center gap-1.5">
                        <User size={16} className="text-ds-ink-faint" />
                        <span>{post.author?.username || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-ds-ink-faint" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    <p className="text-ds-ink-soft text-sm leading-relaxed">
                      {isExpanded ? post.content : truncateText(post.content, 250)}
                    </p>
                    
                    {post.content && post.content.length > 250 && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="text-ds-blue text-sm font-medium mt-2 flex items-center gap-1 hover:text-ds-blue"
                      >
                        {isExpanded ? (
                          <>Show Less <ChevronUp size={16} /></>
                        ) : (
                          <>Show More <ChevronDown size={16} /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="flex gap-2 mt-3 mb-3">
                    {post.images.slice(0, 3).map((img, idx) => (
                      <img 
                        key={`${post._id}-img-${idx}`}
                        src={img.url} 
                        alt=""
                        className="w-20 h-20 object-cover  border border-ds-edge"
                      />
                    ))}
                    {post.images.length > 3 && (
                      <div className="w-20 h-20 bg-ds-ground  border border-ds-edge flex items-center justify-center text-ds-ink-soft text-sm font-medium">
                        +{post.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-ds-edge">
                  <div className="flex items-center gap-4 text-sm text-ds-ink-soft">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp size={16} className="text-ds-ink-faint" />
                      <span>{post.upvotes?.length || 0} upvotes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={16} className="text-ds-ink-faint" />
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openDeleteModal("post", post._id, post.title)}
                    className="flex items-center gap-2 px-4 py-2  text-sm font-bold text-ds-red bg-ds-red-tint hover:bg-ds-red-tint border border-ds-red/30 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderComments = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ds-ink-faint" size={20} />
        <input
          type="text"
          placeholder="Search comments by content, author, or post title..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-ds-edge    focus:border-navy outline-none"
          value={commentSearchQuery}
          onChange={(e) => setCommentSearchQuery(e.target.value)}
        />
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-20 bg-ds-ground  border border-dashed border-ds-edge">
          <p className="text-ds-ink-soft">No comments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => {
            const indentStyle = comment.depth > 0 ? { marginLeft: `${Math.min(comment.depth * 24, 96)}px` } : {};
            const bgColor = comment.isReply ? 'bg-ds-blue-tint' : 'bg-white';
            const borderColor = comment.isReply ? 'border-ds-edge' : 'border-ds-edge';
            
            return (
              <div 
                key={comment._id} 
                style={indentStyle}
                className={`${bgColor} p-6  border ${borderColor}  hover: transition-all`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="mb-3 pb-3 border-b border-ds-edge">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-ds-ink-soft">Comment on post:</p>
                        {comment.isReply && (
                          <span className="bg-ds-blue-tint text-ds-blue px-2 py-0.5  text-xs font-bold">
                            ↳ Reply {comment.depth > 1 ? `(Level ${comment.depth})` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-ds-ink">{comment.postTitle}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-ds-ink-soft mb-3">
                      <div className="flex items-center gap-1.5">
                        <User size={16} className="text-ds-ink-faint" />
                        <span className="font-medium">
                          {comment.isAnonymous ? "Anonymous" : (comment.author?.username || "Unknown")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-ds-ink-faint" />
                        <span>{formatDateTime(comment.createdAt)}</span>
                      </div>
                    </div>

                    <p className="text-ds-ink leading-relaxed">{comment.content}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-ds-edge">
                  <div className="flex items-center gap-4 text-sm text-ds-ink-soft">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp size={16} className="text-ds-ink-faint" />
                      <span>{comment.upvotes?.length || 0} upvotes</span>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={16} className="text-ds-ink-faint" />
                        <span>{comment.replies.length} replies</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => openDeleteModal(
                      "comment", 
                      comment._id, 
                      truncateText(comment.content, 30), 
                      comment.isReply ? "reply" : "comment", 
                      comment.postId
                    )}
                    className="flex items-center gap-2 px-4 py-2  text-sm font-bold text-ds-red bg-ds-red-tint hover:bg-ds-red-tint border border-ds-red/30 transition"
                  >
                    <Trash2 size={16} /> Delete {comment.isReply ? 'Reply' : 'Comment'}
                  </button>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 p-3 bg-ds-red-tint border border-ds-red/30  flex items-start gap-2">
                    <AlertTriangle size={16} className="text-ds-red mt-0.5 shrink-0" />
                    <p className="text-xs text-ds-red-deep">
                      <strong>Warning:</strong> Deleting this comment will also delete all {comment.replies.length} nested {comment.replies.length === 1 ? 'reply' : 'replies'}.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans relative">
      {renderDeleteModal()}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-ds-edge">
          <h1 className="text-3xl font-bold text-ds-ink">Content Management</h1>
          <div className="flex gap-2">
            <span className="bg-ds-blue-tint text-ds-blue px-3 py-1  text-sm font-semibold">
              Events: {events.length}
            </span>
            <span className="bg-ds-blue-tint text-ds-blue px-3 py-1  text-sm font-semibold">
              Posts: {posts.length}
            </span>
            <span className="bg-ds-blue-tint text-ds-blue px-3 py-1  text-sm font-semibold">
              Comments: {comments.length}
            </span>
          </div>
        </div>

        <div className="flex gap-2 bg-ds-ground p-1 ">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 px-6 py-3  font-semibold transition-all ${
              activeTab === "events"
                ? "bg-white text-ds-blue "
                : "text-ds-ink-soft hover:text-ds-ink"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 px-6 py-3  font-semibold transition-all ${
              activeTab === "posts"
                ? "bg-white text-ds-blue "
                : "text-ds-ink-soft hover:text-ds-ink"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-6 py-3  font-semibold transition-all ${
              activeTab === "comments"
                ? "bg-white text-ds-blue "
                : "text-ds-ink-soft hover:text-ds-ink"
            }`}
          >
            Comments
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "events" && renderEvents()}
        {activeTab === "posts" && renderPosts()}
        {activeTab === "comments" && renderComments()}
      </div>
    </div>
  );
}