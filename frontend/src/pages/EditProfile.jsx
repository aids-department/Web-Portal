import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Award, Upload, X, Plus, Edit2, Trash2, Save, AlertCircle, FileText } from "lucide-react";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";
import Avatar from "../components/ui/Avatar";

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
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
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
    if (!userId) return;
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
      console.log('Submitting profile data:', profilePayload);

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

      const savedProfile = await res.json();
      console.log('Profile saved successfully:', savedProfile);

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

  const statusTagVariant = (status) =>
    status === "approved" ? "workshop" : status === "rejected" ? "question-paper" : "outline";

  return (
    <div>
      <div className="mb-8 pb-6 border-b-2 border-navy">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Account</span>
        <h1 className="text-page-heading text-navy mt-2.5">Edit profile</h1>
        <p className="text-body text-ds-ink-soft mt-2">Update your information and showcase your achievements.</p>
      </div>

      {/* Profile Picture Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar src={profileImage?.url} initials={name.charAt(0).toUpperCase() || "U"} size={96} className="text-section-heading" />
            <label className="absolute -bottom-1.5 -right-1.5 bg-navy text-white p-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
          </div>
          <div className="flex-1 w-full flex flex-col gap-3">
            <Field.Input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            <Field.Select
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select year</option>
              <option value="1st Year">1st year</option>
              <option value="2nd Year">2nd year</option>
              <option value="3rd Year">3rd year</option>
              <option value="4th Year">4th year</option>
            </Field.Select>
            <Field.Input
              id="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <Field.Input
              id="registerNumber"
              name="registerNumber"
              type="text"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              placeholder="Register number"
            />
            <Field.Input
              id="email"
              name="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-ds-ground cursor-not-allowed"
            />
          </div>
          {imageFile && (
            <Button variant="primary" onClick={handleImageUpload}>Upload image</Button>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <h2 className="text-card-title text-navy mb-4 flex items-center gap-2">
          <User size={16} /> About
        </h2>
        <Field.Textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself…"
          rows="4"
        />
      </div>

      {/* Social Links Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <h2 className="text-card-title text-navy mb-4 flex items-center gap-2">
          <Briefcase size={16} /> Social links
        </h2>
        <div className="flex flex-col gap-3">
          <Field.Input
            id="github"
            name="github"
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub profile URL"
          />
          <Field.Input
            id="leetcode"
            name="leetcode"
            type="url"
            value={leetcode}
            onChange={(e) => setLeetcode(e.target.value)}
            placeholder="LeetCode profile URL"
          />
          <Field.Input
            id="linkedin"
            name="linkedin"
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="LinkedIn profile URL"
          />
        </div>
      </div>

      {/* Resume Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <h2 className="text-card-title text-navy mb-4 flex items-center gap-2">
          <Upload size={16} /> Résumé
        </h2>
        {resume?.url ? (
          <div className="flex items-center gap-3 p-3 bg-ds-ground border border-ds-edge">
            <FileText className="w-5 h-5 text-ds-blue shrink-0" />
            <div className="flex-1">
              <p className="text-label font-medium text-navy">{resume.filename || "Resume"}</p>
              <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-label text-ds-blue">
                View résumé
              </a>
            </div>
            <button onClick={() => setResume(null)} className="text-ds-ink-faint hover:text-ds-red p-1" title="Remove resume">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-ds-edge p-6 text-center">
            <Upload className="w-7 h-7 mx-auto text-ds-ink-faint mb-2" />
            <p className="text-body text-ds-ink-soft mb-3">Upload your résumé (PDF format)</p>
            <label className="inline-block">
              <span className="inline-flex items-center px-4 py-2.5 bg-navy text-white text-label font-medium cursor-pointer">
                Choose file
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleResumeUpload(file);
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <h2 className="text-card-title text-navy mb-4 flex items-center gap-2">
          <Briefcase size={16} /> Skills
        </h2>

        {/* AI Skills */}
        <div className="mb-4 p-3 bg-ds-blue-tint">
          <p className="text-kicker tracking-kicker uppercase text-ds-blue mb-2">AI &amp; data science skills</p>
          <div className="flex flex-wrap gap-2">
            {aiSkills.filter(s => !skills.includes(s)).map((skill) => (
              <span
                key={skill}
                onClick={() => setSkills([...skills, skill])}
                className="px-2 py-1 bg-white border border-ds-blue text-ds-blue text-label cursor-pointer hover:bg-ds-blue-tint"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Web Skills */}
        <div className="mb-4 p-3 bg-ds-ground">
          <p className="text-kicker tracking-kicker uppercase text-ds-ink-soft mb-2">Web development skills</p>
          <div className="flex flex-wrap gap-2">
            {webSkills.filter(s => !skills.includes(s)).map((skill) => (
              <span
                key={skill}
                onClick={() => setSkills([...skills, skill])}
                className="px-2 py-1 bg-white border border-ds-edge text-ds-ink-soft text-label cursor-pointer hover:bg-ds-ground"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1.5 bg-navy text-white text-label flex items-center gap-2">
              {skill}
              <X className="w-3 h-3 cursor-pointer hover:text-ds-red-tint" onClick={() => handleRemoveSkill(skill)} />
            </span>
          ))}
        </div>
        <Field.Input
          id="customSkill"
          name="customSkill"
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Add a custom skill and press Enter…"
        />
      </div>

      {/* Achievements Section */}
      <div className="border border-ds-edge p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-navy flex items-center gap-2">
            <Award size={16} /> Achievements
          </h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {achievements.filter((a) => !a.markedForDeletion).map((a, index) => (
            <div key={a._id || index} className="border-l-3 border-navy bg-ds-ground p-4">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="text-card-title text-navy">{a.title}</h3>
                <Tag variant={statusTagVariant(a.localStatus)}>{a.localStatus}</Tag>
              </div>
              <p className="text-body text-ds-ink-soft mb-3">{a.description}</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEditAchievement(index)}>
                  <Edit2 size={13} /> Edit
                </Button>
                <Button variant="quiet" onClick={() => handleDeleteAchievement(index)}>
                  <Trash2 size={13} /> Delete
                </Button>
              </div>
            </div>
          ))}
          {achievements.filter((a) => !a.markedForDeletion).length === 0 && (
            <p className="text-center text-body text-ds-ink-faint py-8">No achievements yet. Click "Add" to create one.</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1 justify-center" onClick={() => handleNavigateWithCheck("/profile")}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1 justify-center" onClick={handleSubmit}>
          <Save size={16} /> Save profile
        </Button>
      </div>

      {isProfileUpdated && (
        <div className="fixed top-4 right-4 bg-navy text-white px-6 py-4 border-t-2 border-ds-blue flex items-center gap-3 z-[9999]">
          <Save className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-label font-semibold">Profile saved</p>
            <p className="text-label text-on-navy-muted">Your changes have been saved successfully.</p>
          </div>
        </div>
      )}

      {showUnsavedToast && (
        <div className="fixed top-4 right-4 bg-ds-red text-white px-6 py-4 border-t-2 border-ds-red-deep flex items-center gap-3 z-[9999]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-label font-semibold">Unsaved changes</p>
            <p className="text-label text-white/80">Please save your changes before leaving.</p>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white border-2 border-navy w-full max-w-lg p-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-section-heading text-navy mb-6">Add achievement</h3>
            <div className="flex flex-col gap-4">
              <div>
                <Field.Label>Title</Field.Label>
                <Field.Input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Winner at GDG In Campus"
                />
              </div>
              <div>
                <Field.Label>Description</Field.Label>
                <Field.Textarea
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Describe your achievement…"
                  rows="4"
                />
              </div>
              <div>
                <Field.Label>Certificate (PDF, optional)</Field.Label>
                <Field.Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                />
              </div>
            </div>
            <div className="flex gap-2.5 mt-6">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={handleSaveNewAchievement}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
