// components/AboutTabs.jsx
import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Faculty', to: '/about/faculty' },
  { label: 'Staff', to: '/about/staff' },
  { label: 'Team', to: '/team-info' },
];

export default function AboutTabs() {
  const location = useLocation();

  return (
    <div className="font-brand flex gap-6 flex-wrap px-5 sm:px-8 lg:px-12 border-b-2 border-brand-navy bg-white">
      {TABS.map((t) => {
        const isActive = location.pathname === t.to;
        return (
          <Link
            key={t.label}
            to={t.to}
            className={`py-4 text-[12.5px] ${
              isActive
                ? 'font-semibold text-brand-navy shadow-[inset_0_-3px_0_#dd2b0f]'
                : 'font-medium text-brand-ink-soft shadow-[inset_0_-3px_0_transparent]'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
