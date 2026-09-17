import React, { useState, useMemo } from "react";
import AboutTabs from "../components/AboutTabs";
import { Search, X, FileText, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const DATA = {
  "Semester 1": {
    theory: [
      {
        title: "Calculus and its Applications",
        pdfPage: 30,
        url: "https://image2url.com/r2/default/documents/1767520058712-f4856925-0238-49cc-ac18-f1d451eb6b9e.pdf",
      },
      {
        title: "C Programming",
        pdfPage: 31,
        url: "https://image2url.com/r2/default/documents/1767520189369-89df32df-1de6-4c37-ac77-98ab55503a4c.pdf",
      },
      {
        title: "Basics of Electrical and Electronic Systems",
        pdfPage: 32,
        url: "https://image2url.com/r2/default/documents/1767520223915-e4638064-fa8e-40cf-9ec9-d090ec4e16bb.pdf",
      },
      {
        title: "English Language Proficiency",
        pdfPage: 33,
        url: "https://image2url.com/r2/default/documents/1767520260658-f8caab9d-7d67-4186-85ce-32ec6ea9a2cb.pdf",
      },
      {
        title: "Heritage of Tamils",
        pdfPage: 34,
        url: "https://image2url.com/r2/default/documents/1767520283550-b5db0557-1f30-472d-8d6a-b44f072caee3.pdf",
      },
    ],
    lab: [
      {
        title: "C Programming Laboratory",
        pdfPage: 36,
        url: "https://image2url.com/r2/default/documents/1767521624009-aa0cca59-a76a-4a37-9664-4fadcbd0ff46.pdf",
      },
      {
        title: "Engineering Skills Laboratory",
        pdfPage: 37,
        url: "https://image2url.com/r2/default/documents/1767520350635-15662c81-5638-42f9-ae8c-4d219ac545d0.pdf",
      },
      {
        title: "Design Thinking for Innovation",
        pdfPage: 40,
        url: "https://image2url.com/r2/default/documents/1767520373238-cb46e845-3cda-4851-848e-8cda69e5970d.pdf",
      },
    ],
  },

  "Semester 2": {
    theory: [
      {
        title: "Transforms and Applications",
        pdfPage: 42,
        url: "https://image2url.com/r2/default/documents/1767526938604-76511f19-4338-43a2-b562-d1139daa0f1e.pdf",
      },
      {
        title: "Discrete Mathematics",
        pdfPage: 43,
        url: "https://image2url.com/r2/default/documents/1767526961443-b2ab66d8-66a5-441f-9c67-70c36eb12372.pdf",
      },
      {
        title: "Applied Chemistry",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767526982386-3f3ef03a-72ea-4fa6-9d3f-1bfe7097e5a5.pdf",
      },
      {
        title: "Python Programming",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767526998126-2387d445-96a1-47a0-83cd-e9abf0f3f7c9.pdf",
      },
      {
        title: "Digital Principles & Computer Organization",
        pdfPage: 46,
        url: "https://image2url.com/r2/default/documents/1767527548961-aab56bce-d11b-4f69-8503-0da59a8d7fa8.pdf",
      },
      {
        title: "Tamils and Technology",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767527030369-ab02264a-c055-40eb-ac1a-acb38d9e8f38.pdf",
      },
    ],
    lab: [
      {
        title: "Python Programming Laboratory",
        pdfPage: 50,
        url: "https://image2url.com/r2/default/documents/1767527047449-caadff02-407b-4a32-b055-bf99f566e77d.pdf",
      },
      {
        title: "Chemistry Laboratory",
        pdfPage: 50,
        url: "https://image2url.com/r2/default/documents/1767527066026-5d181f42-9107-40a8-9efb-31bb099a6550.pdf",
      },
      {
        title: "Engineering Graphics",
        pdfPage: 51,
        url: "https://image2url.com/r2/default/documents/1767527084014-858c4bda-a0c4-4c69-b8a8-b7546079e70b.pdf",
      },
      {
        title: "Language Electives",
        pdfPage: 52,
        url: "https://image2url.com/r2/default/documents/1767527107441-b343e468-0db9-45b8-be02-937a5f1aaf59.pdf",
      },
      {
        title: "Workplace Communication Skills",
        pdfPage: 50,
        url: "https://image2url.com/r2/default/documents/1767527122505-90b4015c-8463-4774-ad0f-33094dc73607.pdf",
      },
    ],
  },

  "Semester 3": { 
    theory: [
      {
        title: "Artificial Intelligence",
        pdfPage: 51,
        url: "https://image2url.com/r2/default/documents/1767581442227-6095ec7b-ff5e-4b38-8d93-ad6a1c2b9253.pdf",
      },
      {
        title: "Design and Analysis of Algorithms",
        pdfPage: 43,
        url: "https://image2url.com/r2/default/documents/1767581496040-c48f7de4-7d77-4cb7-bff1-99126ebf371e.pdf",
      },
      {
        title: "Database Design and Management",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767581474518-e22b8df9-6581-494e-8298-17cb18448c86.pdf",
      },
      {
        title: "Data Exploration and Visualization",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767581458144-f6412ccb-7e41-436a-ac51-1898ab16c7a1.pdf",
      },
      {
        title: "Digital Principles & Computer Organization",
        pdfPage: 46,
        url: "https://image2url.com/r2/default/documents/1767581538605-7042da5b-fd09-4ee2-b7e0-975f195e9142.pdf",
      },
      {
        title: "Discrete Mathematics",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767581553278-3128de84-a365-4d34-bc0f-226a0be1716c.pdf",
      },
      ],
          lab:
            [
              {
        title: "Artificial Intelligence Laboratory",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767584698430-03706bc9-1b03-4494-adba-0565732f2384.pdf",
      },
      {
        title: "Database Design and Management Laboratory",
        pdfPage: 46,
        url: "https://image2url.com/r2/default/documents/1767584714136-ccceb17a-dfcc-47da-846d-1c92f603fb79.pdf",
      },
      {
        title: "Professional Development",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767584729855-3ea8693e-d6ef-4025-a961-0ff1ba17c447.pdf",
      },
    ],
  },
  "Semester 4": { 
    theory: [
      {
        title: "Probability and Statistics",
        pdfPage: 42,
        url: "https://image2url.com/r2/default/documents/1767621758441-51e5c4e4-ee01-4f00-bad1-9fabb9b2696a.pdf",
      },
      {
        title: "Operating Systems",
        pdfPage: 43,
        url: "https://image2url.com/r2/default/documents/1767621797703-763286e5-5fca-4ee6-a10f-9f0bd9b11ebd.pdf",
      },
      {
        title: "Machine Learning",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767621832011-69a21808-061c-4cc8-b750-1e5e16da3aa8.pdf",
      },
      {
        title: "Fundamentals of Data Science and Analytics",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767621847005-cfdc9852-393d-45cf-a408-c1eb60c19d75.pdf",
      },
      {
        title: "Computer Networks",
        pdfPage: 46,
        url: "https://image2url.com/r2/default/documents/1767621885168-9d98dbe0-0234-4833-ab7b-f2540c66b872.pdf",
      },
      {
        title: "Environmental Sciences and Sustainability",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767621899900-486c275e-6b4d-4adf-855c-f185c832ba64.pdf",
      },
      {
        title: "NCC Credit Course Level 2",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767621929822-6f42ffdc-e9c8-4eeb-ac64-41359da9b286.pdf",
      },
    ],
      lab: [
        {
        title: "Data Science and Analytics Laboratory",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767621949046-5774cd96-288e-40ec-add7-a863718ac586.pdf",
      },
      {
        title: "Machine Learning Laboratory",
        pdfPage: null,
        url: "https://image2url.com/r2/default/documents/1767621986810-eafeedff-524f-465f-8223-0d40bf4e061d.pdf",
      },
        ],
  },
  "Semester 5": 
  { 
    theory: 
      [
      {
        title: "Deep Learning",
        pdfPage: 42,
        url: "https://image2url.com/r2/default/documents/1767623968255-92e976ee-74bf-48fe-9474-dd5dd14bd6d7.pdf",
      },
      {
        title: "Data and Information Security",
        pdfPage: 43,
        url: "https://image2url.com/r2/default/documents/1767623860768-c8d08cf7-e358-4481-89fa-307a53000d89.pdf",
      },
      {
        title: "Distributed Computing",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767623886774-22614d14-51e0-4e84-b6ef-552da1699ba0.pdf",
      },
      {
        title: "Big Data Analytics",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767623836728-1b4b6549-b316-4aac-918b-34d7507a6eab.pdf",
      },
    ],
  lab:
    [
      {
        title: "Deep Learning Laboratory",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767624025337-41f70fa7-a8b8-4ee7-8c0e-4ab8ad5a6912.pdf",
      },
      {
        title: "Summer Internship",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767626242087-d5b1811b-6aa1-4760-8eb8-af06cf16283e.pdf",
      },
      ],
  },
  "Semester 6": 
  { 
    theory:
    [
    {
        title: "Embedded Systems and IoT",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767626987911-62e78fa9-b840-4971-9c65-d005c5c5b110.pdf",
      },
      {
        title: "NCC Credit Course Level 3",
        pdfPage: 45,
        url: "https://image2url.com/r2/default/documents/1767627017061-aa9c2f10-6d27-40ef-b712-43fdadb7b1a6.pdf",
      },
    ],
  lab: null },
  "Semester 7": 
  {  
    theory:
    [
    {
        title: "Human Values and Ethics",
        pdfPage: 44,
        url: "https://image2url.com/r2/default/documents/1767631557269-c13d082d-3712-47ce-8cab-f46eeb798b95.pdf",
      },
      ],
    lab: null },
  "Semester 8": { theory: null, 
     lab:
     [
     {
          title: "Project Work/Internship",
          pdfPage: 45,
          url: "https://image2url.com/r2/default/documents/1767630502465-b9ab6e18-fe60-424b-ba88-963b9d8a24b0.pdf",
      },
      ],
  },
};

export default function Syllabus() {
  const [openSem, setOpenSem] = useState(null);
  const [openGroup, setOpenGroup] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [openMessage, setOpenMessage] = useState(null);
  const [q, setQ] = useState("");
  const [invalidSearch, setInvalidSearch] = useState(false);

  const semesters = Object.keys(DATA);

  // Build search list
  const allSubjects = useMemo(() => {
    const list = [];
    for (const sem of semesters) {
      ["theory", "lab"].forEach((group) => {
        if (Array.isArray(DATA[sem][group])) {
          DATA[sem][group].forEach((course) => {
            list.push({ sem, group, ...course });
          });
        }
      });
    }
    return list;
  }, []);

  const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");
  const filteredSubjects = allSubjects.filter((s) =>
    normalize(s.title).includes(normalize(q))
  );

  return (
    <div className="font-brand bg-white min-h-screen">
      <AboutTabs />

      {/* Header */}
      <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] border-b-2 border-brand-navy flex items-end justify-between gap-5 flex-wrap">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Curriculum
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Syllabus
          </h1>
          <p className="m-0 max-w-[64ch] text-[14px] leading-[1.65] text-brand-ink-soft">
            Complete semester-wise course curriculum, theory subjects, and laboratory modules for AI &amp; DS.
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 py-8 max-w-5xl mx-auto flex flex-col gap-6">
        {/* Search */}
        <div className="flex items-stretch border-2 border-brand-navy max-w-md w-full">
          <span className="px-3.5 grid place-items-center text-brand-ink-soft">
            <Search size={16} />
          </span>
          <input
            value={q}
            onChange={(e) => {
              const value = e.target.value;
              setQ(value);
              setInvalidSearch(value.trim() && filteredSubjects.length === 0);
            }}
            placeholder="Search subjects by name..."
            className="flex-1 py-3 text-[13.5px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                setInvalidSearch(false);
              }}
              className="px-3 text-brand-ink-soft hover:text-brand-navy"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {q.trim() !== "" && filteredSubjects.length > 0 && (
          <div className="border border-brand-edge bg-brand-ground p-4 flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-navy">
              Found {filteredSubjects.length} matching subject{filteredSubjects.length > 1 ? "s" : ""}:
            </span>
            <div className="flex flex-col gap-1.5">
              {filteredSubjects.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setOpenSem(semesters.indexOf(s.sem));
                    setOpenGroup({ [s.sem]: s.group });
                    setOpenSubject(s);
                  }}
                  className="p-3 bg-white border border-brand-edge hover:border-brand-navy cursor-pointer flex items-center justify-between gap-3 text-[13px] transition-colors"
                >
                  <div>
                    <span className="font-semibold text-brand-navy">{s.title}</span>
                    <span className="text-brand-ink-soft text-[12px] ml-2">
                      ({s.sem} · {s.group === "theory" ? "Theory" : "Laboratory"})
                    </span>
                  </div>
                  <span className="text-brand-red font-medium text-[12px]">View PDF →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semester Accordion */}
        <div className="flex flex-col border border-brand-edge divide-y divide-brand-edge">
          {semesters.map((sem, index) => {
            const hasTheory = Array.isArray(DATA[sem]?.theory);
            const hasLab = Array.isArray(DATA[sem]?.lab);
            const isOpen = openSem === index;
            const currentGroup = openGroup[sem] || (hasTheory ? "theory" : "lab");

            return (
              <div key={sem} className="bg-white">
                <button
                  onClick={() => setOpenSem(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-brand-ground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-brand-navy text-white text-[12px] font-bold grid place-items-center">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[16px] text-brand-navy">{sem}</span>
                  </div>
                  <span className="text-brand-ink-soft">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-brand-row bg-[#fafbfc] flex flex-col gap-3">
                    {/* Theory / Lab Tabs */}
                    <div className="flex gap-2 border-b border-brand-edge pb-2">
                      <button
                        onClick={() => {
                          if (!hasTheory) return setOpenMessage("Theory content will be updated soon.");
                          setOpenGroup({ [sem]: "theory" });
                        }}
                        className={`px-4 py-2 text-[12px] font-semibold transition-colors ${
                          currentGroup === "theory"
                            ? "bg-brand-navy text-white"
                            : "border border-brand-edge text-brand-ink-soft hover:bg-white"
                        }`}
                      >
                        Theory ({DATA[sem]?.theory?.length || 0})
                      </button>

                      <button
                        onClick={() => {
                          if (!hasLab) return setOpenMessage("Laboratory content will be updated soon.");
                          setOpenGroup({ [sem]: "lab" });
                        }}
                        className={`px-4 py-2 text-[12px] font-semibold transition-colors ${
                          currentGroup === "lab"
                            ? "bg-brand-navy text-white"
                            : "border border-brand-edge text-brand-ink-soft hover:bg-white"
                        }`}
                      >
                        Laboratory ({DATA[sem]?.lab?.length || 0})
                      </button>
                    </div>

                    {/* Subject List */}
                    <div className="flex flex-col gap-2">
                      {Array.isArray(DATA[sem]?.[currentGroup]) &&
                        DATA[sem][currentGroup].map((subject, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-white border border-brand-edge flex items-center justify-between gap-3 hover:border-brand-navy transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-brand-navy shrink-0" />
                              <span className="text-[13.5px] font-medium text-brand-navy">
                                {subject.title}
                              </span>
                            </div>
                            <button
                              onClick={() => setOpenSubject(subject)}
                              className="px-3 py-1.5 text-[11.5px] font-semibold bg-brand-navy text-white hover:bg-brand-blue transition-colors shrink-0"
                            >
                              View PDF
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Invalid Search Alert */}
        {invalidSearch && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
            onClick={() => setInvalidSearch(false)}
          >
            <div className="bg-white p-6 border-2 border-brand-navy max-w-sm w-full mx-4 shadow-xl flex flex-col gap-3">
              <span className="text-[14px] text-brand-navy font-medium">
                No subjects matching "{q}" were found.
              </span>
              <button
                onClick={() => setInvalidSearch(false)}
                className="px-4 py-2 bg-brand-navy text-white text-[12px] font-semibold self-end"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {openMessage && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
            onClick={() => setOpenMessage(null)}
          >
            <div className="bg-white p-6 border-2 border-brand-navy max-w-sm w-full mx-4 shadow-xl flex flex-col gap-3">
              <span className="text-[14px] text-brand-navy font-medium">{openMessage}</span>
              <button
                onClick={() => setOpenMessage(null)}
                className="px-4 py-2 bg-brand-navy text-white text-[12px] font-semibold self-end"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* PDF Modal */}
        {openSubject && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-[999]">
            <div className="bg-white w-full max-w-5xl h-[85vh] border-2 border-brand-navy flex flex-col shadow-2xl">
              <div className="px-5 py-3.5 bg-brand-navy text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-brand-red shrink-0" />
                  <strong className="text-[14px] truncate">{openSubject.title}</strong>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {openSubject.url && (
                    <a
                      href={openSubject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-brand-on-navy hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink size={13} />
                      Open in tab
                    </a>
                  )}
                  <button
                    onClick={() => setOpenSubject(null)}
                    className="px-3 py-1 bg-brand-red text-white text-[12px] font-semibold hover:opacity-90"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 relative">
                {openSubject.url ? (
                  <iframe
                    src={`${openSubject.url}#page=${openSubject.pdfPage || 1}`}
                    title={openSubject.title}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-ink-soft">
                    <FileText size={36} className="text-brand-ink-faint" />
                    <p className="text-[14px]">PDF document will be available soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
