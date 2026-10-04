import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { User, Building, Code, SlidersHorizontal, Users } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { LoadingState, EmptyState } from "../components/ui/States";
import AlumniCard from "../components/AlumniCard";
import AlumniThoughts from "../components/AlumniThoughts";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://web-portal-760h.onrender.com';

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    passOutYear: "All",
    company: "",
    skills: "",
  });
  const [passOutYears, setPassOutYears] = useState([]);
  const [companies, setCompanies] = useState([]);
  const searchRef = useRef(null);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/alumni`);
        if (!response.ok) throw new Error("Failed to fetch alumni");
        const data = await response.json();
        setAlumni(data);
        setFilteredAlumni(data);

        // Extract unique years and companies
        const years = [...new Set(data.map((a) => a.passOutYear))].sort(
          (a, b) => b - a
        );
        const companies_list = [
          ...new Set(data.map((a) => a.company).filter((c) => c)),
        ].sort();
        setPassOutYears(years);
        setCompanies(companies_list);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const suggestionMap = new Map();

      alumni.forEach((alum) => {
        // Add matching names
        if (alum.name && alum.name.toLowerCase().includes(term)) {
          if (!suggestionMap.has(alum.name)) {
            suggestionMap.set(alum.name, { value: alum.name, type: 'name' });
          }
        }
        // Add matching companies
        if (alum.company && alum.company.toLowerCase().includes(term)) {
          if (!suggestionMap.has(alum.company)) {
            suggestionMap.set(alum.company, { value: alum.company, type: 'company' });
          }
        }
        // Add matching skills
        if (Array.isArray(alum.skills)) {
          alum.skills.forEach((skill) => {
            if (skill && skill.toLowerCase().includes(term)) {
              if (!suggestionMap.has(skill)) {
                suggestionMap.set(skill, { value: skill, type: 'skill' });
              }
            }
          });
        }
      });

      const suggestionArray = Array.from(suggestionMap.values()).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(suggestionArray);
      setShowSuggestions(suggestionArray.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, alumni]);

  // Apply filters and search
  useEffect(() => {
    let result = alumni;

    // Search filter - with safe checks
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          (a.name && a.name.toLowerCase().includes(term)) ||
          (a.company && a.company.toLowerCase().includes(term)) ||
          (Array.isArray(a.skills) &&
            a.skills.some((skill) => skill && skill.toLowerCase().includes(term)))
      );
    }

    // Pass out year filter
    if (filters.passOutYear !== "All") {
      result = result.filter((a) => a.passOutYear == filters.passOutYear);
    }

    // Company filter
    if (filters.company) {
      result = result.filter((a) =>
        a.company && a.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    // Skills filter
    if (filters.skills) {
      const skillsArray = filters.skills
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      result = result.filter((a) =>
        Array.isArray(a.skills) &&
        skillsArray.every((skill) =>
          a.skills.map((s) => (s ? s.toLowerCase() : "")).includes(skill)
        )
      );
    }

    setFilteredAlumni(result);
  }, [searchTerm, filters, alumni]);

  const suggestionIcon = (type) => {
    switch (type) {
      case 'name': return <User className="text-accent-bright" size={14} />;
      case 'company': return <Building className="text-accent-bright" size={14} />;
      case 'skill': return <Code className="text-accent-bright" size={14} />;
      default: return <FaSearch className="text-fg-muted" size={12} />;
    }
  };

  const clearFilters = () => {
    setFilters({ passOutYear: "All", company: "", skills: "" });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="container-ln">
        <LoadingState label="Loading alumni" />
      </div>
    );
  }

  return (
    <div className="container-ln flex flex-col gap-6 pb-8">
      <PageHeader eyebrow={`${alumni.length} profiles`} title="Alumni directory" spacing="pt-14 pb-4 sm:pt-20 sm:pb-6 lg:pt-24">
        {/* Search */}
        <div ref={searchRef} className="relative mt-8 max-w-xl">
          <FaSearch size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            placeholder="Name, company or skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            aria-label="Search alumni"
            className="field py-3.5 pl-11 text-[14px]"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 animate-fade-in overflow-y-auto rounded-xl border border-line bg-canvas-elevated/95 p-1.5 shadow-popover backdrop-blur-xl"
            >
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.06]"
                  onClick={() => {
                    setSearchTerm(s.value);
                    setShowSuggestions(false);
                  }}
                >
                  <span className="flex items-center gap-2.5 text-[13px] text-fg">
                    {suggestionIcon(s.type)}
                    {s.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">{s.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(220px,250px)_minmax(0,3fr)]">
        {/* Filters */}
        <aside className="surface flex min-w-[230px] flex-col gap-5 p-5 lg:sticky lg:top-24">
          <span className="eyebrow flex items-center gap-2">
            <SlidersHorizontal size={12} />
            Filter
          </span>

          <label className="flex flex-col gap-2">
            <span className="field-label mb-0 font-mono text-[10px] uppercase tracking-[0.16em]">
              Pass out year
            </span>
            <select
              value={filters.passOutYear}
              onChange={(e) => setFilters({ ...filters, passOutYear: e.target.value })}
              className="field"
            >
              <option>All</option>
              {passOutYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="field-label mb-0 font-mono text-[10px] uppercase tracking-[0.16em]">
              Company
            </span>
            <input
              type="text"
              list="alumni-companies"
              placeholder="e.g. Google"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="field"
            />
            <datalist id="alumni-companies">
              {companies.map((c) => <option key={c} value={c} />)}
            </datalist>
          </label>

          <label className="flex flex-col gap-2">
            <span className="field-label mb-0 font-mono text-[10px] uppercase tracking-[0.16em]">
              Skills
            </span>
            <input
              type="text"
              placeholder="e.g. Python, ML"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              className="field"
            />
          </label>

          <button onClick={clearFilters} className="btn-secondary btn-sm self-start">
            Clear all
          </button>
        </aside>

        {/* Results */}
        <div className="flex min-w-0 flex-col gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            Showing <span className="text-fg">{filteredAlumni.length}</span> of {alumni.length}
          </span>

          {error && (
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300">
              Error: {error}
            </div>
          )}

          {filteredAlumni.length > 0 ? (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
            >
              {filteredAlumni.map((alum) => (
                <div key={alum._id} className="animate-fade-in">
                  <AlumniCard alumni={alum} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title="No alumni found matching your filters." />
          )}
        </div>
      </div>

      {/* Alumni Thoughts Carousel */}
      <div className="mt-10 border-t border-line pt-14 sm:mt-14">
        <AlumniThoughts />
      </div>
    </div>
  );
}
