// components/Navbar.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, UserRound, PencilLine, LogOut, ChevronDown } from "lucide-react";
import { EASE } from "./ui/motion";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", match: (p) => p === "/" },
  { label: "About", to: "/about/faculty", match: (p) => p.startsWith("/about") },
  { label: "Events", to: "/events", match: (p) => p.startsWith("/events") },
  { label: "Leaderboard", to: "/leaderboards", match: (p) => p.startsWith("/leaderboards") },
  { label: "Achievements", to: "/achievements", match: (p) => p.startsWith("/achievements") },
  { label: "Alumni", to: "/alumni", match: (p) => p.startsWith("/alumni") },
  { label: "Posts", to: "/posts", match: (p) => p.startsWith("/posts") },
  { label: "Team", to: "/team-info", match: (p) => p.startsWith("/team") },
];

export function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.03] shadow-inner-hl">
        <span className="h-2 w-2 rounded-[3px] bg-accent shadow-[0_0_12px_2px_rgba(94,106,210,0.8)]" />
      </span>
      {!compact && (
        <span className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold leading-none tracking-tight text-fg">AI &amp; DS</span>
          <span className="font-mono text-[9.5px] uppercase leading-none tracking-[0.18em] text-fg-muted">
            Department
          </span>
        </span>
      )}
    </span>
  );
}

function Avatar({ initials, size = "h-8 w-8" }) {
  return (
    <span
      className={`${size} grid place-items-center rounded-full bg-gradient-to-b from-accent/70 to-accent/30 text-[11px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_16px_rgba(94,106,210,0.35)]`}
    >
      {initials}
    </span>
  );
}

export default function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Glass intensifies once the page scrolls under the bar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ease-expo ${
        scrolled || mobileMenuOpen
          ? "border-line bg-canvas/75 backdrop-blur-xl"
          : "border-transparent bg-canvas/30 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="AI & DS home" className="rounded-lg">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(location.pathname);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative isolate whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute inset-0 -z-10 rounded-md bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 lg:flex">
          {authed ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen((s) => !s);
                  }}
                  className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors duration-200 hover:bg-white/[0.05]"
                >
                  <Avatar initials={initials} />
                  <span className="max-w-[14ch] truncate text-[13px] font-medium text-fg">{displayName}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-fg-muted transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      ref={menuRef}
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="absolute right-0 z-[9999] mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-line bg-canvas-elevated/95 p-1.5 shadow-popover backdrop-blur-xl"
                    >
                      <div className="px-2.5 pb-2 pt-1.5">
                        <p className="truncate text-[13px] font-medium text-fg">{displayName}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Signed in</p>
                      </div>
                      <div className="hairline mb-1" />
                      {[
                        { label: "My Profile", icon: UserRound, to: "/profile" },
                        { label: "Edit Profile", icon: PencilLine, to: "/edit-profile" },
                      ].map(({ label, icon: Icon, to }) => (
                        <button
                          key={label}
                          role="menuitem"
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-fg-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-fg"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            navigate(to);
                          }}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={logout} className="btn-ghost btn-sm">
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary btn-sm">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((s) => !s)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="btn-icon lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileMenuOpen ? "x" : "menu"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
              className="grid place-items-center"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-line bg-canvas/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-0.5 px-3 pt-3" aria-label="Mobile">
              {NAV_ITEMS.map((item) => {
                const isActive = item.match(location.pathname);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium transition-colors duration-150 ${
                      isActive ? "bg-white/[0.06] text-fg" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg"
                    }`}
                  >
                    {item.label}
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(94,106,210,0.9)]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-line px-4 py-4">
              {authed ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 pb-1">
                    <Avatar initials={initials} size="h-9 w-9" />
                    <span className="text-sm font-medium text-fg">{displayName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link to="/profile" onClick={closeMobileMenu} className="btn-secondary">
                      My Profile
                    </Link>
                    <Link to="/edit-profile" onClick={closeMobileMenu} className="btn-secondary">
                      Edit Profile
                    </Link>
                  </div>
                  <button onClick={logout} className="btn-primary w-full">
                    Sign out
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="btn-primary w-full">
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
