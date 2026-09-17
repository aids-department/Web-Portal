import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { User, Building, Code } from "lucide-react";
import AlumniCard from "../components/AlumniCard";
import AlumniThoughts from "../components/AlumniThoughts";

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

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://web-portal-760h.onrender.com/api/alumni");
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
      case 'name': return <User className="text-brand-blue" size={14} />;
      case 'company': return <Building className="text-brand-blue" size={14} />;
      case 'skill': return <Code className="text-brand-blue" size={14} />;
      default: return <FaSearch className="text-brand-ink-faint" size={12} />;
    }
  };

  const clearFilters = () => {
    setFilters({ passOutYear: "All", company: "", skills: "" });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="font-brand px-5 sm:px-8 lg:px-12 py-10">
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading alumni…</p>
      </div>
    );
  }

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-5.5 gap-y-5">
      <div className="flex flex-col gap-2.5">
        <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
          {alumni.length} profiles
        </span>
        <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
          Alumni directory
        </h1>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <div className="flex items-stretch border-2 border-brand-navy">
          <span className="px-3.5 grid place-items-center text-brand-ink-soft">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Name, company or skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="flex-1 py-3.5 text-[13.5px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-edge shadow-lg z-30 max-h-56 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-3.5 py-2.5 hover:bg-brand-ground cursor-pointer border-b border-brand-row last:border-b-0 flex items-center justify-between gap-2"
                onClick={() => {
                  setSearchTerm(s.value);
                  setShowSuggestions(false);
                }}
              >
                <span className="flex items-center gap-2 text-[13px] text-brand-ink">
                  {suggestionIcon(s.type)}
                  {s.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-brand-ink-faint">{s.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,240px)_minmax(0,3fr)] gap-6 items-start">
        {/* Filters */}
        <aside className="border border-brand-edge bg-brand-ground p-5 flex flex-col gap-5 min-w-[230px]">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brand-navy">Filter</span>

          <div className="flex flex-col gap-2 border-t border-brand-edge pt-3.5">
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
              Pass out year
            </span>
            <select
              value={filters.passOutYear}
              onChange={(e) => setFilters({ ...filters, passOutYear: e.target.value })}
              className="border border-brand-ink-faint bg-white px-3 py-2.5 text-[12.5px] text-brand-navy outline-none"
            >
              <option>All</option>
              {passOutYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-edge pt-3.5">
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
              Company
            </span>
            <input
              type="text"
              list="alumni-companies"
              placeholder="e.g. Google"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="border border-brand-ink-faint bg-white px-3 py-2.5 text-[12.5px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
            />
            <datalist id="alumni-companies">
              {companies.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-edge pt-3.5">
            <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
              Skills
            </span>
            <input
              type="text"
              placeholder="e.g. Python, ML"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              className="border border-brand-ink-faint bg-white px-3 py-2.5 text-[12.5px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
            />
          </div>

          <button
            onClick={clearFilters}
            className="self-start px-3.5 py-2.5 border border-brand-ink-faint bg-white text-[11.5px] font-medium text-brand-ink-soft hover:bg-brand-ground"
          >
            Clear all
          </button>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex flex-col gap-3.5">
          <span className="text-[12.5px] text-brand-ink-soft">
            Showing {filteredAlumni.length} of {alumni.length}
          </span>

          {error && (
            <div className="bg-brand-red-tint text-brand-red-deep px-3.5 py-3 text-[13px]">
              Error: {error}
            </div>
          )}

          {filteredAlumni.length > 0 ? (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
            >
              {filteredAlumni.map((alum) => (
                <div key={alum._id} className="border border-brand-edge">
                  <AlumniCard alumni={alum} />
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-brand-edge p-10 text-center">
              <p className="m-0 text-[13.5px] text-brand-ink-soft">
                No alumni found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alumni Thoughts Carousel */}
      <div className="mt-6 sm:mt-8">
        <AlumniThoughts />
      </div>
    </div>
  );
}
