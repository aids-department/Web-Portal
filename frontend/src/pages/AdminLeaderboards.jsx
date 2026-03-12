import React, { useState, useEffect } from "react";
import { Trophy, Users, Award, Save } from "lucide-react";
import LeaderboardBox from "../components/AdminLeaderboardBox.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminLeaderboards() {
  const [participantCount, setParticipantCount] = useState(23);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch count from DB on load
  useEffect(() => {
    axios.get("https://web-portal-760h.onrender.com/api/stats")
        .then(res => setParticipantCount(res.data.value))
        .catch(err => console.error("Error fetching stats", err));
  }, []);

  // Save updated count to DB
  const handleSave = async () => {
    try {
      await axios.put("https://web-portal-760h.onrender.com/api/stats", { value: Number(participantCount) });
      toast.success("Participant count updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save to database");
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Leaderboards</h1>
            <p className="text-gray-600">Update and manage competition rankings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Participants</p>
                {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                          type="number"
                          value={participantCount}
                          onChange={(e) => setParticipantCount(e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-lg font-bold outline-blue-500"
                          autoFocus
                      />
                      <button onClick={handleSave} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                        <Save size={18} />
                      </button>
                    </div>
                ) : (
                    <p
                        className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                      {participantCount}
                    </p>
                )}
              </div>
            </div>
          </div>
          {/* ... Rest of your static cards (Award/Competitions) stay exactly the same ... */}
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

        {/* ... LeaderboardBox section stays exactly the same ... */}
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
