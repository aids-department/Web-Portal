import React, { useEffect, useState } from "react";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/achievements/approved/recent")
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, []);

  return (
    <div className="user-achievements-page">
      <h2>Recent Achievements</h2>

      {achievements.map(a => (
        <div key={a._id} className="achievement-feed-item">
          <h4>{a.title}</h4>
          <p>{a.description}</p>
          <p className="achievement-user">
            — {a.userId.fullName} ({a.userId.year} Year)
          </p>
        </div>
      ))}

      {/* ===== PAGE-LOCAL CSS ===== */}
      <style>{`
        .user-achievements-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
        }

        .achievement-feed-item {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .achievement-feed-item h4 {
          font-size: 18px;
          margin-bottom: 6px;
        }

        .achievement-feed-item p {
          color: #374151;
          line-height: 1.5;
        }

        .achievement-user {
          margin-top: 10px;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
