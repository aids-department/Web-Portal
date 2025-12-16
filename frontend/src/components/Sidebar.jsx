// components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [aboutOpen, setAboutOpen] = useState(false);

  const menu = [
    { name: "About", type: "dropdown", items: [
      { name: "Faculty Info", path: "/about/faculty" },
      { name: "Staff Info", path: "/about/staff" },
      { name: "Syllabus", path: "/about/syllabus" }
    ]},
    { name: "Leaderboards", path: "/leaderboards" },
    { name: "Events", path: "/events" },
    { name: "Achievements", path: "/achievements" },
    { name: "Alumni", path: "/alumni" },
    { name: "Connect", path: "/connect" },
    { name: "Projects", path: "/projects" },
    { name: "Posts", path: "/posts" },
    { name: "Question Bank", path: "/question-bank" },
    { name: "Association Members", path: "/association-members" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={toggleSidebar}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-50 bg-blue-900 text-white w-6 h-20 flex items-center justify-center border-r border-blue-800 shadow-md hover:bg-blue-700 transition"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 p-6 pt-24 shadow-md transition-all duration-300 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"
        }`}
      >
        <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menu.map((item) => {
            if (item.type === "dropdown") {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setAboutOpen(!aboutOpen)}
                    className="w-full text-left px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-100 transition flex items-center justify-between"
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
                              ? "bg-blue-900 text-white"
                              : "text-blue-800 hover:bg-blue-50"
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
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-100"
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