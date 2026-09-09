import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingEvents = [
    {
      id: 1,
      type: "Contest",
      tagBg: "#dd2b0f",
      tagFg: "#fff",
      stamp: "Added 2 days ago",
      name: "Enigma '26 - Annual Coding Contest",
      blurb: "The department's flagship competitive programming event. 6 hours, 8 algorithmic challenges. Open to all years with separate leaderboards for first-year students.",
      date: "14 Oct 2026 · 09:00 AM",
      venue: "Lab 1 & 2",
    },
    {
      id: 2,
      type: "Workshop",
      tagBg: "#0e1c3d",
      tagFg: "#fff",
      stamp: "Added 1 week ago",
      name: "Introduction to Rust for Systems Programming",
      blurb: "A two-day hands-on workshop covering Rust fundamentals, memory safety guarantees, and building a simple CLI tool. Laptops mandatory.",
      date: "21 Oct 2026 · 10:00 AM",
      venue: "Seminar Hall",
    },
    {
      id: 3,
      type: "Talk",
      tagBg: "#1b3a6b",
      tagFg: "#fff",
      stamp: "Added 1 week ago",
      name: "Building Resilient Distributed Systems",
      blurb: "Guest lecture by alumni currently at Amazon Web Services discussing the reality of CAP theorem in production environments.",
      date: "28 Oct 2026 · 02:00 PM",
      venue: "Seminar Hall",
    },
  ];

  const pastEvents = [
    { type: "Workshop", name: "Version Control with Git", date: "12 Sep 2026 · Lab 3" },
    { type: "Talk", name: "Forecasting at retail scale", date: "09 Aug 2026 · Seminar Hall" },
  ];

  const days = Array.from({ length: 35 }).map((_, i) => {
    const n = i - 2; // offset to make 1 start on a specific day
    if (n < 1 || n > 31) return { n: "", bg: "transparent", fg: "transparent", dot: "transparent" };
    
    // Some mock styling for the calendar
    if (n === 14) return { n, bg: "#0e1c3d", fg: "#fff", dot: "#dd2b0f" }; // selected/event
    if (n === 21) return { n, bg: "#f3f2f2", fg: "#0e1c3d", dot: "#1b3a6b" }; 
    if (n === 28) return { n, bg: "#f3f2f2", fg: "#0e1c3d", dot: "#7d7979" }; 
    return { n, bg: "transparent", fg: "#201e1d", dot: "transparent" };
  });

  return (
    <div className="bg-[#e8e6e3] min-h-screen pb-12">
      <div className="max-w-[1280px] mx-auto bg-white border border-[#0e1c3d]/20 shadow-[0_2px_10px_rgba(14,28,61,0.08)]">
        
        {/* Header */}
        <div className="pt-10 px-gutter pb-[26px] bg-white border-b-2 border-navy flex items-end justify-between">
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
              Department calendar
            </span>
            <h1 className="m-0 font-semibold text-[44px] leading-none tracking-display text-navy">
              Events
            </h1>
          </div>
          <div className="flex">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`px-[18px] py-[11px] font-semibold text-[12px] leading-none cursor-pointer ${
                activeTab === "upcoming" ? "bg-navy text-white border border-navy" : "bg-white text-ds-ink-soft border border-ds-edge border-r-0"
              }`}
            >
              Upcoming · {upcomingEvents.length}
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`px-[18px] py-[11px] font-semibold text-[12px] leading-none cursor-pointer ${
                activeTab === "past" ? "bg-navy text-white border border-navy" : "bg-white text-ds-ink-soft border border-ds-edge border-l-0"
              }`}
            >
              Past · {pastEvents.length}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_344px] bg-white">
          
          {/* Main Content Column */}
          <div className="pt-[34px] px-10 pb-[44px] border-r border-ds-edge flex flex-col gap-[22px]">
            
            {activeTab === "upcoming" && upcomingEvents.map((e) => (
              <article key={e.id} className="grid grid-cols-[190px_1fr] gap-[22px] border border-ds-edge p-[18px] bg-white">
                <div className="h-[132px] bg-ds-blue-tint border border-[#c3cfe3] grid place-items-center">
                  <span className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-[#7d8ba6]">Event image</span>
                </div>
                <div className="flex flex-col gap-[9px]">
                  <div className="flex items-center gap-[9px]">
                    <span 
                      className="px-2 py-1 font-semibold text-[9.5px] leading-none tracking-[.12em] uppercase"
                      style={{ background: e.tagBg, color: e.tagFg }}
                    >
                      {e.type}
                    </span>
                    <span className="font-normal text-[11.5px] leading-none text-[#9b9797] tabular-nums">{e.stamp}</span>
                  </div>
                  <h3 className="m-0 font-semibold text-[21px] leading-[1.2] text-navy">{e.name}</h3>
                  <p className="m-0 font-normal text-[13.5px] leading-[1.55] text-ds-ink-soft max-w-[60ch]">
                    {e.blurb}
                  </p>
                  <div className="flex gap-[22px] mt-auto pt-2.5 border-t border-ds-row">
                    <span className="font-medium text-[12px] leading-none text-ds-blue tabular-nums">{e.date}</span>
                    <span className="font-normal text-[12px] leading-none text-ds-ink-soft">{e.venue}</span>
                    <a href="#" className="ml-auto font-medium text-[12px] leading-none text-ds-red no-underline">Details</a>
                  </div>
                </div>
              </article>
            ))}

            <div className="pt-2 flex items-center gap-[14px]">
              <span className="font-medium text-[10.5px] leading-none tracking-[.18em] uppercase text-[#7d7979]">Past events</span>
              <span className="flex-1 h-px bg-ds-edge"></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              {pastEvents.map((pe, i) => (
                <article key={i} className="border border-ds-edge p-4 flex gap-[14px] opacity-85">
                  <div className="w-[74px] h-[74px] bg-ds-row border border-ds-edge flex-none grid place-items-center grayscale">
                    <span className="font-medium text-[8.5px] leading-none text-[#9b9797]">IMAGE</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-semibold text-[9.5px] leading-none tracking-[.12em] uppercase text-[#7d7979]">{pe.type}</span>
                    <h4 className="m-0 font-semibold text-[15px] leading-[1.25] text-navy">{pe.name}</h4>
                    <span className="font-normal text-[11.5px] leading-none text-[#9b9797] tabular-nums">{pe.date}</span>
                  </div>
                </article>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <aside className="p-[34px_28px] flex flex-col gap-6 bg-ds-ground">
            <div className="border border-ds-edge bg-white">
              <div className="flex items-center justify-between p-[14px_16px] border-b border-ds-edge">
                <span className="font-semibold text-[13px] leading-none text-navy">October 2026</span>
                <div className="flex gap-1.5">
                  <span className="w-[22px] h-[22px] border border-ds-edge grid place-items-center font-medium text-[11px] leading-none text-ds-ink-soft cursor-pointer hover:bg-ds-ground">‹</span>
                  <span className="w-[22px] h-[22px] border border-ds-edge grid place-items-center font-medium text-[11px] leading-none text-ds-ink-soft cursor-pointer hover:bg-ds-ground">›</span>
                </div>
              </div>
              <div className="grid grid-cols-7 p-[12px_12px_4px]">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                  <span key={d} className="text-center font-medium text-[9.5px] leading-none tracking-[.06em] uppercase text-[#9b9797] pb-2">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 p-[0_12px_14px]">
                {days.map((d, i) => (
                  <span 
                    key={i} 
                    className="h-[30px] grid place-items-center relative font-normal text-[12px] leading-none tabular-nums"
                    style={{ background: d.bg, color: d.fg }}
                  >
                    {d.n}
                    {d.dot !== "transparent" && <span className="absolute bottom-1 w-1 h-1" style={{ background: d.dot }}></span>}
                  </span>
                ))}
              </div>
              <div className="border-t border-ds-edge p-[12px_16px] flex gap-4">
                <span className="flex items-center gap-1.5 font-normal text-[10.5px] leading-none text-ds-ink-soft"><span className="w-1.5 h-1.5 bg-ds-red"></span>Contest</span>
                <span className="flex items-center gap-1.5 font-normal text-[10.5px] leading-none text-ds-ink-soft"><span className="w-1.5 h-1.5 bg-ds-blue"></span>Talk</span>
                <span className="flex items-center gap-1.5 font-normal text-[10.5px] leading-none text-ds-ink-soft"><span className="w-1.5 h-1.5 bg-[#7d7979]"></span>Workshop</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-medium text-[10.5px] leading-none tracking-[.18em] uppercase text-navy">Filter by type</span>
              <label className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                <span className="w-3.5 h-3.5 border border-navy bg-navy"></span> Contest
              </label>
              <label className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                <span className="w-3.5 h-3.5 border border-[#bab6b6]"></span> Workshop
              </label>
              <label className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                <span className="w-3.5 h-3.5 border border-[#bab6b6]"></span> Guest talk
              </label>
              <label className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                <span className="w-3.5 h-3.5 border border-[#bab6b6]"></span> Expo
              </label>
            </div>

            <a href="#" className="p-[12px_16px] border border-navy text-navy font-medium text-[12px] leading-none text-left no-underline hover:bg-ds-ground">
              Subscribe to calendar
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
