import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
  const isOwnProfile = !paramUserId || paramUserId === loggedInUserId;

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
        const postsList = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : [];
        const userPosts = postsList.filter(
          post => post.author?._id === userId || post.author?.id === userId
        );
        setPostsCount(userPosts.length);
      })
      .catch(err => {
        console.error(err);
        setPostsCount(0);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading profile…</p>
      </div>
    );
  }

  if (!loading && !profile && paramUserId) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft text-[14px]">Profile not found.</p>
      </div>
    );
  }

  const displayName = profile?.name || user?.username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const kicker = [profile?.year, profile?.registerNumber ? `Roll ${profile.registerNumber}` : null]
    .filter(Boolean)
    .join(' · ');

  const links = [
    profile?.socialLinks?.github && { label: 'GitHub', href: profile.socialLinks.github },
    profile?.socialLinks?.leetcode && { label: 'LeetCode', href: profile.socialLinks.leetcode },
    profile?.socialLinks?.linkedin && { label: 'LinkedIn', href: profile.socialLinks.linkedin },
  ].filter(Boolean);

  return (
    <div className="font-brand">
      {/* Hero */}
      <div className="bg-brand-navy px-5 sm:px-8 lg:px-12 py-7 sm:py-8 lg:py-10 grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)_auto] gap-7 items-start">
        <div className="h-[150px] w-[150px] bg-brand-blue border border-[#3d5077] grid place-items-center overflow-hidden">
          {profile?.profileImage?.url ? (
            <img src={profile.profileImage.url} alt={displayName} className="w-full h-full object-cover grayscale" />
          ) : (
            <span className="text-[34px] font-semibold text-[#a8b6cc]">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex flex-col gap-2.5">
          {kicker && (
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-brand-red">
              {kicker}
            </span>
          )}
          <h1 className="m-0 text-[30px] sm:text-[36px] lg:text-[40px] leading-[1.05] font-semibold tracking-[-0.02em] text-white">
            {displayName}
          </h1>
          <span className="text-[13.5px] text-brand-on-navy">{user?.email || "No email"}</span>
        </div>
        {isOwnProfile && (
          <div className="flex flex-col gap-2.5 items-start min-w-[130px]">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-2.5 bg-brand-red text-white text-[12px] font-semibold"
            >
              Edit profile
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(240px,340px)]">
        <div className="min-w-0 lg:border-r border-brand-edge px-5 sm:px-8 lg:px-10 py-7 sm:py-8 lg:py-9 flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-semibold text-brand-navy border-b-2 border-brand-navy pb-2.5">About</h2>
            <p className="m-0 max-w-[78ch] text-[14.5px] leading-[1.75] text-[#3a3838]">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <h2 className="m-0 text-[20px] font-semibold text-brand-navy border-b-2 border-brand-navy pb-2.5">Skills</h2>
            {profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-[7px] border border-brand-ink-faint text-[12.5px] text-[#3a3838]">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[13px] text-brand-ink-soft">No skills added yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-3.5">
            <h2 className="m-0 text-[20px] font-semibold text-brand-navy border-b-2 border-brand-navy pb-2.5">Achievements</h2>
            {achievements.length === 0 ? (
              <p className="m-0 text-[13px] text-brand-ink-soft">No achievements yet.</p>
            ) : (
              achievements.map((a, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-3 sm:gap-5 py-3.5 border-b border-brand-row">
                  {a.createdAt && (
                    <span className="text-[12px] font-medium text-brand-ink-soft tabular-nums">
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold text-brand-navy">{a.title}</span>
                    <span className="text-[13px] leading-[1.6] text-brand-ink-soft">{a.description}</span>
                    {a.certificate?.url && (
                      <a
                        href={a.certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-medium text-brand-blue"
                      >
                        View certificate
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="px-5 sm:px-8 lg:px-7 py-7 sm:py-8 lg:py-9 bg-brand-ground flex flex-col gap-6 min-w-[250px]">
          <div className="border border-brand-edge bg-white p-5 flex flex-col gap-3">
            <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brand-red">Résumé</span>
            {profile?.resume?.url ? (
              <>
                <div className="flex gap-3.5 items-center">
                  <div className="w-[52px] h-[66px] shrink-0 bg-brand-blue-tint border border-[#c3cfe3] grid place-items-center text-[8.5px] font-medium text-[#5f6e88]">
                    PDF
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[13px] font-medium text-brand-navy truncate">
                      {profile.resume.filename || "Resume.pdf"}
                    </span>
                  </div>
                </div>
                <a
                  href={profile.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-brand-navy text-white text-[11.5px] font-semibold text-center"
                >
                  Download
                </a>
              </>
            ) : (
              <p className="m-0 text-[12.5px] text-brand-ink-soft">No resume uploaded yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-brand-navy">Links</span>
            {links.length > 0 ? (
              links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between gap-2.5 border-t border-brand-edge pt-2.5"
                >
                  <span className="text-[13px] font-medium text-brand-navy">{l.label}</span>
                  <span className="text-[12px] text-brand-blue">Visit</span>
                </a>
              ))
            ) : (
              <p className="m-0 text-[12.5px] text-brand-ink-soft">No links added yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-brand-navy">Activity</span>
            <div className="flex justify-between border-t border-brand-edge pt-2.5">
              <span className="text-[13px] text-brand-ink-soft">Posts</span>
              <span className="text-[13px] font-medium text-brand-navy tabular-nums">{postsCount}</span>
            </div>
            <div className="flex justify-between border-t border-brand-edge pt-2.5">
              <span className="text-[13px] text-brand-ink-soft">Achievements</span>
              <span className="text-[13px] font-medium text-brand-navy tabular-nums">{achievements.length}</span>
            </div>
            <div className="flex justify-between border-t border-brand-edge pt-2.5">
              <span className="text-[13px] text-brand-ink-soft">Skills listed</span>
              <span className="text-[13px] font-medium text-brand-navy tabular-nums">{profile?.skills?.length || 0}</span>
            </div>
          </div>
        </aside>
      </div>

      {showSavedToast && (
        <div className="fixed top-4 right-4 bg-brand-navy text-white px-5 py-3.5 z-[9999] flex items-center gap-2">
          <span className="text-[13px] font-semibold">Profile saved.</span>
        </div>
      )}
    </div>
  );
}
