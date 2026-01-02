import React, { useEffect, useState } from "react";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent")
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Achievements</h2>

      {achievements.map(a => (
        <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">{a.title}</h4>
          <p className="text-gray-700 leading-relaxed mb-2">{a.description}</p>
          <p className="text-gray-500 text-sm">
            — {a.userId.fullName} ({a.userId.year} Year)
          </p>
        </div>
      ))}
    </div>
  );
}
