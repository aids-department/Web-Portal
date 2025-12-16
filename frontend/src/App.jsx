import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Images for Dashboard
import img1 from "./assets/leetcode.png";
import img2 from "./assets/project_expo.jpeg";
import Dashboard_Carousel from "./components/Dashboard_Carousel";

import "./style.css";

// ============================================
// DASHBOARD PAGE COMPONENT (From App 1)
// ============================================
function DashboardPage() {
  return (
    <>
      {/* HEADER SECTION */}
      <section className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          Welcome to the Department of AI and DS
        </h1>

        <p className="text-gray-600 leading-relaxed max-w-3xl mb-10">
          Our mission is to foster innovation and excellence in Artificial
          Intelligence and Data Science through cutting-edge research,
          industry collaboration, and a dynamic learning environment.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Ongoing Projects", value: "50+" },
            { label: "Faculty Members", value: "12" },
            { label: "Active Students", value: "300+" },
            { label: "Research Lab", value: "1" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#eef4ff] p-6 rounded-xl shadow-sm border border-blue-100 text-center"
            >
              <div className="text-3xl font-bold text-blue-900">{item.value}</div>
              <p className="text-blue-700 mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="bg-white mt-12 p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Events</h2>

        <Dashboard_Carousel
          slides={[
            { img: img1, page: "/events/codenigma" },
            { img: img2, page: "/events/genesys" },
          ]}
        />
      </section>

      {/* RECENT UPDATES */}
      <section className="bg-white mt-12 p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Recent Updates</h2>

        <div className="space-y-4">
          {[
            { title: "Need Volunteers for Yukta2k26", time: "1 day ago" },
            { title: "Enigma Contest results out", time: "2 days ago" },
            { title: "50+ students placed in final year", time: "5 days ago" },
          ].map((u) => (
            <div key={u.title} className="pb-3 border-b">
              <p className="text-blue-900 font-medium">{u.title}</p>
              <p className="text-gray-500 text-sm">{u.time}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ============================================
// PLACEHOLDER PAGES (From App 2)
// ============================================
function LeaderboardsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Leaderboards</h2>
      <p className="text-gray-600">Leaderboards content coming soon...</p>
    </div>
  );
}

function AchievementsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Achievements</h2>
      <p className="text-gray-600">Achievements content coming soon...</p>
    </div>
  );
}

function ConnectPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Connect</h2>
      <p className="text-gray-600">Connect content coming soon...</p>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Projects</h2>
      <p className="text-gray-600">Projects content coming soon...</p>
    </div>
  );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
function MainLayout({ children, isOpen, toggleSidebar }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans overflow-hidden flex relative">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300 pt-20
          ${isOpen ? "ml-64" : "ml-0"}
        `}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-10">
          {children}
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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* ADMIN NAVBAR */}
      <nav style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <a
          href="/adminpage"
          style={{
            padding: "10px 15px",
            background: "#1e3a8a",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Manage Events
        </a>

        <a
          href="/adminpage/manage-uploads"
          style={{
            padding: "10px 15px",
            background: "#1e3a8a",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Manage QP Uploads
        </a>
      </nav>

      {/* ADMIN CONTENT */}
      {children}
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

        {/* 
          ============================================
          MAIN APPLICATION ROUTES
          All pages wrapped in MainLayout with Sidebar/Navbar
          ============================================
        */}
        
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
              <LeaderboardsPage />
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
              <AchievementsPage />
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

        {/* Question Bank - PUBLIC */}
        <Route
          path="/question-bank"
          element={
            <MainLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
              <QuestionBank />
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

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}