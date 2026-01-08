import React, { useEffect, useState } from "react";

const SkillTag = ({ skill }) => (
  <span className="skill-tag">{skill}</span>
);

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [achievements, setAchievements] = useState([]);

    useEffect(() => {
      if (!userId) return;

      fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}`)
        .then(res => res.json())
        .then(data => setAchievements(data))
        .catch(err => console.error(err));
    }, [userId]);


  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>No profile found.</p>;
  return (
    <div className="profile-page-container">
      {/* Profile Info */}
      <div className="profile-info-card">
        <div className="profile-icon-large">
          <img
            src={profile.profileImage?.url || "/user-icon.jpg"}
            alt="Profile"
            className="profile-image-circle"
          />
        </div>
        <h2>{profile.name}</h2>
        <p>{profile.year}</p>
      </div>

      {/* Bio & Skills */}
      <div className="profile-section-card">
        <h3 className="section-title">Bio</h3>
        <p>{profile.bio || "—"}</p>

        <h3 className="section-title">Skills</h3>
        <div className="skills-container">
          {(profile.skills || []).map((skill, i) => (
            <SkillTag key={i} skill={skill} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="profile-section-card">
        <h3 className="section-title">Achievements</h3>

        {achievements.length === 0 ? (
          <p>No approved achievements yet.</p>
        ) : (
          achievements.map((a, i) => (
            <div key={i} className="achievement-item">
              <h4>{a.title}</h4>
              <p>{a.description}</p>
              {a.certificate?.url && (
                <a
                  href={a.certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate (PDF)
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
