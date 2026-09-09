import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserAchievements() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Hackathons", "Publications", "Internships", "Sport and culture"];

  const achievements = [
    {
      span: 2,
      h: 180,
      tag: "Hackathon",
      title: "Smart India Hackathon 2026 Winner",
      body: "Team 'Ctrl Freaks' won first place in the renewable energy track for their AI-driven solar panel optimization algorithm.",
      who: "Ctrl Freaks (III Year)",
    },
    {
      span: 2,
      h: 180,
      tag: "Publication",
      title: "IEEE Conference Paper Accepted",
      body: "A novel approach to low-light image enhancement using diffusion models. Accepted at CVPR 2026.",
      who: "Ananya S, Dr. Lokesh S",
    },
    {
      span: 2,
      h: 180,
      tag: "Internship",
      title: "Summer Analyst at Goldman Sachs",
      body: "Secured a highly competitive summer internship role at GS Bengaluru office starting May 2026.",
      who: "Rahul V (III Year)",
    },
    {
      span: 3,
      h: 220,
      tag: "Hackathon",
      title: "Runner-up at KJSCE Hackathon",
      body: "Built a fully functional real-time translation app for regional Indian languages over 36 hours. Secured the runner-up position among 150+ participating teams.",
      who: "Tech Titans (II Year)",
    },
    {
      span: 3,
      h: 220,
      tag: "Sport",
      title: "Zonal Athletics Meet",
      body: "Gold medal in 100m sprint and silver in 400m relay at the Anna University Zonal Athletics Meet 2025.",
      who: "Priya M (IV Year)",
    },
  ];

  const filteredAchievements = activeTab === "All" 
    ? achievements 
    : achievements.filter(a => a.tag === (activeTab === "Sport and culture" ? "Sport" : activeTab.slice(0, -1)));

  return (
    <div className="bg-[#e8e6e3] min-h-screen pb-12">
      <div className="max-w-[1280px] mx-auto bg-white border border-[#0e1c3d]/20 shadow-[0_2px_10px_rgba(14,28,61,0.08)]">
        
        {/* Navigation included just like dc.html reference */}
        
        <div className="bg-navy pt-[46px] px-gutter pb-10 flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
              2024 — 2026
            </span>
            <h1 className="m-0 font-semibold text-[52px] leading-none tracking-display text-white">
              Student achievements
            </h1>
            <p className="m-0 max-w-[62ch] font-normal text-[14.5px] leading-[1.6] text-on-navy mt-1">
              Contest placements, published work, hackathon wins and the internships that came out of them. Submissions are verified by the faculty coordinator before they appear here.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="font-semibold text-[44px] leading-none text-white tabular-nums">
              {achievements.length}
            </span>
            <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#8c9ab5]">
              Entries
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[10px] py-4 px-gutter border-b-2 border-navy bg-white flex-wrap">
          {tabs.map((t) => (
            <span 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-2 cursor-pointer ${
                activeTab === t 
                  ? "font-semibold text-[11.5px] leading-none bg-navy text-white" 
                  : "font-medium text-[11.5px] leading-none border border-ds-edge text-ds-ink-soft hover:text-navy"
              }`}
            >
              {t}
            </span>
          ))}
          <span className="ml-auto font-normal text-[12px] leading-none text-[#7d7979]">
            Sorted by most recent
          </span>
        </div>

        <div className="pt-[34px] px-gutter pb-12 bg-white grid grid-cols-1 md:grid-cols-6 gap-5">
          {filteredAchievements.map((a, i) => (
            <figure 
              key={i} 
              className="m-0 flex flex-col border border-ds-edge bg-white"
              style={{ gridColumn: `span ${a.span}` }}
            >
              <div className="relative">
                <div 
                  className="bg-ds-blue grid place-items-center grayscale overflow-hidden"
                  style={{ height: `${a.h}px` }}
                >
                  <span className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-[#a8b6cc]">
                    Photograph
                  </span>
                </div>
                <span className="absolute top-0 left-0 px-[9px] py-[5px] font-semibold text-[9.5px] leading-none tracking-[.12em] uppercase bg-ds-red text-white">
                  {a.tag}
                </span>
              </div>
              <figcaption className="p-[18px_18px_20px] flex flex-col gap-2">
                <h3 className="m-0 font-semibold text-[17px] leading-[1.25] text-navy">
                  {a.title}
                </h3>
                <p className="m-0 font-normal text-[13px] leading-[1.6] text-ds-ink-soft">
                  {a.body}
                </p>
                <span className="font-normal text-[11.5px] leading-none text-[#9b9797] pt-1 tabular-nums">
                  {a.who}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </div>
  );
}
