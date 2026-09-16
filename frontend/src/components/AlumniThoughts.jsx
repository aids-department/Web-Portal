import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Send } from "lucide-react";

const API_BASE = "https://web-portal-760h.onrender.com";

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
    <div className="font-brand">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Voices
          </span>
          <h2 className="m-0 text-[26px] sm:text-[30px] font-semibold tracking-[-0.02em] text-brand-navy">
            Thoughts from Alumni
          </h2>
        </div>
        {isAlumni && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-[12px] font-semibold tracking-[0.04em] hover:bg-brand-navy-deep transition-colors"
          >
            <Send size={13} />
            Share your thought
          </button>
        )}
      </div>

      {/* Post form (alumni only) */}
      {showForm && isAlumni && (
        <div className="mb-5 border border-brand-edge bg-white p-5 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a thought, memory, or message with the department…"
            rows={3}
            className="w-full border border-brand-ink-faint px-3.5 py-3 text-[13.5px] text-brand-ink outline-none focus:border-brand-navy resize-none placeholder:text-brand-ink-faint"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`text-[11px] tabular-nums ${
                wordCount > 100 ? "text-brand-red font-semibold" : "text-brand-ink-soft"
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
                className="px-3.5 py-2 border border-brand-ink-faint text-[11.5px] font-medium text-brand-ink-soft hover:bg-brand-ground"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || !text.trim() || wordCount > 100}
                className="px-4 py-2 bg-brand-red text-white text-[11.5px] font-semibold disabled:opacity-40"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-brand-red-tint text-brand-red-deep px-3 py-2 text-[12px]">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Carousel */}
      {displayThoughts.length > 0 ? (
        <div className="relative group">
          {/* Navigation arrows */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 bg-white border border-brand-edge shadow-md grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} className="text-brand-navy" />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 bg-white border border-brand-edge shadow-md grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} className="text-brand-navy" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
          >
            {displayThoughts.map((t) => (
              <div
                key={t._id}
                className="flex-shrink-0 w-[300px] border border-brand-edge bg-white p-5 flex flex-col gap-3"
              >
                <Quote size={20} className="text-brand-red opacity-60" />
                <p className="m-0 text-[13.5px] leading-[1.7] text-brand-ink flex-1">
                  {t.text}
                </p>
                <div className="border-t border-brand-row pt-3 flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-semibold text-brand-navy">
                    {t.authorName}
                  </span>
                  <span className="text-[10.5px] text-brand-ink-faint tabular-nums">
                    {formatDate(t.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-brand-edge p-8 text-center">
          <p className="m-0 text-[13.5px] text-brand-ink-soft">
            No thoughts shared yet. Be the first to share!
          </p>
        </div>
      )}
    </div>
  );
}
