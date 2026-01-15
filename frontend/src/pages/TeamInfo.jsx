import React from "react";

export default function TeamInfo() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-4 md:p-8 overflow-hidden" style={{ height: "calc(100vh - 5rem)" }}>
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 md:mb-4 font-cursive leading-tight">
            Team Members
          </h1>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-3 md:mb-4"></div>
          <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Meet our dedicated team members
          </p>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <iframe
            src="https://vite-app-pro.vercel.app"
            title="Team Info"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
