import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, Plus, PencilLine, Trash2, AlertTriangle } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import { Reveal } from "../components/ui/Reveal";

const STATUS_STYLE = {
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  new: 'border-white/10 bg-white/[0.05] text-fg-muted',
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
    <div className="container-ln pb-8">
      <div className="mx-auto flex max-w-[820px] flex-col gap-5">
        <PageHeader
          eyebrow="Account"
          title="Edit profile"
          description="Update your information and showcase your achievements."
          spacing="pt-14 pb-4 sm:pt-20 sm:pb-6 lg:pt-24"
        />

        {/* Identity */}
        <Reveal className="surface edge-highlight flex flex-col gap-6 p-5 sm:flex-row sm:p-6">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-2 rounded-3xl bg-accent/25 blur-xl" />
              <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-canvas-elevated">
                {profileImage?.url ? (
                  <img src={profileImage.url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[30px] font-semibold text-gradient">{name.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
            </div>
            <label className="btn-secondary btn-sm cursor-pointer">
              <Upload size={13} />
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
            {imageFile && (
              <button onClick={handleImageUpload} className="btn-primary btn-sm w-full">
                Upload image
              </button>
            )}
          </div>

          <div className="grid flex-1 grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="Full name" value={name} onChange={setName} placeholder="As on the roll list" />
            <label className="flex flex-col">
              <span className="field-label">Year</span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="field">
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </label>
            <Field label="Date of birth" type="date" value={dob} onChange={setDob} />
            <Field label="Register number" value={registerNumber} onChange={setRegisterNumber} placeholder="21AD000" />
            <label className="flex flex-col sm:col-span-2">
              <span className="field-label">Email</span>
              <input value={user?.email || ""} disabled className="field cursor-not-allowed" />
            </label>
          </div>
        </Reveal>

        {/* About */}
        <Section title="About">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio about yourself…"
            rows={4}
            className="field resize-none py-3 leading-[1.6]"
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
            <div className="flex items-center gap-3.5 rounded-xl border border-line bg-white/[0.03] p-3.5">
              <div className="icon-tile h-[52px] w-[42px] shrink-0 rounded-lg">
                <FileText className="h-4 w-4 text-fg-muted" strokeWidth={1.5} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[13.5px] font-medium text-fg">{resume.filename || "Resume"}</span>
                <a href={resume.url} target="_blank" rel="noopener noreferrer" className="w-fit text-[12.5px] text-accent-bright hover:text-indigo-300">
                  View resume
                </a>
              </div>
              <button onClick={() => setResume(null)} className="btn-icon h-8 w-8 hover:bg-rose-500/10 hover:text-rose-300" title="Remove resume" aria-label="Remove resume">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/15 px-4 py-6 text-[13px] text-fg-muted transition-colors hover:border-line-accent hover:bg-accent/[0.04] hover:text-fg">
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
            <SkillSuggestions title="AI & Data Science" skills={aiSkills.filter(s => !skills.includes(s))} onAdd={(skill) => setSkills([...skills, skill])} />
            <SkillSuggestions title="Web development" skills={webSkills.filter(s => !skills.includes(s))} onAdd={(skill) => setSkills([...skills, skill])} />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="pill py-1 pl-3 pr-1.5 text-[12.5px]">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="grid h-4 w-4 place-items-center rounded-full text-indigo-200/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Add a custom skill and press Enter…"
              className="field"
            />
          </div>
        </Section>

        {/* Achievements */}
        <Section
          title="Achievements"
          action={
            <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
              <Plus size={14} />
              Add
            </button>
          }
        >
          {visibleAchievements.length === 0 ? (
            <p className="text-[13px] text-fg-muted">No achievements yet. Click "Add" to create one!</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visibleAchievements.map((a, index) => {
                const st = STATUS_STYLE[a.localStatus] || STATUS_STYLE.new;
                return (
                  <div key={a._id || index} className="flex flex-col gap-2 rounded-xl border border-line bg-white/[0.02] p-4 transition-colors hover:border-line-hover">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[14px] font-semibold text-fg">{a.title}</span>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${st}`}>
                        {a.localStatus}
                      </span>
                    </div>
                    <p className="text-[13px] text-fg-muted">{a.description}</p>
                    <div className="flex gap-1 pt-1">
                      <button onClick={() => handleEditAchievement(achievements.indexOf(a))} className="btn-ghost btn-sm -ml-3">
                        <PencilLine size={13} />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAchievement(achievements.indexOf(a))} className="btn-ghost btn-sm hover:bg-rose-500/10 hover:text-rose-300">
                        <Trash2 size={13} />
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
        <div className="flex gap-3 pt-2">
          <button onClick={() => handleNavigateWithCheck("/profile")} className="btn-secondary btn-lg flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary btn-lg flex-1">
            Save profile
          </button>
        </div>
      </div>

      {showUnsavedToast && (
        <div className="fixed right-4 top-20 z-[9999] flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-canvas-elevated/95 px-4 py-3 shadow-popover backdrop-blur-xl animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
          <p className="text-[13px] font-medium text-fg">Unsaved changes — save before leaving.</p>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <Modal onBackdropClick={() => setShowAddModal(false)} onEscape={() => setShowAddModal(false)} z="z-[9999]" className="max-w-[480px]">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[15px] font-semibold text-fg">Add achievement</h2>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <Field label="Title" value={modalTitle} onChange={setModalTitle} placeholder="e.g. Winner at GDG In Campus" />
            <label className="flex flex-col">
              <span className="field-label">Description</span>
              <textarea
                value={modalDesc}
                onChange={(e) => setModalDesc(e.target.value)}
                placeholder="Describe your achievement…"
                rows={4}
                className="field resize-none leading-[1.6]"
              />
            </label>
            <label className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-white/15 px-4 py-3.5 text-[13px] text-fg-muted transition-colors hover:border-line-accent hover:text-fg">
              <FileText size={15} />
              <span className="truncate">{certificateFile ? certificateFile.name : "Attach certificate (PDF, optional)"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setCertificateFile(e.target.files[0])}
              />
            </label>
            <div className="flex gap-2.5 pt-1">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSaveNewAchievement} className="btn-primary flex-1">
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const Section = ({ title, action, children }) => (
  <Reveal className="surface flex flex-col gap-4 p-5 sm:p-6">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-fg">{title}</h2>
      {action}
    </div>
    {children}
  </Reveal>
);

const SkillSuggestions = ({ title, skills, onAdd }) => (
  <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-white/[0.02] p-4">
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">{title}</span>
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <button
          key={skill}
          onClick={() => onAdd(skill)}
          className="rounded-full px-2.5 py-1 text-[11.5px] text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-[background-color,color,box-shadow] duration-200 hover:bg-accent/10 hover:text-indigo-100 hover:shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)]"
        >
          + {skill}
        </button>
      ))}
    </div>
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="flex flex-col">
    <span className="field-label">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="field"
    />
  </label>
);
