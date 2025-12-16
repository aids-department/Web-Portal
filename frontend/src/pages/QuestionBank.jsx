import React, { useState, useEffect, useMemo } from "react";
import { Upload, Search, FileText, Download, Eye, BookOpen, FileQuestion, X, CheckCircle, AlertCircle, Filter, ChevronDown, CheckSquare, Square } from "lucide-react";

/* =====================================================
   ANNA UNIVERSITY R2021 — AI & DS SUBJECT LIST
====================================================== */
const SUBJECTS = {
  1: [
    { code: "HS3151", name: "Professional English - I" },
    { code: "MA3151", name: "Matrices and Calculus" },
    { code: "PH3151", name: "Engineering Physics" },
    { code: "CY3151", name: "Engineering Chemistry" },
    { code: "GE3151", name: "Problem Solving and Python Programming" },
    { code: "GE3171", name: "Python Programming Lab" },
  ],
  2: [
    { code: "HS3251", name: "Professional English - II" },
    { code: "MA3251", name: "Statistics and Numerical Methods" },
    { code: "PH3256", name: "Physics for Information Science" },
    { code: "BE3251", name: "Basic Electrical and Electronics Engineering" },
    { code: "CS3251", name: "Programming in C" },
    { code: "CS3271", name: "C Programming Lab" },
  ],
  3: [
    { code: "MA3354", name: "Discrete Mathematics" },
    { code: "AD3391", name: "Foundations of Data Science" },
    { code: "CS3351", name: "Digital Principles & Computer Organization" },
    { code: "AD3351", name: "Data Structures" },
    { code: "AD3352", name: "Probability and Queueing Theory" },
  ],
  4: [
    { code: "AD3401", name: "Design and Analysis of Algorithms" },
    { code: "AD3491", name: "Database Management Systems" },
    { code: "CS3491", name: "Artificial Intelligence" },
    { code: "AD3451", name: "Machine Learning" },
    { code: "AD3411", name: "Algorithms Laboratory" },
  ],
  5: [
    { code: "AD3501", name: "Deep Learning" },
    { code: "CS3551", name: "Computer Networks" },
    { code: "AD3502", name: "Big Data Analytics" },
    { code: "AD3503", name: "Reinforcement Learning" },
  ],
  6: [
    { code: "CS3691", name: "Cyber Security" },
    { code: "AD3601", name: "Natural Language Processing" },
    { code: "AD3602", name: "Cloud Computing" },
  ],
};

const FILTER_OPTIONS = ["Semester", "Internal 1", "Internal 2", "Question Bank"];

