import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import AlumniCard from "../components/AlumniCard";

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Apply filters and search
  useEffect(() => {
    let result = alumni;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.company.toLowerCase().includes(term) ||
          a.skills.some((skill) =>
            skill.toLowerCase().includes(term)
          )
      );
    }

    // Pass out year filter
    if (filters.passOutYear !== "All") {
      result = result.filter((a) => a.passOutYear == filters.passOutYear);
    }

    // Company filter
    if (filters.company) {
      result = result.filter((a) =>
        a.company.toLowerCase().includes(filters.company.toLowerCase())
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
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          Alumni Connect - AI and Data Science Department
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Connect with our successful alumni working in leading tech companies
          worldwide. Explore their career paths, skills, and get inspired for
          your journey.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alumni by name, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
      </section>

      {/* Results Count */}
      <div className="text-gray-600 font-medium">
        Showing {filteredAlumni.length} of {alumni.length} alumni
      </div>

      {/* Alumni Cards Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alum) => (
            <AlumniCard key={alum._id} alumni={alum} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="text-lg text-gray-600">
            No alumni found matching your filters.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
}
