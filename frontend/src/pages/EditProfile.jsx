import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText } from "lucide-react";

const STATUS_STYLE = {
  approved: { bg: '#e4eaf4', fg: '#1b3a6b' },
  rejected: { bg: '#ffe0d9', fg: '#ae1800' },
  new: { bg: '#eae7e7', fg: '#444141' },
};

export default function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [dob, setDob] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const aiSkills = [
    "Machine Learning", "Deep Learning", "Python", "TensorFlow", "PyTorch",
    "Natural Language Processing", "Computer Vision", "Data Science",
    "Neural Networks", "AI Ethics", "Reinforcement Learning", "Scikit-learn",
    "Pandas", "NumPy", "Keras", "OpenCV", "Transformers", "LLMs",
    "Data Analysis", "Data Visualization", "Statistics", "Probability",
    "Big Data", "Hadoop", "Spark", "Tableau", "Power BI", "Excel",
    "R Programming", "MATLAB", "Jupyter", "Data Mining", "ETL",
    "Feature Engineering", "Model Deployment", "MLOps", "AWS", "Azure",
    "Time Series Analysis", "Clustering", "Classification", "Regression"
  ];

  const webSkills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express",
    "MongoDB", "SQL", "TypeScript", "Next.js", "Vue.js", "Angular",
    "Tailwind CSS", "Bootstrap", "REST API", "GraphQL", "Git", "Docker"
  ];
  const [achievements, setAchievements] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedToast, setShowUnsavedToast] = useState(false);
  const [originalData, setOriginalData] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        const profileData = {
          name: data.name || "",
          year: data.year || "",
          dob: data.dob || "",
          registerNumber: data.registerNumber || "",
          bio: data.bio || "",
          github: data.socialLinks?.github || "",
          leetcode: data.socialLinks?.leetcode || "",
          linkedin: data.socialLinks?.linkedin || "",
          skills: data.skills || [],
        };
        setName(profileData.name);
        setYear(profileData.year);
        setDob(profileData.dob);
        setRegisterNumber(profileData.registerNumber);
        setBio(profileData.bio);
        setGithub(profileData.github);
        setLeetcode(profileData.leetcode);
        setLinkedin(profileData.linkedin);
        setSkills(profileData.skills);
        setProfileImage(data.profileImage || null);
        setResume(data.resume || null);
        setOriginalData(profileData);
      })
      .catch((err) => console.error("Load profile error", err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}?all=true`)
      .then((res) => res.json())
      .then((data) => {
        setAchievements(data.map((a) => ({ ...a, localStatus: a.status })));
      })
      .catch((err) => console.error("Load achievements error", err));
  }, [userId]);

  useEffect(() => {
    if (Object.keys(originalData).length === 0) return;
    const currentData = { name, year, dob, registerNumber, bio, github, leetcode, linkedin, skills: JSON.stringify(skills) };
    const original = { ...originalData, skills: JSON.stringify(originalData.skills) };
    const changed = JSON.stringify(currentData) !== JSON.stringify(original);
    setHasUnsavedChanges(changed);
  }, [name, year, dob, registerNumber, bio, github, leetcode, linkedin, skills, originalData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigateWithCheck = (path) => {
    if (hasUnsavedChanges) {
      setShowUnsavedToast(true);
      setTimeout(() => setShowUnsavedToast(false), 4000);
    } else {
      navigate(path);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const uploaded = await res.json();
      setProfileImage(uploaded);
      setImageFile(null);
    } catch (err) {
      alert("Failed to upload profile image");
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}/resume`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const uploaded = await res.json();
      setResume(uploaded);
    } catch (err) {
      alert("Failed to upload resume");
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

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

  const handleSaveNewAchievement = () => {
    if (!modalTitle) return;
    setAchievements([
      ...achievements,
      {
        title: modalTitle,
        description: modalDesc,
        localStatus: "new",
        certificateFile,
      },
    ]);
    setModalTitle("");
    setModalDesc("");
    setCertificateFile(null);
    setShowAddModal(false);
  };

  const handleSubmit = async () => {
    try {
      const profilePayload = {
        name,
        year,
        dob,
        registerNumber,
        bio,
        skills,
        socialLinks: { github, leetcode, linkedin }
      };

      const res = await fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Save failed:', errorData);
        throw new Error("Profile save failed");
      }

      await res.json();

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
            body: JSON.stringify({ userId, title: a.title, description: a.description }),
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

      setHasUnsavedChanges(false);
      setOriginalData({ name, year, dob, registerNumber, bio, github, leetcode, linkedin, skills });
      navigate("/profile", { state: { profileSaved: true } });
    } catch (err) {
      console.error('Profile save error:', err);
      alert("Failed to save profile: " + err.message);
    }
  };

  const visibleAchievements = achievements.filter((a) => !a.markedForDeletion);

  return (
    <div className="font-brand bg-brand-ground px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px]">
      <div className="max-w-[820px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">Account</span>
          <h1 className="m-0 text-[32px] sm:text-[38px] font-semibold tracking-[-0.02em] text-brand-navy">
            Edit profile
          </h1>
          <p className="m-0 text-[13.5px] text-brand-ink-soft">Update your information and showcase your achievements.</p>
        </div>

        {/* Identity */}
        <div className="bg-white border border-brand-edge p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-28 h-28 bg-brand-blue-tint border border-[#c3cfe3] grid place-items-center overflow-hidden">
              {profileImage?.url ? (
                <img src={profileImage.url} alt="Profile" className="w-full h-full object-cover grayscale" />
              ) : (
                <span className="text-[30px] font-semibold text-[#5f6e88]">{name.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <label className="flex items-center gap-2 px-3 py-2 border border-brand-ink-faint text-[11.5px] font-medium text-brand-ink-soft cursor-pointer">
              <Upload size={13} />
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
            {imageFile && (
              <button onClick={handleImageUpload} className="px-3 py-2 bg-brand-navy text-white text-[11.5px] font-semibold w-full">
                Upload image
              </button>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Full name" value={name} onChange={setName} placeholder="As on the roll list" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">Year</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-brand-ink-faint px-3 py-2.5 text-[13px] text-brand-navy outline-none focus:border-brand-navy bg-white"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <Field label="Date of birth" type="date" value={dob} onChange={setDob} />
            <Field label="Register number" value={registerNumber} onChange={setRegisterNumber} placeholder="21AD000" />
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">Email</span>
              <input
                value={user?.email || ""}
                disabled
                className="border border-brand-edge bg-brand-ground px-3 py-2.5 text-[13px] text-brand-ink-soft outline-none"
              />
            </div>
          </div>
        </div>

        {/* About */}
        <Section title="About">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio about yourself…"
            rows={4}
            className="border border-brand-ink-faint px-3.5 py-3 text-[13.5px] leading-[1.6] text-brand-ink outline-none focus:border-brand-navy resize-none"
          />
        </Section>

        {/* Social links */}
        <Section title="Social links">
          <div className="flex flex-col gap-3">
            <Field label="GitHub" value={github} onChange={setGithub} placeholder="https://github.com/username" />
            <Field label="LeetCode" value={leetcode} onChange={setLeetcode} placeholder="https://leetcode.com/username" />
            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/username" />
          </div>
        </Section>

        {/* Resume */}
        <Section title="Résumé">
          {resume?.url ? (
            <div className="flex items-center gap-3.5 border border-brand-edge p-3.5">
              <div className="w-[42px] h-[54px] shrink-0 bg-brand-blue-tint border border-[#c3cfe3] grid place-items-center text-[8px] font-medium text-[#5f6e88]">
                PDF
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[13px] font-medium text-brand-navy truncate">{resume.filename || "Resume"}</span>
                <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-brand-blue">
                  View resume
                </a>
              </div>
              <button onClick={() => setResume(null)} className="text-brand-red" title="Remove resume">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2.5 border border-dashed border-brand-ink-faint px-3.5 py-3 cursor-pointer text-[12.5px] text-brand-ink-soft w-fit">
              <Upload size={15} />
              Upload resume (PDF)
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => { const file = e.target.files[0]; if (file) handleResumeUpload(file); }}
              />
            </label>
          )}
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <div className="flex flex-col gap-3">
            <div className="border border-brand-edge p-3.5 flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-brand-blue">AI &amp; Data Science</span>
              <div className="flex flex-wrap gap-1.5">
                {aiSkills.filter(s => !skills.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSkills([...skills, skill])}
                    className="px-2.5 py-1 border border-brand-edge text-[11px] text-brand-blue"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-brand-edge p-3.5 flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-brand-red">Web development</span>
              <div className="flex flex-wrap gap-1.5">
                {webSkills.filter(s => !skills.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSkills([...skills, skill])}
                    className="px-2.5 py-1 border border-brand-edge text-[11px] text-brand-red-deep"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-[7px] bg-brand-navy text-white text-[12px] flex items-center gap-2">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                  </span>
                ))}
              </div>
            )}
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Add a custom skill and press Enter…"
              className="border border-brand-ink-faint px-3.5 py-2.5 text-[13px] text-brand-ink outline-none focus:border-brand-navy"
            />
          </div>
        </Section>

        {/* Achievements */}
        <Section
          title="Achievements"
          action={
            <button onClick={() => setShowAddModal(true)} className="px-3.5 py-2 bg-brand-red text-white text-[11.5px] font-semibold">
              Add
            </button>
          }
        >
          {visibleAchievements.length === 0 ? (
            <p className="m-0 text-[13px] text-brand-ink-soft">No achievements yet. Click "Add" to create one!</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visibleAchievements.map((a, index) => {
                const st = STATUS_STYLE[a.localStatus] || STATUS_STYLE.new;
                return (
                  <div key={a._id || index} className="border border-brand-edge p-3.5 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[14px] font-semibold text-brand-navy">{a.title}</span>
                      <span
                        className="px-2 py-1 text-[9.5px] font-semibold tracking-[0.08em] uppercase shrink-0"
                        style={{ background: st.bg, color: st.fg }}
                      >
                        {a.localStatus}
                      </span>
                    </div>
                    <p className="m-0 text-[12.5px] text-brand-ink-soft">{a.description}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleEditAchievement(achievements.indexOf(a))} className="text-[11.5px] font-medium text-brand-blue">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAchievement(achievements.indexOf(a))} className="text-[11.5px] font-medium text-brand-red">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Save / Cancel */}
        <div className="flex gap-3">
          <button onClick={() => handleNavigateWithCheck("/profile")} className="flex-1 py-3 border border-brand-ink-faint text-[13px] font-medium text-brand-ink-soft">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-brand-red text-white text-[13px] font-semibold">
            Save profile
          </button>
        </div>
      </div>

      {showUnsavedToast && (
        <div className="fixed top-4 right-4 bg-brand-red-tint text-brand-red-deep px-5 py-3.5 z-[9999]">
          <p className="m-0 text-[13px] font-semibold">Unsaved changes — save before leaving.</p>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 z-[9998] bg-black/50" />
          <div className="font-brand fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[480px] bg-white border border-brand-edge">
            <div className="bg-brand-navy px-6 py-4">
              <h2 className="m-0 text-[15px] font-semibold text-white">Add achievement</h2>
            </div>
            <div className="p-6 flex flex-col gap-3.5">
              <Field label="Title" value={modalTitle} onChange={setModalTitle} placeholder="e.g. Winner at GDG In Campus" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">Description</span>
                <textarea
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Describe your achievement…"
                  rows={4}
                  className="border border-brand-ink-faint px-3 py-2.5 text-[13.5px] leading-[1.6] text-brand-ink outline-none focus:border-brand-navy resize-none"
                />
              </div>
              <label className="flex items-center gap-2.5 border border-dashed border-brand-ink-faint px-3.5 py-3 cursor-pointer text-[12.5px] text-brand-ink-soft w-fit">
                <FileText size={15} />
                {certificateFile ? certificateFile.name : "Attach certificate (PDF, optional)"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                />
              </label>
              <div className="flex gap-2.5 pt-1">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-brand-ink-faint text-[13px] font-medium text-brand-ink-soft">
                  Cancel
                </button>
                <button onClick={handleSaveNewAchievement} className="flex-1 py-2.5 bg-brand-navy text-white text-[13px] font-semibold">
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const Section = ({ title, action, children }) => (
  <div className="bg-white border border-brand-edge p-5 sm:p-6 flex flex-col gap-3.5">
    <div className="flex items-center justify-between gap-3">
      <h2 className="m-0 text-[15px] font-semibold text-brand-navy">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-brand-ink-faint px-3 py-2.5 text-[13px] text-brand-ink outline-none focus:border-brand-navy placeholder:text-brand-ink-faint"
    />
  </div>
);
