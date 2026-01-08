import React, { useState, useEffect } from "react";

const formatRows = (rows) => {
  return rows.map((r, index) => ({
    ...r,
    rank: index + 1,
    yearDisplay:
      r.year === 1
        ? "I"
        : r.year === 2
        ? "II"
        : r.year === 3
        ? "III"
        : r.year === 4
        ? "IV"
        : r.year,
    timeDisplay: r.time === null ? "—" : `${r.time}s`,
  }));
};

// --- Enigma Leaderboard Component (with Sub-Tabs) ---
const EnigmaLeaderboard = ({ activeSubTab, setActiveSubTab }) => {
  const [firstYearData, setFirstYearData] = useState([]);
  const [nonFirstYearData, setNonFirstYearData] = useState([]);
  const [codenigmaData, setCodenigmaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboards() {
      setLoading(true);

      const res1 = await fetch(
        "https://web-portal-760h.onrender.com/api/leaderboard/Enigma First Year"
      );
      const fy = await res1.json();

      const res2 = await fetch(
        "https://web-portal-760h.onrender.com/api/leaderboard/Enigma Non-First Year"
      );
      const nf = await res2.json();

      const res3 = await fetch(
        "https://web-portal-760h.onrender.com/api/leaderboard/Codenigma"
      );
      const cd = await res3.json();

      setFirstYearData(fy);
      setNonFirstYearData(nf);
      setCodenigmaData(cd);

      setLoading(false);
    }

    loadLeaderboards();
  }, []);

  const currentLeaderboard =
    activeSubTab === "first_years"
      ? formatRows(firstYearData)
      : formatRows(nonFirstYearData);

  // Use JSON data for Codenigma Winners sidebar
  const codenigmaWinners = codenigmaData.map(
    (p) => `${p.name} (${p.year} Year)`
  );
  const organizers = ["Harikrishna S (III Year)", "Chandhru R (III Year)", "Priya Dharshini D (II Year)"];

  if (loading) return <p>Loading leaderboard…</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        {/* Sub-Navigation Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeSubTab === "first_years"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSubTab("first_years")}
          >
            First Years
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeSubTab === "non_first_years"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSubTab("non_first_years")}
          >
            Non First Years
          </button>
        </div>

        {/* Table Display */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold text-gray-900">Rank</th>
                <th className="p-3 text-left font-semibold text-gray-900">Name</th>
                <th className="p-3 text-left font-semibold text-gray-900">Year</th>
                <th className="p-3 text-left font-semibold text-gray-900">Score</th>
                <th className="p-3 text-left font-semibold text-gray-900 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((row) => (
                <tr key={row.roll} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-gray-700">{row.rank}</td>
                  <td className="p-3 text-gray-700">{row.name}</td>
                  <td className="p-3 text-gray-700">{row.yearDisplay}</td>
                  <td className="p-3 text-gray-700">{row.score}</td>
                  <td className="p-3 text-gray-700 hidden sm:table-cell">{row.timeDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Codenigma Winners</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {codenigmaWinners.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizers</h3>
          {organizers.map((organizer, index) => (
            <p key={index} className="text-gray-700">{organizer}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Genesis Leaderboard Component (STATIC, UNCHANGED) ---
const GenesisLeaderboard = () => {
  const [hoveredLead, setHoveredLead] = useState(null);

  const leaderboardData = [
    {
      rank: 1,
      projectName: "",
      year: "III",
      team: "--",
      lead: "Anirudh S",
      members: ["Devanidharsan K", "Varsha G", "Archana K M"],
    },
    {
      rank: 2,
      projectName: "Atlas Protocol",
      year: "III",
      team: "Team Atlas",
      lead: "Risheekesh K G",
      members: ["Harikrishna S", "Hariharan V", "Balamurugan M"],
    },
    {
      rank: 3,
      projectName: "Smart Autonomous Trolley",
      year: "III",
      team: "CTRL Freaks",
      lead: "Nija Priya S",
      members: ["Rithanya S", "Santhiya V", "Yaazhini S"],
    },
  ];

  const organizers = ["Anto Nickson J (IV Year)", "Kuhan M (IV Year)"];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold text-gray-900">Rank</th>
                <th className="p-3 text-left font-semibold text-gray-900">Project Name</th>
                <th className="p-3 text-left font-semibold text-gray-900">Year</th>
                <th className="p-3 text-left font-semibold text-gray-900 hidden sm:table-cell">Team</th>
                <th className="p-3 text-left font-semibold text-gray-900">Team Lead</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-gray-700">{row.rank}</td>
                  <td className="p-3 text-gray-700">{row.projectName}</td>
                  <td className="p-3 text-gray-700">{row.year}</td>
                  <td className="p-3 text-gray-700 hidden sm:table-cell">{row.team}</td>
                  <td
                    className="p-3 text-gray-700 relative cursor-pointer"
                    onMouseEnter={() => setHoveredLead(row)}
                    onMouseLeave={() => setHoveredLead(null)}
                  >
                    {row.lead}
                    {hoveredLead && hoveredLead.rank === row.rank && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-44 max-h-36 overflow-y-auto text-sm">
                        <p className="font-medium text-gray-900 mb-1">Team Members</p>
                        <ul className="space-y-1">
                          {hoveredLead.members.map((member, i) => (
                            <li key={i} className="text-gray-700 leading-snug">{member}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full lg:w-80">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizers</h3>
          {organizers.map((organizer, index) => (
            <p key={index} className="text-gray-700">{organizer}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };