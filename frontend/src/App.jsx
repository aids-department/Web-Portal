import axios from "axios";
import { format } from "date-fns";

import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroCanvas from "./components/HeroCanvas";
import BrickBreakerGame from "./components/BrickBreakerGame";
import AmbientBackground from "./components/ui/AmbientBackground";
import SpotlightCard from "./components/ui/SpotlightCard";
import { Reveal, Stagger, StaggerItem } from "./components/ui/Reveal";
import { EASE } from "./components/ui/motion";
import { EmptyState } from "./components/ui/States";
import { ArrowRight, ArrowUpRight, Building2, CalendarDays, Trophy, Award, GraduationCap, MessagesSquare, UserRound, Construction, Megaphone } from "lucide-react";
import projectExpoImg from "./assets/project_expo.jpeg";

// Pages from App 1
import Codenigma from "./pages/Codenigma";
import Genesys from "./pages/Genesys";
import FacultyInfo from "./pages/FacultyInfo";
import Syllabus from "./pages/Syllabus";
import StaffInfo from "./pages/StaffInfo";
import Alumni from "./pages/Alumni";

// Pages from App 2
import EventsPage from "./pages/EventsPage";
import PostsPage from "./pages/PostsPage";
import AssociationMembers from "./pages/AssociationMembers";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EventsAdminPage from "./components/EventsAdminPage";
import AdminDashboard from "./components/AdminDashboard";
import ProfessionalAdminLayout from "./components/ProfessionalAdminLayout";
import ManageUploads from "./components/ManageUploads";
import ManageContent from "./components/ManageContent";
import UpdateContent from "./components/ManageContentupdates.jsx";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminLeaderboards from "./pages/AdminLeaderboards";
import TeamInfo from "./pages/TeamInfo";
import { Toaster } from "react-hot-toast";
import UserLeaderboards from "./pages/UserLeaderboards";
import AdminAchievements from "./pages/AdminAchievements";
import UserAchievements from "./pages/UserAchievements";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PostDetailPage from './pages/PostDetailPage';


// ScrollNumber Component
const ScrollNumber = ({ target, suffix = "", duration = 1000 }) => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const numTarget = parseInt(target.replace(/[^\d]/g, '')) || 0;
    const steps = duration / 50;
    const increment = numTarget / steps;
    let currentValue = 0;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numTarget) {
        setCurrent(numTarget);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(currentValue));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{isAnimating ? current : target}{suffix}</span>;
};

// ============================================
// DASHBOARD PAGE COMPONENT (From App 1)
// ============================================
const DASHBOARD_STATS = [
  { label: "Ongoing Projects", value: "50+", num: "50" },
  { label: "Faculty Members", value: "12", num: "12" },
  { label: "Active Students", value: "300+", num: "300" },
  { label: "Research Lab", value: "1", num: "1" },
];

