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
// Images for Dashboard
import img1 from "./assets/enigma.png";
import img2 from "./assets/genesys.png";
import Dashboard_Carousel from "./components/Dashboard_Carousel";
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
    const [achievements, setAchievements] = useState([]);
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
        // Fetch achievements from the Render API
        const fetchAchievements = async () => {
            try {
                const res = await fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent");
                const data = await res.json();
                setAchievements(data);
            } catch (err) {
                console.error("Failed to fetch achievements:", err);
            }
        };
        fetchUpdates();
        fetchAchievements();
    }, []);

    const stats = [
        { label: "Students", num: "412", suffix: "" },
        { label: "Faculty", num: "24", suffix: "" },
        { label: "Publications", num: "61", suffix: "" },
        { label: "Alumni", num: "870", suffix: "" },
    ];

    const quickInfo = [
        { kicker: "Contests", title: "Leaderboard is live", to: "/leaderboards" },
        { kicker: "Calendar", title: "See upcoming events", to: "/events" },
        { kicker: "Resources", title: "Browse the question bank", to: "/question-bank" },
        { kicker: "Recognition", title: "Recent achievements", to: "/achievements" },
    ];

    const researchGroups = [
        { name: "Computer vision and imaging" },
        { name: "Language and speech systems" },
        { name: "Applied statistics and forecasting" },
        { name: "Responsible AI and governance" },
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
                        className={`px-gutter-mobile sm:px-7 py-5.5 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-ds-edge' : ''}`}
                    >
                        <div className="text-kicker tracking-kicker uppercase text-ds-red">{item.kicker}</div>
                        <div className="text-label font-medium text-ds-ink pt-2">{item.title}</div>
                    </Link>
                ))}
            </div>

            <div className="px-gutter-mobile sm:px-gutter">
                {/* EVENTS */}
                <section id="events" className="pt-10 pb-2">
                    <h2 className="text-section-heading text-navy mb-6">Events</h2>
                    <Dashboard_Carousel
                        slides={[
                            { img: img1, page: "/events/codenigma" },
                            { img: img2, page: "/events/genesys" },
                        ]}
                    />
                </section>

                {/* RECENT ACHIEVEMENTS */}
                <section className="pt-10 pb-2 border-t-2 border-navy mt-10">
                    <AchievementsCarousel />
                </section>

                {/* RECENT UPDATES - Dynamic from MongoDB */}
                <section className="pt-10 pb-12 border-t-2 border-navy mt-10">
                    <h2 className="text-section-heading text-navy mb-6">Recent updates</h2>

                    {updates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ds-edge border border-ds-edge">
                            {updates.map((u) => (
                                <article key={u._id} className="bg-white p-6 flex flex-col gap-3">
                                    <div className="h-[130px] bg-ds-blue-tint border border-ds-edge grid place-items-center">
                                        <span className="text-kicker tracking-kicker uppercase text-ds-blue">Update</span>
                                    </div>
                                    <h3 className="text-card-title text-navy">{u.title}</h3>
                                    <span className="text-label text-ds-ink-faint tabular-nums mt-auto pt-2">
                                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                                    </span>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-body text-ds-ink-faint italic">No updates available at the moment.</p>
                    )}
                </section>
            </div>

            {/* RESEARCH GROUPS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-ds-ground border-t-2 border-navy">
                <div className="px-gutter-mobile sm:px-gutter py-11 lg:border-r border-ds-edge flex flex-col gap-5">
                    <h3 className="text-section-heading text-navy">Research groups</h3>
                    <div className="flex flex-col">
                        {researchGroups.map((g) => (
                            <div key={g.name} className="flex justify-between py-3.5 border-b border-ds-edge">
                                <span className="text-body text-ds-ink">{g.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-gutter-mobile sm:px-gutter py-11 flex flex-col gap-5">
                    <h3 className="text-section-heading text-navy">From the labs</h3>
                    <div className="h-[180px] bg-navy grid place-items-center grayscale">
                        <span className="text-kicker tracking-kicker uppercase text-on-navy-muted">Photograph — lab session, black and white</span>
                    </div>
                    <p className="text-body text-ds-ink-soft">
                        Photographs print in black and white throughout, so student-submitted images stay consistent whatever their source.
                    </p>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-navy px-gutter-mobile sm:px-gutter py-12 flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-9">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-ds-red" />
                            </div>
                            <span className="text-label font-bold tracking-label text-white">AI &amp; DS</span>
                        </div>
                        <p className="text-body text-on-navy-muted max-w-[38ch]">
                            Department of Artificial Intelligence and Data Science. Block C, second floor.
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
                <div className="border-t border-blue pt-4 flex flex-col sm:flex-row justify-between gap-2">
                    <span className="text-label text-on-navy-muted">Maintained by the department web committee</span>
                    <span className="text-label text-on-navy-muted">Updated 8 September 2026</span>
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