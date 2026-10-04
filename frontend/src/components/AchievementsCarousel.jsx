import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export default function AchievementsCarousel() {
    const [achievements, setAchievements] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch live achievements from the Render API
    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent");
                const data = await res.json();
                setAchievements(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch achievements:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    // 2. Auto-play logic
    useEffect(() => {
        if (achievements.length > 0) {
            const t = setInterval(() => {
                setCurrent((c) => (c === achievements.length - 1 ? 0 : c + 1));
            }, 6000); // 6 seconds per achievement
            return () => clearInterval(t);
        }
    }, [achievements.length]);

    if (loading) return <div className="flex h-48 items-center justify-center text-sm text-fg-muted">Loading achievements...</div>;
    if (achievements.length === 0) return null;

    return (
        <div className="surface-glass relative h-56 w-full overflow-hidden">

            {/* Slides Container */}
            <div
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {achievements.map((a) => (
                    <div key={a._id} className="w-full flex-shrink-0 h-full p-8 flex flex-col justify-center">
                        <div className="max-w-3xl mx-auto text-center">
              <span className="pill mb-3 font-mono uppercase tracking-wider">
                New Achievement
              </span>
                            <h4 className="mb-2 truncate text-2xl font-semibold tracking-tight text-fg">
                                {a.title}
                            </h4>
                            <p className="mb-4 line-clamp-2 text-fg-muted">
                                "{a.description}"
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-fg-muted">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-accent/70 to-accent/30 text-xs text-white">
                                    {a.userId?.fullName?.charAt(0) || "A"}
                                </div>
                                <span>{a.userId?.fullName}</span>
                                <span className="text-fg-muted/40">•</span>
                                <span>{a.userId?.year} Year</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {achievements.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === current ? "bg-accent-bright w-6" : "bg-white/25"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Side arrows for manual navigation */}
            <button
                onClick={() => setCurrent((c) => (c === 0 ? achievements.length - 1 : c - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted transition-colors hover:text-fg"
            >
                ‹
            </button>
            <button
                onClick={() => setCurrent((c) => (c === achievements.length - 1 ? 0 : c + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted transition-colors hover:text-fg"
            >
                ›
            </button>
        </div>
    );
}