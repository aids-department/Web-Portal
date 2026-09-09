import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { User, Building, Code } from "lucide-react";
import AlumniCard from "../components/AlumniCard";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

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
        if (alum.name.toLowerCase().includes(term)) {
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
        alum.skills.forEach((skill) => {
          if (skill.toLowerCase().includes(term)) {
            if (!suggestionMap.has(skill)) {
              suggestionMap.set(skill, { value: skill, type: 'skill' });
            }
          }
        });
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

    // Search filter - FIXED: Added null/undefined checks
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          (a.company && a.company.toLowerCase().includes(term)) || // NULL CHECK ADDED HERE
          a.skills.some((skill) =>
            skill.toLowerCase().includes(term)
          )
      );
    }

    // Pass out year filter
    if (filters.passOutYear !== "All") {
      result = result.filter((a) => a.passOutYear == filters.passOutYear);
    }

    // Company filter - FIXED: Added null/undefined check
    if (filters.company) {
      result = result.filter((a) =>
        a.company && a.company.toLowerCase().includes(filters.company.toLowerCase()) // NULL CHECK ADDED HERE
      );
    }

    // Skills filter
    if (filters.skills) {
      const skillsArray = filters.skills
        .split(",")
        .map((s) => s.trim().toLowerCase());
      result = result.filter((a) =>
        skillsArray.every((skill) =>
          a.skills.map((s) => s.toLowerCase()).includes(skill)
        )
      );
    }

    setFilteredAlumni(result);
  }, [searchTerm, filters, alumni]);

  const suggestionIcon = (type) => {
    switch (type) {
      case 'name': return <User className="text-ds-blue" size={14} />;
      case 'company': return <Building className="text-ds-blue" size={14} />;
      case 'skill': return <Code className="text-ds-blue" size={14} />;
      default: return <FaSearch className="text-ds-ink-faint" size={12} />;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-body text-ds-ink-soft">Loading alumni…</p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 pb-6 border-b border-ds-edge">
        <div>
          <span className="text-kicker tracking-kicker uppercase text-ds-red">{alumni.length} members</span>
          <h1 className="text-page-heading text-navy mt-2.5">Alumni directory</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[266px_1fr] gap-8">
        {/* Filters */}
        <aside className="bg-ds-ground p-6 flex flex-col gap-6 h-fit">
          <div className="relative">
            <Field.Label htmlFor="alumni-search">Search</Field.Label>
            <Field.Input
              id="alumni-search"
              type="text"
              placeholder="Name, company or skill"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ds-edge z-30 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3.5 py-2.5 hover:bg-ds-ground cursor-pointer border-b border-ds-row last:border-b-0 flex items-center justify-between"
                    onClick={() => {
                      setSearchTerm(suggestion.value);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="flex items-center gap-2 text-body text-ds-ink">
                      {suggestionIcon(suggestion.type)}
                      {suggestion.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Field.Label htmlFor="alumni-year">Pass out year</Field.Label>
            <Field.Select
              id="alumni-year"
              value={filters.passOutYear}
              onChange={(e) => setFilters({ ...filters, passOutYear: e.target.value })}
            >
              <option>All</option>
              {passOutYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Field.Select>
          </div>

          <div>
            <Field.Label htmlFor="alumni-company">Company</Field.Label>
            <Field.Input
              id="alumni-company"
              type="text"
              placeholder="e.g. Google"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            />
          </div>

          <div>
            <Field.Label htmlFor="alumni-skills">Technical skills</Field.Label>
            <Field.Input
              id="alumni-skills"
              type="text"
              placeholder="e.g. Python, ML"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            />
          </div>

          <Button
            variant="quiet"
            onClick={() => {
              setFilters({ passOutYear: "All", company: "", skills: "" });
              setSearchTerm("");
            }}
          >
            Clear filters
          </Button>
        </aside>

        {/* Results */}
        <div className="flex flex-col gap-5">
          <span className="text-body text-ds-ink-soft">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </span>

          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-ds-edge border border-ds-edge">
              {filteredAlumni.map((alum) => (
                <AlumniCard key={alum._id} alumni={alum} />
              ))}
            </div>
          ) : (
            <div className="border border-ds-edge p-10 text-center">
              <p className="text-body text-ds-ink-soft">No alumni found matching your filters.</p>
            </div>
          )}

          {error && (
            <div className="bg-ds-red-tint border-t-2 border-ds-red text-ds-red-deep px-4 py-3 text-body">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
