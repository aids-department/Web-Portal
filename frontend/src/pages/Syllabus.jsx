import React, { useState, useMemo } from "react";

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
        title: "Operating Systems:",
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
                          onClick={() => setOpenSubject(subject)}
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

              <iframe
                src={
                  openSubject.url
                    ? `${openSubject.url}#page=${openSubject.pdfPage || 1}`
                    : `https://www.orimi.com/pdf-test.pdf#page=${openSubject.pdfPage}`
                }
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
