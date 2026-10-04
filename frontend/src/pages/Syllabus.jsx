import React, { useState, useMemo } from "react";
import AboutTabs from "../components/AboutTabs";
import { Search, X, FileText, ChevronDown, ChevronUp, ExternalLink, ArrowRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import { Stagger, StaggerItem } from "../components/ui/Reveal";

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
    <div>
      <AboutTabs />

      <div className="container-ln">
        <PageHeader
          spacing="pt-10 pb-10 sm:pt-12 sm:pb-12"
          eyebrow="Curriculum"
          title="Syllabus"
          description="Complete semester-wise course curriculum, theory subjects, and laboratory modules for AI & DS."
        />
      </div>

      <div className="container-ln flex max-w-5xl flex-col gap-6 pb-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            value={q}
            onChange={(e) => {
              const value = e.target.value;
              setQ(value);
              setInvalidSearch(value.trim() && filteredSubjects.length === 0);
            }}
            placeholder="Search subjects by name..."
            aria-label="Search subjects"
            className="field py-3 pl-10 pr-10"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                setInvalidSearch(false);
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {q.trim() !== "" && filteredSubjects.length > 0 && (
          <div className="surface flex flex-col gap-3 p-4 animate-fade-in">
            <span className="eyebrow">
              Found {filteredSubjects.length} matching subject{filteredSubjects.length > 1 ? "s" : ""}
            </span>
            <div className="flex flex-col gap-1.5">
              {filteredSubjects.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setOpenSem(semesters.indexOf(s.sem));
                    setOpenGroup({ [s.sem]: s.group });
                    setOpenSubject(s);
                  }}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.02] p-3 text-left text-[13px] transition-colors duration-200 hover:border-line-accent hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-fg">{s.title}</span>
                    <span className="ml-2 text-[12px] text-fg-muted">
                      {s.sem} · {s.group === "theory" ? "Theory" : "Laboratory"}
                    </span>
                  </div>
                  <span className="flex flex-none items-center gap-1 text-[12px] font-medium text-accent-bright">
                    View PDF
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semester Accordion */}
        <Stagger className="flex flex-col gap-3">
          {semesters.map((sem, index) => {
            const hasTheory = Array.isArray(DATA[sem]?.theory);
            const hasLab = Array.isArray(DATA[sem]?.lab);
            const isOpen = openSem === index;
            const currentGroup = openGroup[sem] || (hasTheory ? "theory" : "lab");

            return (
              <StaggerItem
                key={sem}
                className={`surface overflow-hidden transition-[border-color,box-shadow] duration-300 ${
                  isOpen ? "border-line-accent shadow-card-hover" : ""
                }`}
              >
                <button
                  onClick={() => setOpenSem(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-lg font-mono text-[13px] font-medium transition-colors duration-300 ${
                        isOpen ? "bg-accent text-white shadow-glow" : "border border-white/10 bg-white/[0.04] text-fg-muted"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-semibold tracking-tight text-fg">{sem}</span>
                  </div>
                  <span className="text-fg-muted">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-4 border-t border-line px-5 pb-5 pt-4 animate-fade-in">
                    {/* Theory / Lab Tabs */}
                    <div className="tabs w-fit">
                      <button
                        onClick={() => {
                          if (!hasTheory) return setOpenMessage("Theory content will be updated soon.");
                          setOpenGroup({ [sem]: "theory" });
                        }}
                        className={`tab ${currentGroup === "theory" ? "tab-active" : ""}`}
                      >
                        Theory <span className="ml-1 font-mono text-[11px] opacity-70">{DATA[sem]?.theory?.length || 0}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!hasLab) return setOpenMessage("Laboratory content will be updated soon.");
                          setOpenGroup({ [sem]: "lab" });
                        }}
                        className={`tab ${currentGroup === "lab" ? "tab-active" : ""}`}
                      >
                        Laboratory <span className="ml-1 font-mono text-[11px] opacity-70">{DATA[sem]?.lab?.length || 0}</span>
                      </button>
                    </div>

                    {/* Subject List */}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Array.isArray(DATA[sem]?.[currentGroup]) &&
                        DATA[sem][currentGroup].map((subject, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5 transition-colors duration-200 hover:border-line-hover hover:bg-white/[0.04]"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="icon-tile h-8 w-8 flex-none">
                                <FileText size={14} className="text-fg-muted" />
                              </span>
                              <span className="text-[13.5px] font-medium text-fg">
                                {subject.title}
                              </span>
                            </div>
                            <button
                              onClick={() => setOpenSubject(subject)}
                              className="btn-secondary btn-sm flex-none"
                            >
                              View PDF
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Invalid Search Alert */}
        {invalidSearch && (
          <Modal onBackdropClick={() => setInvalidSearch(false)} onEscape={() => setInvalidSearch(false)} className="max-w-sm">
            <div className="flex flex-col gap-4 p-6">
              <span className="text-[14px] font-medium text-fg">
                No subjects matching "{q}" were found.
              </span>
              <button onClick={() => setInvalidSearch(false)} className="btn-primary btn-sm self-end">
                Close
              </button>
            </div>
          </Modal>
        )}

        {/* Message Alert */}
        {openMessage && (
          <Modal onBackdropClick={() => setOpenMessage(null)} onEscape={() => setOpenMessage(null)} className="max-w-sm">
            <div className="flex flex-col gap-4 p-6">
              <span className="text-[14px] font-medium text-fg">{openMessage}</span>
              <button onClick={() => setOpenMessage(null)} className="btn-primary btn-sm self-end">
                OK
              </button>
            </div>
          </Modal>
        )}

        {/* PDF Modal */}
        {openSubject && (
          <Modal onEscape={() => setOpenSubject(null)} className="flex h-[85vh] max-w-5xl flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText size={16} className="shrink-0 text-accent-bright" />
                <strong className="truncate text-[14px] font-medium text-fg">{openSubject.title}</strong>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {openSubject.url && (
                  <a
                    href={openSubject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost btn-sm"
                  >
                    <ExternalLink size={13} />
                    Open in tab
                  </a>
                )}
                <button onClick={() => setOpenSubject(null)} className="btn-secondary btn-sm">
                  Close
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-canvas">
              {openSubject.url ? (
                <iframe
                  src={`${openSubject.url}#page=${openSubject.pdfPage || 1}`}
                  title={openSubject.title}
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-fg-muted">
                  <FileText size={36} className="text-fg-muted/60" />
                  <p className="text-[14px]">PDF document will be available soon.</p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
