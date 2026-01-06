
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Users, BookOpen, GraduationCap, FlaskConical } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

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
function DashboardPage() {
    const [updates, setUpdates] = useState([]);
    const [achievements, setAchievements] = useState([]);
    // Fetch updates from the dedicated MongoDB server on port 5001
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/updates");
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

    return (
        <>
            {/* HEADER SECTION - Kept exactly the same */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-white/30 mb-8 hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 font-cursive leading-tight">
                            Welcome to the Department of AI and DS
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
                    </div>

                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Our mission is to foster innovation and excellence in Artificial Intelligence and Data Science through
                            <span className="font-semibold text-blue-700"> cutting-edge research</span>,
                            <span className="font-semibold text-purple-700"> industry collaboration</span>, and a
                            <span className="font-semibold text-green-700"> dynamic learning environment</span>.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                            <span className="px-3 py-1 bg-blue-100/50 rounded-full">🤖 AI Research</span>
                            <span className="px-3 py-1 bg-purple-100/50 rounded-full">📊 Data Science</span>
                            <span className="px-3 py-1 bg-green-100/50 rounded-full">🎓 Education</span>
                            <span className="px-3 py-1 bg-orange-100/50 rounded-full">🚀 Innovation</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Ongoing Projects", value: "50+", num: "50", icon: BookOpen, color: "text-blue-600" },
                            { label: "Faculty Members", value: "12", num: "12", icon: Users, color: "text-purple-600" },
                            { label: "Active Students", value: "300+", num: "300", icon: GraduationCap, color: "text-green-600" },
                            { label: "Research Lab", value: "1", num: "1", icon: FlaskConical, color: "text-orange-600" },
                        ].map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={item.label}
                                    className="group bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/40 text-center hover:scale-105 hover:bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 ${item.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="text-4xl font-bold text-gray-900 mb-1">
                                            <ScrollNumber target={item.num} suffix={item.value.includes('+') ? '+' : ''} />
                                        </div>
                                        <p className="text-gray-700 font-medium text-sm">{item.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* EVENTS - Kept exactly the same */}
            <section id="events" className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 mb-8 hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 font-cursive">Events</h2>
                    <Dashboard_Carousel
                        slides={[
                            { img: img1, page: "/events/codenigma" },
                            { img: img2, page: "/events/genesys" },
                        ]}
                    />
                </div>
            </section>
            {/* 3. NEW: RECENT ACHIEVEMENTS SECTION (Between Events and Updates) */}
            <section className="mb-8">
                <AchievementsCarousel />
            </section>
            {/* RECENT UPDATES - Now Dynamic from MongoDB */}
            <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 font-cursive">Recent Updates</h2>

                    <div className="space-y-4">
                        {updates.length > 0 ? (
                            updates.map((u) => (
                                <div key={u._id} className="group pb-4 border-b border-gray-200 hover:bg-white/60 transition-all duration-300 rounded-lg px-4 py-3 hover:shadow-md">
                                    <p className="text-gray-900 font-medium group-hover:text-gray-800">{u.title}</p>
                                    <p className="text-gray-500 text-sm group-hover:text-gray-600">
                                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No updates available at the moment.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
// ============================================
// PLACEHOLDER PAGES (From App 2)
// ============================================

function ConnectPage() {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-cursive">Connect</h2>
        <p className="text-gray-600">Connect content coming soon...</p>
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-cursive">Projects</h2>
        <p className="text-gray-600">Projects content coming soon...</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children, isOpen, toggleSidebar, fullBleed = false }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden flex relative">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`
          flex-1 flex flex-col overflow-x-hidden transition-all duration-300 pt-20
          ${isOpen ? "ml-64" : "ml-0"}
        `}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className={`flex-1 overflow-y-auto ${fullBleed ? 'p-0 bg-transparent' : 'p-8 bg-white shadow-inner'}`}>
          {fullBleed ? (
            <div className="w-full h-full">
              {children}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================
// ADMIN LAYOUT COMPONENT
// ============================================
function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ADMIN NAVBAR */}
      <nav className="bg-gray-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex gap-4">
          <a
            href="/adminpage"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Manage Events
          </a>

          <a
            href="/adminpage/manage-uploads"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Manage QP Uploads
          </a>
            <a
                href="/adminpage/manage-content-updates"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Recent Updates
            </a>
          <a href="/adminpage/manage-content" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Manage Content
          </a>

        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
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
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

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

        {/* 
          ============================================
          ADMIN ROUTES - Separate Layout
          ============================================
        */}
        <Route
          path="/adminpage"
          element={
            <AdminLayout>
              <EventsAdminPage />
            </AdminLayout>
          }
        />
        <Route
          path="/adminpage/manage-uploads"
          element={
            <AdminLayout>
              <ManageUploads />
            </AdminLayout>
          }
        />
        <Route
          path="/adminpage/manage-content"
          element={
            <AdminLayout>
              <ManageContent />
            </AdminLayout>
          }
        />
          <Route
              path="/adminpage/manage-content-updates"
              element={
                  <AdminLayout>
                      <UpdateContent />
                  </AdminLayout>
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
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <Profile />
            </MainLayout>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <EditProfile />
            </MainLayout>
          }
        />

        
        {/* Dashboard/Home - PUBLIC */}
        <Route
          path="/"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <DashboardPage />
            </MainLayout>
          }
        />

        {/* Leaderboards - PUBLIC */}
        <Route
          path="/leaderboards"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <UserLeaderboards />
            </MainLayout>
          }
        />


        {/* Events Section */}
        <Route
          path="/events"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <EventsPage />
            </MainLayout>
          }
        />
        <Route
          path="/events/codenigma"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <Codenigma />
            </MainLayout>
          }
        />
        <Route
          path="/events/genesys"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <Genesys />
            </MainLayout>
          }
        />

        {/* About Section (Faculty, Staff, Syllabus) */}
        <Route
          path="/about/faculty"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <FacultyInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/staff"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <StaffInfo />
            </MainLayout>
          }
        />
        <Route
          path="/about/syllabus"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <Syllabus />
            </MainLayout>
          }
        />

        {/* Alumni - PUBLIC */}
        <Route
          path="/alumni"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <Alumni />
            </MainLayout>
          }
        />

        {/* Achievements - PUBLIC */}
        <Route
          path="/achievements"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <UserAchievements />
            </MainLayout>
          }
        />

        {/* Connect - PUBLIC */}
        <Route
          path="/connect"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <ConnectPage />
            </MainLayout>
          }
        />

        {/* Projects - PUBLIC */}
        <Route
          path="/projects"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <ProjectsPage />
            </MainLayout>
          }
        />

        {/* External Team Info (embedded) */}
        <Route
          path="/team-info"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar} fullBleed={true}>
              <TeamInfo />
            </MainLayout>
          }
        />
        
        {/* Association Members - PUBLIC */}
        <Route
          path="/association-members"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
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
              <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
                <PostsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank"
          element={
            <ProtectedRoute>
              <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
                <QuestionBank />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaderboard"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <AdminLeaderboards />
            </MainLayout>
          }
        />

        <Route
          path="/admin/achievements"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <AdminAchievements />
            </MainLayout>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}