import axios from "axios";
import { formatDistanceToNow } from "date-fns";

import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, FolderUp, Megaphone, PenSquare, Trophy, Award,
} from "lucide-react";
import SiteNav from "./components/SiteNav";
import BrickBreakerGame from "./components/BrickBreakerGame";
import HeroCanvas from "./components/HeroCanvas";
import Button from "./components/ui/Button";
import PageHeader from "./components/ui/PageHeader";
import NoticeStrip from "./components/ui/NoticeStrip";

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
import QuestionBank from "./pages/QuestionBank";
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
import AchievementsCarousel from "./components/AchievementsCarousel";
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

    const stats = [
        { label: "Students", num: "412", suffix: "" },
        { label: "Faculty", num: "24", suffix: "" },
        { label: "Publications", num: "61", suffix: "" },
        { label: "Alumni", num: "870", suffix: "" },
    ];

    const quickInfo = [
        { kicker: "Now open", title: "Winter internship applications", to: "/events" },
        { kicker: "Next event", title: "DataFest · 14 Oct, Seminar Hall", to: "/events" },
        { kicker: "Contest", title: "Round 3 leaderboard is live", to: "/leaderboards" },
        { kicker: "Resources", title: "Sem 5 question bank updated", to: "/question-bank" },
    ];

    return (
        <>
            {/* HERO */}
            <div className="bg-navy grid grid-cols-1 lg:grid-cols-[1fr_480px] items-stretch">
                <div className="flex flex-col gap-6 px-gutter-mobile sm:px-gutter py-14 lg:py-16 border-b lg:border-b-0 lg:border-r-2 border-blue">
                    <span className="text-kicker tracking-kicker uppercase text-ds-red">Undergraduate and postgraduate</span>
                    <h1 className="text-display text-white max-w-[16ch]">Artificial Intelligence and Data Science</h1>
                    <p className="text-body text-on-navy max-w-[52ch]">
                        A department built around applied machine learning, statistical modelling and the systems that carry them into production. Coursework, contests, research groups and an alumni network in one place.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                        <Link to="/about/syllabus"><Button variant="primary">Explore the programme</Button></Link>
                        <Link to="/events"><Button variant="on-navy">Upcoming events</Button></Link>
                    </div>
                    <div className="flex flex-wrap gap-9 pt-6 mt-auto border-t border-blue">
                        {stats.map((item) => (
                            <div key={item.label} className="flex flex-col gap-1.5 pt-5">
                                <span className="text-figure text-white tabular-nums">
                                    <ScrollNumber target={item.num} suffix={item.suffix} />
                                </span>
                                <span className="text-label tracking-label uppercase text-on-navy-muted">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative bg-navy-deep min-h-[320px] lg:min-h-[520px]">
                    <HeroCanvas width={560} height={520} />
                    <div className="absolute left-6 bottom-5 flex flex-col gap-1">
                        <span className="text-kicker tracking-kicker uppercase text-ds-red">Interactive</span>
                        <span className="text-label text-on-navy-muted">Move the cursor. Points settle from noise into structure.</span>
                    </div>
                </div>
            </div>

            {/* QUICK INFO STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-2 border-navy bg-white">
                {quickInfo.map((item, i) => (
                    <Link
                        key={item.kicker}
                        to={item.to}
                        className={`px-gutter-mobile sm:px-7 py-[22px] hover:bg-ds-ground transition-colors ${
                            i === 0
                                ? 'border-r border-ds-edge'
                                : i < 3
                                ? 'border-r border-ds-edge border-t sm:border-t-0'
                                : 'border-t sm:border-t-0'
                        }`}
                    >
                        <div className="text-kicker tracking-kicker uppercase" style={{ color: i === 0 ? '#dd2b0f' : '#7d7979' }}>{item.kicker}</div>
                        <div className="text-[13.5px] font-medium text-ds-ink pt-2 leading-snug">{item.title}</div>
                    </Link>
                ))}
            </div>

            {/* ACHIEVEMENTS + UPDATES — white bg, no floating lines */}
            <div className="bg-white px-gutter-mobile sm:px-gutter pb-12">
                <div className="pt-8">
                    <AchievementsCarousel />
                </div>
                <div className="mt-10">
                    <div className="flex items-end justify-between border-b-2 border-navy pb-3 mb-0">
                        <h2 className="text-[28px] font-semibold leading-none tracking-[-0.01em] text-navy">Recent updates</h2>
                        <Link to="/posts" className="text-[12px] font-medium text-ds-blue no-underline pb-[3px]" style={{ borderBottom: '2px solid #dd2b0f' }}>View all</Link>
                    </div>
                    {updates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ds-edge border-x border-b border-ds-edge">
                            {updates.map((u) => (
                                <article key={u._id} className="bg-white p-6 flex flex-col gap-3">
                                    <div className="h-[120px] bg-ds-blue-tint border border-ds-edge grid place-items-center">
                                        <span className="text-kicker tracking-kicker uppercase text-ds-blue">{u.category || 'General'}</span>
                                    </div>
                                    <span className="text-kicker tracking-kicker uppercase text-ds-red">{u.category || 'Update'}</span>
                                    <h3 className="text-[18px] font-semibold leading-snug text-navy m-0">{u.title}</h3>
                                    {u.content && <p className="text-[13px] leading-relaxed text-ds-ink-soft m-0">{u.content}</p>}
                                    <span className="text-[11.5px] text-ds-ink-faint tabular-nums mt-auto pt-2">
                                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                                    </span>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="border-x border-b border-ds-edge bg-white p-6">
                            <p className="text-[14px] text-ds-ink-faint italic m-0">No updates yet.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* FOOTER */}
            <footer className="bg-navy px-gutter-mobile sm:px-gutter py-10 flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-9">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 bg-ds-red" />
                            </div>
                            <span className="text-[13px] font-bold tracking-[0.14em] text-white">AI &amp; DS</span>
                        </div>
                        <p className="text-body text-on-navy-muted max-w-[38ch]">
                            Department of Artificial Intelligence and Data Science.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span className="text-kicker tracking-kicker uppercase text-ds-red">Department</span>
                        <Link to="/about/faculty" className="text-body text-on-navy">Faculty</Link>
                        <Link to="/about/staff" className="text-body text-on-navy">Staff</Link>
                        <Link to="/about/syllabus" className="text-body text-on-navy">Syllabus</Link>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span className="text-kicker tracking-kicker uppercase text-ds-red">Student life</span>
                        <Link to="/events" className="text-body text-on-navy">Events</Link>
                        <Link to="/leaderboards" className="text-body text-on-navy">Leaderboard</Link>
                        <Link to="/achievements" className="text-body text-on-navy">Achievements</Link>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span className="text-kicker tracking-kicker uppercase text-ds-red">Members</span>
                        <Link to="/alumni" className="text-body text-on-navy">Alumni</Link>
                        <Link to="/posts" className="text-body text-on-navy">Posts</Link>
                        <Link to="/question-bank" className="text-body text-on-navy">Question bank</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
// ============================================
// PLACEHOLDER PAGES (From App 2)
// ============================================

function ConnectPage() {
  return (
    <div>
      <PageHeader kicker="Coming soon" heading="Connect">
        We're working on ways to help you connect with peers and faculty.
      </PageHeader>
      <NoticeStrip tagLabel="Notice" message="Connect features are coming soon." className="mb-8 -mx-gutter-mobile sm:-mx-gutter w-auto" />
      <p className="text-body text-ds-ink-soft mb-4">Meanwhile, enjoy a quick game to pass the time.</p>
      <BrickBreakerGame />
    </div>
  );
}

function ProjectsPage() {
  return (
    <div>
      <PageHeader kicker="Coming soon" heading="Projects">
        We're working on showcasing student and faculty projects.
      </PageHeader>
      <NoticeStrip tagLabel="Notice" message="The projects showcase is coming soon." className="mb-8 -mx-gutter-mobile sm:-mx-gutter w-auto" />
      <p className="text-body text-ds-ink-soft mb-4">Meanwhile, enjoy a quick game to pass the time.</p>
      <BrickBreakerGame />
    </div>
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children, fullBleed = false }) {
  return (
    <div className="min-h-screen bg-ds-ground font-sans overflow-x-hidden flex flex-col relative">
      <SiteNav />
      <main className={`flex-1 pt-16 overflow-x-hidden ${fullBleed ? 'p-0 pt-16 bg-transparent' : 'px-gutter-mobile sm:px-gutter py-10 bg-white'}`}>
        {fullBleed ? (
          <div className="w-full h-full">
            {children}
          </div>
        ) : (
          <div className="max-w-7xl">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// ADMIN LAYOUT COMPONENT
// ============================================
const ADMIN_LINKS = [
  { href: "/adminpage", label: "Dashboard", icon: LayoutDashboard },
  { href: "/adminpage/events", label: "Events", icon: CalendarDays },
  { href: "/adminpage/manage-uploads", label: "Uploads", icon: FolderUp },
  { href: "/adminpage/manage-content-updates", label: "Updates", icon: Megaphone },
  { href: "/adminpage/manage-content", label: "Content", icon: PenSquare },
  { href: "/adminpage/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/adminpage/achievements", label: "Achievements", icon: Award },
];

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-ds-ground font-sans">
      {/* ADMIN NAVBAR */}
      <nav className="bg-navy text-white border-b-2 border-ds-red">
        <div className="max-w-7xl px-gutter-mobile sm:px-gutter py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-ds-red" />
              </div>
              <div>
                <h1 className="text-card-title text-white">Admin portal</h1>
                <p className="text-label text-on-navy-muted">Management dashboard</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminData');
                window.location.href = '/admin-login';
              }}
              className="px-3.5 py-2 text-label font-medium text-white border border-on-navy"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-blue">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-2 py-4 bg-navy hover:bg-navy-deep transition-colors"
                >
                  <Icon size={18} className="text-on-navy" />
                  <span className="text-label text-on-navy">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="px-gutter-mobile sm:px-gutter py-10">
        <div className="max-w-7xl bg-white border border-ds-edge p-8">
          {children}
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

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
          All pages wrapped in MainLayout with Sidebar/Navbar
          ============================================
        */}

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <MainLayout>
              <EditProfile />
            </MainLayout>
          }
        />

        
        {/* Dashboard/Home - PUBLIC */}
        <Route
          path="/"
          element={
            <MainLayout fullBleed>
              <DashboardPage />
            </MainLayout>
          }
        />

        {/* Leaderboards - PUBLIC */}
        <Route
          path="/leaderboards"
          element={
            <MainLayout>
              <UserLeaderboards />
            </MainLayout>
          }
        />


        {/* Events Section */}
        <Route
          path="/events"
          element={
            <MainLayout>
              <EventsPage />
            </MainLayout>
          }
        />
        <Route
          path="/events/codenigma"
          element={
            <MainLayout>
              <Codenigma />
            </MainLayout>
          }
        />
        <Route
          path="/events/genesys"
          element={
            <MainLayout>
              <Genesys />
            </MainLayout>
          }
        />

        {/* About Section (Faculty, Staff, Syllabus) */}
        <Route
          path="/about/faculty"
          element={
            <MainLayout>
              <FacultyInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/staff"
          element={
            <MainLayout>
              <StaffInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/syllabus"
          element={
            <MainLayout>
              <Syllabus />
            </MainLayout>
          }
        />

        {/* Alumni - PUBLIC */}
        <Route
          path="/alumni"
          element={
            <MainLayout>
              <Alumni />
            </MainLayout>
          }
        />

        {/* Achievements - PUBLIC */}
        <Route
          path="/achievements"
          element={
            <MainLayout>
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
              <MainLayout>
                <PostsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PostDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        /> 

        <Route
          path="/question-bank"
          element={
            <ProtectedRoute>
              <MainLayout>
                <QuestionBank />
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