import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { teamData } from "../data/teamData";

// Flatten all leads + children into a single array
const flattenAllMembers = (data) => {
  const result = [];
  data.forEach((lead) => {
    result.push(lead);
    if (lead.children && lead.children.length > 0) {
      result.push(...flattenAllMembers(lead.children));
    }
  });
  return result;
};

const getRoleCategory = (role) => {
  const r = role.toLowerCase();
  if (r.includes("coordinator") || r.includes("lead")) return "Leads";
  if (r.includes("frontend") && r.includes("backend")) return "Full Stack";
  if (r.includes("frontend")) return "Frontend";
  if (r.includes("backend") || r.includes("database")) return "Backend & Data";
  if (r.includes("ui") || r.includes("designer")) return "UI/UX Design";
  return "Members";
};

const CATEGORIES = ["All", "Leads", "Frontend", "Backend & Data", "UI/UX Design"];
const VIEWS = [
  ["members", "All members"],
  ["pods", "Pods"],
];

const MemberPhoto = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = src && src !== "/user-icon.jpg" && !imgError;

  return (
    <div className="w-fit self-center bg-brand-blue-tint border border-[#c3cfe3]">
      {hasPhoto ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImgError(true)}
          className="max-w-[150px] h-auto block"
        />
      ) : (
        <div className="w-[150px] h-[150px] grid place-items-center">
          <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-[#5f6e88]">
            Portrait
          </span>
        </div>
      )}
    </div>
  );
};

const MemberCard = ({ member }) => (
  <div className="font-brand bg-white p-5 flex flex-col gap-2.5">
    <MemberPhoto src={member.imageUrl} alt={member.name} />
    <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-red">
      {member.role}
    </span>
    <h3 className="m-0 text-[15px] font-semibold leading-[1.25] text-brand-navy">{member.name}</h3>
    <span className="text-[11.5px] text-brand-ink-soft">Year {member.collegeYear}</span>
    {member.skills?.length > 0 && (
      <div className="mt-auto border-t border-brand-row pt-2.5 flex flex-wrap gap-1.5">
        {member.skills.map((skill) => (
          <span key={skill} className="px-2 py-1 border border-brand-ink-faint text-[10.5px] text-brand-ink-soft">
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default function TeamInfo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState("members");

  const allMembers = useMemo(() => flattenAllMembers(teamData), []);

  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.skills || []).some((s) => s.toLowerCase().includes(q)) ||
        (m.collegeYear && m.collegeYear.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeCategory === "All") return true;
      if (activeCategory === "Leads") {
        return m.role.toLowerCase().includes("lead") || m.role.toLowerCase().includes("coordinator");
      }
      return getRoleCategory(m.role) === activeCategory;
    });
  }, [allMembers, searchQuery, activeCategory]);

  return (
    <div className="font-brand">
      <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
              Web portal
            </span>
            <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
              Team
            </h1>
            <p className="m-0 max-w-[70ch] text-[14px] leading-[1.7] text-brand-ink-soft">
              Students who built and maintain this portal.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {VIEWS.map(([val, label]) => (
              <button
                key={val}
                onClick={() => setView(val)}
                className={`px-3.5 py-2 text-[12px] font-semibold ${
                  view === val ? "bg-brand-navy text-white" : "border border-brand-edge text-brand-ink-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === "members" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 text-[11.5px] font-medium whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-brand-navy text-white"
                        : "border border-brand-edge text-brand-ink-soft"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-stretch border-2 border-brand-navy max-w-xs">
                <span className="px-3 grid place-items-center text-brand-ink-faint">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Name, role or skill"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-2.5 text-[13px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
                />
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="border border-brand-edge p-10 text-center">
                <p className="m-0 text-[13.5px] text-brand-ink-soft">No members match your search.</p>
              </div>
            ) : (
              <div
                className="grid gap-px bg-brand-edge border border-brand-edge"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
              >
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "pods" && (
          <div className="flex flex-col gap-7">
            {teamData.map((lead) => (
              <div key={lead.id} className="border border-brand-edge p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(120px,150px)_minmax(0,2fr)] gap-6">
                  <MemberPhoto src={lead.imageUrl} alt={lead.name} />
                  <div className="min-w-0 flex flex-col gap-2">
                    <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-brand-red">
                      {lead.role}
                    </span>
                    <h2 className="m-0 text-[22px] font-semibold text-brand-navy">{lead.name}</h2>
                    <span className="text-[12.5px] text-brand-ink-soft">Year {lead.collegeYear}</span>
                    {lead.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lead.skills.map((s) => (
                          <span key={s} className="px-2.5 py-1 border border-brand-ink-faint text-[11px] text-brand-ink-soft">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
                    Contributors ({lead.children?.length || 0})
                  </span>
                  {(!lead.children || lead.children.length === 0) ? (
                    <p className="m-0 text-[13px] text-brand-ink-soft">No direct contributors listed.</p>
                  ) : (
                    <div
                      className="grid gap-px bg-brand-edge border border-brand-edge"
                      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
                    >
                      {lead.children.map((sub) => (
                        <MemberCard key={sub.id} member={sub} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
