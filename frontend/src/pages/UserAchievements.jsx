import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent")
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, []);

  return (
    <div>
      <div className="mb-10 pb-6 border-b-2 border-navy">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">{achievements.length} entries</span>
        <h1 className="text-page-heading text-navy mt-2.5">Student achievements</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(a => (
          <Card key={a._id} className="p-6 flex flex-col gap-2.5">
            <Card.Kicker>Achievement</Card.Kicker>
            <Card.Title>{a.title}</Card.Title>
            <Card.Body>{a.description}</Card.Body>
            <span className="text-label text-ds-ink-faint mt-auto pt-2">
              {a.userId.fullName} · {a.userId.year} year
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
