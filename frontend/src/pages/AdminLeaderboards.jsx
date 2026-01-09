import React from "react";
import { Trophy, Users, Award } from "lucide-react";
import LeaderboardBox from "../components/AdminLeaderboardBox.jsx";

export default function AdminLeaderboards() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Leaderboards</h1>
          <p className="text-gray-600">Update and manage competition rankings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active Competitions</p>
              <p className="text-xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Competition Leaderboards</h2>
        <div className="flex gap-6 justify-start items-start flex-wrap">
          <LeaderboardBox title="Enigma First Year" count={10} />
          <LeaderboardBox title="Enigma Non-First Year" count={10} />
          <LeaderboardBox title="Codenigma" count={3} />
        </div>
      </div>
    </div>
  );
}
