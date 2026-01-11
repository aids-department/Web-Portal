import React, { useState } from "react";
import { EnigmaLeaderboard, GenesisLeaderboard } from "../components/UserLeaderboardBox";

function UserLeaderboards() {
  const [activeLeaderboard, setActiveLeaderboard] = useState("enigma");
  const [activeEnigmaTab, setActiveEnigmaTab] = useState("first_years");

  return (
    <div className="min-h-screen relative bg-white p-6 sm:p-8 md:p-12">

      {/* Soft background accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* MAIN GLASS CONTAINER */}
        <div className="bg-blue-50/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/60 p-8 ">

          {/* HEADER — SUBTLE BLUE SHADE */}
          <div className="mb-10  px-6 py-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>

          {/* MAIN TABS */}
          <div className="flex justify-center gap-4 mb-10">
            {["enigma", "genesis"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeaderboard(tab)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeLeaderboard === tab
                    ? "bg-white shadow-md text-blue-700 border border-gray-200"
                    : "bg-white/60 text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent"
                }`}
              >
                {tab === "enigma" ? "Enigma" : "Genesis"}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/60 p-6">
            {activeLeaderboard === "enigma" ? (
              <EnigmaLeaderboard
                activeSubTab={activeEnigmaTab}
                setActiveSubTab={setActiveEnigmaTab}
              />
            ) : (
              <GenesisLeaderboard />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserLeaderboards;
