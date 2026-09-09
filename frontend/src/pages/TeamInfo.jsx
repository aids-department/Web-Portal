import React from "react";

export default function TeamInfo() {
  return (
    <div className="px-gutter-mobile sm:px-gutter py-8 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="mb-6">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Community</span>
        <h1 className="text-page-heading text-navy mt-2.5">Team members</h1>
        <p className="text-body text-ds-ink-soft mt-2">Meet our dedicated team members.</p>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-white border border-ds-edge overflow-hidden">
        <iframe
          src="https://vite-app-pro.vercel.app"
          title="Team Info"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
