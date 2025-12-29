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


  if (loading) return <p>Loading pending achievements…</p>;
  if (pending.length === 0) return <p>No pending achievements 🎉</p>;

  return (
    <div className="admin-achievements">
      <h1>Pending Achievements</h1>

      {pending.map(a => (
        <div key={a._id} className="achievement-card">
          <h3>{a.title}</h3>
          <p>{a.description}</p>

          <p>
            <strong>User:</strong> {a.userId.fullName} ({a.userId.year} Year)
          </p>

          <div className="actions">
            <button onClick={() => approveAchievement(a._id)}>
              Approve
            </button>
            <button onClick={() => rejectAchievement(a._id)}>
              Reject
            </button>
          </div>
        </div>
      ))}

      {/* ✅ INTERNAL CSS */}
      <style>{`
        .admin-achievements {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
        }

        .admin-achievements h1 {
          font-size: 28px;
          margin-bottom: 25px;
          color: #1f2937;
        }

        .achievement-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
        }

        .achievement-card h3 {
          font-size: 20px;
          margin-bottom: 8px;
          color: #111827;
        }

        .achievement-card p {
          margin: 6px 0;
          color: #374151;
          line-height: 1.5;
        }

        .achievement-card .actions {
          margin-top: 15px;
          display: flex;
          gap: 12px;
        }

        .achievement-card button {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .achievement-card button:first-child {
          background-color: #16a34a;
          color: white;
        }

        .achievement-card button:last-child {
          background-color: #dc2626;
          color: white;
        }
      `}</style>
    </div>
  );
}
