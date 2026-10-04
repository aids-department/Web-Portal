import React, { useState, useEffect } from "react";
import { Trophy, Users, Award, Save } from "lucide-react";
import LeaderboardBox from "../components/AdminLeaderboardBox.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";

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
        <PageHeader
          compact
          eyebrow="Competitions"
          title="Manage Leaderboards"
          description="Update and manage competition rankings"
        />

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpotlightCard variant="gradient">
            <div className="flex items-center gap-4 p-5">
              <span className="icon-tile h-10 w-10">
                <Users className="h-[18px] w-[18px] text-accent-bright" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] text-fg-muted">Total Participants</p>
                {isEditing ? (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                          type="number"
                          value={participantCount}
                          onChange={(e) => setParticipantCount(e.target.value)}
                          className="field w-24 px-2.5 py-1.5 font-mono text-lg font-semibold"
                          autoFocus
                      />
                      <button onClick={handleSave} aria-label="Save participant count" className="btn-success h-9 w-9 p-0">
                        <Save size={16} />
                      </button>
                    </div>
                ) : (
                    <p
                        className="w-fit cursor-pointer text-2xl font-semibold tabular-nums text-fg underline decoration-dotted decoration-white/20 underline-offset-4 transition-colors hover:text-accent-bright"
                        onClick={() => setIsEditing(true)}
                        title="Click to edit"
                    >
                      {participantCount}
                    </p>
                )}
              </div>
            </div>
          </SpotlightCard>
          {/* ... Rest of your static cards (Award/Competitions) stay exactly the same ... */}
          <SpotlightCard>
            <div className="flex items-center gap-4 p-5">
              <span className="icon-tile h-10 w-10">
                <Award className="h-[18px] w-[18px] text-emerald-300" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[13px] text-fg-muted">Active Competitions</p>
                <p className="text-2xl font-semibold tabular-nums text-fg">3</p>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* ... LeaderboardBox section stays exactly the same ... */}
        <div className="surface edge-highlight p-6">
          <h2 className="mb-6 flex items-center gap-2 text-[15px] font-semibold tracking-tight text-fg">
            <Trophy className="h-4 w-4 text-accent-bright" />
            Competition Leaderboards
          </h2>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <LeaderboardBox title="Enigma First Year" count={10} />
            <LeaderboardBox title="Enigma Non-First Year" count={10} />
            <LeaderboardBox title="Codenigma" count={3} />
          </div>
        </div>
      </div>
  );
}
