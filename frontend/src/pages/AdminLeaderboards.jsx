import React from "react";
import LeaderboardBox from "../components/AdminLeaderboardBox.jsx";

export default function AdminLeaderboards() {
  return (
    <div style={styles.container}>
      <LeaderboardBox title="Enigma First Year" count={10} />
      <LeaderboardBox title="Enigma Non-First Year" count={10} />
      <LeaderboardBox title="Codenigma" count={3} />
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "none",
    margin: "0 auto",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "20px",
    padding: "20px",
    boxSizing: "border-box",
  },
};
