import { useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, FolderUp, Megaphone, PenSquare, Trophy, Award } from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/adminpage', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/adminpage/events', label: 'Events', icon: CalendarDays },
  { href: '/adminpage/manage-uploads', label: 'Uploads', icon: FolderUp },
  { href: '/adminpage/manage-content-updates', label: 'Updates', icon: Megaphone },
  { href: '/adminpage/manage-content', label: 'Content', icon: PenSquare },
  { href: '/adminpage/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/adminpage/achievements', label: 'Achievements', icon: Award },
];

export default function ProfessionalAdminLayout({ children }) {
  const location = useLocation();

  const isActive = (path) =>
    path === '/adminpage' ? location.pathname === '/adminpage' : location.pathname === path;

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

          <div className="flex flex-wrap gap-1">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 text-label font-medium border ${
                    active
                      ? 'text-navy bg-white border-white'
                      : 'text-on-navy border-blue hover:bg-navy-deep'
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
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
