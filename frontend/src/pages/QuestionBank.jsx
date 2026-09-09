import React, { useState, useEffect, useMemo } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

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
  ],
  2: [
    { code: "HS3251", name: "Professional English - II" },
    { code: "MA3251", name: "Statistics and Numerical Methods" },
    { code: "CS3251", name: "Programming in C" },
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
  ],
  5: [
    { code: "AD3501", name: "Deep Learning" },
    { code: "CS3551", name: "Computer Networks" },
    { code: "AD3502", name: "Big Data Analytics" },
  ],
  6: [
    { code: "CS3691", name: "Cyber Security" },
    { code: "AD3601", name: "Natural Language Processing" },
  ],
};

export default function QuestionBank() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Search and Browse States
  const [searchQuery, setSearchQuery] = useState("");
  const [uploads, setUploads] = useState([]);
  
  // Filter States
  const [activeTypes, setActiveTypes] = useState(["Question paper", "Question bank"]);
  const [activeExams, setActiveExams] = useState(["End semester"]);
  const [filterSem, setFilterSem] = useState("5");
  
  // Upload States
  const [semester, setSemester] = useState("5");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [resourceType, setResourceType] = useState("Question paper");
  const [examCategory, setExamCategory] = useState("End semester");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    fetchPapers();
  }, [searchQuery]);

  const fetchPapers = async () => {
    try {
      const res = await fetch(`https://web-portal-760h.onrender.com/api/qp?search=${searchQuery}`);
      const data = await res.json();
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
    }
  };

  const processedUploads = useMemo(() => {
    let data = [...uploads];
    if (filterSem) {
      data = data.filter(u => String(u.semester) === String(filterSem));
    }
    if (activeTypes.length > 0) {
      data = data.filter(u => activeTypes.includes(u.examType) || (u.examType === 'Question paper' && activeTypes.includes('Question paper')));
    }
    if (activeExams.length > 0) {
      // Basic filtering based on exam types if they match
      data = data.filter(u => activeExams.includes(u.examType) || u.examType === 'Question bank' || u.examType === 'Notes');
    }
    // Sorting newest
    data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return data;
  }, [uploads, activeTypes, activeExams, filterSem]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem("user");
    if (!userString) {
      showToast("You must be logged in to upload.", "error");
      return;
    }
    const user = JSON.parse(userString);
    const fileInput = document.getElementById("qpFile");
    if (!fileInput?.files.length) {
      showToast("Please select a PDF file.", "error");
      return;
    }

    if (!selectedSubject) {
      showToast("Please select a subject.", "error");
      return;
    }
    
    const subjectInfo = SUBJECTS[semester]?.find(s => s.code === selectedSubject);

    setLoading(true);
    const formData = new FormData();
    formData.append("pdfFile", fileInput.files[0]);
    formData.append("semester", semester);
    formData.append("subjectName", subjectInfo ? subjectInfo.name : "Unknown");
    formData.append("subjectCode", selectedSubject);
    formData.append("examType", resourceType === "Question paper" ? examCategory : resourceType);
    formData.append("authorId", user.id);

    try {
      const res = await fetch("https://web-portal-760h.onrender.com/api/qp", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast("Uploaded successfully!", "success");
        setShowUploadModal(false);
        fetchPapers();
      } else {
        showToast(result.error || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getDownloadUrl = (url, subjectCode) => {
    if (!url) return "#";
    return url.replace("/upload/", `/upload/fl_attachment:${subjectCode}_resource/`);
  };

  const toggleType = (t) => setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleExam = (e) => setActiveExams(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  return (
    <div className="bg-[#e8e6e3] min-h-screen">
      
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 border-t-2 ${
          toast.type === "success" ? "bg-navy text-white border-ds-blue" : "bg-ds-red text-white border-ds-red-deep"
        }`}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <div>
            <h4 className="text-[10.5px] leading-none tracking-kicker uppercase font-semibold">{toast.type === "success" ? "Success" : "Error"}</h4>
            <p className="text-[14px] mt-1">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 opacity-80 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto bg-white border border-[#0e1c3d]/20 shadow-[0_2px_10px_rgba(14,28,61,0.08)] relative">
        
        {/* Header */}
        <div className="pt-[34px] px-gutter pb-[22px] bg-white flex items-end justify-between">
          <div className="flex flex-col gap-[9px]">
            <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
              {uploads.length} files · student contributed
            </span>
            <h1 className="m-0 font-semibold text-[42px] leading-none tracking-display text-navy">
              Question bank
            </h1>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-[18px] py-[13px] bg-ds-red text-white font-semibold text-[12.5px] leading-none no-underline border-none cursor-pointer"
          >
            Upload a resource
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-gutter pb-5 bg-white">
          <div className="flex items-stretch border-2 border-navy">
            <span className="px-3.5 grid place-items-center font-normal text-[13px] leading-none text-[#7d7979]">Search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Subject code or name — for example AD5301 or Machine Learning" 
              className="flex-1 border-none outline-none py-3.5 font-normal text-[14px] leading-none text-ds-ink"
            />
            <button className="px-[22px] bg-navy text-white border-none font-semibold text-[12.5px] leading-none cursor-pointer">
              Search
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-[250px_1fr] bg-white">
          
          {/* Sidebar Filters */}
          <aside className="border-r border-ds-edge bg-ds-ground pt-[26px] px-6 pb-10 flex flex-col gap-6">
            <span className="font-semibold text-[11px] leading-none tracking-[.18em] uppercase text-navy">Refine</span>
            
            <div className="flex flex-col gap-2.5">
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Resource type</span>
              {["Question paper", "Question bank", "Notes"].map(type => (
                <label key={type} className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                  <span 
                    onClick={() => toggleType(type)}
                    className={`w-3.5 h-3.5 border flex items-center justify-center ${activeTypes.includes(type) ? 'border-navy bg-navy text-white' : 'border-[#bab6b6] bg-white'}`}
                  >
                    {activeTypes.includes(type) && <CheckCircle size={10} strokeWidth={4} />}
                  </span>
                  {type}
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Exam category</span>
              {["Internal 1", "Internal 2", "End semester", "Model exam"].map(exam => (
                <label key={exam} className="flex items-center gap-[9px] font-normal text-[13px] leading-none text-ds-ink cursor-pointer">
                  <span 
                    onClick={() => toggleExam(exam)}
                    className={`w-3.5 h-3.5 border flex items-center justify-center ${activeExams.includes(exam) ? 'border-navy bg-navy text-white' : 'border-[#bab6b6] bg-white'}`}
                  >
                    {activeExams.includes(exam) && <CheckCircle size={10} strokeWidth={4} />}
                  </span>
                  {exam}
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-[9px]">
              <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Semester</span>
              <div className="border border-[#bab6b6] bg-white px-3 py-2.5 flex justify-between items-center relative">
                <select 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={filterSem}
                  onChange={(e) => setFilterSem(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                <span className="font-normal text-[13px] leading-none text-navy pointer-events-none">
                  {filterSem ? `Semester ${filterSem}` : "All Semesters"}
                </span>
                <span className="font-normal text-[10px] leading-none text-[#9b9797] pointer-events-none">▾</span>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="pt-[26px] px-10 pb-[46px] flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="font-normal text-[12.5px] leading-none text-ds-ink-soft">
                {processedUploads.length} results {searchQuery && `for “${searchQuery}”`}
              </span>
              <span className="font-normal text-[12.5px] leading-none text-ds-ink-soft">Sort: newest</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ds-edge border border-ds-edge">
              {processedUploads.length > 0 ? processedUploads.map(r => (
                <div key={r._id} className="bg-white px-5 py-[18px] flex flex-col gap-[9px]">
                  <div className="flex items-center gap-[9px]">
                    <span className="px-2 py-1 font-semibold text-[9.5px] leading-none tracking-[.1em] uppercase bg-ds-blue-tint text-ds-blue">
                      {r.examType}
                    </span>
                    <span className="font-normal text-[11.5px] leading-none text-[#9b9797] tabular-nums">{r.subjectCode}</span>
                  </div>
                  <h3 className="m-0 font-semibold text-[15.5px] leading-[1.3] text-navy">{r.subjectName}</h3>
                  <span className="font-normal text-[12px] leading-[1.4] text-ds-ink-soft">Semester {r.semester} · {new Date(r.uploadedAt).toLocaleDateString()}</span>
                  <div className="border-t border-ds-row pt-2.5 mt-auto flex justify-between items-center">
                    <span className="font-normal text-[11.5px] leading-none text-[#9b9797]">
                      {r.author ? r.author.fullName || r.author.username || "Unknown" : "Anonymous"}
                    </span>
                    <a href={getDownloadUrl(r.fileUrl, r.subjectCode)} className="font-semibold text-[11.5px] leading-none text-ds-red no-underline" target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 bg-white p-10 text-center font-normal text-[14px] text-ds-ink-soft">
                  No resources found matching criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal (2g match) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-navy/60 flex items-center justify-center p-4 z-50">
          <div className="w-[760px] max-w-full bg-white flex flex-col shadow-2xl relative">
            <div className="bg-navy pt-[22px] px-[28px] pb-[22px] flex justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-[10px] leading-none tracking-[.18em] uppercase text-ds-red">Contribute</span>
                <span className="font-semibold text-[24px] leading-[1.2] text-white">Upload a resource</span>
              </div>
              <span onClick={() => setShowUploadModal(false)} className="font-normal text-[18px] leading-none text-[#8c9ab5] cursor-pointer hover:text-white">×</span>
            </div>

            <form onSubmit={handleUpload} className="p-[26px_28px_32px] flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-[18px]">
                <div className="flex flex-col gap-[7px]">
                  <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Semester</span>
                  <div className="border border-[#bab6b6] p-[12px_13px] flex justify-between relative">
                    <select className="absolute inset-0 w-full opacity-0 cursor-pointer" value={semester} onChange={e => { setSemester(e.target.value); setSelectedSubject(""); }}>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                    <span className="font-normal text-[13.5px] leading-none text-navy">Semester {semester}</span>
                    <span className="font-normal text-[10px] leading-none text-[#9b9797]">▾</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[7px]">
                  <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Subject</span>
                  <div className="border border-[#bab6b6] p-[12px_13px] flex justify-between relative">
                    <select className="absolute inset-0 w-full opacity-0 cursor-pointer" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                      <option value="">Select...</option>
                      {SUBJECTS[semester]?.map(sub => <option key={sub.code} value={sub.code}>{sub.code} — {sub.name}</option>)}
                    </select>
                    <span className="font-normal text-[13.5px] leading-none text-navy truncate">
                      {selectedSubject ? `${selectedSubject} — ${SUBJECTS[semester]?.find(s => s.code === selectedSubject)?.name}` : "Select a subject"}
                    </span>
                    <span className="font-normal text-[10px] leading-none text-[#9b9797]">▾</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[9px]">
                <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Resource type</span>
                <div className="flex">
                  {["Question paper", "Question bank", "Notes"].map((type, idx) => (
                    <span 
                      key={type}
                      onClick={() => setResourceType(type)}
                      className={`px-4 py-[11px] cursor-pointer ${
                        resourceType === type 
                          ? "font-semibold text-[12px] leading-none bg-navy text-white border border-navy" 
                          : `font-medium text-[12px] leading-none text-ds-ink-soft border border-ds-edge ${idx > 0 ? 'border-l-0' : ''}`
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {resourceType === "Question paper" && (
                <div className="flex flex-col gap-[9px] border-l-4 border-ds-red pl-4">
                  <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-ds-red">Exam category · question papers only</span>
                  <div className="flex gap-5 pt-[2px]">
                    {["Internal 1", "Internal 2", "End semester", "Model exam"].map(exam => (
                      <label key={exam} className={`flex items-center gap-2 font-normal text-[13px] leading-none cursor-pointer ${examCategory === exam ? 'text-navy' : 'text-ds-ink'}`}>
                        <span onClick={() => setExamCategory(exam)} className={`w-[13px] h-[13px] rounded-full flex items-center justify-center ${examCategory === exam ? 'border-[4px] border-navy' : 'border border-[#bab6b6]'}`}></span>
                        {exam}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-[18px]">
                <div className="flex flex-col gap-[7px]">
                  <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Academic year</span>
                  <div className="border border-[#bab6b6] p-[12px_13px] font-normal text-[13.5px] leading-none text-navy tabular-nums">
                    2025 — 2026
                  </div>
                </div>
                <div className="flex flex-col gap-[7px]">
                  <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">Title shown in results</span>
                  <div className="border border-[#bab6b6] p-[12px_13px] font-normal text-[13.5px] leading-none text-[#9b9797]">
                    Optional
                  </div>
                </div>
              </div>

              <label className="border-2 border-dashed border-[#bcc7dc] bg-[#f7f9fc] p-[30px] flex flex-col gap-2 items-start cursor-pointer hover:bg-[#eff3f8]">
                <span className="font-semibold text-[14px] leading-none text-navy">Drop a PDF here, or browse</span>
                <span className="font-normal text-[12.5px] leading-[1.5] text-ds-ink-soft">Up to 25 MB. Scanned papers are fine if the text is legible. Files are checked by a moderator before they appear.</span>
                <span className="mt-2.5 px-[15px] py-[10px] border border-navy font-medium text-[12px] leading-none text-navy">Choose file</span>
                <input id="qpFile" type="file" className="hidden" accept=".pdf" />
              </label>

              <div className="flex justify-between items-center border-t-2 border-navy pt-[18px]">
                <span className="font-normal text-[12px] leading-none text-[#7d7979]">Uploaded as {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : "Guest"} · visible after review</span>
                <div className="flex gap-2.5">
                  <span onClick={() => setShowUploadModal(false)} className="px-[17px] py-3 border border-[#bab6b6] font-medium text-[12px] leading-none text-ds-ink-soft cursor-pointer hover:bg-ds-ground">Cancel</span>
                  <button type="submit" disabled={loading} className="px-[17px] py-3 bg-ds-red border-none text-white font-semibold text-[12px] leading-none cursor-pointer hover:bg-ds-red-deep">
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
