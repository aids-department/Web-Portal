import React, { useEffect, useState } from "react";
import { Mail, Calendar, Award, Code, Edit, TrendingUp, MessageCircle, Hash, Cake, Save } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (location.state?.profileSaved) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setProfile(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}`)
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error(err));

    fetch(`https://web-portal-760h.onrender.com/api/posts`)
      .then(res => res.json())
      .then(data => {
        const userPosts = data.filter(post => post.author?._id === userId || post.author?.id === userId);
        setPostsCount(userPosts.length);
      })
      .catch(err => console.error(err));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-xl text-gray-600">Loading profile...</div>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-4 md:p-8 overflow-hidden min-h-[80vh]">
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shrink-0 overflow-hidden">
              {profile?.profileImage?.url ? (
                <img src={profile.profileImage.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {profile?.name || user?.username || "User"}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{profile?.year || "Student"}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Mail size={16} /> {user?.email || "No email"}
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Hash size={16} /> {profile?.registerNumber || "Not provided"}
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Cake size={16} /> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
            >
              <Edit size={18} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 text-center">
            <Award className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{achievements.length}</p>
            <p className="text-sm text-gray-600">Achievements</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{profile?.skills?.length || 0}</p>
            <p className="text-sm text-gray-600">Skills</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{postsCount}</p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bio Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
            <p className="text-gray-700 leading-relaxed">
              {profile?.bio || "No bio added yet. Click 'Edit Profile' to add your bio and tell others about yourself!"}
            </p>
          </div>

          {/* Skills Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code size={20} /> Skills
            </h3>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet. Add your skills to showcase your expertise!</p>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={20} /> Achievements
          </h3>
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">No achievements yet</p>
              <p className="text-sm text-gray-400">Add your achievements in Edit Profile to showcase your accomplishments!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((a, i) => (
                <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">{a.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                  {a.certificate?.url && (
                    <a
                      href={a.certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSavedToast && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999] animate-bounce">
          <Save className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">Profile Saved!</p>
            <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
