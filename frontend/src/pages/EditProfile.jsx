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
const ProfilePicturePage = ({ onBackToEditForm }) => {
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  /* --- LOAD CURRENT PROFILE IMAGE --- */
  useEffect(() => {
    if (!userId) return;

    fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.profileImage?.url) {
          setCurrentImage(data.profileImage.url);
        }
      })
      .catch((err) => console.error("Load profile image error", err));
  }, [userId]);

  /* --- UPLOAD NEW IMAGE --- */
  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://web-portal-760h.onrender.com/api/profile/${userId}/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const uploaded = await res.json();
      setCurrentImage(uploaded.url); // update preview instantly
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile image");
    }
  };

  return (
    <div className="profile-picture-page">
        <style>{`
        .profile-image-preview {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            }

        .profile-image-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ddd;
            }
        `}</style>
      <h3>Edit Profile Picture</h3>

      {/* --- CURRENT IMAGE PREVIEW --- */}
      <div className="profile-image-preview">
        <img
          src={currentImage || "user-icon.jpg"}
          alt="Profile"
          className="profile-image-circle"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="submit-profile-btn"
        style={{ maxWidth: "200px", marginTop: "20px" }}
        onClick={handleUpload}
      >
        Upload & Save
      </button>

      <button className="back-btn" onClick={onBackToEditForm}>
        ← Back to Edit Profile
      </button>
    </div>
  );
};

