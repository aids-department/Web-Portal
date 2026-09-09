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

    if (loading) return <div className="h-48 flex items-center justify-center text-body text-ds-ink-faint italic">Loading achievements…</div>;
    if (achievements.length === 0) return null;

    return (
        <div className="relative w-full h-56 overflow-hidden bg-white border border-ds-edge">

            {/* Slides Container */}
            <div
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {achievements.map((a) => (
                    <div key={a._id} className="w-full flex-shrink-0 h-full p-8 flex flex-col justify-center">
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="inline-block px-2.5 py-1 mb-3 text-kicker tracking-kicker uppercase text-ds-blue bg-ds-blue-tint">
                                New achievement
                            </span>
                            <h4 className="text-section-heading text-navy mb-2 truncate">
                                {a.title}
                            </h4>
                            <p className="text-body text-ds-ink-soft mb-4 italic">
                                "{a.description}"
                            </p>
                            <div className="flex items-center justify-center gap-2.5 text-label text-ds-ink-faint">
                                <div className="w-7 h-7 bg-ds-blue-tint border border-ds-edge flex items-center justify-center text-navy text-label font-semibold">
                                    {a.userId?.fullName?.charAt(0) || "A"}
                                </div>
                                <span>{a.userId?.fullName}</span>
                                <span>·</span>
                                <span>{a.userId?.year} year</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {achievements.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 transition-all ${
                            index === current ? "bg-ds-red w-6" : "bg-ds-edge w-1.5"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Side arrows for manual navigation */}
            <button
                onClick={() => setCurrent((c) => (c === 0 ? achievements.length - 1 : c - 1))}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-ds-ink-faint hover:text-navy transition-colors"
            >
                ‹
            </button>
            <button
                onClick={() => setCurrent((c) => (c === achievements.length - 1 ? 0 : c + 1))}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-ds-ink-faint hover:text-navy transition-colors"
            >
                ›
            </button>
        </div>
    );
}