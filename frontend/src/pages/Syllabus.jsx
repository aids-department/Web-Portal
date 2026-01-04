import React, { useState, useMemo } from "react";
import SYLLABUS from "../data/syllabus.json";

const DATA = {
  "Semester 1": {
    theory: [
      { title: "Calculus and its Applications", pdfPage: 30 },
      { title: "C Programming", pdfPage: 31 },
      { title: "Basics of Electrical and Electronic Systems", pdfPage: 32 },
      { title: "English Language Proficiency", pdfPage: 33 },
      { title: "Heritage of Tamils", pdfPage: 34 },
    ],
    lab: [
      { title: "C Programming Laboratory", pdfPage: 36 },
      { title: "Engineering Skills Laboratory", pdfPage: 37 },
      { title: "Design Thinking for Innovation", pdfPage: 40 },
    ],
  },

  "Semester 2": {
    theory: [
      { title: "Transforms and Applications", pdfPage: 42 },
      { title: "Discrete Mathematics", pdfPage: 43 },
      { title: "Applied Chemistry", pdfPage: 44 },
      { title: "Python Programming", pdfPage: 45 },
      { title: "Digital Principles & Computer Organization", pdfPage: 46 },
    ],
    lab: [
      { title: "Python Programming Laboratory", pdfPage: 50 },
      { title: "Chemistry Laboratory", pdfPage: 50 },
      { title: "Engineering Graphics", pdfPage: 51 },
      { title: "Language Elective", pdfPage: 52 },
      { title: "Workplace Communication Skills", pdfPage: 50 },
    ],
  },

  "Semester 3": { theory: null, lab: null },
  "Semester 4": { theory: null, lab: null },
  "Semester 5": { theory: null, lab: null },
  "Semester 6": { theory: null, lab: null },
  "Semester 7": { theory: null, lab: null },
  "Semester 8": { theory: null, lab: null },
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

  const getPdfUrl = (sem, title, group) => {
    if (!SYLLABUS || !Array.isArray(SYLLABUS.semesters)) return null;
    const s = SYLLABUS.semesters.find((x) => x.semester === sem);
    if (!s) return null;
    const arr = Array.isArray(s[group]) ? s[group] : null;
    if (!arr) return null;
    const item = arr.find((it) => (it.title || "").toLowerCase() === (title || "").toLowerCase());
    return item ? item.pdfUrl || null : null;
  };

  const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");
  const filteredSubjects = allSubjects.filter((s) =>
    normalize(s.title).includes(normalize(q))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex justify-center p-10">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200/10 to-transparent rounded-full -translate-y-48 translate-x-48 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-200/10 to-transparent rounded-full translate-y-40 -translate-x-40 pointer-events-none"></div>

      <div className="w-full max-w-3xl text-black relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">AI & DS - Syllabus Portal</h2>

        {/* SEARCH BAR */}
        <input
          value={q}
          onChange={(e) => {
            const value = e.target.value;
            setQ(value);
            setInvalidSearch(value.trim() && filteredSubjects.length === 0);
          }}
          placeholder="Search subjects..."
          className="w-full p-3 rounded-xl bg-gray-200 border border-gray-300 text-black mb-6"
        />

        {/* SEARCH RESULTS */}
        {q.trim() !== "" && filteredSubjects.length > 0 && (
          <div className="mb-4">
            <strong>Results:</strong>
            <div className="mt-2 space-y-2">
                  {filteredSubjects.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setOpenSem(semesters.indexOf(s.sem));
                        setOpenGroup({ [s.sem]: s.group });
                        const pdfUrl = getPdfUrl(s.sem, s.title, s.group);
                        setOpenSubject({ ...s, pdfUrl });
                      }}
                >
                  {s.sem} → {s.group} → <b>{s.title}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEMESTER CARDS */}
        {semesters.map((sem, index) => {
          const hasTheory = Array.isArray(DATA[sem].theory);
          const hasLab = Array.isArray(DATA[sem].lab);

          return (
            <div
              key={sem}
              className="bg-white p-5 rounded-2xl shadow mb-6"
            >
              <button
                onClick={() =>
                  setOpenSem(openSem === index ? null : index)
                }
                className="w-full text-left flex justify-between font-semibold text-lg"
              >
                {sem}
                <span>{openSem === index ? "▲" : "▼"}</span>
              </button>

              {openSem === index && (
                <div className="mt-3 overflow-hidden">
                  {/* THEORY / LAB BUTTONS */}
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={() => {
                        if (!hasTheory) return setOpenMessage("Content will be updated soon.");
                        setOpenGroup({ [sem]: "theory" });
                      }}
                      className={`p-2 rounded-lg border w-full ${
                        openGroup[sem] === "theory"
                          ? "bg-blue-100 border-blue-300"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      Theory
                    </button>

                    <button
                      onClick={() => {
                        if (!hasLab) return setOpenMessage("Content will be updated soon.");
                        setOpenGroup({ [sem]: "lab" });
                      }}
                      className={`p-2 rounded-lg border w-full ${
                        openGroup[sem] === "lab"
                          ? "bg-blue-100 border-blue-300"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      Lab
                    </button>
                  </div>

                  {/* SUBJECT LIST */}
                  {openGroup[sem] &&
                    Array.isArray(DATA[sem][openGroup[sem]]) &&
                    DATA[sem][openGroup[sem]].map((subject, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-100 rounded-xl flex justify-between items-center mb-2"
                      >
                        <div>{subject.title}</div>
                        <button
                          onClick={() => {
                            const pdfUrl = getPdfUrl(sem, subject.title, openGroup[sem] || "theory");
                            setOpenSubject({ ...subject, pdfUrl });
                          }}
                          className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-200"
                        >
                          View
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {/* POPUPS */}

        {/* INVALID SEARCH */}
        {invalidSearch && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
            onClick={() => setInvalidSearch(false)}
          >
            <div className="bg-white p-5 rounded-xl shadow-xl text-lg">
              Enter a valid subject name
            </div>
          </div>
        )}

        {/* ALERT MESSAGE */}
        {openMessage && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
            onClick={() => setOpenMessage(null)}
          >
            <div className="bg-white p-5 rounded-xl shadow-xl text-lg">
              {openMessage}
            </div>
          </div>
        )}

        {/* PDF MODAL */}
        {openSubject && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-[999]"
          >
            <div
              className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="p-3 border-b flex justify-between">
                <strong>{openSubject.title}</strong>
                <button
                  onClick={() => setOpenSubject(null)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="w-full h-full relative">
                <iframe
                  src={openSubject.pdfUrl ? openSubject.pdfUrl : `https://www.orimi.com/pdf-test.pdf#page=${openSubject.pdfPage}`}
                  className="w-full h-full"
                />
                <div className="absolute top-3 right-3 bg-white/90 p-2 rounded">
                  <a
                    href={openSubject.pdfUrl ? openSubject.pdfUrl : `https://www.orimi.com/pdf-test.pdf#page=${openSubject.pdfPage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline"
                  >
                    Open PDF in new tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
