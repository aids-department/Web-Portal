import { useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, FolderUp, Megaphone, FileEdit, Trophy, Award, LogOut, ShieldCheck } from 'lucide-react';
import AmbientBackground from './ui/AmbientBackground';

const NAV = [
  { href: '/adminpage', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/adminpage/events', label: 'Events', Icon: CalendarDays },
  { href: '/adminpage/manage-uploads', label: 'Uploads', Icon: FolderUp },
  { href: '/adminpage/manage-content-updates', label: 'Updates', Icon: Megaphone },
  { href: '/adminpage/manage-content', label: 'Content', Icon: FileEdit },
  { href: '/adminpage/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { href: '/adminpage/achievements', label: 'Achievements', Icon: Award },
];

export default function ProfessionalAdminLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/adminpage') {
      return location.pathname === '/adminpage';
    }
    return location.pathname === path;
  };

  return (
    <div className="relative isolate min-h-screen">
      <AmbientBackground intensity={0.6} />

      {/* ADMIN NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-line bg-canvas/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="icon-tile h-9 w-9 rounded-lg">
                <ShieldCheck className="h-[18px] w-[18px] text-accent-bright" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-[15px] font-semibold leading-tight tracking-tight text-fg">Admin Portal</h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminData');
                window.location.href = '/admin-login';
              }}
              className="btn-danger btn-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>

          <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto pb-2.5">
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-none items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-white/[0.08] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-accent-bright' : ''}`} strokeWidth={1.75} />
                  {label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-2.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
