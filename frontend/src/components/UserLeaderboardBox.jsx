import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const formatRows = (rows) => {
  return rows.map((r, index) => ({
    ...r,
    rank: index + 1,
    yearDisplay:
        r.year === 1 ? "I" : r.year === 2 ? "II" : r.year === 3 ? "III" : r.year === 4 ? "IV" : r.year,
    timeDisplay: r.time === null ? "—" : `${r.time}s`,
  }));
};

const rankStyle = (rank) => ({
  bg: rank === 1 ? "#dd2b0f" : rank <= 3 ? "#e4eaf4" : "transparent",
  fg: rank === 1 ? "#ffffff" : "#0e1c3d",
});

// --- Enigma Leaderboard Component ---
const EnigmaLeaderboard = ({ activeSubTab, setActiveSubTab }) => {
  const [firstYearData, setFirstYearData] = useState([]);
  const [nonFirstYearData, setNonFirstYearData] = useState([]);
  const [codenigmaData, setCodenigmaData] = useState([]);
  const [participationCount, setParticipationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLeaderboards() {
      setLoading(true);

      const fy = await (await fetch(
          "https://web-portal-760h.onrender.com/api/leaderboard/Enigma First Year"
      )).json();

      const nf = await (await fetch(
          "https://web-portal-760h.onrender.com/api/leaderboard/Enigma Non-First Year"
      )).json();

      const cd = await (await fetch(
          "https://web-portal-760h.onrender.com/api/leaderboard/Codenigma"
      )).json();

      const stats = await (await fetch(
          "https://web-portal-760h.onrender.com/api/stats"
      )).json();

      setFirstYearData(fy);
      setNonFirstYearData(nf);
      setCodenigmaData(cd);
      setParticipationCount(stats.value || 0);
      setLoading(false);
    }

    loadLeaderboards();
  }, []);

  const currentLeaderboard =
      activeSubTab === "first_years"
          ? formatRows(firstYearData)
          : formatRows(nonFirstYearData);

  const codenigmaWinners = codenigmaData.map(
      (p) => `${p.name} (${p.year} Year)`
  );

  const organizers = [
    "Harikrishna S (III Year)",
    "Chandhru R (III Year)",
    "Priya Dharshini D (II Year)",
  ];

  if (loading) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading leaderboard…</p>
      </div>
    );
  }

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-6 sm:py-7 lg:py-8 flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        {["first_years", "non_first_years"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-3.5 py-2 text-[12px] font-semibold ${
              activeSubTab === tab ? "bg-brand-navy text-white" : "border border-brand-edge text-brand-ink-soft"
            }`}
          >
            {tab === "first_years" ? "First Years" : "Non First Years"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(230px,1fr)] gap-6 items-start">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-brand-edge">
                <th className="w-[70px] text-left py-2.5 pr-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-ink-soft">Rank</th>
                <th className="text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-ink-soft">Name</th>
                <th className="w-[100px] text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-ink-soft">Year</th>
                <th className="w-[100px] text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-ink-soft">Score</th>
                <th className="w-[100px] text-left py-2.5 pl-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-ink-soft hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((row) => {
                const rs = rankStyle(row.rank);
                return (
                  <tr key={row.roll} className="border-b border-brand-row">
                    <td className="py-3.5 pr-3">
                      <span
                        className="inline-block min-w-[26px] px-1.5 py-1 text-center text-[12.5px] font-semibold tabular-nums"
                        style={{ background: rs.bg, color: rs.fg }}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => {
                          if (row.roll && /^[a-fA-F0-9]{24}$/.test(row.roll)) {
                            navigate(`/profile/${row.roll}`);
                          } else {
                            toast.error("Profile not available");
                          }
                        }}
                        className="text-[14px] font-medium text-brand-blue border-b border-[#c3cfe3]"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-[13px] text-brand-ink-soft">{row.yearDisplay}</td>
                    <td className="py-3.5 px-3 text-[13.5px] font-semibold text-brand-navy tabular-nums">{row.score}</td>
                    <td className="py-3.5 pl-3 text-[13px] text-brand-ink-soft tabular-nums hidden sm:table-cell">
                      {row.timeDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="bg-brand-navy px-[18px] py-4 flex flex-col gap-1.5">
            <span className="text-[26px] leading-none font-semibold text-white tabular-nums">
              {participationCount}
            </span>
            <span className="text-[10px] leading-none tracking-[0.14em] uppercase text-brand-on-navy-muted">
              Participants
            </span>
          </div>

          <div className="border border-brand-edge p-[18px] flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
              Codenigma winners
            </span>
            <ol className="m-0 pl-4 flex flex-col gap-1 text-[13px] text-[#3a3838]">
              {codenigmaWinners.map((winner, index) => (
                <li key={index}>{winner}</li>
              ))}
            </ol>
          </div>

          <div className="border border-brand-edge p-[18px] flex flex-col gap-2">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
              Organisers
            </span>
            {organizers.map((org, i) => (
              <p key={i} className="m-0 text-[13px] text-[#3a3838]">{org}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- Genesis Leaderboard Component ---
const GenesisLeaderboard = () => {
  const [hoveredLead, setHoveredLead] = useState(null);

  const leaderboardData = [
    { rank: 1, projectName: "FinBuild", year: "III", team: "The Archons", lead: "Anirudh S", members: ["Devanidharsan K", "Varsha G", "Archana K M"] },
    { rank: 2, projectName: "Atlas Protocol", year: "III", team: "Team Atlas", lead: "Risheekesh K G", members: ["Harikrishna S", "Hariharan V", "Balamurugan M"] },
    { rank: 3, projectName: "Smart Autonomous Trolley", year: "III", team: "CTRL Freaks", lead: "Nija Priya S", members: ["Rithanya S", "Santhiya V", "Yaazhini S"] },
  ];

  const organizers = ["Anto Nickson J (IV Year)", "Kuhan M (IV Year)"];

  const podiumRule = { 1: "#dd2b0f", 2: "#1b3a6b", 3: "#605d5d" };

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-6 sm:py-7 lg:py-8 flex flex-col gap-7">
      {/* Podium */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {leaderboardData.map((p) => (
          <div
            key={p.rank}
            className="border border-brand-edge p-[22px] flex flex-col gap-2.5"
            style={{ borderTop: `4px solid ${podiumRule[p.rank]}` }}
          >
            <span className="text-[32px] font-semibold tabular-nums" style={{ color: podiumRule[p.rank] }}>
              {p.rank}
            </span>
            <h3 className="m-0 text-[17px] font-semibold leading-[1.25] text-brand-navy">{p.projectName}</h3>
            <span className="text-[12.5px] font-medium text-brand-blue">{p.team}</span>
            <span className="text-[12.5px] text-brand-ink-soft">Led by {p.lead}</span>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(230px,1fr)] gap-6 items-start">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-navy">
                <th className="w-[70px] text-left py-2.5 pr-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">Rank</th>
                <th className="text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">Project</th>
                <th className="text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy hidden sm:table-cell">Team</th>
                <th className="w-[90px] text-left py-2.5 px-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">Year</th>
                <th className="text-left py-2.5 pl-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">Team lead</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row) => (
                <tr key={row.rank} className="border-b border-brand-row">
                  <td className="py-3.5 pr-3 text-[13px] font-semibold text-brand-navy tabular-nums">{row.rank}</td>
                  <td className="py-3.5 px-3 text-[14px] font-medium text-brand-navy">{row.projectName}</td>
                  <td className="py-3.5 px-3 text-[13.5px] text-brand-blue hidden sm:table-cell">{row.team}</td>
                  <td className="py-3.5 px-3 text-[13px] text-brand-ink-soft">{row.year}</td>
                  <td
                    className="py-3.5 pl-3 relative text-[13.5px] font-medium text-brand-navy cursor-pointer"
                    onMouseEnter={() => setHoveredLead(row)}
                    onMouseLeave={() => setHoveredLead(null)}
                  >
                    {row.lead}
                    {hoveredLead?.rank === row.rank && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-brand-edge shadow-lg p-3 z-10 w-52">
                        <p className="m-0 mb-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-brand-ink-soft">
                          Team members
                        </p>
                        {row.members.map((m, i) => (
                          <p key={i} className="m-0 text-[13px] text-[#3a3838]">{m}</p>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="border border-brand-edge p-[18px] flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
            Organisers
          </span>
          {organizers.map((org, i) => (
            <p key={i} className="m-0 text-[13px] text-[#3a3838]">{org}</p>
          ))}
        </aside>
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
