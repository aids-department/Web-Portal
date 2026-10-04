import React, { useEffect, useState } from "react";
import { 
  Trash2, Search, AlertTriangle, Calendar, 
  MapPin, User, MessageSquare, ThumbsUp, 
  Filter, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import PageHeader from "./ui/PageHeader";
import Modal from "./ui/Modal";
import { EmptyState } from "./ui/States";

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
      <Modal z="z-50" className="max-w-md">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-4">
            <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-300">
              <AlertTriangle size={24} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize tracking-tight text-fg">
                Delete {deleteModal.subType || deleteModal.type}?
              </h3>
              <p className="mt-1 text-[13.5px] text-fg-muted">
                This will permanently delete "{truncateText(deleteModal.name, 50)}"
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setDeleteModal({ show: false, type: "", id: "", name: "", subType: "", postId: null })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn bg-rose-600 text-white shadow-[0_0_0_1px_rgba(244,63,94,0.5),0_4px_12px_rgba(244,63,94,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-rose-500"
            >
              {loading ? "Deleting..." : "Yes, Delete It"}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const ExpandToggle = ({ id, isExpanded }) => (
    <button
      onClick={() => toggleExpand(id)}
      className="mt-2 flex items-center gap-1 text-[13px] font-medium text-accent-bright hover:text-indigo-300"
    >
      {isExpanded ? (
        <>Show Less <ChevronUp size={15} /></>
      ) : (
        <>Show More <ChevronDown size={15} /></>
      )}
    </button>
  );

  const renderEvents = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <SearchBox
          placeholder="Search events by name, organizer, venue..."
          value={eventSearchQuery}
          onChange={(e) => setEventSearchQuery(e.target.value)}
        />

        <div className="relative">
          <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" size={18} />
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="field min-w-[200px] cursor-pointer appearance-none py-3 pl-11 pr-8"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted" size={15} />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Empty>No events found.</Empty>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const isExpanded = expandedItems.has(event._id);

            return (
              <div key={event._id} className="surface p-5 transition-colors hover:border-line-hover sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[16px] font-semibold tracking-tight text-fg">{event.eventName}</h3>
                      <span className="pill font-mono uppercase tracking-wider">
                        {event.eventType}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-[13px] text-fg-muted">
                      <Meta icon={Calendar}>{formatDate(event.startDate)}</Meta>
                      {event.venue && <Meta icon={MapPin}>{event.venue}</Meta>}
                      {event.organizer && <Meta icon={User}>{event.organizer}</Meta>}
                    </div>

                    {event.description && (
                      <div className="mt-3">
                        <p className="text-[13.5px] leading-relaxed text-fg/80">
                          {isExpanded ? event.description : truncateText(event.description, 200)}
                        </p>
                        {event.description.length > 200 && <ExpandToggle id={event._id} isExpanded={isExpanded} />}
                      </div>
                    )}
                  </div>

                  {event.poster && (
                    <img
                      src={event.poster}
                      alt={event.eventName}
                      className="h-32 w-24 flex-none rounded-lg border border-line object-cover"
                    />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-line pt-4">
                  {event.registrationLink && (
                    <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                      <ExternalLink size={15} /> View Registration
                    </a>
                  )}

                  <DeleteButton onClick={() => openDeleteModal("event", event._id, event.eventName)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-5">
      <SearchBox
        placeholder="Search posts by title, content, or author..."
        value={postSearchQuery}
        onChange={(e) => setPostSearchQuery(e.target.value)}
      />

      {filteredPosts.length === 0 ? (
        <Empty>No posts found.</Empty>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const isExpanded = expandedItems.has(post._id);

            return (
              <div key={post._id} className="surface p-5 transition-colors hover:border-line-hover sm:p-6">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[16px] font-semibold tracking-tight text-fg">{post.title}</h3>
                      {post.isAnonymous && <span className="pill-neutral">Anonymous</span>}
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-[13px] text-fg-muted">
                      <Meta icon={User}>{post.author?.username || "Unknown"}</Meta>
                      <Meta icon={Calendar}>{formatDate(post.createdAt)}</Meta>
                    </div>

                    <p className="text-[13.5px] leading-relaxed text-fg/80">
                      {isExpanded ? post.content : truncateText(post.content, 250)}
                    </p>

                    {post.content && post.content.length > 250 && <ExpandToggle id={post._id} isExpanded={isExpanded} />}
                  </div>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="mb-3 mt-3 flex gap-2">
                    {post.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={`${post._id}-img-${idx}`}
                        src={img.url}
                        alt=""
                        className="h-20 w-20 rounded-lg border border-line object-cover"
                      />
                    ))}
                    {post.images.length > 3 && (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-line bg-white/[0.04] text-[13px] font-medium text-fg-muted">
                        +{post.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <div className="flex items-center gap-4 font-mono text-[12px] text-fg-muted">
                    <Meta icon={ThumbsUp}>{post.upvotes?.length || 0} upvotes</Meta>
                    <Meta icon={MessageSquare}>{post.comments?.length || 0} comments</Meta>
                  </div>

                  <DeleteButton onClick={() => openDeleteModal("post", post._id, post.title)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderComments = () => (
    <div className="space-y-5">
      <SearchBox
        placeholder="Search comments by content, author, or post title..."
        value={commentSearchQuery}
        onChange={(e) => setCommentSearchQuery(e.target.value)}
      />

      {filteredComments.length === 0 ? (
        <Empty>No comments found.</Empty>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => {
            const indentStyle = comment.depth > 0 ? { marginLeft: `${Math.min(comment.depth * 24, 96)}px` } : {};

            return (
              <div
                key={comment._id}
                style={indentStyle}
                className={`surface p-5 transition-colors hover:border-line-hover sm:p-6 ${comment.isReply ? 'border-l-2 border-l-accent/50' : ''}`}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 border-b border-line pb-3">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-muted">Comment on post:</p>
                        {comment.isReply && (
                          <span className="pill">
                            ↳ Reply {comment.depth > 1 ? `(Level ${comment.depth})` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-[13.5px] font-semibold text-fg">{comment.postTitle}</p>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-[13px] text-fg-muted">
                      <Meta icon={User}>
                        <span className="font-medium text-fg/90">
                          {comment.isAnonymous ? "Anonymous" : (comment.author?.username || "Unknown")}
                        </span>
                      </Meta>
                      <Meta icon={Calendar}>{formatDateTime(comment.createdAt)}</Meta>
                    </div>

                    <p className="leading-relaxed text-fg/85">{comment.content}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <div className="flex items-center gap-4 font-mono text-[12px] text-fg-muted">
                    <Meta icon={ThumbsUp}>{comment.upvotes?.length || 0} upvotes</Meta>
                    {comment.replies && comment.replies.length > 0 && (
                      <Meta icon={MessageSquare}>{comment.replies.length} replies</Meta>
                    )}
                  </div>

                  <DeleteButton
                    onClick={() => openDeleteModal(
                      "comment",
                      comment._id,
                      truncateText(comment.content, 30),
                      comment.isReply ? "reply" : "comment",
                      comment.postId
                    )}
                  >
                    Delete {comment.isReply ? 'Reply' : 'Comment'}
                  </DeleteButton>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
                    <p className="text-[12.5px] text-amber-100/90">
                      <strong className="font-semibold">Warning:</strong> Deleting this comment will also delete all {comment.replies.length} nested {comment.replies.length === 1 ? 'reply' : 'replies'}.
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

  const TABS = [
    { id: "events", label: "Events", count: events.length },
    { id: "posts", label: "Posts", count: posts.length },
    { id: "comments", label: "Comments", count: comments.length },
  ];

  return (
    <div className="relative mx-auto max-w-6xl">
      {renderDeleteModal()}

      <PageHeader
        compact
        eyebrow="Moderation"
        title="Content Management"
        actions={
          <div className="flex flex-wrap gap-2">
            <span className="pill-neutral font-mono">Events: {events.length}</span>
            <span className="pill-neutral font-mono">Posts: {posts.length}</span>
            <span className="pill-neutral font-mono">Comments: {comments.length}</span>
          </div>
        }
      >
        <div className="tabs mt-6 flex w-full">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`tab flex-1 py-2.5 ${activeTab === t.id ? "tab-active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="animate-fade-in" key={activeTab}>
        {activeTab === "events" && renderEvents()}
        {activeTab === "posts" && renderPosts()}
        {activeTab === "comments" && renderComments()}
      </div>
    </div>
  );
}

// Module-scope helpers: defining these inside ManageContent would remount
// them (and drop input focus) on every keystroke.
const SearchBox = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" size={18} />
    <input type="text" placeholder={placeholder} className="field py-3 pl-11" value={value} onChange={onChange} />
  </div>
);

const Meta = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-1.5">
    <Icon size={14} className="text-fg-muted/70" />
    <span>{children}</span>
  </div>
);

const DeleteButton = ({ onClick, children = "Delete" }) => (
  <button onClick={onClick} className="btn-danger btn-sm">
    <Trash2 size={15} /> {children}
  </button>
);

const Empty = ({ children }) => <EmptyState title={children} />;
