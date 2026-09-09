// components/SiteNav.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/" },
  {
    name: "About",
    items: [
      { name: "Faculty", path: "/about/faculty" },
      { name: "Staff", path: "/about/staff" },
      { name: "Syllabus", path: "/about/syllabus" },
      { name: "Team members", path: "/team-info" },
      { name: "Association members", path: "/association-members" },
    ],
  },
  { name: "Events", path: "/events" },
  { name: "Leaderboard", path: "/leaderboards" },
  { name: "Achievements", path: "/achievements" },
  { name: "Alumni", path: "/alumni" },
  { name: "Posts", path: "/posts" },
  { name: "Question Bank", path: "/question-bank" },
  {
    name: "More",
    items: [
      { name: "Connect", path: "/connect" },
      { name: "Projects", path: "/projects" },
    ],
  },
];

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function SiteNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const displayName = user ? user.fullName || user.name || user.username || "Member" : null;

  useEffect(() => {
    function onDocClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
      setOpenDropdown((cur) => (e.target.closest?.("[data-site-nav-dropdown]") ? cur : null));
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const isActiveGroup = (item) =>
    item.path
      ? location.pathname === item.path
      : item.items?.some((sub) => location.pathname === sub.path);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-stretch justify-between bg-white border-b-2 border-navy font-sans fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-9 px-gutter-mobile sm:px-gutter">
        <Link to="/" className="flex items-center gap-2.5 py-3.5">
          <img src={logo} alt="" className="h-6 w-6 grayscale" />
          <span className="flex flex-col leading-none">
            <span className="text-label font-bold tracking-label text-navy">AI &amp; DS</span>
            <span className="text-[9px] tracking-label uppercase text-ds-ink-faint">Department</span>
          </span>
        </Link>

        <nav className="flex items-stretch gap-6">
          {NAV_ITEMS.map((item) => {
            const active = isActiveGroup(item);
            if (item.items) {
              return (
                <div key={item.name} className="relative flex items-stretch" data-site-nav-dropdown>
                  <button
                    onClick={() => setOpenDropdown((cur) => (cur === item.name ? null : item.name))}
                    className={`flex items-center gap-1 text-label font-medium whitespace-nowrap ${
                      active ? "text-navy" : "text-ds-ink-soft"
                    }`}
                    style={{ boxShadow: active ? "inset 0 -3px 0 #dd2b0f" : "none" }}
                  >
                    {item.name}
                    <ChevronDown size={13} />
                  </button>
                  {openDropdown === item.name && (
                    <div className="absolute left-0 top-full bg-white border border-ds-edge min-w-[180px] py-1">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2 text-label ${
                            location.pathname === sub.path
                              ? "text-navy font-medium bg-ds-ground"
                              : "text-ds-ink-soft hover:bg-ds-ground"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-label font-medium whitespace-nowrap ${
                  active ? "text-navy" : "text-ds-ink-soft"
                }`}
                style={{ boxShadow: active ? "inset 0 -3px 0 #dd2b0f" : "none" }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 px-gutter-mobile sm:px-gutter">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-3.5 py-2 text-label font-medium text-navy border border-ds-edge"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-2 text-label font-semibold text-white bg-navy"
            >
              Create account
            </Link>
          </>
        ) : (
          <div className="relative">
            <div
              ref={avatarRef}
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen((s) => !s);
              }}
            >
              <span className="text-label text-ds-ink-soft">{displayName}</span>
              <div className="w-[30px] h-[30px] bg-ds-blue-tint border border-navy flex items-center justify-center text-label font-semibold text-navy">
                {initialsOf(displayName)}
              </div>
            </div>

            {profileMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-52 bg-white border border-ds-edge z-[9999]"
              >
                <ul className="py-2">
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-label hover:bg-ds-ground text-ds-ink"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-label hover:bg-ds-ground text-ds-ink"
                      onClick={() => navigate("/edit-profile")}
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-label text-ds-red hover:bg-ds-ground"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
