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
  const organizers = ["XXX (III Year)", "YYY (II Year)", "ZZZ (I Year)"];

  if (loading) return <p>Loading leaderboard…</p>;

  return (
    <div className="leaderboard-content">
      <div className="leaderboard-table-container">
        {/* Sub-Navigation Buttons */}
        <div className="leaderboard-sub-tabs">
          <button
            className={activeSubTab === "first_years" ? "active-tab" : ""}
            onClick={() => setActiveSubTab("first_years")}
          >
            First Years
          </button>
          <button
            className={activeSubTab === "non_first_years" ? "active-tab" : ""}
            onClick={() => setActiveSubTab("non_first_years")}
          >
            Non First Years
          </button>
        </div>

        {/* Table Display */}
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Year</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaderboard.map((row) => (
              <tr key={row.roll}>
                <td>{row.rank}</td>
                <td>{row.name}</td>
                <td>{row.yearDisplay}</td>
                <td>{row.score}</td>
                <td>{row.timeDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sidebar-widgets">
        <div className="codenigma-winners-box">
          <h3>Codenigma Winners</h3>
          <ol style={{ listStyleType: "none", padding: 0 }}>
            {codenigmaWinners.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ol>
        </div>

        <div className="organizers-box">
          <h3>Organizers</h3>
          {organizers.map((organizer, index) => (
            <p key={index}>{organizer}</p>
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
      projectName: "AAA",
      year: "II",
      team: "--",
      lead: "Alex Johnson",
      members: ["Maria Santos", "Ben Chen", "Samar Khan"],
    },
    {
      rank: 2,
      projectName: "BBB",
      year: "II",
      team: "--",
      lead: "Rahul Sharma",
      members: ["Priya Nair", "Wei Li", "David Lee"],
    },
    {
      rank: 3,
      projectName: "CCC",
      year: "II",
      team: "--",
      lead: "Elena Rodriguez",
      members: ["Omar Hassan", "Emily Brown", "Aisha Ali"],
    },
  ];

  const organizers = ["XXX (III Year)", "YYY (II Year)", "ZZZ (I Year)"];

  return (
    <div className="leaderboard-content">
      <div className="leaderboard-table-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Project Name</th>
              <th>Year</th>
              <th>Team</th>
              <th>Team Lead</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row, index) => (
              <tr key={index}>
                <td>{row.rank}</td>
                <td>{row.projectName}</td>
                <td>{row.year}</td>
                <td>{row.team}</td>
                <td
                  onMouseEnter={() => setHoveredLead(row)}
                  onMouseLeave={() => setHoveredLead(null)}
                  className="tooltip-container"
                >
                  {row.lead}
                  {hoveredLead && hoveredLead.rank === row.rank && (
                    <div className="team-tooltip">
                      <p>
                        <strong>Team Members:</strong>
                      </p>
                      <ul>
                        {hoveredLead.members.map((member, i) => (
                          <li key={i}>{member}</li>
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

      <div className="organizers-box-genesis">
        <h3>Organizers</h3>
        {organizers.map((organizer, index) => (
          <p key={index}>{organizer}</p>
        ))}
      </div>
    </div>
  );
};

export { EnigmaLeaderboard, GenesisLeaderboard };
