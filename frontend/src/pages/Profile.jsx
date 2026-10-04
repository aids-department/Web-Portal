import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, PencilLine, ArrowUpRight, FileText, Download, CheckCircle2, UserRound } from "lucide-react";
import SpotlightCard from "../components/ui/SpotlightCard";
import { LoadingState, EmptyState } from "../components/ui/States";
import { Stagger, StaggerItem } from "../components/ui/Reveal";
import { EASE } from "../components/ui/motion";

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
      <div className="container-ln">
        <LoadingState label="Loading profile" />
      </div>
    );
  }

  if (!loading && !profile && paramUserId) {
    return (
      <div className="container-ln py-16">
        <EmptyState icon={UserRound} title="Profile not found." />
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

  const stats = [
    { label: "Posts", value: postsCount },
    { label: "Achievements", value: achievements.length },
    { label: "Skills listed", value: profile?.skills?.length || 0 },
  ];

  return (
    <div className="container-ln pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative mt-10 sm:mt-14"
      >
        <div className="surface edge-highlight relative overflow-hidden">
          {/* banner */}
          <div aria-hidden="true" className="h-28 bg-[radial-gradient(ellipse_at_top_left,rgba(94,106,210,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.18),transparent_60%)] sm:h-36">
            <div className="h-full w-full bg-grid opacity-[0.05]" />
          </div>
          <div className="grid grid-cols-1 items-end gap-6 px-6 pb-6 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:px-8 sm:pb-8">
            <div className="relative -mt-16 h-[120px] w-[120px] sm:-mt-20 sm:h-[150px] sm:w-[150px]">
              <div aria-hidden="true" className="absolute -inset-2 rounded-3xl bg-accent/30 blur-xl" />
              <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-2xl border border-white/15 bg-canvas-elevated shadow-card">
                {profile?.profileImage?.url ? (
                  <img src={profile.profileImage.url} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[34px] font-semibold text-gradient">{initials}</span>
                )}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
                <span className="text-gradient">{displayName}</span>
              </h1>
              <span className="flex items-center gap-1.5 text-[14px] text-fg-muted">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                {user?.email || "No email"}
              </span>
            </div>
            {isOwnProfile && (
              <div className="flex min-w-[130px] flex-col items-start gap-2.5 sm:items-end">
                <button onClick={() => navigate("/edit-profile")} className="btn-primary">
                  <PencilLine className="h-4 w-4" />
                  Edit profile
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Body */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,340px)]">
        <Stagger className="flex min-w-0 flex-col gap-6">
          <StaggerItem className="surface flex flex-col gap-4 p-6">
            <h2 className="eyebrow border-b border-line pb-3">About</h2>
            <p className="max-w-[78ch] text-[15px] leading-[1.75] text-fg/85">
              {profile?.bio || "No bio added yet."}
            </p>
          </StaggerItem>

          <StaggerItem className="surface flex flex-col gap-4 p-6">
            <h2 className="eyebrow border-b border-line pb-3">Skills</h2>
            {profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="pill-neutral px-3 py-1 text-[12.5px] text-fg/85">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-fg-muted">No skills added yet.</p>
            )}
          </StaggerItem>

          <StaggerItem className="surface flex flex-col gap-2 p-6">
            <h2 className="eyebrow border-b border-line pb-3">Achievements</h2>
            {achievements.length === 0 ? (
              <p className="pt-2 text-[13px] text-fg-muted">No achievements yet.</p>
            ) : (
              <ol className="relative m-0 list-none p-0">
                {achievements.map((a, i) => (
                  <li key={i} className="grid grid-cols-1 gap-2 border-b border-line py-4 last:border-b-0 sm:grid-cols-[110px_1fr] sm:gap-5">
                    {a.createdAt && (
                      <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-fg-muted">
                        {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-semibold tracking-tight text-fg">{a.title}</span>
                      <span className="text-[13.5px] leading-[1.6] text-fg-muted">{a.description}</span>
                      {a.certificate?.url && (
                        <a
                          href={a.certificate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex w-fit items-center gap-1 text-[12.5px] font-medium text-accent-bright hover:text-indigo-300"
                        >
                          View certificate
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </StaggerItem>
        </Stagger>

        <Stagger as="aside" className="flex min-w-[250px] flex-col gap-4">
          <StaggerItem>
            <SpotlightCard variant="gradient">
              <div className="flex flex-col gap-4 p-5">
                <span className="eyebrow-accent">Résumé</span>
                {profile?.resume?.url ? (
                  <>
                    <div className="flex items-center gap-3.5">
                      <div className="icon-tile h-[60px] w-[48px] shrink-0 rounded-lg">
                        <FileText className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="truncate text-[13.5px] font-medium text-fg">
                          {profile.resume.filename || "Resume.pdf"}
                        </span>
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-fg-muted">PDF</span>
                      </div>
                    </div>
                    <a
                      href={profile.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </>
                ) : (
                  <p className="text-[13px] text-fg-muted">No resume uploaded yet.</p>
                )}
              </div>
            </SpotlightCard>
          </StaggerItem>

          <StaggerItem className="surface flex flex-col gap-1 p-5">
            <span className="eyebrow mb-2">Links</span>
            {links.length > 0 ? (
              links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2.5 rounded-lg px-2 py-2.5 -mx-2 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="text-[13.5px] font-medium text-fg">{l.label}</span>
                  <span className="flex items-center gap-1 text-[12.5px] text-fg-muted group-hover:text-fg">
                    Visit
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))
            ) : (
              <p className="text-[13px] text-fg-muted">No links added yet.</p>
            )}
          </StaggerItem>

          <StaggerItem className="surface flex flex-col gap-3 p-5">
            <span className="eyebrow">Activity</span>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 rounded-xl border border-line bg-white/[0.03] px-3 py-3">
                  <span className="text-xl font-semibold tabular-nums text-fg">{s.value}</span>
                  <span className="text-[11px] leading-tight text-fg-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      {showSavedToast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed right-4 top-20 z-[9999] flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-canvas-elevated/95 px-4 py-3 shadow-popover backdrop-blur-xl"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-[13px] font-medium text-fg">Profile saved.</span>
        </motion.div>
      )}
    </div>
  );
}