function DashboardPage() {
    const [updates, setUpdates] = useState([]);
    // Fetch updates from the dedicated MongoDB server on port 5001
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await axios.get("https://web-portal-760h.onrender.com/api/updates");
                setUpdates(res.data);
            } catch (err) {
                console.error("Failed to fetch updates:", err);
            }
        };
        fetchUpdates();
    }, []);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Hero parallax: content fades, shrinks and drifts down over the first half of the scroll
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    // `span` drives the asymmetric bento layout on desktop (6-column grid)
    const tiles = [
        { label: "Events", body: "Workshops, talks and contests with a marked calendar.", to: "/events", icon: CalendarDays, image: "/images/events/devfest.jpeg", span: "lg:col-span-4 lg:row-span-2" },
        { label: "About", body: "Faculty, staff and the full syllabus by semester.", to: "/about/faculty", icon: Building2, span: "lg:col-span-2" },
        { label: "Leaderboard", body: "Coding contest standings and rankings.", to: "/leaderboards", icon: Trophy, span: "lg:col-span-2" },
        { label: "Achievements", body: "A gallery of what students have won and built.", to: "/achievements", icon: Award, image: projectExpoImg, span: "lg:col-span-2 lg:row-span-2" },
        { label: "Alumni", body: "Browse the alumni directory.", to: "/alumni", icon: GraduationCap, span: "lg:col-span-2" },
        { label: "Posts", body: "Open discussion and forum for students.", to: "/posts", icon: MessagesSquare, span: "lg:col-span-2" },
        { label: "Your profile", body: "Skills, links and achievements.", to: user ? "/profile" : "/login", icon: UserRound, span: "md:col-span-2 lg:col-span-4" },
    ];

    return (
        <div>
            {/* HERO */}
            <section ref={heroRef} className="relative overflow-hidden">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                    className="container-ln grid items-center gap-12 pb-20 pt-16 sm:pt-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24"
                >
                    <div className="flex flex-col gap-7">
                        <motion.span
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="pill w-fit py-1 pl-1.5 pr-3 text-[12px]"
                        >
                            <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">UG · PG</span>
                            Undergraduate and postgraduate
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
                            className="h-display max-w-[14ch] lg:text-[5.25rem] xl:text-8xl"
                        >
                            <span className="text-gradient">Artificial Intelligence and </span>
                            <span className="text-shimmer">Data Science</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
                            className="max-w-[52ch] text-base leading-relaxed text-fg-muted sm:text-lg xl:text-xl"
                        >
                            Our mission is to foster innovation and excellence in Artificial Intelligence and Data
                            Science through cutting-edge research, industry collaboration, and a dynamic learning
                            environment.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link to="/about/syllabus" className="btn-primary btn-lg">
                                Explore the programme
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link to="/events" className="btn-secondary btn-lg">
                                Upcoming events
                            </Link>
                        </motion.div>

                        <Stagger className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {DASHBOARD_STATS.map((s) => (
                                <StaggerItem key={s.label} className="surface-glass edge-highlight px-4 py-3.5">
                                    <div className="text-2xl font-semibold tracking-tight text-fg tabular-nums">
                                        <ScrollNumber target={s.num} suffix={s.value.includes("+") ? "+" : ""} />
                                    </div>
                                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted">
                                        {s.label}
                                    </div>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>

                    {/* Mock "application window" framing the interactive canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                        className="relative"
                    >
                        <div aria-hidden="true" className="absolute -inset-10 rounded-[40px] bg-accent/20 blur-[80px]" />
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-canvas-elevated/80 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.6),0_0_120px_rgba(94,106,210,0.15)] backdrop-blur-xl">
                            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                <span className="ml-3 font-mono text-[10.5px] tracking-wider text-fg-muted">neural-field.canvas</span>
                                <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-bright">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
                                    Live
                                </span>
                            </div>
                            <div className="relative aspect-[620/470] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.10),transparent_70%)]">
                                <HeroCanvas />
                            </div>
                            <div className="flex flex-col gap-1 border-t border-line px-4 py-3">
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-bright">Interactive</span>
                                <span className="text-xs text-fg-muted">Move the cursor. Points settling from noise into structure.</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* RECENT UPDATES */}
            <section className="border-t border-line py-16 sm:py-24">
                <div className="container-ln">
                    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-3">
                            <span className="eyebrow-accent">Recent updates</span>
                            <h2 className="h-page text-3xl sm:text-4xl lg:text-5xl">
                                <span className="text-gradient">What is happening</span>
                            </h2>
                        </div>
                        <Link to="/posts" className="btn-ghost group">
                            All updates
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                    </Reveal>
                    {updates.length > 0 ? (
                        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {updates.map((u, i) => (
                                <StaggerItem key={u._id} className={i === 0 && updates.length > 2 ? "sm:col-span-2" : ""}>
                                    <SpotlightCard className="h-full" interactive>
                                        <div className="flex h-full flex-col gap-4 p-6">
                                            <span className="pill w-fit">
                                                <Megaphone className="h-3 w-3" />
                                                Update
                                            </span>
                                            <h3 className={`font-semibold leading-snug tracking-tight text-fg ${i === 0 && updates.length > 2 ? "text-xl sm:text-2xl" : "text-lg"}`}>
                                                {u.title}
                                            </h3>
                                            <span className="mt-auto border-t border-line pt-3 font-mono text-[11px] uppercase tracking-wider text-fg-muted">
                                                {format(new Date(u.createdAt), "dd MMM yyyy")}
                                            </span>
                                        </div>
                                    </SpotlightCard>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    ) : (
                        <EmptyState icon={Megaphone} title="No updates available at the moment." />
                    )}
                </div>
            </section>

            {/* WHERE TO GO */}
            <section className="border-t border-line py-16 sm:py-24">
                <div className="container-ln">
                    <Reveal className="mb-10 flex flex-col gap-3">
                        <span className="eyebrow-accent">Where to go</span>
                        <h2 className="h-page text-3xl sm:text-4xl lg:text-5xl">
                            <span className="text-gradient">The portal at a glance</span>
                        </h2>
                    </Reveal>
                    <Stagger as="ul" className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:auto-rows-[180px] lg:grid-cols-6">
                        {tiles.map((t) => {
                            const Icon = t.icon;
                            return (
                                <StaggerItem as="li" key={t.label} className={`min-h-[160px] ${t.span}`}>
                                    <SpotlightCard as={Link} to={t.to} interactive className="block h-full overflow-hidden">
                                        {t.image && (
                                            <>
                                                <img
                                                    src={t.image}
                                                    alt=""
                                                    loading="lazy"
                                                    className="absolute inset-0 h-full w-full object-cover opacity-40 transition-[transform,opacity] duration-500 ease-expo group-hover:scale-[1.03] group-hover:opacity-55"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/10" />
                                            </>
                                        )}
                                        <div className="relative flex h-full flex-col justify-between gap-6 p-6">
                                            <div className="flex items-start justify-between">
                                                <span className="icon-tile h-10 w-10">
                                                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                                                </span>
                                                <ArrowUpRight className="h-5 w-5 text-fg-muted transition-[transform,color] duration-200 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" strokeWidth={1.75} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`font-semibold tracking-tight text-fg ${t.image ? "text-2xl" : "text-lg"}`}>{t.label}</span>
                                                <span className="text-sm leading-relaxed text-fg-muted">{t.body}</span>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>
        </div>
    );
}
// ============================================
// PLACEHOLDER PAGES (From App 2)
// ============================================

function ComingSoon({ eyebrow, title, description, note }) {
  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-16">
      <Reveal className="flex flex-col gap-4 text-center">
        <span className="eyebrow-accent mx-auto">{eyebrow}</span>
        <h1 className="h-page"><span className="text-gradient">{title}</span></h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <SpotlightCard>
          <div className="flex items-center gap-3 border-b border-line px-6 py-4">
            <span className="icon-tile h-9 w-9">
              <Construction className="h-4 w-4 text-accent-bright" strokeWidth={1.75} />
            </span>
            <p className="text-sm text-fg-muted">{note}</p>
          </div>
          <div className="flex justify-center p-6">
            <BrickBreakerGame />
          </div>
        </SpotlightCard>
      </Reveal>
    </div>
  );
}

function ConnectPage() {
  return (
    <ComingSoon
      eyebrow="Under Development"
      title="Connect"
      description="We are working on dedicated tools to help students connect with peers, clubs, and mentors."
      note="Connect features are coming soon. Meanwhile, enjoy a quick game to pass the time:"
    />
  );
}

function ProjectsPage() {
  return (
    <ComingSoon
      eyebrow="Showcase"
      title="Projects"
      description="A dedicated repository of cutting-edge AI and Data Science student and faculty projects."
      note="The project showcase is launching soon. Meanwhile, enjoy a quick game to pass the time:"
    />
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children, fullBleed = false }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">
        {fullBleed ? (
          <div className="w-full h-full">{children}</div>
        ) : (
          <div className="container-ln py-8">{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "rgba(10,10,12,0.92)",
            color: "#EDEDEF",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 40px rgba(94,106,210,0.10)",
            backdropFilter: "blur(16px)",
          },
          success: { iconTheme: { primary: "#5E6AD2", secondary: "#EDEDEF" } },
          error: { iconTheme: { primary: "#F43F5E", secondary: "#EDEDEF" } },
        }}
      />
      <Routes>
        {/* 
          ============================================
          PUBLIC ROUTES - No Authentication Required
          ============================================
        */}
        
        {/* Login and Signup pages */}
        <Route
          path="/login"
          element={
            <MainLayout fullBleed={true}>
              <LoginPage />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout fullBleed={true}>
              <SignupPage />
            </MainLayout>
          }
        />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 
          ============================================
          ADMIN ROUTES - Separate Layout
          ============================================
        */}
        <Route
          path="/adminpage"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <AdminDashboard />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminpage/events"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <EventsAdminPage />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminpage/manage-uploads"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <ManageUploads />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminpage/manage-content"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <ManageContent />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
          <Route
              path="/adminpage/manage-content-updates"
              element={
                <AdminProtectedRoute>
                  <ProfessionalAdminLayout>
                      <UpdateContent />
                  </ProfessionalAdminLayout>
                </AdminProtectedRoute>
              }
          />
        <Route
          path="/adminpage/leaderboard"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <AdminLeaderboards />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminpage/achievements"
          element={
            <AdminProtectedRoute>
              <ProfessionalAdminLayout>
                <AdminAchievements />
              </ProfessionalAdminLayout>
            </AdminProtectedRoute>
          }
        />
        {/* 
          ============================================
          MAIN APPLICATION ROUTES
          All pages wrapped in MainLayout with Navbar/Footer
          ============================================
        */}

        <Route
          path="/profile"
          element={
            <MainLayout fullBleed={true}>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <MainLayout fullBleed={true}>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <MainLayout fullBleed={true}>
                <EditProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        
        {/* Dashboard/Home - PUBLIC */}
        <Route
          path="/"
          element={
            <MainLayout fullBleed={true}>
              <DashboardPage />
            </MainLayout>
          }
        />

        {/* Leaderboards - PUBLIC */}
        <Route
          path="/leaderboards"
          element={
            <MainLayout fullBleed={true}>
              <UserLeaderboards />
            </MainLayout>
          }
        />


        {/* Events Section */}
        <Route
          path="/events"
          element={
            <MainLayout fullBleed={true}>
              <EventsPage />
            </MainLayout>
          }
        />
        <Route path="/events/codenigma" element={<Navigate to="/leaderboards" replace />} />
        <Route path="/events/genesys" element={<Navigate to="/leaderboards" replace />} />

        {/* About Section (Faculty, Staff, Syllabus) */}
        <Route
          path="/about/faculty"
          element={
            <MainLayout fullBleed={true}>
              <FacultyInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/staff"
          element={
            <MainLayout fullBleed={true}>
              <StaffInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/syllabus"
          element={
            <MainLayout fullBleed={true}>
              <Syllabus />
            </MainLayout>
          }
        />

        {/* Alumni - PUBLIC */}
        <Route
          path="/alumni"
          element={
            <MainLayout fullBleed={true}>
              <Alumni />
            </MainLayout>
          }
        />

        {/* Achievements - PUBLIC */}
        <Route
          path="/achievements"
          element={
            <MainLayout fullBleed={true}>
              <UserAchievements />
            </MainLayout>
          }
        />

        {/* Connect - PUBLIC */}
        <Route
          path="/connect"
          element={
            <MainLayout>
              <ConnectPage />
            </MainLayout>
          }
        />

        {/* Projects - PUBLIC */}
        <Route
          path="/projects"
          element={
            <MainLayout>
              <ProjectsPage />
            </MainLayout>
          }
        />

        {/* External Team Info (embedded) */}
        <Route
          path="/team-info"
          element={
            <MainLayout fullBleed={true}>
              <TeamInfo />
            </MainLayout>
          }
        />
        <Route
          path="/team"
          element={<Navigate to="/team-info" replace />}
        />
        <Route
          path="/about/team"
          element={<Navigate to="/team-info" replace />}
        />
        
        {/* Association Members - PUBLIC */}
        <Route
          path="/association-members"
          element={
            <MainLayout>
              <AssociationMembers />
            </MainLayout>
          }
        />

        {/* 
          ============================================
          PROTECTED ROUTE - Authentication Required
          ONLY the Posts page requires login
          ============================================
        */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <MainLayout fullBleed={true}>
                <PostsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <MainLayout fullBleed={true}>
                <PostDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </MotionConfig>
  );
}