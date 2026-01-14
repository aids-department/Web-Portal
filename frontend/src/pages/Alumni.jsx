import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { User, Building, Code } from "lucide-react";
import AlumniCard from "../components/AlumniCard";

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">Loading alumni...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/10 to-transparent rounded-full -translate-y-48 translate-x-48 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/10 to-transparent rounded-full translate-y-40 -translate-x-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Alumni Connect - AI and Data Science Department
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Connect with our successful alumni working in leading tech companies
              worldwide. Explore their career paths, skills, and get inspired for
              your journey.
            </p>
          </div>
        </section>

      {/* Search and Filters */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alumni by name, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click on suggestions
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => {
                  const getIcon = (type) => {
                    switch (type) {
                      case 'name':
                        return <User className="text-blue-500" size={16} />;
                      case 'company':
                        return <Building className="text-green-500" size={16} />;
                      case 'skill':
                        return <Code className="text-purple-500" size={16} />;
                      default:
                        return <FaSearch className="text-gray-400" size={14} />;
                    }
                  };

                  const getTypeLabel = (type) => {
                    switch (type) {
                      case 'name':
                        return 'Name';
                      case 'company':
                        return 'Company';
                      case 'skill':
                        return 'Skill';
                      default:
                        return '';
                    }
                  };

                  return (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchTerm(suggestion.value);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getIcon(suggestion.type)}
                          <span className="text-gray-700 ml-2">{suggestion.value}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {getTypeLabel(suggestion.type)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pass Out Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              Pass Out Year
            </label>
            <select
              value={filters.passOutYear}
              onChange={(e) =>
                setFilters({ ...filters, passOutYear: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              {passOutYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              placeholder="e.g., Google"
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Skills
            </label>
            <input
              type="text"
              placeholder="e.g., Python, ML"
              value={filters.skills}
              onChange={(e) =>
                setFilters({ ...filters, skills: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setFilters({ passOutYear: "All", company: "", skills: "" });
            setSearchTerm("");
          }}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
        </div>
      </section>

      {/* Results Count */}
      <div className="text-gray-600 font-medium">
        Showing {filteredAlumni.length} of {alumni.length} alumni
      </div>

      {/* Alumni Cards Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((alum) => (
                <AlumniCard key={alum._id} alumni={alum} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10 text-center">
            <p className="text-lg text-gray-600">
              No alumni found matching your filters.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="relative bg-gradient-to-br from-red-50 via-white to-pink-50 backdrop-blur-lg px-4 py-3 rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-200/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>

          <div className="relative z-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              Error: {error}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
