import React, { useState } from "react";
import { EnigmaLeaderboard, GenesisLeaderboard } from "../components/UserLeaderboardBox";

function UserLeaderboards() {
  const [activeLeaderboard, setActiveLeaderboard] = useState("enigma");
  const [activeEnigmaTab, setActiveEnigmaTab] = useState("first_years");

  return (
    <div className="font-brand">
      <div className="bg-brand-navy px-5 sm:px-8 lg:px-12 py-7 sm:py-8 lg:py-[38px] flex items-end justify-between gap-5 flex-wrap">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Standings
          </span>
          <h1 className="m-0 text-[34px] sm:text-[40px] lg:text-[46px] leading-none font-semibold tracking-[-0.02em] text-white">
            Leaderboard
          </h1>
        </div>
      </div>

      <div className="flex border-b-2 border-brand-navy flex-wrap">
        <button
          onClick={() => setActiveLeaderboard("enigma")}
          className={`px-[22px] py-[15px] text-[13px] font-semibold ${
            activeLeaderboard === "enigma" ? "bg-brand-navy text-white" : "bg-white text-brand-ink-soft"
          }`}
        >
          Coding contest
        </button>
        <button
          onClick={() => setActiveLeaderboard("genesis")}
          className={`px-[22px] py-[15px] text-[13px] font-semibold ${
            activeLeaderboard === "genesis" ? "bg-brand-navy text-white" : "bg-white text-brand-ink-soft"
          }`}
        >
          Project expo
        </button>
      </div>

      {activeLeaderboard === "enigma" ? (
        <EnigmaLeaderboard activeSubTab={activeEnigmaTab} setActiveSubTab={setActiveEnigmaTab} />
      ) : (
        <GenesisLeaderboard />
      )}
    </div>
  );
}

export default UserLeaderboards;
