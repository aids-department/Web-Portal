import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Trophy, Sparkles } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import { LoadingState } from "./ui/States";
import { Reveal, Stagger, StaggerItem } from "./ui/Reveal";

const cleanStudentName = (name) => {
  if (!name) return "";
  return name.replace(/^bjhH+/i, "").trim();
};

const formatRows = (rows) => {
  return rows.map((r, index) => ({
    ...r,
    name: cleanStudentName(r.name),
    rank: index + 1,
    yearDisplay:
        r.year === 1 ? "I" : r.year === 2 ? "II" : r.year === 3 ? "III" : r.year === 4 ? "IV" : r.year,
    timeDisplay: r.time === null ? "—" : `${r.time}s`,
  }));
};

// Rank chip: #1 glows in the accent, #2–3 get a quiet highlight, the rest stay neutral
const rankClass = (rank) =>
  rank === 1
    ? "bg-accent text-white shadow-glow"
    : rank <= 3
    ? "bg-white/[0.08] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
    : "text-fg-muted";

function SideCard({ title, children }) {
  return (
    <div className="surface flex flex-col gap-3 p-5">
      <span className="eyebrow border-b border-line pb-3">{title}</span>
      {children}
    </div>
  );
}

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

  // Intelligently categorize by actual student year (year === 1 vs year > 1)
  const isSwapped =
    Array.isArray(firstYearData) &&
    firstYearData.filter((r) => Number(r.year) > 1).length >
      firstYearData.filter((r) => Number(r.year) === 1).length;

  let currentRaw = [];
  if (isSwapped) {
    currentRaw =
      activeSubTab === "first_years"
        ? [...nonFirstYearData, ...firstYearData].filter((r) => Number(r.year) === 1)
        : [...firstYearData, ...nonFirstYearData].filter((r) => Number(r.year) > 1);
  } else {
    currentRaw =
      activeSubTab === "first_years" ? firstYearData : nonFirstYearData;
  }

  // Deduplicate and sort by score desc, then time asc
  const seen = new Set();
  const deduped = [];
  const sorted = [...currentRaw].sort(
    (a, b) =>
      (Number(b.score) || 0) - (Number(a.score) || 0) ||
      (Number(a.time) || 0) - (Number(b.time) || 0)
  );
  for (const r of sorted) {
    const key = (r.roll || r.name || "").trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  const currentLeaderboard = formatRows(deduped);

  const codenigmaWinners = codenigmaData.map(
      (p) => `${p.name} (${p.year} Year)`
  );

  const organizers = [
    "Harikrishna S (III Year)",
    "Chandhru R (III Year)",
    "Priya Dharshini D (II Year)",
  ];

  if (loading) {
    return <LoadingState label="Loading leaderboard" />;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="tabs w-fit">
        {["first_years", "non_first_years"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`tab ${activeSubTab === tab ? "tab-active" : ""}`}
          >
            {tab === "first_years" ? "First Years" : "Non First Years"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(250px,1fr)]">
        <Reveal className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-ln min-w-[560px]">
              <thead>
                <tr>
                  <th className="w-[80px]">Rank</th>
                  <th>Name</th>
                  <th className="w-[100px]">Year</th>
                  <th className="w-[100px]">Score</th>
                  <th className="hidden w-[100px] sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {currentLeaderboard.map((row) => (
                  <tr key={row.roll} className={row.rank === 1 ? "bg-accent/[0.06]" : ""}>
                    <td>
                      <span
                        className={`inline-grid h-7 min-w-[28px] place-items-center rounded-md px-1.5 font-mono text-[12.5px] font-medium tabular-nums ${rankClass(row.rank)}`}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          if (row.roll && /^[a-fA-F0-9]{24}$/.test(row.roll)) {
                            navigate(`/profile/${row.roll}`);
                          } else {
                            toast.error("Profile not available");
                          }
                        }}
                        className="text-left text-[14px] font-medium text-fg underline decoration-white/15 underline-offset-4 transition-colors hover:text-accent-bright hover:decoration-accent/60"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="font-mono text-[13px] text-fg-muted">{row.yearDisplay}</td>
                    <td className="font-mono text-[13.5px] font-medium tabular-nums text-fg">{row.score}</td>
                    <td className="hidden font-mono text-[13px] tabular-nums text-fg-muted sm:table-cell">
                      {row.timeDisplay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Stagger as="aside" className="flex flex-col gap-4">
          <StaggerItem>
            <SpotlightCard variant="gradient">
              <div className="flex items-center justify-between p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-3xl font-semibold leading-none tracking-tight text-fg tabular-nums">
                    {participationCount}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
                    Participants
                  </span>
                </div>
                <span className="icon-tile h-10 w-10">
                  <Users className="h-[18px] w-[18px] text-accent-bright" strokeWidth={1.5} />
                </span>
              </div>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem>
            <SideCard title="Codenigma winners">
              <ol className="m-0 flex list-none flex-col gap-2 p-0 text-[13px] text-fg/85">
                {codenigmaWinners.map((winner, index) => (
                  <li key={index} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 flex-none place-items-center rounded font-mono text-[10.5px] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                      {index + 1}
                    </span>
                    {winner}
                  </li>
                ))}
              </ol>
            </SideCard>
          </StaggerItem>

          <StaggerItem>
            <SideCard title="Organisers">
              {organizers.map((org, i) => (
                <p key={i} className="m-0 text-[13px] text-fg/85">{org}</p>
              ))}
            </SideCard>
          </StaggerItem>
        </Stagger>
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

  return (
    <div className="flex flex-col gap-7 py-6">
      {/* Podium */}
      <Stagger className="grid gap-4 md:grid-cols-3">
        {leaderboardData.map((p) => (
          <StaggerItem key={p.rank} className="h-full">
            <SpotlightCard variant={p.rank === 1 ? "gradient" : "default"} interactive className={`h-full ${p.rank === 1 ? "border-line-accent" : ""}`}>
              <div className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-start justify-between">
                  <span
                    className={`font-mono text-4xl font-medium tabular-nums ${
                      p.rank === 1 ? "text-shimmer" : "text-fg-muted"
                    }`}
                  >
                    {String(p.rank).padStart(2, "0")}
                  </span>
                  {p.rank === 1 ? (
                    <span className="pill">
                      <Trophy className="h-3 w-3" />
                      Winner
                    </span>
                  ) : (
                    <Sparkles className="h-4 w-4 text-fg-muted/60" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-fg">{p.projectName}</h3>
                <span className="text-[13px] font-medium text-accent-bright">{p.team}</span>
                <span className="mt-auto border-t border-line pt-3 text-[13px] text-fg-muted">Led by {p.lead}</span>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Full table */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(250px,1fr)]">
        <Reveal className="surface">
          <div className="overflow-x-auto rounded-2xl">
            <table className="table-ln min-w-[560px]">
              <thead>
                <tr>
                  <th className="w-[80px]">Rank</th>
                  <th>Project</th>
                  <th className="hidden sm:table-cell">Team</th>
                  <th className="w-[90px]">Year</th>
                  <th>Team lead</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((row) => (
                  <tr key={row.rank}>
                    <td>
                      <span className={`inline-grid h-7 min-w-[28px] place-items-center rounded-md px-1.5 font-mono text-[12.5px] font-medium ${rankClass(row.rank)}`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="text-[14px] font-medium text-fg">{row.projectName}</td>
                    <td className="hidden text-[13.5px] text-accent-bright sm:table-cell">{row.team}</td>
                    <td className="font-mono text-[13px] text-fg-muted">{row.year}</td>
                    <td
                      className="relative cursor-pointer text-[13.5px] font-medium text-fg underline decoration-dotted decoration-white/25 underline-offset-4"
                      onMouseEnter={() => setHoveredLead(row)}
                      onMouseLeave={() => setHoveredLead(null)}
                    >
                      {row.lead}
                      {hoveredLead?.rank === row.rank && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-56 animate-fade-in rounded-xl border border-line bg-canvas-elevated/95 p-3.5 no-underline shadow-popover backdrop-blur-xl">
                          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
                            Team members
                          </p>
                          {row.members.map((m, i) => (
                            <p key={i} className="py-0.5 text-[13px] text-fg/90">{m}</p>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal as="aside" delay={0.08}>
          <SideCard title="Organisers">
            {organizers.map((org, i) => (
              <p key={i} className="m-0 text-[13px] text-fg/85">{org}</p>
            ))}
          </SideCard>
        </Reveal>
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