export default function EditProfile() {
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [achievements, setAchievements] = useState([]);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const [isEditingPicture, setIsEditingPicture] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    /* --- MODAL STATE --- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDesc, setModalDesc] = useState("");
    const [certificateFile, setCertificateFile] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    /* ---------------- LOAD PROFILE ---------------- */
    useEffect(() => {
        if (!userId) return;
        fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data) {
                    setName(""); setYear(""); setBio(""); setSkills([]); setAchievements([]);
                    return;
                }
                setName(data.name || "");
                setYear(data.year || "");
                setBio(data.bio || "");
                setSkills(data.skills || []);
                setProfileImage(data.profileImage || null);
            })
            .catch((err) => console.error("Load profile error", err));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}?all=true`)
            .then((res) => res.json())
            .then((data) => {
                const withLocalStatus = data.map((a) => ({
                    ...a,
                    localStatus: a.status,
                }));
                setAchievements(withLocalStatus);
            })
            .catch((err) => console.error("Load achievements error", err));
    }, [userId]);

    /* ---------------- SKILLS ---------------- */
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    const handleAddSkill = (e) => {
        if (e.key === "Enter" && newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    /* ---------------- ACHIEVEMENTS ---------------- */
    const handleDeleteAchievement = (index) => {
        const updated = [...achievements];
        updated[index] = { ...updated[index], markedForDeletion: true };
        setAchievements(updated);
    };

    const handleEditAchievement = (index) => {
        const old = achievements[index];
        const newTitle = prompt("Edit achievement title", old.title);
        if (newTitle === null) return;
        const newDesc = prompt("Edit achievement description", old.description);
        if (newDesc === null) return;

        const updated = [...achievements];
        updated[index] = {
            ...old,
            title: newTitle,
            description: newDesc,
            localStatus: old.localStatus === "approved" ? "new" : "rejected",
            editedFromApproved: old.localStatus === "approved",
        };
        setAchievements(updated);
    };

    /* --- MODAL SAVE LOGIC --- */
    const handleSaveNewAchievement = () => {
        if (!modalTitle) return;

        setAchievements([
            ...achievements,
            {
            title: modalTitle,
            description: modalDesc,
            localStatus: "new",
            certificateFile, // store file locally
            },
        ]);

        setModalTitle("");
        setModalDesc("");
        setCertificateFile(null);
        setShowAddModal(false);
    };


    /* ---------------- SAVE PROFILE ---------------- */
    const handleSubmit = async () => {
        try {
            const profilePayload = { name, year, bio, skills };
            const res = await fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profilePayload),
            });
            if (!res.ok) throw new Error("Profile save failed");

            for (const a of achievements) {
                if (a.markedForDeletion || (a.localStatus !== "new" && a.localStatus !== "rejected")) continue;
                if (a.certificateFile) {
                    const formData = new FormData();
                    formData.append("userId", userId);
                    formData.append("title", a.title);
                    formData.append("description", a.description);
                    formData.append("certificate", a.certificateFile);

                    await fetch("https://web-portal-760h.onrender.com/api/achievements", {
                        method: "POST",
                        body: formData,
                    });
                    } else {
                    await fetch("https://web-portal-760h.onrender.com/api/achievements", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        userId,
                        title: a.title,
                        description: a.description,
                        }),
                    });
                }
                if (a.localStatus === "rejected" && a._id) {
                    await fetch(`https://web-portal-760h.onrender.com/api/achievements/${a._id}`, { method: "DELETE" });
                }
                if (a.editedFromApproved && a._id) {
                    await fetch(`https://web-portal-760h.onrender.com/api/achievements/${a._id}`, { method: "DELETE" });
                }
            }

            for (const a of achievements) {
                if (a.markedForDeletion && a._id) {
                    await fetch(`https://web-portal-760h.onrender.com/api/achievements/${a._id}`, { method: "DELETE" });
                }
            }

            fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}?all=true`)
                .then((res) => res.json())
                .then((data) => {
                    setAchievements(data.map((a) => ({ ...a, localStatus: a.status })));
                });

            setIsProfileUpdated(true);
            setTimeout(() => setIsProfileUpdated(false), 3000);
        } catch (err) {
            console.error(err);
            alert("Failed to save profile");
        }
    };

    if (isEditingPicture) {
        return <ProfilePicturePage onBackToEditForm={() => setIsEditingPicture(false)} />;
    }

    return (
        <div className="profile-edit-container">
            {/* INLINE CSS */}
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                }
                .achievement-modal {
                    background: #fff;
                    padding: 24px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                .modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 24px;
                    color: #000;
                }
                .modal-field {
                    margin-bottom: 20px;
                }
                .modal-field label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #333;
                }
                .modal-field input, .modal-field textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    outline: none;
                }
                .modal-field input:focus, .modal-field textarea:focus {
                    border-color: #4285f4;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }
                .modal-cancel-btn {
                    background: #f0f0f0;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .modal-save-btn {
                    background: #4285f4;
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .profile-image-preview {
                    display: flex;
                    justify-content: center;
                    margin: 20px 0;
                    }
                .profile-image-circle {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #ddd;
                    }
            `}</style>

            <h2 className="edit-title">Edit Profile</h2>
            <p className="edit-subtitle">Keep your profile updated</p>

            <div className="edit-card profile-info-card-edit profile-image-preview">
                <div className="profile-icon-edit clickable-icon" onClick={() => setIsEditingPicture(true)} title="Click to edit profile picture">
                    <img src={profileImage?.url || "user-icon.jpg"} alt="Profile" className="profile-image-circle"/>

                </div>
                <div className="profile-fields">
                    <input type="text" className="name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
                    <input type="text" className="year-input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year (e.g., 3rd Year)" />
                </div>
            </div>

            <div className="edit-card profile-bio-skills-card">
                <h3 className="section-title">Bio and Top Skills</h3>
                <h4 className="sub-section-title">Bio</h4>
                <textarea rows="4" className="bio-textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write a short bio about yourself..." />
                <h4 className="sub-section-title">Skills</h4>
                <div className="skills-input-container">
                    {skills.map((skill) => (
                        <RemovableSkillTag key={skill} skill={skill} onRemove={handleRemoveSkill} />
                    ))}
                    <input type="text" placeholder="Add more skills..." className="add-skill-input" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleAddSkill} />
                </div>
            </div>

            <div className="edit-card profile-achievements-card">
                <h3 className="section-title">Achievements</h3>
                {achievements
                    .filter((a) => !a.markedForDeletion)
                    .map((a, index) => (
                        <div key={a._id || index} className="achievement-item-edit">
                            <h4>{a.title}</h4>
                            <p>{a.description}</p>
                            <span className={`status-badge ${a.localStatus}`}>{a.localStatus.toUpperCase()}</span>
                            {(a.localStatus === "rejected" || a.localStatus === "new" || a.localStatus === "approved") && (
                                <div className="achievement-actions">
                                    <button className="action-btn edit-btn" onClick={() => handleEditAchievement(index)}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDeleteAchievement(index)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                <button className="add-more-btn" onClick={() => setShowAddModal(true)}>Add More</button>
            </div>

            {/* --- ACHIEVEMENT MODAL UI --- */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="achievement-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Add Achievement</h3>
                        <div className="modal-field">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Winner at GDG In Campus"
                                value={modalTitle}
                                onChange={(e) => setModalTitle(e.target.value)}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Description</label>
                            <textarea
                                placeholder="Describe your achievement..."
                                rows="4"
                                value={modalDesc}
                                onChange={(e) => setModalDesc(e.target.value)}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Certificate (PDF – optional)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setCertificateFile(e.target.files[0])}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="modal-save-btn" onClick={handleSaveNewAchievement}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <button className="submit-profile-btn" onClick={handleSubmit}>Submit Profile</button>
            {isProfileUpdated && <div className="profile-updated-message">Profile Updated Successfully!</div>}
        </div>
    );
}