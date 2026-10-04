import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Lightbulb } from "lucide-react";
import { EnigmaLeaderboard, GenesisLeaderboard } from "../components/UserLeaderboardBox";
import PageHeader from "../components/ui/PageHeader";
import { EASE } from "../components/ui/motion";

function UserLeaderboards() {
  const [activeLeaderboard, setActiveLeaderboard] = useState("enigma");
  const [activeEnigmaTab, setActiveEnigmaTab] = useState("first_years");

  const boards = [
    { id: "enigma", label: "Coding contest", Icon: Code2 },
    { id: "genesis", label: "Project expo", Icon: Lightbulb },
  ];

  return (
    <div className="container-ln pb-8">
      <PageHeader
        eyebrow="Standings"
        title="Leaderboard"
        description="Rankings from the department's coding contests and project expo."
        actions={
          <div className="tabs" role="tablist" aria-label="Leaderboards">
            {boards.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeLeaderboard === id}
                onClick={() => setActiveLeaderboard(id)}
                className={`tab relative isolate flex items-center gap-1.5 px-4 py-2 ${activeLeaderboard === id ? "text-fg" : ""}`}
              >
                {activeLeaderboard === id && (
                  <motion.span
                    layoutId="leaderboard-tab"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_1px_8px_rgba(0,0,0,0.35)]"
                  />
                )}
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="hairline" />

      {activeLeaderboard === "enigma" ? (
        <EnigmaLeaderboard activeSubTab={activeEnigmaTab} setActiveSubTab={setActiveEnigmaTab} />
      ) : (
        <GenesisLeaderboard />
      )}
    </div>
  );
}

export default UserLeaderboards;
