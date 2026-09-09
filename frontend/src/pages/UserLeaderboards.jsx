import React, { useState } from "react";
import { EnigmaLeaderboard, GenesisLeaderboard } from "../components/UserLeaderboardBox";

function UserLeaderboards() {
  const [activeLeaderboard, setActiveLeaderboard] = useState("enigma");
  const [activeEnigmaTab, setActiveEnigmaTab] = useState("first_years");

  return (
    <div>
      <div className="mb-8 pb-6 border-b-2 border-navy">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Contest results</span>
        <h1 className="text-page-heading text-navy mt-2.5">Leaderboard</h1>
      </div>

      {/* MAIN TABS */}
      <div className="flex border-b-2 border-navy mb-8">
        {["enigma", "genesis"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveLeaderboard(tab)}
            className={`px-5 py-3.5 text-label font-semibold ${
              activeLeaderboard === tab
                ? "text-white bg-navy"
                : "text-ds-ink-soft"
            }`}
          >
            {tab === "enigma" ? "Enigma" : "Genesis"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeLeaderboard === "enigma" ? (
        <EnigmaLeaderboard
          activeSubTab={activeEnigmaTab}
          setActiveSubTab={setActiveEnigmaTab}
        />
      ) : (
        <GenesisLeaderboard />
      )}
    </div>
  );
}

export default UserLeaderboards;
