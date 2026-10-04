import React, { useState, useMemo } from "react";
import { Search, UserRound, Users } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import { EmptyState } from "../components/ui/States";
import { Stagger, StaggerItem } from "../components/ui/Reveal";
import { EASE } from "../components/ui/motion";
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

const MemberPhoto = ({ src, alt, className = "aspect-square w-full" }) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = src && src !== "/user-icon.jpg" && !imgError;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-canvas-elevated ${className}`}>
      {hasPhoto ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-expo group-hover:scale-[1.03]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.16),transparent_70%)]">
          <UserRound className="h-8 w-8 text-fg-muted/50" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
};

const MemberCard = ({ member }) => (
  <SpotlightCard interactive className="h-full">
    <div className="flex h-full flex-col gap-3 p-4">
      <MemberPhoto src={member.imageUrl} alt={member.name} />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-accent-bright">
          {member.role}
        </span>
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-fg">{member.name}</h3>
        <span className="text-[12px] text-fg-muted">Year {member.collegeYear}</span>
      </div>
      {member.skills?.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
          {member.skills.map((skill) => (
            <span key={skill} className="pill-neutral text-[10.5px]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </SpotlightCard>
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
    <div className="container-ln flex flex-col gap-6 pb-8">
      <PageHeader
        eyebrow="Web portal"
        title="Team"
        description="Students who built and maintain this portal."
        spacing="pt-14 pb-2 sm:pt-20 sm:pb-4 lg:pt-24"
        actions={
          <div className="tabs">
            {VIEWS.map(([val, label]) => (
              <button
                key={val}
                onClick={() => setView(val)}
                className={`tab relative isolate ${view === val ? "text-fg" : ""}`}
              >
                {view === val && (
                  <motion.span
                    layoutId="team-view"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_1px_8px_rgba(0,0,0,0.35)]"
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        }
      />

      {view === "members" && (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-[background-color,color,box-shadow] duration-200 ${
                    activeCategory === cat
                      ? "bg-accent/15 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.45)]"
                      : "text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/[0.04] hover:text-fg"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                placeholder="Name, role or skill"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search team"
                className="field pl-10"
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <EmptyState icon={Users} title="No members match your search." />
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
            >
              {filteredMembers.map((member) => (
                <div key={member.id} className="animate-fade-in">
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "pods" && (
        <Stagger className="flex flex-col gap-6">
          {teamData.map((lead) => (
            <StaggerItem key={lead.id} className="surface edge-highlight flex flex-col gap-6 p-6 sm:p-8">
              <div className="group grid grid-cols-1 gap-6 sm:grid-cols-[minmax(120px,150px)_minmax(0,2fr)]">
                <MemberPhoto src={lead.imageUrl} alt={lead.name} className="aspect-square w-full max-w-[150px]" />
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="eyebrow-accent">{lead.role}</span>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    <span className="text-gradient">{lead.name}</span>
                  </h2>
                  <span className="text-[13px] text-fg-muted">Year {lead.collegeYear}</span>
                  {lead.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lead.skills.map((s) => (
                        <span key={s} className="pill-neutral">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="eyebrow border-b border-line pb-3">
                  Contributors ({lead.children?.length || 0})
                </span>
                {(!lead.children || lead.children.length === 0) ? (
                  <p className="text-[13px] text-fg-muted">No direct contributors listed.</p>
                ) : (
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
                  >
                    {lead.children.map((sub) => (
                      <MemberCard key={sub.id} member={sub} />
                    ))}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
