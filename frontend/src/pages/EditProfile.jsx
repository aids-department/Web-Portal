// src/EditProfile.jsx
import React, { useEffect, useState } from "react";

// Skill tag with remove
const RemovableSkillTag = ({ skill, onRemove }) => (
  <span className="skill-tag removable-tag">
    {skill}
    <span
      className="remove-btn"
      onClick={() => onRemove(skill)}
    >
      ×
    </span>
  </span>
);

// Component for Profile Picture Editing
const ProfilePicturePage = ({ onBackToEditForm }) => (
  <div className="profile-picture-page">
    <h3>Edit Profile Picture</h3>

    <p>
      This is the dedicated page for uploading and managing your profile image.
    </p>

    <div className="current-image-preview">
      Current Picture
    </div>

    <input
      type="file"
      accept="image/*"
    />

    <button
      className="submit-profile-btn"
      style={{
        maxWidth: "200px",
        marginTop: "20px",
      }}
    >
      Upload & Save
    </button>

    <button
      className="back-btn"
      onClick={onBackToEditForm}
    >
      ← Back to Edit Profile
    </button>
  </div>
);

export default function EditProfile() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    if (!userId) {
      // window.location.href = "/login";
      return;
    }

    fetch(
      `https://web-portal-760h.onrender.com/api/profile/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          // 🔥 IMPORTANT: clear old user's data
          setName("");
          setYear("");
          setBio("");
          setSkills([]);
          setAchievements([]);
          return;
        }

        setName(data.name || "");
        setYear(data.year || "");
        setBio(data.bio || "");
        setSkills(data.skills || []);
      })
      .catch((err) =>
        console.error("Load profile error", err)
      );
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(
      `https://web-portal-760h.onrender.com/api/achievements/user/${userId}?all=true`
    )
      .then((res) => res.json())
      .then((data) => {
        // normalize: add local flag for UI
        const withLocalStatus = data.map((a) => ({
          ...a,
          localStatus: a.status, // approved | pending | rejected
        }));

        setAchievements(withLocalStatus);
      })
      .catch((err) =>
        console.error("Load achievements error", err)
      );
  }, [userId]);

  /* ---------------- SKILLS ---------------- */
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(
      skills.filter((s) => s !== skillToRemove)
    );
  };

  const handleAddSkill = (e) => {
    if (
      e.key === "Enter" &&
      newSkill.trim() &&
      !skills.includes(newSkill.trim())
    ) {
      setSkills([
        ...skills,
        newSkill.trim(),
      ]);
      setNewSkill("");
    }
  };

  /* ---------------- ACHIEVEMENTS ---------------- */
  const handleDeleteAchievement = (index) => {
    const updated = [...achievements];

    updated[index] = {
      ...updated[index],
      markedForDeletion: true,
    };

    setAchievements(updated);
  };

  const handleEditAchievement = (index) => {
    const old = achievements[index];

    const newTitle = prompt(
      "Edit achievement title",
      old.title
    );
    if (newTitle === null) return;

    const newDesc = prompt(
      "Edit achievement description",
      old.description
    );
    if (newDesc === null) return;

    const updated = [...achievements];
    updated[index] = {
      ...old,
      title: newTitle,
      description: newDesc,
      localStatus:
        old.localStatus === "approved"
          ? "new"
          : "rejected",
      editedFromApproved:
        old.localStatus === "approved", // ✅ THIS LINE
    };

    setAchievements(updated);
  };

  const handleAddAchievement = () => {
    const title = prompt("Achievement title");
    const description = prompt(
      "Achievement description"
    );

    if (title && description) {
      setAchievements([
        ...achievements,
        {
          title,
          description,
          localStatus: "new", // 🔥 important
        },
      ]);
    }
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSubmit = async () => {
    try {
      // 1️⃣ Save profile info ONLY
      const profilePayload = {
        name,
        year,
        bio,
        skills,
      };

      const res = await fetch(
        `https://web-portal-760h.onrender.com/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profilePayload),
        }
      );

      if (!res.ok)
        throw new Error("Profile save failed");

      // 2️⃣ Submit achievements separately (pending)
      for (const a of achievements) {
        if (
          a.markedForDeletion ||
          (a.localStatus !== "new" &&
            a.localStatus !== "rejected")
        ) {
          continue;
        }

        await fetch(
          "https://web-portal-760h.onrender.com/api/achievements",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              title: a.title,
              description: a.description,
            }),
          }
        );

        // delete old achievement if it was edited (rejected OR approved)
        // delete old rejected
        if (
          a.localStatus === "rejected" &&
          a._id
        ) {
          await fetch(
            `https://web-portal-760h.onrender.com/api/achievements/${a._id}`,
            { method: "DELETE" }
          );
        }

        // delete old approved (only if edited)
        if (
          a.editedFromApproved &&
          a._id
        ) {
          await fetch(
            `https://web-portal-760h.onrender.com/api/achievements/${a._id}`,
            { method: "DELETE" }
          );
        }
      }

      // delete achievements marked for deletion
      for (const a of achievements) {
        if (
          a.markedForDeletion &&
          a._id
        ) {
          await fetch(
            `https://web-portal-760h.onrender.com/api/achievements/${a._id}`,
            { method: "DELETE" }
          );
        }
      }

      // refresh achievements after submit
      fetch(
        `https://web-portal-760h.onrender.com/api/achievements/user/${userId}?all=true`
      )
        .then((res) => res.json())
        .then((data) => {
          setAchievements(
            data.map((a) => ({
              ...a,
              localStatus: a.status,
            }))
          );
        });

      setIsProfileUpdated(true);
      setTimeout(
        () => setIsProfileUpdated(false),
        3000
      );
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  if (isEditingPicture) {
    return (
      <ProfilePicturePage
        onBackToEditForm={() =>
          setIsEditingPicture(false)
        }
      />
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="profile-edit-container">
      <h2 className="edit-title">
        Edit Profile
      </h2>

      <p className="edit-subtitle">
        Keep your profile updated
      </p>

      {/* Profile Info */}
      <div className="edit-card profile-info-card-edit">
        <div
          className="profile-icon-edit clickable-icon"
          onClick={() =>
            setIsEditingPicture(true)
          }
          title="Click to edit profile picture"
        >
          <img
            src="user-icon.png"
            alt="Profile"
          />
        </div>

        <div className="profile-fields">
          <input
            type="text"
            className="name-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Full Name"
          />

          <input
            type="text"
            className="year-input"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
            placeholder="Year (e.g., 3rd Year)"
          />
        </div>
      </div>

      {/* Bio & Skills */}
      <div className="edit-card profile-bio-skills-card">
        <h3 className="section-title">
          Bio and Top Skills
        </h3>

        <h4 className="sub-section-title">
          Bio
        </h4>

        <textarea
          rows="4"
          className="bio-textarea"
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
          placeholder="Write a short bio about yourself..."
        />

        <h4 className="sub-section-title">
          Skills
        </h4>

        <div className="skills-input-container">
          {skills.map((skill) => (
            <RemovableSkillTag
              key={skill}
              skill={skill}
              onRemove={handleRemoveSkill}
            />
          ))}

          <input
            type="text"
            placeholder="Add more skills..."
            className="add-skill-input"
            value={newSkill}
            onChange={(e) =>
              setNewSkill(e.target.value)
            }
            onKeyDown={handleAddSkill}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="edit-card profile-achievements-card">
        <h3 className="section-title">
          Achievements
        </h3>

        {achievements
          .filter((a) => !a.markedForDeletion)
          .map((a, index) => (
            <div
              key={a._id || index}
              className="achievement-item-edit"
            >
              <h4>{a.title}</h4>
              <p>{a.description}</p>

              <span
                className={`status-badge ${a.localStatus}`}
              >
                {a.localStatus.toUpperCase()}
              </span>

              {(a.localStatus === "rejected" ||
                a.localStatus === "new" ||
                a.localStatus === "approved") && (
                <div className="achievement-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() =>
                      handleEditAchievement(index)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      handleDeleteAchievement(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

        <button
          className="add-more-btn"
          onClick={handleAddAchievement}
        >
          Add More
        </button>
      </div>

      <button
        className="submit-profile-btn"
        onClick={handleSubmit}
      >
        Submit Profile
      </button>

      {isProfileUpdated && (
        <div className="profile-updated-message">
          Profile Updated Successfully!
        </div>
      )}
    </div>
  );
}
