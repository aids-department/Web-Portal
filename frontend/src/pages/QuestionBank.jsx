import React, { useState, useEffect, useMemo } from "react";
import { Upload, Search, FileText, Download, Eye, BookOpen, FileQuestion, X, CheckCircle, AlertCircle, Filter, ChevronDown, CheckSquare, Square, User, NotebookPen } from "lucide-react";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";
import Tabs from "../components/ui/Tabs";

/* =====================================================
   ANNA UNIVERSITY R2021 – AI & DS SUBJECT LIST
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

const FILTER_OPTIONS = ["Semester", "Internal 1", "Internal 2", "Question Bank", "Notes"];

export default function QuestionBank() {
  const [tab, setTab] = useState("upload");
  const [semester, setSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({});
  const [manualSubjectName, setManualSubjectName] = useState("");
  const [manualSubjectCode, setManualSubjectCode] = useState("");

  const [resourceType, setResourceType] = useState("paper");
  const [examSelection, setExamSelection] = useState("Internal 1");

  const [searchQuery, setSearchQuery] = useState("");

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
      const res = await fetch(`https://web-portal-760h.onrender.com/api/qp?search=${searchQuery}`);
      const data = await res.json();
      console.log("📄 Fetched papers:", data);
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
    }
  };

  const toggleFilter = (option) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const processedUploads = useMemo(() => {
    let data = [...uploads];

    if (selectedFilters.length > 0) {
      data = data.filter((u) => selectedFilters.includes(u.examType));
    }

    const typeOrder = {
      "Semester": 1,
      "Internal 1": 2,
      "Internal 2": 3,
      "Question Bank": 4,
      "Notes": 5
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

    // Determine final exam type based on resource selection
    let finalExamType;
    if (resourceType === "bank") {
      finalExamType = "Question Bank";
    } else if (resourceType === "notes") {
      finalExamType = "Notes";
    } else {
      finalExamType = examSelection;
    }

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
      const res = await fetch("https://web-portal-760h.onrender.com/api/qp", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showToast("Uploaded successfully!", "success");
        setTab("search");
        fetchPapers();

        setSemester("");
        setSelectedSubject({});
        setManualSubjectName("");
        setManualSubjectCode("");
        fileInput.value = "";
      } else {
        showToast(result.error || "Upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resourceTag = (examType) => {
    if (examType === "Question Bank") return "workshop";
    if (examType === "Notes") return "outline";
    return "question-paper";
  };

  return (
    <div onClick={() => setIsFilterOpen(false)}>

      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 border-t-2 ${
          toast.type === "success" ? "bg-navy text-white border-ds-blue" : "bg-ds-red text-white border-ds-red-deep"
        }`}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <div>
            <h4 className="text-kicker tracking-kicker uppercase">{toast.type === "success" ? "Success" : "Error"}</h4>
            <p className="text-body">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 opacity-80 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 pb-6 border-b-2 border-navy">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Student contributed</span>
        <h1 className="text-page-heading text-navy mt-2.5">Question bank</h1>
        <p className="text-body text-ds-ink-soft mt-2">Past question papers, question banks and study notes.</p>
      </div>

      {/* TABS */}
      <Tabs className="mb-8">
        <Tabs.Tab active={tab === "upload"} onClick={() => setTab("upload")}>
          <span className="inline-flex items-center gap-2"><Upload size={15} /> Upload</span>
        </Tabs.Tab>
        <Tabs.Tab active={tab === "search"} onClick={() => setTab("search")}>
          <span className="inline-flex items-center gap-2"><Search size={15} /> Search</span>
        </Tabs.Tab>
      </Tabs>

      {/* UPLOAD SECTION */}
      {tab === "upload" && (
        <div className="max-w-2xl border border-ds-edge p-7" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-card-title text-navy mb-6 pb-3 border-b border-ds-row">Upload a new resource</h2>

          <div className="mb-5">
            <Field.Label htmlFor="qb-semester">Semester</Field.Label>
            <Field.Select
              id="qb-semester"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSelectedSubject({});
              }}
            >
              <option value="">Select semester</option>
              {Object.keys(SUBJECTS || {}).map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </Field.Select>
          </div>

          {semester && (
            <div className="mb-5">
              <Field.Label htmlFor="qb-subject">Subject</Field.Label>
              <Field.Select
                id="qb-subject"
                className="mb-3"
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
                <option value="">Choose from list</option>
                {SUBJECTS[semester] && SUBJECTS[semester].map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} – {sub.name}
                  </option>
                ))}
              </Field.Select>

              {!selectedSubject?.code && (
                <div className="bg-ds-ground p-4 border border-dashed border-ds-edge">
                  <p className="text-kicker tracking-kicker uppercase text-ds-ink-faint mb-2">Or enter manually</p>
                  <div className="flex gap-2">
                    <Field.Input
                      type="text"
                      placeholder="Subject name"
                      className="w-2/3"
                      value={manualSubjectName}
                      onChange={(e) => setManualSubjectName(e.target.value)}
                    />
                    <Field.Input
                      type="text"
                      placeholder="Code"
                      className="w-1/3"
                      value={manualSubjectCode}
                      onChange={(e) => setManualSubjectCode(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {((selectedSubject && selectedSubject.code) || manualSubjectName) && (
            <form onSubmit={handleUpload}>

              <Field.Label>Resource type</Field.Label>
              <div className="flex mb-5">
                {[
                  { key: 'paper', label: 'Question paper', icon: FileQuestion },
                  { key: 'bank', label: 'Question bank', icon: BookOpen },
                  { key: 'notes', label: 'Notes', icon: NotebookPen },
                ].map(({ key, label, icon: Icon }, i) => (
                  <label
                    key={key}
                    className={`flex-1 cursor-pointer border py-3 flex flex-col items-center justify-center gap-2 ${i > 0 ? 'border-l-0' : ''} ${
                      resourceType === key ? 'bg-navy border-navy text-white' : 'bg-white border-ds-edge text-ds-ink-soft'
                    }`}
                    onClick={() => setResourceType(key)}
                  >
                    <Icon size={18} />
                    <span className="text-label font-medium">{label}</span>
                  </label>
                ))}
              </div>

              {resourceType === 'paper' && (
                <div className="mb-5">
                  <Field.Label htmlFor="qb-exam">Exam category</Field.Label>
                  <Field.Select
                    id="qb-exam"
                    value={examSelection}
                    onChange={(e) => setExamSelection(e.target.value)}
                  >
                    <option>Internal 1</option>
                    <option>Internal 2</option>
                    <option>Semester</option>
                  </Field.Select>
                </div>
              )}

              <div className="mb-6">
                <Field.Label htmlFor="qpFile">Upload PDF file</Field.Label>
                <input
                  type="file"
                  id="qpFile"
                  className="block w-full text-body text-ds-ink-soft file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-label file:font-medium file:bg-navy file:text-white cursor-pointer border border-ds-edge p-1"
                  accept=".pdf"
                />
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
                {loading ? "Uploading…" : "Submit resource"}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* SEARCH SECTION */}
      {tab === "search" && (
        <div onClick={(e) => e.stopPropagation()}>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="flex-1">
              <Field.Input
                type="text"
                placeholder="Search by subject name or code…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* MULTI-SELECT FILTER DROPDOWN */}
            <div className="relative min-w-[220px]">

              <button
                onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 border ${
                  isFilterOpen || selectedFilters.length > 0 ? "bg-ds-blue-tint border-ds-blue text-ds-blue" : "bg-white border-ds-edge text-ds-ink-soft"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Filter size={15} />
                  <span className="text-label font-medium truncate">
                    {selectedFilters.length === 0 ? "Filter type" : `Filters (${selectedFilters.length})`}
                  </span>
                </span>
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ds-edge z-20">
                  <div className="p-2">
                    {FILTER_OPTIONS.map((option) => {
                      const isSelected = selectedFilters.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleFilter(option)}
                          className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer ${
                            isSelected ? "bg-ds-blue-tint text-ds-blue" : "hover:bg-ds-ground text-ds-ink"
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-ds-blue" />
                          ) : (
                            <Square size={16} className="text-ds-ink-faint" />
                          )}
                          <span className="text-label font-medium">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedFilters.length > 0 && (
                    <div
                      onClick={() => setSelectedFilters([])}
                      className="border-t border-ds-edge p-2 text-center text-kicker tracking-kicker uppercase text-ds-red cursor-pointer hover:bg-ds-red-tint"
                    >
                      Clear all
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {processedUploads.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-ds-edge">
              <FileText className="text-ds-ink-faint mx-auto mb-4" size={32} />
              <p className="text-body text-ds-ink-soft">No resources found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-ds-edge border border-ds-edge">
              {processedUploads.map((u) => {
                const niceName = `${u.subjectCode}_${u.examType}_Sem${u.semester}`;
                const isNotes = u.examType === "Notes";
                const isBank = u.examType === "Question Bank";
                const IconComponent = isNotes ? NotebookPen : (isBank ? BookOpen : FileText);

                return (
                  <div key={u._id} className="bg-white p-5">

                    {/* Main Content Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-ds-blue-tint text-ds-blue shrink-0">
                          <IconComponent size={22} />
                        </div>
                        <div>
                          <h3 className="text-card-title text-navy leading-tight">
                            {u.subjectName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="font-mono text-label font-semibold text-ds-ink-soft bg-ds-ground px-2 py-0.5">
                              {u.subjectCode}
                            </span>
                            <Tag variant={resourceTag(u.examType)}>{u.examType}</Tag>
                            <span className="text-label text-ds-ink-faint">
                              Semester {u.semester}
                            </span>
                          </div>
                          <p className="text-label text-ds-ink-faint mt-1.5">
                            Added {new Date(u.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 w-full md:w-auto mt-2 md:mt-0">
                        <a href={u.fileUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none">
                          <Button variant="secondary" className="w-full justify-center">
                            <Eye size={15} /> View
                          </Button>
                        </a>
                        <a href={getDownloadUrl(u.fileUrl, niceName)} className="flex-1 md:flex-none">
                          <Button variant="navy" className="w-full justify-center">
                            <Download size={15} /> Download
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Uploader Info Section */}
                    <div className="flex items-center gap-2 pt-3 border-t border-ds-row">
                      {u.author ? (
                        <div className="flex items-center gap-2 text-label text-ds-ink-faint">
                          <User size={13} />
                          <span>Uploaded by <span className="font-medium text-ds-ink-soft">{u.author.fullName || u.author.username || "Unknown"}</span></span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-label text-ds-ink-faint">
                          <User size={13} />
                          <span>Uploader information not available</span>
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
    </div>
  );
}
