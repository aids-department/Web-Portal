// components/AboutTabs.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EASE } from './ui/motion';

const TABS = [
  { label: 'Faculty', to: '/about/faculty' },
  { label: 'Staff', to: '/about/staff' },
];

export default function AboutTabs() {
  const location = useLocation();

  return (
    <div className="container-ln pt-8">
      <nav className="tabs" aria-label="About sections">
        {TABS.map((t) => {
          const isActive = location.pathname === t.to;
          return (
            <Link
              key={t.label}
              to={t.to}
              aria-current={isActive ? 'page' : undefined}
              className={`tab relative isolate ${isActive ? 'text-fg' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="about-tab"
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_1px_8px_rgba(0,0,0,0.35)]"
                />
              )}
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
