import React, { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);

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

  const codenigmaWinners = codenigmaData.map(
    (p) => `${p.name} (${p.year} Year)`
  );

  const organizers = [
    "Harikrishna S (III Year)",
    "Chandhru R (III Year)",
    "Priya Dharshini D (II Year)",
  ];

  if (loading)
    return <p className="text-center text-gray-500 font-medium">Loading leaderboard…</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* TABLE */}
      <div className="flex-1">
        {/* Sub Tabs */}
        <div className="flex gap-3 mb-6">
          {["first_years", "non_first_years"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition ${
                activeSubTab === tab
                  ? "bg-white shadow text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "first_years" ? "First Years" : "Non First Years"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100/60">
                {["Rank", "Name", "Year", "Score", "Time"].map((h) => (
                  <th
                    key={h}
                    className={`p-4 text-left font-bold text-gray-800 ${
                      h === "Time" ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((row) => (
                <tr
                  key={row.roll}
                  className="border-t border-gray-200/60 hover:bg-gray-50/60 transition"
                >
                  <td className="p-4 font-medium text-gray-700">{row.rank}</td>
                  <td className="p-4 font-medium text-gray-700">{row.name}</td>
                  <td className="p-4 text-gray-600">{row.yearDisplay}</td>
                  <td className="p-4 font-medium text-gray-700">{row.score}</td>
                  <td className="p-4 text-gray-600 hidden sm:table-cell">
                    {row.timeDisplay}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Codenigma Winners
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {codenigmaWinners.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Organizers
          </h3>
          {organizers.map((org, i) => (
            <p key={i} className="text-gray-700">
              {org}
            </p>
          ))}
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
      <div className="flex-1 overflow-x-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100/60">
              {["Rank", "Project", "Year", "Team", "Team Lead"].map((h) => (
                <th
                  key={h}
                  className={`p-4 text-left font-bold text-gray-800 ${
                    h === "Team" ? "hidden sm:table-cell" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row) => (
              <tr
                key={row.rank}
                className="border-t border-gray-200/60 hover:bg-gray-50/60 transition"
              >
                <td className="p-4">{row.rank}</td>
                <td className="p-4">{row.projectName}</td>
                <td className="p-4">{row.year}</td>
                <td className="p-4 hidden sm:table-cell">{row.team}</td>
                <td
                  className="p-4 relative cursor-pointer font-medium"
                  onMouseEnter={() => setHoveredLead(row)}
                  onMouseLeave={() => setHoveredLead(null)}
                >
                  {row.lead}
                  {hoveredLead?.rank === row.rank && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-10 w-48 text-sm">
                      <p className="font-semibold mb-1">Team Members</p>
                      {row.members.map((m, i) => (
                        <p key={i}>{m}</p>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full lg:w-80">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Organizers
          </h3>
          {organizers.map((org, i) => (
            <p key={i} className="text-gray-700">
              {org}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
