import React from "react";

export default function TeamInfo() {
  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 5rem)" }}>
      <h1 className="sr-only">Team Info</h1>

      <iframe
        src="https://vite-app-pro.vercel.app"
        title="Team Info"
        className="absolute inset-0 w-full h-full border-0 bg-transparent"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