export default function QuestionBank() {
  const [tab, setTab] = useState("upload");
  const [semester, setSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({}); 
  const [manualSubjectName, setManualSubjectName] = useState("");
  const [manualSubjectCode, setManualSubjectCode] = useState("");
  
  const [resourceType, setResourceType] = useState("paper"); 
  const [examSelection, setExamSelection] = useState("Internal 1"); 

  const [searchQuery, setSearchQuery] = useState("");
  
  // ✅ NEW: Multi-Select Filter State
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const getDownloadUrl = (url, fileName) => {
    if (!url) return "#";
    const cleanName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    return url.replace("/upload/", `/upload/fl_attachment:${cleanName}/`);
  };

  useEffect(() => {
    if (tab === "search") {
      fetchPapers();
    }
  }, [tab, searchQuery]);

  const fetchPapers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/qp?search=${searchQuery}`);
      const data = await res.json();
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
    }
  };

  // ✅ TOGGLE FILTER FUNCTION
  const toggleFilter = (option) => {
    setSelectedFilters((prev) => 
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Remove if exists
        : [...prev, option] // Add if not exists
    );
  };

  // ✅ SORTING & FILTERING LOGIC
  const processedUploads = useMemo(() => {
    let data = [...uploads];

    // 1. FILTER (Multi-Select)
    if (selectedFilters.length > 0) {
      data = data.filter((u) => selectedFilters.includes(u.examType));
    }

    // 2. SORT (Hierarchy: Semester -> Int 1 -> Int 2 -> QB)
    const typeOrder = { 
      "Semester": 1, 
      "Internal 1": 2, 
      "Internal 2": 3, 
      "Question Bank": 4 
    };

    data.sort((a, b) => {
      const typeA = typeOrder[a.examType] || 99;
      const typeB = typeOrder[b.examType] || 99;
      return typeA - typeB;
    });

    return data;
  }, [uploads, selectedFilters]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const userString = localStorage.getItem("user");
    if (!userString) {
      showToast("You must be logged in to upload.", "error");
      return;
    }
    const user = JSON.parse(userString);

    const fileInput = document.getElementById("qpFile");
    if (!fileInput.files.length) {
      showToast("Please select a PDF file.", "error");
      return;
    }

    const finalName = manualSubjectName || (selectedSubject && selectedSubject.name);
    const finalCode = manualSubjectCode || (selectedSubject && selectedSubject.code);
    const finalExamType = resourceType === "bank" ? "Question Bank" : examSelection;

    if (!finalName || !finalCode) {
      showToast("Please select or enter subject details.", "error");
      return;
    }

   setLoading(true);
    const formData = new FormData();
    formData.append("pdfFile", fileInput.files[0]);
    formData.append("semester", semester);
    formData.append("subjectName", finalName);
    formData.append("subjectCode", finalCode);
    formData.append("examType", finalExamType);
    formData.append("authorId", user.id);

    try {
      const res = await fetch("http://localhost:5000/api/qp", {
        method: "POST",
        body: formData,
      });
      
      const result = await res.json();

      if (res.ok && result.success) { // Check res.ok (status 200-299)
        showToast("Uploaded successfully!", "success");
        setTab("search");
        fetchPapers();
        
        // Reset Form
        setSemester("");
        setSelectedSubject({});
        setManualSubjectName("");
        setManualSubjectCode("");
        fileInput.value = "";
      } else {
        // This will now show "File too large. Maximum limit is 10MB."
        showToast(result.error || "Upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800 relative" onClick={() => setIsFilterOpen(false)}>
      
      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-5 duration-300 ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider">{toast.type === "success" ? "Success" : "Error"}</h4>
            <p className="font-medium text-base">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 opacity-80 hover:opacity-100">
            <X size={18} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Resource Repository</h1>
        <p className="text-gray-500">Access previous year question papers and question banks</p>
      </div>

      {/* TABS */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setTab("upload")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "upload" ? "bg-blue-900 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Upload size={18} /> Upload
          </button>
          <button
            onClick={() => setTab("search")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "search" ? "bg-blue-900 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Search size={18} /> Search
          </button>
        </div>
      </div>

      {/* UPLOAD SECTION */}
      {tab === "upload" && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Upload New Resource</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Semester</label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSelectedSubject({});
              }}
            >
              <option value="">-- Select Semester --</option>
              {Object.keys(SUBJECTS || {}).map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {semester && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Subject</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3 transition"
                value={selectedSubject?.code || ""} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setSelectedSubject({});
                  } else {
                    const subject = SUBJECTS[semester].find((s) => s.code === val);
                    setSelectedSubject(subject || {});
                  }
                  setManualSubjectName("");
                  setManualSubjectCode("");
                }}
              >
                <option value="">-- Choose from List --</option>
                {SUBJECTS[semester] && SUBJECTS[semester].map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>

              {!selectedSubject?.code && (
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                  <p className="text-xs text-center text-gray-500 mb-2 font-bold uppercase tracking-wider">Or Enter Manually</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      className="w-2/3 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      value={manualSubjectName}
                      onChange={(e) => setManualSubjectName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Code"
                      className="w-1/3 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      value={manualSubjectCode}
                      onChange={(e) => setManualSubjectCode(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {((selectedSubject && selectedSubject.code) || manualSubjectName) && (
            <form onSubmit={handleUpload} className="animate-in fade-in slide-in-from-top-4 duration-500">
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Type</label>
              <div className="flex gap-4 mb-4">
                <label 
                  className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                    resourceType === 'paper' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setResourceType('paper')}
                >
                  <FileQuestion size={18} />
                  <span className="font-medium">Question Paper</span>
                </label>

                <label 
                  className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                    resourceType === 'bank' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setResourceType('bank')}
                >
                  <BookOpen size={18} />
                  <span className="font-medium">Question Bank</span>
                </label>
              </div>

              {resourceType === 'paper' && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Exam Category</label>
                  <select 
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={examSelection}
                    onChange={(e) => setExamSelection(e.target.value)}
                  >
                    <option>Internal 1</option>
                    <option>Internal 2</option>
                    <option>Semester</option>
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PDF File</label>
                <input type="file" id="qpFile" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg p-1" accept=".pdf" />
              </div>

              <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800 hover:shadow-lg"}`}>
                {loading ? "Uploading..." : "Submit Resource"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SEARCH SECTION */}
      {tab === "search" && (
        <div className="max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
          
          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by subject name or code..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ✅ NEW: MULTI-SELECT FILTER DROPDOWN */}
            <div className="relative min-w-[220px]">
              
              {/* Filter Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                className={`w-full flex items-center justify-between pl-12 pr-4 py-3 border rounded-xl shadow-sm transition-all ${
                  isFilterOpen || selectedFilters.length > 0 ? "bg-blue-50 border-blue-500 text-blue-800" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <Filter className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${selectedFilters.length > 0 ? "text-blue-600" : "text-gray-400"}`} size={18} />
                <span className="font-medium truncate">
                  {selectedFilters.length === 0 ? "Filter Type" : `Filters (${selectedFilters.length})`}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    {FILTER_OPTIONS.map((option) => {
                      const isSelected = selectedFilters.includes(option);
                      return (
                        <div 
                          key={option} 
                          onClick={() => toggleFilter(option)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50 text-blue-800" : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare size={18} className="text-blue-600 fill-blue-50" />
                          ) : (
                            <Square size={18} className="text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Clear Button */}
                  {selectedFilters.length > 0 && (
                    <div 
                      onClick={() => setSelectedFilters([])}
                      className="border-t border-gray-100 p-2 text-center text-xs font-bold text-red-500 cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      CLEAR ALL
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {processedUploads.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">No resources found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {processedUploads.map((u) => {
                const niceName = `${u.subjectCode}_${u.examType}_Sem${u.semester}`;
                const isBank = u.examType === "Question Bank";
                
                return (
                  <div key={u._id} className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg shrink-0 ${isBank ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isBank ? <BookOpen size={24} /> : <FileText size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 leading-tight">
                          {u.subjectName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                           <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {u.subjectCode}
                           </span>
                           <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                             isBank ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                           }`}>
                             {u.examType}
                           </span>
                           <span className="text-xs text-gray-500 font-medium">
                             Semester {u.semester}
                           </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                          Added {new Date(u.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <a href={u.fileUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                        <Eye size={16} /> View
                      </a>
                      <a href={getDownloadUrl(u.fileUrl, niceName)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 transition shadow-sm cursor-pointer">
                        <Download size={16} /> Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}