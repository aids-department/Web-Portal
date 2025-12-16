import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");
  const filteredSubjects = allSubjects.filter((s) =>
    normalize(s.title).includes(normalize(q))
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="w-full max-w-3xl text-black">

        <h2 className="text-3xl font-bold mb-6">AI & DS - Syllabus Portal</h2>

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
                    setOpenSubject(s);
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
            <motion.div
              layout
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

              <AnimatePresence>
                {openSem === index && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 overflow-hidden"
                  >
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
                        <motion.div
                          layout
                          key={idx}
                          className="p-3 bg-gray-100 rounded-xl flex justify-between items-center mb-2"
                        >
                          <div>{subject.title}</div>
                          <button
                            onClick={() => setOpenSubject(subject)}
                            className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-200"
                          >
                            View
                          </button>
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* POPUPS */}

        {/* INVALID SEARCH */}
        <AnimatePresence>
          {invalidSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
              onClick={() => setInvalidSearch(false)}
            >
              <div className="bg-white p-5 rounded-xl shadow-xl text-lg">
                Enter a valid subject name
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALERT MESSAGE */}
        <AnimatePresence>
          {openMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
              onClick={() => setOpenMessage(null)}
            >
              <div className="bg-white p-5 rounded-xl shadow-xl text-lg">
                {openMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF MODAL */}
        <AnimatePresence>
          {openSubject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-[999]"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
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

                <iframe
                  src={`/syllabus_first_year.pdf#page=${openSubject.pdfPage}`}
                  className="w-full h-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
