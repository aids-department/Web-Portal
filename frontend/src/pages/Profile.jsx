import React, { useEffect, useState } from "react";
import { Mail, Award, Code, Edit, Hash, Cake, Save, Github, Link, FileText } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useRef } from "react";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";

export default function Profile() {
  const { userId: paramUserId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownToast = useRef(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = user?.id;
  const userId = paramUserId || loggedInUserId;

  useEffect(() => {
    if (location.state?.profileSaved) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!paramUserId && !loggedInUserId) {
      window.location.href = "/login";
      return;
    }

    // Reset state on route change
    setProfile(null);
    setLoading(true);
    hasShownToast.current = false;

    fetch(`https://web-portal-760h.onrender.com/api/profile/${userId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data && paramUserId) {
          if (!hasShownToast.current) {
            toast.error("Profile not found");
            hasShownToast.current = true;
          }
          setProfile(null);
          return;
        }

        setProfile(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetch(`https://web-portal-760h.onrender.com/api/achievements/user/${userId}`)
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error(err));

    fetch(`https://web-portal-760h.onrender.com/api/posts`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setPostsCount(0);
          return;
        }

        const userPosts = data.filter(
          post => post.author?._id === userId || post.author?.id === userId
        );

        setPostsCount(userPosts.length);
      })
      .catch(err => console.error(err));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center h-full py-20">
      <div className="text-body text-ds-ink-soft">Loading profile…</div>
    </div>
  );


  if (!loading && !profile && paramUserId) {
    return (
      <div className="text-center mt-20 text-body text-ds-ink-soft">
        Profile not found
      </div>
    );
  }

  const displayName = profile?.name || user?.username || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const hasSocialLinks = profile?.socialLinks && (profile.socialLinks.github || profile.socialLinks.leetcode || profile.socialLinks.linkedin);

  return (
    <div>
      {/* Profile hero */}
      <div className="bg-navy -mx-gutter-mobile sm:-mx-gutter px-gutter-mobile sm:px-gutter py-10 grid grid-cols-1 md:grid-cols-[150px_1fr_auto] gap-7 items-start">
        <Avatar src={profile?.profileImage?.url} initials={initials} size={150} className="text-figure" />
        <div className="flex flex-col gap-2.5">
          <span className="text-kicker tracking-kicker uppercase text-ds-red">{profile?.year || "Student"}</span>
          <h1 className="text-page-heading text-white">{displayName}</h1>
          <div className="flex flex-wrap gap-4 mt-1">
            <span className="flex items-center gap-2 text-label text-on-navy">
              <Mail size={14} /> {user?.email || "No email"}
            </span>
            <span className="flex items-center gap-2 text-label text-on-navy">
              <Hash size={14} /> {profile?.registerNumber || "Not provided"}
            </span>
            <span className="flex items-center gap-2 text-label text-on-navy">
              <Cake size={14} /> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
            </span>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate("/edit-profile")}>
          <Edit size={15} /> Edit profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] -mx-gutter-mobile sm:-mx-gutter">
        {/* Main column */}
        <div className="lg:border-r border-ds-edge px-gutter-mobile sm:px-gutter py-9 flex flex-col gap-9">
          <section className="flex flex-col gap-3">
            <h2 className="text-section-heading text-navy border-b-2 border-navy pb-2.5">About</h2>
            <p className="text-body text-ds-ink">
              {profile?.bio || "No bio added yet. Edit your profile to add one."}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-section-heading text-navy border-b-2 border-navy pb-2.5 flex items-center gap-2">
              <Code size={18} /> Skills
            </h2>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1.5 border border-ds-edge text-label text-ds-ink">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-body text-ds-ink-faint">No skills added yet.</p>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-section-heading text-navy border-b-2 border-navy pb-2.5 flex items-center gap-2">
              <Award size={18} /> Achievements
            </h2>
            {achievements.length === 0 ? (
              <p className="text-body text-ds-ink-faint">No achievements yet.</p>
            ) : (
              <div className="flex flex-col">
                {achievements.map((a, i) => (
                  <div key={i} className="grid grid-cols-1 gap-1.5 py-3.5 border-b border-ds-row">
                    <h4 className="text-card-title text-navy">{a.title}</h4>
                    <p className="text-body text-ds-ink-soft">{a.description}</p>
                    {a.certificate?.url && (
                      <a
                        href={a.certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label font-medium text-ds-red mt-1"
                      >
                        View certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="px-gutter-mobile sm:px-gutter py-9 bg-ds-ground flex flex-col gap-7">
          <div className="border border-ds-edge bg-white p-5 flex flex-col gap-3">
            <span className="text-kicker tracking-kicker uppercase text-ds-red flex items-center gap-2">
              <FileText size={14} /> Résumé
            </span>
            {profile?.resume?.url ? (
              <>
                <p className="text-label font-medium text-navy">{profile.resume.filename || "Resume.pdf"}</p>
                <a href={profile.resume.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="navy" className="w-full justify-center">View résumé</Button>
                </a>
              </>
            ) : (
              <p className="text-label text-ds-ink-faint">No résumé uploaded yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-label font-medium tracking-label uppercase text-navy">Links</span>
            {hasSocialLinks ? (
              <>
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between border-t border-ds-edge pt-2.5 text-label">
                    <span className="flex items-center gap-2 font-medium text-navy"><Github size={14} /> GitHub</span>
                  </a>
                )}
                {profile.socialLinks.leetcode && (
                  <a href={profile.socialLinks.leetcode} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between border-t border-ds-edge pt-2.5 text-label">
                    <span className="flex items-center gap-2 font-medium text-navy"><Code size={14} /> LeetCode</span>
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between border-t border-ds-edge pt-2.5 text-label">
                    <span className="flex items-center gap-2 font-medium text-navy"><Link size={14} /> LinkedIn</span>
                  </a>
                )}
              </>
            ) : (
              <p className="text-label text-ds-ink-faint">No links added yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-label font-medium tracking-label uppercase text-navy">Activity</span>
            <div className="flex justify-between border-t border-ds-edge pt-2.5">
              <span className="text-body text-ds-ink-soft">Achievements</span>
              <span className="text-label font-medium text-navy tabular-nums">{achievements.length}</span>
            </div>
            <div className="flex justify-between border-t border-ds-edge pt-2.5">
              <span className="text-body text-ds-ink-soft">Skills</span>
              <span className="text-label font-medium text-navy tabular-nums">{profile?.skills?.length || 0}</span>
            </div>
            <div className="flex justify-between border-t border-ds-edge pt-2.5">
              <span className="text-body text-ds-ink-soft">Posts</span>
              <span className="text-label font-medium text-navy tabular-nums">{postsCount}</span>
            </div>
          </div>
        </aside>
      </div>

      {showSavedToast && (
        <div className="fixed top-4 right-4 bg-navy text-white px-6 py-4 border-t-2 border-ds-red flex items-center gap-3 z-[9999]">
          <Save className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-label font-semibold">Profile saved</p>
            <p className="text-label text-on-navy-muted">Your changes have been saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
