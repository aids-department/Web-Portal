import axios from "axios";
import { format } from "date-fns";

import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroCanvas from "./components/HeroCanvas";
import BrickBreakerGame from "./components/BrickBreakerGame";

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
import "./style.css";


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

    const tiles = [
        { label: "About", body: "Faculty, staff and the full syllabus by semester.", to: "/about/faculty" },
        { label: "Events", body: "Workshops, talks and contests with a marked calendar.", to: "/events" },
        { label: "Leaderboard", body: "Coding contest standings and rankings.", to: "/leaderboards" },
        { label: "Achievements", body: "A gallery of what students have won and built.", to: "/achievements" },
        { label: "Alumni", body: "Browse the alumni directory.", to: "/alumni" },
        { label: "Posts", body: "Open discussion and forum for students.", to: "/posts" },
        { label: "Your profile", body: "Skills, links and achievements.", to: user ? "/profile" : "/login" },
    ];

    return (
        <div className="font-brand">
            {/* HERO */}
            <div className="bg-brand-navy grid items-stretch" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))" }}>
                <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-[60px] flex flex-col gap-6 border-r-2 border-brand-blue">
                    <span className="text-[11px] font-medium tracking-[0.22em] uppercase text-brand-red">
                        Undergraduate and postgraduate
                    </span>
                    <h1 className="m-0 text-[38px] sm:text-[48px] lg:text-[60px] leading-[1.03] font-semibold tracking-[-0.02em] text-white max-w-[16ch]">
                        Artificial Intelligence and Data Science
                    </h1>
                    <p className="m-0 max-w-[52ch] text-[15px] leading-[1.62] text-brand-on-navy">
                        Our mission is to foster innovation and excellence in Artificial Intelligence and Data
                        Science through cutting-edge research, industry collaboration, and a dynamic learning
                        environment.
                    </p>
                    <div className="flex gap-3 flex-wrap pt-1">
                        <Link
                            to="/about/syllabus"
                            className="px-5 py-[13px] bg-brand-red text-white font-semibold text-[12.5px]"
                        >
                            Explore the programme
                        </Link>
                        <Link
                            to="/events"
                            className="px-5 py-[13px] border border-[#4a5a7a] text-white font-medium text-[12.5px]"
                        >
                            Upcoming events
                        </Link>
                    </div>
                    <div className="flex gap-8 flex-wrap border-t border-[#23345c] pt-5 mt-auto">
                        {DASHBOARD_STATS.map((s) => (
                            <div key={s.label} className="flex flex-col gap-1.5">
                                <span className="text-[26px] leading-none font-semibold text-white tabular-nums">
                                    <ScrollNumber target={s.num} suffix={s.value.includes("+") ? "+" : ""} />
                                </span>
                                <span className="text-[10.5px] leading-none tracking-[0.14em] uppercase text-brand-on-navy-muted">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative bg-brand-navy-deep min-h-[300px] lg:min-h-[440px]">
                    <HeroCanvas />
                    <div className="absolute left-[22px] bottom-5 flex flex-col gap-1 pointer-events-none">
                        <span className="text-[10px] leading-none tracking-[0.18em] uppercase text-brand-red">
                            Interactive
                        </span>
                        <span className="text-[11px] leading-[1.4] text-brand-on-navy-muted">
                            Move the cursor. Points settling from noise into structure.
                        </span>
                    </div>
                </div>
            </div>

            {/* RECENT UPDATES */}
            <section className="px-5 sm:px-8 lg:px-12 py-8 sm:py-9 lg:py-[46px] border-b-2 border-brand-navy">
                <div className="flex items-baseline justify-between gap-4 flex-wrap mb-[22px]">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
                            Recent updates
                        </span>
                        <h2 className="m-0 text-[30px] font-semibold tracking-[-0.01em] text-brand-navy">
                            What is happening
                        </h2>
                    </div>
                    <Link to="/posts" className="text-[12.5px] font-semibold text-brand-red">
                        All updates
                    </Link>
                </div>
                {updates.length > 0 ? (
                    <div
                        className="grid gap-px bg-brand-edge border border-brand-edge"
                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
                    >
                        {updates.map((u) => (
                            <div key={u._id} className="bg-white p-5 flex flex-col gap-2">
                                <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-red">
                                    Update
                                </span>
                                <h3 className="m-0 text-[16.5px] leading-[1.32] font-semibold text-brand-navy">
                                    {u.title}
                                </h3>
                                <span className="mt-auto border-t border-brand-row pt-2.5 text-[11.5px] text-brand-ink-soft">
                                    {format(new Date(u.createdAt), "dd MMM yyyy")}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-brand-ink-soft italic text-[13.5px]">No updates available at the moment.</p>
                )}
            </section>

            {/* WHERE TO GO */}
            <section className="px-5 sm:px-8 lg:px-12 py-8 sm:py-9 lg:py-[46px]">
                <div className="flex flex-col gap-2 mb-[22px]">
                    <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
                        Where to go
                    </span>
                    <h2 className="m-0 text-[30px] font-semibold tracking-[-0.01em] text-brand-navy">
                        The portal at a glance
                    </h2>
                </div>
                <div
                    className="grid gap-px bg-brand-edge border border-brand-edge"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
                >
                    {tiles.map((t) => (
                        <Link
                            key={t.label}
                            to={t.to}
                            className="bg-white p-5 flex flex-col gap-2 hover:bg-[#f7f9fc]"
                        >
                            <span className="text-[15.5px] font-semibold text-brand-navy">{t.label}</span>
                            <span className="text-[12.5px] leading-[1.6] text-brand-ink-soft">{t.body}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
// ============================================
// PLACEHOLDER PAGES (From App 2)
// ============================================

function ConnectPage() {
  return (
    <div className="font-brand bg-white border border-brand-edge p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-brand-edge pb-4">
        <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
          Under Development
        </span>
        <h1 className="m-0 text-[28px] sm:text-[36px] font-semibold text-brand-navy">
          Connect
        </h1>
        <p className="m-0 text-[13.5px] text-brand-ink-soft">
          We are working on dedicated tools to help students connect with peers, clubs, and mentors.
        </p>
      </div>

      <div className="border border-brand-edge bg-brand-ground p-4">
        <p className="m-0 text-[13px] text-brand-navy font-medium">
          🚧 Connect features are coming soon. Meanwhile, enjoy a quick game to pass the time:
        </p>
      </div>

      <div className="flex justify-center py-2">
        <BrickBreakerGame />
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="font-brand bg-white border border-brand-edge p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-brand-edge pb-4">
        <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
          Showcase
        </span>
        <h1 className="m-0 text-[28px] sm:text-[36px] font-semibold text-brand-navy">
          Projects
        </h1>
        <p className="m-0 text-[13.5px] text-brand-ink-soft">
          A dedicated repository of cutting-edge AI and Data Science student and faculty projects.
        </p>
      </div>

      <div className="border border-brand-edge bg-brand-ground p-4">
        <p className="m-0 text-[13px] text-brand-navy font-medium">
          🚧 The project showcase is launching soon. Meanwhile, enjoy a quick game to pass the time:
        </p>
      </div>

      <div className="flex justify-center py-2">
        <BrickBreakerGame />
      </div>
    </div>
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children, fullBleed = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        {fullBleed ? (
          <div className="w-full h-full">{children}</div>
        ) : (
          <div className="max-w-7xl mx-auto p-8">{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ============================================
// ADMIN LAYOUT COMPONENT
// ============================================
function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 font-sans relative overflow-hidden">
      {/* Professional background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.08)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
      {/* ADMIN NAVBAR */}
      <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-blue-200 text-xs">Management Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminData');
                window.location.href = '/admin-login';
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-300 text-red-200 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <a
              href="/adminpage"
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📊</span>
              </div>
              <span className="text-xs font-medium text-center">Dashboard</span>
            </a>
            
            <a
              href="/adminpage/events"
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📅</span>
              </div>
              <span className="text-xs font-medium text-center">Events</span>
            </a>
            
            <a
              href="/adminpage/manage-uploads"
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📁</span>
              </div>
              <span className="text-xs font-medium text-center">Uploads</span>
            </a>
            
            <a
              href="/adminpage/manage-content-updates"
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📢</span>
              </div>
              <span className="text-xs font-medium text-center">Updates</span>
            </a>
            
            <a 
              href="/adminpage/manage-content" 
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">✏️</span>
              </div>
              <span className="text-xs font-medium text-center">Content</span>
            </a>
            
            <a 
              href="/adminpage/leaderboard" 
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">🏆</span>
              </div>
              <span className="text-xs font-medium text-center">Leaderboard</span>
            </a>
            
            <a 
              href="/adminpage/achievements" 
              className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20 md:col-span-3 lg:col-span-1"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">🎖️</span>
              </div>
              <span className="text-xs font-medium text-center">Achievements</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 min-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  return (
    <BrowserRouter>
       <Toaster position="top-right" reverseOrder={false} />
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
  );
}