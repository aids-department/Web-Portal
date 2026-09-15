// components/Navbar.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", match: (p) => p === "/" },
  { label: "About", to: "/about/faculty", match: (p) => p.startsWith("/about") },
  { label: "Events", to: "/events", match: (p) => p.startsWith("/events") },
  { label: "Leaderboard", to: "/leaderboards", match: (p) => p.startsWith("/leaderboards") },
  { label: "Achievements", to: "/achievements", match: (p) => p.startsWith("/achievements") },
  { label: "Alumni", to: "/alumni", match: (p) => p.startsWith("/alumni") },
  // Only Posts is actually gated by ProtectedRoute today, so it's the only
  // item that shows the "locked" hint when signed out.
  { label: "Posts", to: "/posts", match: (p) => p.startsWith("/posts"), gated: true },
];

export default function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const authed = !!user;

  // close dropdown on outside click
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
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const displayName = user?.fullName || user?.name || "Account";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "U";

  return (
    <header className="font-brand sticky top-0 z-40 bg-white border-b-2 border-brand-navy">
      <div className="flex items-stretch justify-between">
        <div className="flex items-center gap-[30px] pl-4 sm:pl-8 lg:pl-11">
          <Link to="/" className="flex items-center gap-2.5 py-3.5">
            <div className="flex-none w-[26px] h-[26px] bg-brand-navy grid place-items-center">
              <div className="w-2 h-2 bg-brand-red" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[13px] leading-none tracking-[0.14em] text-brand-navy">
                AI &amp; DS
              </span>
              <span className="text-[9px] leading-none tracking-[0.1em] uppercase text-[#7d7979]">
                Department
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-stretch gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(location.pathname);
              const locked = item.gated && !authed;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  title={locked ? "Sign in required" : item.label}
                  className={`flex items-center gap-1.5 py-[18px] text-[12.5px] font-medium whitespace-nowrap box-border ${
                    isActive
                      ? "text-brand-navy shadow-[inset_0_-3px_0_#dd2b0f]"
                      : "text-brand-ink-soft shadow-[inset_0_-3px_0_transparent]"
                  }`}
                >
                  {item.label}
                  {locked && (
                    <span className="text-[8px] leading-none tracking-[0.08em] font-semibold text-brand-ink-faint">
                      LOCKED
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 sm:px-8 lg:px-11 py-2">
          {authed ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen((s) => !s);
                  }}
                  className="flex items-center gap-2.5"
                >
                  <span className="text-[12px] font-medium text-[#3a3838]">{displayName}</span>
                  <span className="w-[30px] h-[30px] bg-brand-blue-tint border border-brand-navy grid place-items-center text-[11px] font-semibold text-brand-navy">
                    {initials}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-52 bg-white border border-brand-edge shadow-lg z-[9999]"
                  >
                    <ul className="py-1">
                      <li>
                        <button
                          className="w-full text-left px-4 py-2.5 text-[12.5px] text-brand-ink hover:bg-brand-ground"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            navigate("/profile");
                          }}
                        >
                          My Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2.5 text-[12.5px] text-brand-ink hover:bg-brand-ground"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            navigate("/edit-profile");
                          }}
                        >
                          Edit Profile
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="px-[13px] py-[9px] border border-brand-ink-faint bg-white text-[11.5px] font-medium text-brand-ink-soft hover:bg-brand-ground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-[15px] py-2.5 border border-brand-ink-faint bg-white text-[12px] font-medium text-brand-navy hover:bg-brand-ground"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-[15px] py-2.5 border-none bg-brand-navy text-[12px] font-semibold text-white hover:bg-brand-blue"
              >
                Create account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((s) => !s)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="lg:hidden flex items-center px-4 sm:px-8 text-brand-navy"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-edge">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(location.pathname);
              const locked = item.gated && !authed;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between gap-2 px-5 py-3.5 text-[13.5px] font-medium border-b border-brand-row ${
                    isActive ? "text-brand-navy bg-brand-ground" : "text-brand-ink-soft"
                  }`}
                >
                  {item.label}
                  {locked && (
                    <span className="text-[9px] leading-none tracking-[0.08em] font-semibold text-brand-ink-faint">
                      LOCKED
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 py-4">
            {authed ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 pb-1">
                  <span className="w-[30px] h-[30px] bg-brand-blue-tint border border-brand-navy grid place-items-center text-[11px] font-semibold text-brand-navy">
                    {initials}
                  </span>
                  <span className="text-[13px] font-medium text-[#3a3838]">{displayName}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="px-4 py-2.5 border border-brand-ink-faint text-[12.5px] font-medium text-brand-navy text-center"
                >
                  My Profile
                </Link>
                <Link
                  to="/edit-profile"
                  onClick={closeMobileMenu}
                  className="px-4 py-2.5 border border-brand-ink-faint text-[12.5px] font-medium text-brand-navy text-center"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2.5 bg-brand-navy text-white text-[12.5px] font-semibold"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="px-4 py-2.5 border border-brand-ink-faint text-[12.5px] font-medium text-brand-navy text-center"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="px-4 py-2.5 bg-brand-navy text-white text-[12.5px] font-semibold text-center"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
