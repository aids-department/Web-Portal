import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLeaderboards() {
  const [activeTab, setActiveTab] = useState("coding"); // "coding" | "project"
  const [activeYearFilter, setActiveYearFilter] = useState("all");
  
  // Data State
  const [firstYearData, setFirstYearData] = useState([]);
  const [nonFirstYearData, setNonFirstYearData] = useState([]);
  const [participationCount, setParticipationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fy = await (await fetch("https://web-portal-760h.onrender.com/api/leaderboard/Enigma First Year")).json();
        const nf = await (await fetch("https://web-portal-760h.onrender.com/api/leaderboard/Enigma Non-First Year")).json();
        const stats = await (await fetch("https://web-portal-760h.onrender.com/api/stats")).json();
        setFirstYearData(fy);
        setNonFirstYearData(nf);
        setParticipationCount(stats.value || 186); // fallback to 186
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const allCodingData = [
    { year: "First year", count: firstYearData.length, rows: firstYearData },
    { year: "Non-first year", count: nonFirstYearData.length, rows: nonFirstYearData },
  ];

  const filteredCodingData = activeYearFilter === "all" 
    ? allCodingData 
    : activeYearFilter === "first" 
      ? [allCodingData[0]] 
      : [allCodingData[1]];

  const getRankColors = (rank) => {
    if (rank === 1) return { bg: "#ffd700", fg: "#000" }; // Gold
    if (rank === 2) return { bg: "#e5e4e2", fg: "#000" }; // Silver
    if (rank === 3) return { bg: "#cd7f32", fg: "#fff" }; // Bronze
    return { bg: "transparent", fg: "#0e1c3d" };
  };

  // Genesis/Project Expo Hardcoded Data
  const podiumData = [
    { place: 1, score: "94.5", project: "FinBuild", team: "The Archons", blurb: "A scalable microfinance platform for unbanked populations.", rule: "#ffd700" },
    { place: 2, score: "91.0", project: "Atlas Protocol", team: "Team Atlas", blurb: "Decentralized identity verification for secure transactions.", rule: "#e5e4e2" },
    { place: 3, score: "88.5", project: "Smart Autonomous Trolley", team: "CTRL Freaks", blurb: "Computer vision powered checkout-free shopping cart.", rule: "#cd7f32" },
  ];

  const expoData = [
    { rank: 4, project: "NeuroSync", team: "MindMakers", year: "IV", score: "85.0" },
    { rank: 5, project: "AgriSense", team: "GreenTech", year: "III", score: "82.5" },
    { rank: 6, project: "MedVault", team: "HealthCoders", year: "II", score: "79.0" },
  ];

  return (
    <div className="bg-[#e8e6e3] min-h-screen">
      <div className="max-w-[1280px] mx-auto bg-white border border-[#0e1c3d]/20 shadow-[0_2px_10px_rgba(14,28,61,0.08)]">
        
        {/* Navy Hero Header */}
        <div className="bg-navy pt-[38px] px-gutter pb-[30px] flex items-end justify-between">
          <div className="flex flex-col gap-[11px]">
            <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
              {activeTab === "coding" ? "Round 3 · closed 02 Sep 2026" : "Annual event · 2026 Edition"}
            </span>
            <h1 className="m-0 font-semibold text-[46px] leading-none tracking-display text-white">
              Leaderboard
            </h1>
          </div>
          <div className="flex gap-[34px]">
            <div className="flex flex-col gap-[7px]">
              <span className="font-semibold text-[30px] leading-none text-white tabular-nums">
                {activeTab === "coding" ? participationCount : "41"}
              </span>
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#8c9ab5]">
                {activeTab === "coding" ? "Participants" : "Teams"}
              </span>
            </div>
            <div className="flex flex-col gap-[7px]">
              <span className="font-semibold text-[30px] leading-none text-white tabular-nums">
                {activeTab === "coding" ? "8" : "6"}
              </span>
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#8c9ab5]">
                {activeTab === "coding" ? "Problems" : "Panelists"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex bg-white border-b-2 border-navy">
          <span 
            onClick={() => setActiveTab("coding")}
            className={`px-[22px] py-[15px] cursor-pointer ${
              activeTab === "coding" 
                ? "font-semibold text-[12.5px] leading-none text-white bg-navy"
                : "font-medium text-[12.5px] leading-none text-ds-ink-soft hover:text-navy"
            }`}
          >
            Coding contest
          </span>
          <span 
            onClick={() => setActiveTab("project")}
            className={`px-[22px] py-[15px] cursor-pointer ${
              activeTab === "project" 
                ? "font-semibold text-[12.5px] leading-none text-white bg-navy"
                : "font-medium text-[12.5px] leading-none text-ds-ink-soft hover:text-navy"
            }`}
          >
            Project expo
          </span>
          <span className="ml-auto pl-[22px] pr-gutter py-[15px] font-normal text-[12px] leading-none text-[#7d7979]">
            {activeTab === "coding" 
              ? "Organised by the Coding Club · Faculty in charge Dr. Kavya Iyer"
              : "Organised by the department · 41 teams · panel of 6"}
          </span>
        </div>

        {/* Content Box */}
        <div className="pt-[26px] px-gutter pb-[46px] bg-white flex flex-col gap-[34px]">
          
          {activeTab === "coding" && (
            <>
              {/* Filters */}
              <div className="flex gap-[9px]">
                <span 
                  onClick={() => setActiveYearFilter("all")}
                  className={`px-[15px] py-[9px] cursor-pointer ${
                    activeYearFilter === "all" ? "font-semibold text-[12px] leading-none bg-navy text-white" : "font-medium text-[12px] leading-none border border-ds-edge text-ds-ink-soft"
                  }`}
                >
                  All years
                </span>
                <span 
                  onClick={() => setActiveYearFilter("first")}
                  className={`px-[15px] py-[9px] cursor-pointer ${
                    activeYearFilter === "first" ? "font-semibold text-[12px] leading-none bg-navy text-white" : "font-medium text-[12px] leading-none border border-ds-edge text-ds-ink-soft"
                  }`}
                >
                  First year
                </span>
                <span 
                  onClick={() => setActiveYearFilter("nonfirst")}
                  className={`px-[15px] py-[9px] cursor-pointer ${
                    activeYearFilter === "nonfirst" ? "font-semibold text-[12px] leading-none bg-navy text-white" : "font-medium text-[12px] leading-none border border-ds-edge text-ds-ink-soft"
                  }`}
                >
                  Non-first year
                </span>
              </div>

              {/* Leaderboard Tables */}
              {loading ? (
                <p className="text-[14px] text-ds-ink-soft italic">Loading leaderboard data...</p>
              ) : (
                filteredCodingData.map((board, idx) => (
                  <div key={idx} className="flex flex-col gap-[14px]">
                    <div className="flex items-baseline justify-between border-b-2 border-navy pb-[10px]">
                      <h2 className="m-0 font-semibold text-[24px] leading-none text-navy">{board.year}</h2>
                      <span className="font-normal text-[12.5px] leading-none text-[#7d7979] tabular-nums">
                        {board.count} participants · top results shown
                      </span>
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-ds-edge">
                          <th className="text-left w-[70px] py-2.5 pr-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-[#7d7979]">Rank</th>
                          <th className="text-left p-2.5 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-[#7d7979]">Name</th>
                          <th className="text-left w-[130px] p-2.5 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-[#7d7979]">Year</th>
                          <th className="text-left w-[120px] p-2.5 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-[#7d7979]">Score</th>
                          <th className="text-left w-[120px] py-2.5 pl-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-[#7d7979]">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {board.rows.map((r, i) => {
                          const rank = i + 1;
                          const colors = getRankColors(rank);
                          return (
                            <tr key={i} className="border-b border-ds-row">
                              <td className="py-[13px] pr-3">
                                <span className="inline-block min-w-[26px] px-[7px] py-1 text-center font-semibold text-[12.5px] leading-none tabular-nums" style={{ color: colors.fg, backgroundColor: colors.bg }}>
                                  {rank}
                                </span>
                              </td>
                              <td className="p-[13px]">
                                <span 
                                  onClick={() => r.roll && navigate(`/profile/${r.roll}`)} 
                                  className="font-medium text-[14px] leading-[1.3] text-ds-blue border-b border-[#c3cfe3] cursor-pointer"
                                >
                                  {r.name}
                                </span>
                              </td>
                              <td className="p-[13px] font-normal text-[13px] leading-[1.3] text-ds-ink-soft">{r.year === 1 ? "I" : r.year === 2 ? "II" : r.year === 3 ? "III" : r.year === 4 ? "IV" : r.year}</td>
                              <td className="p-[13px] font-semibold text-[13.5px] leading-[1.3] text-navy tabular-nums">{r.score}</td>
                              <td className="py-[13px] pl-3 font-normal text-[13px] leading-[1.3] text-ds-ink-soft tabular-nums">{r.time === null ? "—" : `${r.time}s`}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "project" && (
            <div className="flex flex-col gap-[26px] pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {podiumData.map((p, idx) => (
                  <div key={idx} className="border border-ds-edge p-[22px] flex flex-col gap-[11px]" style={{ borderTop: `4px solid ${p.rule}` }}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[34px] leading-none tabular-nums" style={{ color: p.rule }}>{p.place}</span>
                      <span className="font-semibold text-[15px] leading-none text-navy tabular-nums">{p.score}</span>
                    </div>
                    <h3 className="m-0 font-semibold text-[18px] leading-[1.25] text-navy">{p.project}</h3>
                    <span className="font-medium text-[12.5px] leading-[1.4] text-ds-blue">{p.team}</span>
                    <p className="m-0 font-normal text-[12.5px] leading-[1.6] text-ds-ink-soft">{p.blurb}</p>
                  </div>
                ))}
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-navy">
                    <th className="text-left w-[70px] py-[11px] pr-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Rank</th>
                    <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Project</th>
                    <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Team</th>
                    <th className="text-left w-[140px] p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Year</th>
                    <th className="text-left w-[110px] py-[11px] pl-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {expoData.map((e, idx) => (
                    <tr key={idx} className="border-b border-ds-row">
                      <td className="py-[13px] pr-3 font-semibold text-[13px] leading-none text-navy tabular-nums">{e.rank}</td>
                      <td className="p-[13px] font-medium text-[14px] leading-[1.3] text-navy">{e.project}</td>
                      <td className="p-[13px]">
                        <span className="font-normal text-[13.5px] leading-[1.3] text-ds-blue border-b border-[#c3cfe3] cursor-pointer">
                          {e.team}
                        </span>
                      </td>
                      <td className="p-[13px] font-normal text-[13px] leading-[1.3] text-ds-ink-soft">{e.year}</td>
                      <td className="py-[13px] pl-3 font-semibold text-[13.5px] leading-[1.3] text-navy tabular-nums">{e.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
