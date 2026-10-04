// components/Footer.jsx
import { Link } from "react-router-dom";
import { Logo } from "./Navbar";

export default function Footer() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const authed = !!user;

  const columns = [
    {
      title: "Department",
      links: [
        { label: "Faculty", to: "/about/faculty" },
        { label: "Staff", to: "/about/staff" },
        { label: "Syllabus", to: "/about/syllabus" },
        { label: "Events", to: "/events" },
        { label: "Team", to: "/team-info" },
      ],
    },
    {
      title: "Students",
      links: [
        { label: "Leaderboard", to: "/leaderboards" },
        { label: "Achievements", to: "/achievements" },
        { label: "Posts", to: "/posts" },
      ],
    },
    {
      title: "Network",
      links: [
        { label: "Alumni directory", to: "/alumni" },
        ...(authed
          ? [{ label: "Your profile", to: "/profile" }]
          : [{ label: "Sign in", to: "/login" }]),
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t border-line bg-canvas-deep">
      {/* soft accent line along the top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.10),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-[34ch] text-sm leading-relaxed text-fg-muted">
              Department of Artificial Intelligence and Data Science.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="eyebrow mb-1 text-[10.5px]">{col.title}</span>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="w-fit text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="text-xs text-fg-muted">Maintained by the AI&amp;DS department web committee.</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-muted">AI &amp; DS · PSG iTech</span>
        </div>
      </div>
    </footer>
  );
}
