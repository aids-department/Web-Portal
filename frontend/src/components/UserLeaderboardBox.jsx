import React, { useState, useEffect } from "react";

/* ------------------ HELPERS ------------------ */
const formatRows = (rows) =>
  rows.map((r, index) => ({
    ...r,
    rank: index + 1,
    yearDisplay:
      r.year === 1 ? "I" : r.year === 2 ? "II" : r.year === 3 ? "III" : r.year === 4 ? "IV" : r.year,
    timeDisplay: r.time === null ? "—" : `${r.time}s`,
  }));

/* ======================================================
   ENIGMA LEADERBOARD (RESPONSIVE)
====================================================== */
const EnigmaLeaderboard = ({ activeSubTab, setActiveSubTab }) => {
  const [firstYearData, setFirstYearData] = useState([]);
  const [nonFirstYearData, setNonFirstYearData] = useState([]);
  const [codenigmaData, setCodenigmaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboards() {
      setLoading(true);
      const fy = await (await fetch("https://web-portal-760h.onrender.com/api/leaderboard/Enigma First Year")).json();
      const nf = await (await fetch("https://web-portal-760h.onrender.com/api/leaderboard/Enigma Non-First Year")).json();
      const cd = await (await fetch("https://web-portal-760h.onrender.com/api/leaderboard/Codenigma")).json();

      setFirstYearData(fy);
      setNonFirstYearData(nf);
      setCodenigmaData(cd);
      setLoading(false);
    }
    loadLeaderboards();
  }, []);

  const leaderboard =
    activeSubTab === "first_years"
      ? formatRows(firstYearData)
      : formatRows(nonFirstYearData);

  const codenigmaWinners = codenigmaData.map((p) => `${p.name} (${p.year} Year)`);
  const organizers = ["XXX (III Year)", "YYY (II Year)", "ZZZ (I Year)"];

  if (loading) return <p className="text-center">Loading leaderboard…</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* Sub Tabs */}
        <div className="flex gap-3 mb-4">
          {["first_years", "non_first_years"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeSubTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab === "first_years" ? "First Years" : "Non First Years"}
            </button>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                {["Rank", "Name", "Year", "Score", "Time"].map((h) => (
                  <th key={h} className="p-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr key={row.roll} className="border-t hover:bg-gray-50">
                  <td className="p-3">{row.rank}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.yearDisplay}</td>
                  <td className="p-3 font-semibold">{row.score}</td>
                  <td className="p-3">{row.timeDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden space-y-3">
          {leaderboard.map((row) => (
            <div key={row.roll} className="bg-white p-4 rounded-xl shadow border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-600">#{row.rank}</span>
                <span className="text-xs text-gray-500">Year {row.yearDisplay}</span>
              </div>
              <p className="font-semibold text-gray-900">{row.name}</p>
              <div className="flex justify-between text-sm mt-2">
                <span>Score: <b>{row.score}</b></span>
                <span>{row.timeDisplay}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Codenigma Winners</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {codenigmaWinners.map((w, i) => <li key={i}>{w}</li>)}
          </ol>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Organizers</h3>
          {organizers.map((o, i) => <p key={i}>{o}</p>)}
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   GENESIS LEADERBOARD (RESPONSIVE)
====================================================== */
const GenesisLeaderboard = () => {
  const leaderboardData = [
    { rank: 1, projectName: "AAA", year: "II", lead: "Alex Johnson", members: ["Maria", "Ben"] },
    { rank: 2, projectName: "BBB", year: "II", lead: "Rahul Sharma", members: ["Priya", "Wei"] },
  ];

  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {["Rank", "Project", "Year", "Lead"].map(h => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((r) => (
              <tr key={r.rank} className="border-t">
                <td className="p-3">{r.rank}</td>
                <td className="p-3">{r.projectName}</td>
                <td className="p-3">{r.year}</td>
                <td className="p-3">{r.lead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {leaderboardData.map((r) => (
          <div key={r.rank} className="bg-white p-4 rounded-xl shadow border">
            <p className="font-bold">#{r.rank} — {r.projectName}</p>
            <p className="text-sm text-gray-600">Year {r.year}</p>
            <p className="mt-1">Lead: <b>{r.lead}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
