import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Award, Upload, X, Plus, Edit2, Trash2, Save, AlertCircle } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Edit Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600">Update your information and showcase your achievements</p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-white/50">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg overflow-hidden">
                {profileImage?.url ? (
                  <img src={profileImage.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase() || <User className="w-12 h-12" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                <Upload className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
            </div>
            <div className="flex-1 w-full">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
              />
              <select
                id="year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              <input
                id="dob"
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="Date of Birth"
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
              />
              <input
                id="registerNumber"
                name="registerNumber"
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="Register Number"
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
              />
              <input
                id="email"
                name="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed outline-none text-sm md:text-base"
              />
            </div>
            {imageFile && (
              <button onClick={handleImageUpload} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm md:text-base">
                Upload Image
              </button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">About</h2>
          </div>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio about yourself..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm md:text-base"
          />
        </div>

        {/* Social Links Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Social Links</h2>
          </div>
          <div className="space-y-3">
            <input
              id="github"
              name="github"
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="GitHub Profile URL (e.g., https://github.com/username)"
              className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
            />
            <input
              id="leetcode"
              name="leetcode"
              type="url"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
              placeholder="LeetCode Profile URL (e.g., https://leetcode.com/username)"
              className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
            />
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="LinkedIn Profile URL (e.g., https://linkedin.com/in/username)"
              className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Skills</h2>
          </div>

          {/* AI Skills */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-700 mb-2">AI & Data Science Skills:</p>
            <div className="flex flex-wrap gap-2">
              {aiSkills.filter(s => !skills.includes(s)).map((skill) => (
                <span
                  key={skill}
                  onClick={() => setSkills([...skills, skill])}
                  className="px-2 py-1 bg-white border border-blue-300 text-blue-700 rounded-full text-xs cursor-pointer hover:bg-blue-100 transition"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Web Skills */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs font-semibold text-purple-700 mb-2">Web Development Skills:</p>
            <div className="flex flex-wrap gap-2">
              {webSkills.filter(s => !skills.includes(s)).map((skill) => (
                <span
                  key={skill}
                  onClick={() => setSkills([...skills, skill])}
                  className="px-2 py-1 bg-white border border-purple-300 text-purple-700 rounded-full text-xs cursor-pointer hover:bg-purple-100 transition"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs md:text-sm flex items-center gap-2">
                {skill}
                <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => handleRemoveSkill(skill)} />
              </span>
            ))}
          </div>
          <input
            id="customSkill"
            name="customSkill"
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="Add a custom skill and press Enter..."
            className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
          />
        </div>

        {/* Achievements Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Achievements</h2>
            </div>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm md:text-base">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {achievements.filter((a) => !a.markedForDeletion).map((a, index) => (
              <div key={a._id || index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">{a.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    a.localStatus === "approved" ? "bg-green-100 text-green-700" :
                    a.localStatus === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {a.localStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 text-xs md:text-sm">{a.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditAchievement(index)} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs md:text-sm">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAchievement(index)} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs md:text-sm">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {achievements.filter((a) => !a.markedForDeletion).length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm md:text-base">No achievements yet. Click "Add" to create one!</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button onClick={() => handleNavigateWithCheck("/profile")} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm md:text-base">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm md:text-base">
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>

        {isProfileUpdated && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999] animate-bounce">
            <Save className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-base">Profile Saved!</p>
              <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
            </div>
          </div>
        )}

        {showUnsavedToast && (
          <div className="fixed top-4 right-4 bg-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999] animate-pulse">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-base">Unsaved Changes!</p>
              <p className="text-sm opacity-90">Please save your changes before leaving.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Add Achievement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Winner at GDG In Campus"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Describe your achievement..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate (PDF - optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 md:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm md:text-base">
                Cancel
              </button>
              <button onClick={handleSaveNewAchievement} className="flex-1 px-4 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm md:text-base">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
