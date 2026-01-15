// components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [aboutOpen, setAboutOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/" },
    { type: "divider", label: "Department" },
    { name: "About", type: "dropdown", items: [
      { name: "Faculty Info", path: "/about/faculty" },
      { name: "Staff Info", path: "/about/staff" },
      { name: "Syllabus", path: "/about/syllabus" }
    ]},
    { name: "Team Members", path: "/team-info" },
    { name: "Association Members", path: "/association-members" },
    { type: "divider", label: "Activities" },
    { name: "Events", path: "/events" },
    { name: "Leaderboards", path: "/leaderboards" },
    { name: "Achievements", path: "/achievements" },
    { type: "divider", label: "Community" },
    { name: "Alumni", path: "/alumni" },
    { name: "Posts", path: "/posts" },
    { name: "Question Bank", path: "/question-bank" },
    { type: "divider", label: "Coming Soon" },
    { name: "Connect", path: "/connect" },
    { name: "Projects", path: "/projects" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white w-6 h-20 flex items-center justify-center border-r border-gray-700 shadow-md hover:bg-gray-800 transition-all ease-in-out duration-300 rounded-r-lg ${
          isOpen ? 'left-64' : 'left-0'
        }`}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700 p-6 pt-24 shadow-md transition-all ease-in-out duration-300 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"
        }`}
      >
        <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menu.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div key={`divider-${index}`} className="pt-4 pb-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                    {item.label}
                  </div>
                </div>
              );
            }
            
            if (item.type === "dropdown") {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setAboutOpen(!aboutOpen)}
                    className="w-full text-left px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    {aboutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {aboutOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => toggleSidebar()}
                          className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition ${
                            isActivePath(subItem.path)
                              ? "bg-gray-800 text-white border border-gray-700"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => toggleSidebar()}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  isActivePath(item.path)
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}