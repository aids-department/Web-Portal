import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Table from "./ui/Table";

const formatRows = (rows) => {
  return rows.map((r, index) => ({
    ...r,
    rank: index + 1,
    yearDisplay:
        r.year === 1 ? "I" : r.year === 2 ? "II" : r.year === 3 ? "III" : r.year === 4 ? "IV" : r.year,
    timeDisplay: r.time === null ? "—" : `${r.time}s`,
  }));
};

// --- Enigma Leaderboard Component ---
const EnigmaLeaderboard = ({ activeSubTab, setActiveSubTab }) => {
  const [firstYearData, setFirstYearData] = useState([]);
  const [nonFirstYearData, setNonFirstYearData] = useState([]);
  const [codenigmaData, setCodenigmaData] = useState([]);
  const [participationCount, setParticipationCount] = useState(0); // Fixed: Moved inside component
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

      // Fixed: Removed extra closing parenthesis
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

  if (loading)
    return <p className="text-body text-ds-ink-soft">Loading leaderboard…</p>;

  return (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* TABLE */}
        <div className="flex-1">
          {/* Sub Tabs */}
          <div className="flex gap-2 mb-6">
            {["first_years", "non_first_years"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`px-4.5 py-2.5 text-label font-medium border ${
                        activeSubTab === tab
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-ds-ink-soft border-ds-edge"
                    }`}
                >
                  {tab === "first_years" ? "First years" : "Non first years"}
                </button>
            ))}
          </div>

          <Table>
            <Table.Head>
              <Table.HeadCell className="w-16">Rank</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Year</Table.HeadCell>
              <Table.HeadCell>Score</Table.HeadCell>
              <Table.HeadCell className="hidden sm:table-cell">Time</Table.HeadCell>
            </Table.Head>
            <tbody>
              {currentLeaderboard.map((row) => (
                  <Table.Row key={row.roll}>
                    <Table.Cell><Table.RankChip rank={row.rank} /></Table.Cell>
                    <Table.Cell
                        className="font-medium text-ds-blue cursor-pointer hover:underline"
                        onClick={() => {
                          if (row.roll && /^[a-fA-F0-9]{24}$/.test(row.roll)) {
                            navigate(`/profile/${row.roll}`);
                          } else {
                            toast.error("Profile not available");
                          }
                        }}
                    >
                      {row.name}
                    </Table.Cell>
                    <Table.Cell>{row.yearDisplay}</Table.Cell>
                    <Table.Cell className="font-semibold text-navy tabular-nums">{row.score}</Table.Cell>
                    <Table.Cell className="hidden sm:table-cell tabular-nums">
                      {row.timeDisplay}
                    </Table.Cell>
                  </Table.Row>
              ))}
            </tbody>
          </Table>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
          <div className="border border-ds-edge p-5">
            <h3 className="text-card-title text-navy mb-3">Codenigma winners</h3>
            <ol className="flex flex-col gap-1.5 text-body text-ds-ink">
              {codenigmaWinners.map((winner, index) => (
                  <li key={index}>{index + 1}. {winner}</li>
              ))}
            </ol>
          </div>

          <div className="border border-ds-edge p-5">
            <h3 className="text-card-title text-navy mb-3">Organizers</h3>
            {organizers.map((org, i) => (
                <p key={i} className="text-body text-ds-ink-soft">
                  {org}
                </p>
            ))}
          </div>

          <div className="bg-navy p-5">
            <h3 className="text-label tracking-label uppercase text-on-navy-muted mb-1">
              Total participants
            </h3>
            <p className="text-figure text-white tabular-nums">
              {participationCount}
            </p>
          </div>
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
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Table>
            <Table.Head>
              <Table.HeadCell className="w-16">Rank</Table.HeadCell>
              <Table.HeadCell>Project</Table.HeadCell>
              <Table.HeadCell>Year</Table.HeadCell>
              <Table.HeadCell className="hidden sm:table-cell">Team</Table.HeadCell>
              <Table.HeadCell>Team lead</Table.HeadCell>
            </Table.Head>
            <tbody>
              {leaderboardData.map((row) => (
                  <Table.Row key={row.rank}>
                    <Table.Cell><Table.RankChip rank={row.rank} /></Table.Cell>
                    <Table.Cell className="font-medium text-navy">{row.projectName}</Table.Cell>
                    <Table.Cell>{row.year}</Table.Cell>
                    <Table.Cell className="hidden sm:table-cell">{row.team}</Table.Cell>
                    <Table.Cell
                        className="relative cursor-pointer font-medium text-ds-blue"
                        onMouseEnter={() => setHoveredLead(row)}
                        onMouseLeave={() => setHoveredLead(null)}
                    >
                      {row.lead}
                      {hoveredLead?.rank === row.rank && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-ds-edge p-3 z-10 w-48 text-body">
                            <p className="font-semibold text-navy mb-1">Team members</p>
                            {row.members.map((m, i) => (
                                <p key={i} className="text-ds-ink-soft">{m}</p>
                            ))}
                          </div>
                      )}
                    </Table.Cell>
                  </Table.Row>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="w-full lg:w-72">
          <div className="border border-ds-edge p-5">
            <h3 className="text-card-title text-navy mb-3">Organizers</h3>
            {organizers.map((org, i) => (
                <p key={i} className="text-body text-ds-ink-soft">
                  {org}
                </p>
            ))}
          </div>
        </div>
      </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
