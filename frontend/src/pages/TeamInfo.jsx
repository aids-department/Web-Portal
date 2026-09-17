import React, { useState, useMemo } from "react";
import {
  Crown,
  Sparkles,
  Code2,
  Palette,
  Database,
  Users,
  Search,
  Layers,
  GraduationCap,
} from "lucide-react";
import AboutTabs from "../components/AboutTabs";
import { teamData } from "../data/teamData";

// Helper: Flatten all leads + children into single array
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

// Role category normalizer
const getRoleCategory = (role) => {
  const r = role.toLowerCase();
  if (r.includes("coordinator") || r.includes("lead")) return "Leads";
  if (r.includes("frontend") && r.includes("backend")) return "Full Stack";
  if (r.includes("frontend")) return "Frontend";
  if (r.includes("backend") || r.includes("database")) return "Backend & Data";
  if (r.includes("ui") || r.includes("designer")) return "UI/UX Design";
  return "Members";
};

// Role Icon mapping
const RoleIcon = ({ role, className = "w-4 h-4" }) => {
  const r = role.toLowerCase();
  if (r.includes("coordinator") || r.includes("lead")) {
    return <Crown className={`${className} text-amber-500`} />;
  }
  if (r.includes("ui") || r.includes("designer")) {
    return <Palette className={`${className} text-purple-600`} />;
  }
  if (r.includes("backend") || r.includes("database")) {
    return <Database className={`${className} text-emerald-600`} />;
  }
  return <Code2 className={`${className} text-blue-600`} />;
};

// Avatar with fallback
const MemberAvatar = ({ src, alt, name }) => {
  const [imgError, setImgError] = useState(false);
  const isPlaceholder = !src || src === "/user-icon.jpg" || imgError;

  if (isPlaceholder) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center select-none overflow-hidden">
        <img
          src="/user-icon.jpg"
          alt={alt || name || "Member placeholder"}
          className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setImgError(true)}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
};

export default function TeamInfo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "pods" | "projects"

  const allMembers = useMemo(() => flattenAllMembers(teamData), []);

  const leadMembers = useMemo(() => {
    const order = ["Tiruvikraman", "Varsha Kumaraguru", "Joel Ebenezer", "Harikrishna"];
    return [...teamData].sort((a, b) => {
      const idxA = order.findIndex((o) => o.toLowerCase() === a.name.toLowerCase());
      const idxB = order.findIndex((o) => o.toLowerCase() === b.name.toLowerCase());
      if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, []);

  // Filtered members for Categories view
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

  // Grouped members by role category
  const categoriesList = ["All", "Leads", "Frontend", "Backend & Data", "UI/UX Design"];

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans selection:bg-brand-red selection:text-white">
      {/* Department About Tabs */}
      <AboutTabs />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-slate-200 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-navy/5 text-brand-navy border border-brand-navy/10">
                <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                Department Engineering &amp; Design
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Portal Development Team
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl">
              Meet the student architects, full-stack engineers, and UI/UX designers who built and maintain the official AI &amp; DS Web Portal.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "categories"
                  ? "bg-brand-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-brand-navy hover:bg-slate-50"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Members</span>
            </button>
            <button
              onClick={() => setActiveTab("pods")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "pods"
                  ? "bg-brand-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-brand-navy hover:bg-slate-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pods</span>
            </button>
          </div>
        </div>

        {/* Tab 1: All Members with Search & Category Filters */}
        {activeTab === "categories" && (
          <div>
            {/* Search & Category Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-brand-navy text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-brand-navy"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, role, skill…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition-all"
                />
              </div>
            </div>

            {/* Members Grid */}
            {filteredMembers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No members match your search</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for a different name, skill, or role</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMembers.map((member) => {
                  const isLead =
                    member.role.toLowerCase().includes("lead") ||
                    member.role.toLowerCase().includes("coordinator");

                  return (
                    <div
                      key={member.id}
                      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden hover:shadow-lg ${
                        isLead
                          ? "border-brand-navy/30 ring-1 ring-brand-navy/10 hover:border-brand-navy"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Top banner / image */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <MemberAvatar
                          src={member.imageUrl}
                          alt={member.name}
                          name={member.name}
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {isLead && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-navy text-white shadow-xs">
                              <Crown className="w-3 h-3 text-amber-300" />
                              Lead
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 shadow-xs">
                            <GraduationCap className="w-3 h-3 text-brand-navy" />
                            Yr {member.collegeYear}
                          </span>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-2 mb-1.5">
                            <RoleIcon role={member.role} className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red leading-snug">
                              {member.role}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-navy transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Dept. of {member.department}
                          </p>
                        </div>

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {member.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 text-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Leadership Pods (Lead + Team Members hierarchy) */}
        {activeTab === "pods" && (
          <div className="space-y-12">
            {leadMembers.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8"
              >
                {/* Lead Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200">
                    <MemberAvatar
                      src={lead.imageUrl}
                      alt={lead.name}
                      name={lead.name}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-navy text-white">
                        <Crown className="w-3 h-3 text-amber-300" />
                        {lead.role}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Class of {lead.collegeYear}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
                      {lead.name}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lead.skills?.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-team Members */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Team Contributors ({lead.children?.length || 0})
                    </h4>
                  </div>

                  {(!lead.children || lead.children.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">
                      Oversees overall departmental initiative coordination and strategic planning.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {lead.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:bg-white hover:border-slate-300 transition-all hover:shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                            <MemberAvatar
                              src={sub.imageUrl}
                              alt={sub.name}
                              name={sub.name}
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {sub.name}
                            </h5>
                            <p className="text-[11px] font-medium text-brand-navy line-clamp-1 mt-0.5">
                              {sub.role}
                            </p>
                            <span className="inline-block text-[10px] text-slate-400 font-medium">
                              Year {sub.collegeYear}
                            </span>
                          </div>
                        </div>
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
