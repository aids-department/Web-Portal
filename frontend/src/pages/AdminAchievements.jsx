import React, { useEffect, useState } from "react";

export default function AdminAchievements() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/pending")
      .then(res => res.json())
      .then(data => setPending(data))
      .finally(() => setLoading(false));
  }, []);

  const approveAchievement = async (id) => {
    const res = await fetch(
      `https://web-portal-760h.onrender.com/api/achievements/${id}/approve`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: "admin-demo" })
      }
    );

    if (!res.ok) {
      alert("Approve failed");
      return;
    }

    setPending(prev => prev.filter(a => a._id !== id));
  };

  const rejectAchievement = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;

    const res = await fetch(
      `https://web-portal-760h.onrender.com/api/achievements/${id}/reject`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: "admin-demo", reason })
      }
    );

    if (!res.ok) {
      alert("Reject failed");
      return;
    }

    setPending(prev => prev.filter(a => a._id !== id));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading pending achievements…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 font-cursive leading-tight">
          🏆 Manage Achievements
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-700 leading-relaxed">
          Review and approve pending achievement submissions
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 via-white to-blue-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl text-gray-700 font-medium">No pending achievements!</p>
          <p className="text-gray-500 mt-2">All submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map(a => (
            <div key={a._id} className="group bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">{a.title}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{a.description}</p>
                
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl mb-6 border border-white/40">
                  <p className="text-gray-800">
                    <span className="font-semibold text-blue-700">Submitted by:</span> {a.userId.fullName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Year:</span> {a.userId.year} Year
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => approveAchievement(a._id)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => rejectAchievement(a._id)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
