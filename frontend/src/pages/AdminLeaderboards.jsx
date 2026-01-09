import React from "react";
import LeaderboardBox from "../components/AdminLeaderboardBox.jsx";

export default function AdminLeaderboards() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 font-cursive leading-tight">
          🏆 Manage Leaderboards
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-700 leading-relaxed">
          Manage and update leaderboard rankings for various competitions
        </p>
      </div>
      
      <div className="flex gap-6 justify-start items-start flex-wrap">
        <LeaderboardBox title="Enigma First Year" count={10} />
        <LeaderboardBox title="Enigma Non-First Year" count={10} />
        <LeaderboardBox title="Codenigma" count={3} />
      </div>
    </div>
  );
}
