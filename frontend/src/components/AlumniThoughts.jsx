import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Send } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { EmptyState } from "./ui/States";

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://web-portal-760h.onrender.com');

export default function AlumniThoughts() {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAlumni = user?.role === "alumni";

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    fetchThoughts();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!autoScroll || thoughts.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [autoScroll, thoughts]);

  const fetchThoughts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/alumni-thoughts`);
      const data = await res.json();
      setThoughts(data);
    } catch (err) {
      console.error("Failed to fetch thoughts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!text.trim()) return;
    if (wordCount > 100) {
      setError("Maximum 100 words allowed.");
      return;
    }
    setPosting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/alumni-thoughts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post");
      }
      setText("");
      setShowForm(false);
      fetchThoughts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const scrollCarousel = (dir) => {
    setAutoScroll(false);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  // Sample placeholder thoughts to show when database is empty
  const sampleThoughts = [
    {
      _id: "sample-1",
      text: "The AI & DS department gave me a strong foundation in machine learning and data science. The faculty were incredibly supportive and always encouraged us to explore beyond the curriculum.",
      authorName: "Rahul Krishnan",
      createdAt: "2025-06-15T10:00:00Z",
    },
    {
      _id: "sample-2",
      text: "Some of my best memories are from the hackathons and coding contests organized by the department. Those experiences shaped my problem-solving skills more than any textbook could.",
      authorName: "Priya Sharma",
      createdAt: "2025-04-22T10:00:00Z",
    },
    {
      _id: "sample-3",
      text: "The hands-on lab sessions and real-world projects prepared me well for the industry. I'm grateful for every challenge and every mentor who believed in us.",
      authorName: "Arun Kumar",
      createdAt: "2025-03-10T10:00:00Z",
    },
    {
      _id: "sample-4",
      text: "Being part of this department was a transformative experience. The blend of theory and practical application is what sets PSG iTech's AI & DS apart.",
      authorName: "Meera Venkatesh",
      createdAt: "2025-01-05T10:00:00Z",
    },
    {
      _id: "sample-5",
      text: "I still remember the late-night project sessions and the camaraderie we built. The department didn't just teach us technology — it taught us teamwork.",
      authorName: "Karthik Rajan",
      createdAt: "2024-11-20T10:00:00Z",
    },
  ];

  const displayThoughts = thoughts.length > 0 ? thoughts : sampleThoughts;

  if (loading) return null;

  return (
    <div>
      {/* Header */}
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="eyebrow-accent">Voices</span>
          <h2 className="h-section text-3xl sm:text-4xl">
            <span className="text-gradient">Thoughts from Alumni</span>
          </h2>
        </div>
        {isAlumni && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Send size={13} />
            Share your thought
          </button>
        )}
      </Reveal>

      {/* Post form (alumni only) */}
      {showForm && isAlumni && (
        <div className="surface mb-6 flex flex-col gap-3 p-5 animate-fade-in">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a thought, memory, or message with the department…"
            rows={3}
            className="field resize-none py-3"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`font-mono text-[11px] tabular-nums ${
                wordCount > 100 ? "font-medium text-rose-400" : "text-fg-muted"
              }`}
            >
              {wordCount}/100 words
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setText("");
                  setError("");
                }}
                className="btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || !text.trim() || wordCount > 100}
                className="btn-primary btn-sm"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
          {error && (
            <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[12.5px] text-rose-300">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Carousel */}
      {displayThoughts.length > 0 ? (
        <div className="group/carousel relative">
          {/* Navigation arrows */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-canvas-elevated/90 text-fg opacity-0 shadow-popover backdrop-blur-xl transition-opacity duration-200 hover:bg-canvas-elevated focus-visible:opacity-100 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-white/10 bg-canvas-elevated/90 text-fg opacity-0 shadow-popover backdrop-blur-xl transition-opacity duration-200 hover:bg-canvas-elevated focus-visible:opacity-100 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth px-0.5 pb-3 pt-0.5 [mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%-24px),transparent)]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
          >
            {displayThoughts.map((t) => (
              <div
                key={t._id}
                className="surface edge-highlight flex w-[300px] flex-shrink-0 flex-col gap-4 p-5"
              >
                <Quote size={20} className="text-accent-bright/70" />
                <p className="flex-1 text-[14px] leading-[1.7] text-fg/85">
                  {t.text}
                </p>
                <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
                  <span className="text-[13px] font-medium text-fg">
                    {t.authorName}
                  </span>
                  <span className="font-mono text-[10.5px] tabular-nums text-fg-muted">
                    {formatDate(t.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={Quote} title="No thoughts shared yet. Be the first to share!" />
      )}
    </div>
  );
}
