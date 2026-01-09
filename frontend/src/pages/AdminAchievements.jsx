import React, { useEffect, useState } from "react";
import { Trophy, CheckCircle, XCircle, Clock, User } from "lucide-react";

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Trophy className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Achievements</h1>
          <p className="text-gray-600">Review and approve pending achievement submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">{pending.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {pending.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Achievements</h3>
          <p className="text-gray-600">All achievement submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(achievement => (
            <div key={achievement._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-700 mb-4">{achievement.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{achievement.userId.fullName}</span>
                    </div>
                    <span>•</span>
                    <span>{achievement.userId.year} Year</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => approveAchievement(achievement._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors border border-green-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectAchievement(achievement._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
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
