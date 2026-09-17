// components/Footer.jsx
import { Link } from "react-router-dom";

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
    <footer className="font-brand bg-brand-navy px-4 py-8 sm:px-8 lg:px-11 sm:py-9 lg:py-11 flex flex-col gap-7">
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white grid place-items-center">
              <div className="w-2 h-2 bg-brand-red" />
            </div>
            <span className="font-bold text-[12.5px] leading-none tracking-[0.14em] text-white">
              AI &amp; DS
            </span>
          </div>
          <p className="max-w-[34ch] text-[12.5px] leading-relaxed text-brand-on-navy">
            Department of Artificial Intelligence and Data Science.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-[11px]">
            <span className="text-[10px] font-semibold leading-none tracking-[0.18em] uppercase text-brand-red">
              {col.title}
            </span>
            {col.links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-[13px] leading-none text-brand-on-navy hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-[#23345c] pt-[18px] flex flex-wrap justify-between gap-4">
        <span className="text-[11.5px] leading-none text-[#6b7a95]">
          Maintained by the AI&amp;DS department web committee.
        </span>
      </div>
    </footer>
  );
}
