import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const DATA = {
  "Semester 1": {
    theory: [
      { code: "MA3151", title: "Calculus and its Applications", type: "Core", ltp: "3-1-0", cr: "4", pdfPage: 30, url: "https://image2url.com/r2/default/documents/1767520058712-f4856925-0238-49cc-ac18-f1d451eb6b9e.pdf" },
      { code: "CS3151", title: "C Programming", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 31, url: "https://image2url.com/r2/default/documents/1767520189369-89df32df-1de6-4c37-ac77-98ab55503a4c.pdf" },
      { code: "EE3151", title: "Basics of Electrical and Electronic Systems", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 32, url: "https://image2url.com/r2/default/documents/1767520223915-e4638064-fa8e-40cf-9ec9-d090ec4e16bb.pdf" },
      { code: "HS3151", title: "English Language Proficiency", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 33, url: "https://image2url.com/r2/default/documents/1767520260658-f8caab9d-7d67-4186-85ce-32ec6ea9a2cb.pdf" },
      { code: "GE3151", title: "Heritage of Tamils", type: "Core", ltp: "1-0-0", cr: "1", pdfPage: 34, url: "https://image2url.com/r2/default/documents/1767520283550-b5db0557-1f30-472d-8d6a-b44f072caee3.pdf" },
    ],
    lab: [
      { code: "CS3171", title: "C Programming Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 36, url: "https://image2url.com/r2/default/documents/1767521624009-aa0cca59-a76a-4a37-9664-4fadcbd0ff46.pdf" },
      { code: "GE3171", title: "Engineering Skills Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 37, url: "https://image2url.com/r2/default/documents/1767520350635-15662c81-5638-42f9-ae8c-4d219ac545d0.pdf" },
      { code: "GE3172", title: "Design Thinking for Innovation", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 40, url: "https://image2url.com/r2/default/documents/1767520373238-cb46e845-3cda-4851-848e-8cda69e5970d.pdf" },
    ],
  },
  "Semester 2": {
    theory: [
      { code: "MA3251", title: "Transforms and Applications", type: "Core", ltp: "3-1-0", cr: "4", pdfPage: 42, url: "https://image2url.com/r2/default/documents/1767526938604-76511f19-4338-43a2-b562-d1139daa0f1e.pdf" },
      { code: "MA3252", title: "Discrete Mathematics", type: "Core", ltp: "3-1-0", cr: "4", pdfPage: 43, url: "https://image2url.com/r2/default/documents/1767526961443-b2ab66d8-66a5-441f-9c67-70c36eb12372.pdf" },
      { code: "CY3251", title: "Applied Chemistry", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767526982386-3f3ef03a-72ea-4fa6-9d3f-1bfe7097e5a5.pdf" },
      { code: "CS3251", title: "Python Programming", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767526998126-2387d445-96a1-47a0-83cd-e9abf0f3f7c9.pdf" },
      { code: "CS3252", title: "Digital Principles & Computer Organization", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 46, url: "https://image2url.com/r2/default/documents/1767527548961-aab56bce-d11b-4f69-8503-0da59a8d7fa8.pdf" },
      { code: "GE3251", title: "Tamils and Technology", type: "Core", ltp: "1-0-0", cr: "1", pdfPage: null, url: "https://image2url.com/r2/default/documents/1767527030369-ab02264a-c055-40eb-ac1a-acb38d9e8f38.pdf" },
    ],
    lab: [
      { code: "CS3271", title: "Python Programming Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 50, url: "https://image2url.com/r2/default/documents/1767527047449-caadff02-407b-4a32-b055-bf99f566e77d.pdf" },
      { code: "CY3271", title: "Chemistry Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 50, url: "https://image2url.com/r2/default/documents/1767527066026-5d181f42-9107-40a8-9efb-31bb099a6550.pdf" },
      { code: "GE3271", title: "Engineering Graphics", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 51, url: "https://image2url.com/r2/default/documents/1767527084014-858c4bda-a0c4-4c69-b8a8-b7546079e70b.pdf" },
      { code: "HS3271", title: "Workplace Communication Skills", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 50, url: "https://image2url.com/r2/default/documents/1767527122505-90b4015c-8463-4774-ad0f-33094dc73607.pdf" },
    ],
  },
  "Semester 3": {
    theory: [
      { code: "AD3351", title: "Artificial Intelligence", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 51, url: "https://image2url.com/r2/default/documents/1767581442227-6095ec7b-ff5e-4b38-8d93-ad6a1c2b9253.pdf" },
      { code: "AD3352", title: "Design and Analysis of Algorithms", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 43, url: "https://image2url.com/r2/default/documents/1767581496040-c48f7de4-7d77-4cb7-bff1-99126ebf371e.pdf" },
      { code: "AD3353", title: "Database Design and Management", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767581474518-e22b8df9-6581-494e-8298-17cb18448c86.pdf" },
      { code: "AD3354", title: "Data Exploration and Visualization", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767581458144-f6412ccb-7e41-436a-ac51-1898ab16c7a1.pdf" },
    ],
    lab: [
      { code: "AD3371", title: "Artificial Intelligence Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767584698430-03706bc9-1b03-4494-adba-0565732f2384.pdf" },
      { code: "AD3372", title: "Database Design and Management Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 46, url: "https://image2url.com/r2/default/documents/1767584714136-ccceb17a-dfcc-47da-846d-1c92f603fb79.pdf" },
    ],
  },
  "Semester 4": {
    theory: [
      { code: "MA3451", title: "Probability and Statistics", type: "Core", ltp: "3-1-0", cr: "4", pdfPage: 42, url: "https://image2url.com/r2/default/documents/1767621758441-51e5c4e4-ee01-4f00-bad1-9fabb9b2696a.pdf" },
      { code: "AD3451", title: "Operating Systems", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 43, url: "https://image2url.com/r2/default/documents/1767621797703-763286e5-5fca-4ee6-a10f-9f0bd9b11ebd.pdf" },
      { code: "AD3452", title: "Machine Learning", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767621832011-69a21808-061c-4cc8-b750-1e5e16da3aa8.pdf" },
      { code: "AD3453", title: "Fundamentals of Data Science and Analytics", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767621847005-cfdc9852-393d-45cf-a408-c1eb60c19d75.pdf" },
    ],
    lab: [
      { code: "AD3471", title: "Data Science and Analytics Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: null, url: "https://image2url.com/r2/default/documents/1767621949046-5774cd96-288e-40ec-add7-a863718ac586.pdf" },
      { code: "AD3472", title: "Machine Learning Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: null, url: "https://image2url.com/r2/default/documents/1767621986810-eafeedff-524f-465f-8223-0d40bf4e061d.pdf" },
    ],
  },
  "Semester 5": {
    theory: [
      { code: "AD3551", title: "Deep Learning", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 42, url: "https://image2url.com/r2/default/documents/1767623968255-92e976ee-74bf-48fe-9474-dd5dd14bd6d7.pdf" },
      { code: "AD3552", title: "Data and Information Security", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 43, url: "https://image2url.com/r2/default/documents/1767623860768-c8d08cf7-e358-4481-89fa-307a53000d89.pdf" },
      { code: "AD3553", title: "Distributed Computing", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767623886774-22614d14-51e0-4e84-b6ef-552da1699ba0.pdf" },
      { code: "AD3554", title: "Big Data Analytics", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767623836728-1b4b6549-b316-4aac-918b-34d7507a6eab.pdf" },
    ],
    lab: [
      { code: "AD3571", title: "Deep Learning Laboratory", type: "Lab", ltp: "0-0-4", cr: "2", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767624025337-41f70fa7-a8b8-4ee7-8c0e-4ab8ad5a6912.pdf" },
      { code: "AD3572", title: "Summer Internship", type: "Internship", ltp: "0-0-0", cr: "1", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767626242087-d5b1811b-6aa1-4760-8eb8-af06cf16283e.pdf" },
    ],
  },
  "Semester 6": {
    theory: [
      { code: "AD3651", title: "Embedded Systems and IoT", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767626987911-62e78fa9-b840-4971-9c65-d005c5c5b110.pdf" },
    ],
    lab: [],
  },
  "Semester 7": {
    theory: [
      { code: "AD3751", title: "Human Values and Ethics", type: "Core", ltp: "3-0-0", cr: "3", pdfPage: 44, url: "https://image2url.com/r2/default/documents/1767631557269-c13d082d-3712-47ce-8cab-f46eeb798b95.pdf" },
    ],
    lab: [],
  },
  "Semester 8": {
    theory: [],
    lab: [
      { code: "AD3871", title: "Project Work/Internship", type: "Project", ltp: "0-0-20", cr: "10", pdfPage: 45, url: "https://image2url.com/r2/default/documents/1767630502465-b9ab6e18-fe60-424b-ba88-963b9d8a24b0.pdf" },
    ],
  },
};

export default function Syllabus() {
  const [activeSem, setActiveSem] = useState("Semester 5");
  const [openSubject, setOpenSubject] = useState(null);

  const semesters = Object.keys(DATA);
  const activeData = DATA[activeSem];
  
  const allCourses = [
    ...(activeData?.theory || []),
    ...(activeData?.lab || [])
  ];

  const totalCredits = allCourses.reduce((sum, c) => sum + parseInt(c.cr || 0, 10), 0);

  return (
    <div className="bg-white">
      {/* Sub-nav tab strip */}
      <div className="flex gap-[26px] px-gutter border-b-2 border-navy bg-white">
        <Link to="/about/faculty" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Faculty</Link>
        <Link to="/about/staff" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Staff</Link>
        <span className="py-4 text-[12.5px] leading-none font-semibold text-navy shadow-[inset_0_-3px_0_#dd2b0f]">Syllabus</span>
        <span className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy cursor-pointer">The department</span>
      </div>

      {/* Page heading */}
      <div className="pt-10 px-gutter pb-6 bg-white flex items-end justify-between border-b border-ds-edge">
        <div className="flex flex-col gap-2.5">
          <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
            B.Tech · Regulation 2023
          </span>
          <h1 className="m-0 font-semibold text-[44px] leading-none tracking-display text-navy">
            Syllabus
          </h1>
        </div>
        <a href="#" className="px-[18px] py-3 bg-navy text-white font-semibold text-[12px] leading-none no-underline">
          Download full curriculum (PDF)
        </a>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[210px_1fr] bg-white">
        {/* Sidebar Nav */}
        <aside className="border-r border-ds-edge bg-ds-ground py-6">
          {semesters.map((sem) => (
            <div
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-[22px] py-3 cursor-pointer ${
                activeSem === sem
                  ? "font-semibold text-[13px] leading-none text-navy bg-white shadow-[inset_3px_0_0_#dd2b0f]"
                  : "font-medium text-[13px] leading-none text-ds-ink-soft hover:text-navy"
              }`}
            >
              {sem}
            </div>
          ))}
        </aside>

        {/* Content Area */}
        <div className="pt-[30px] px-10 pb-[46px] flex flex-col gap-[26px]">
          <div className="flex items-baseline gap-4">
            <h2 className="m-0 font-semibold text-[26px] leading-none text-navy">{activeSem}</h2>
            <span className="font-normal text-[13px] leading-none text-[#7d7979] tabular-nums">
              {allCourses.length} courses · {totalCredits} credits
            </span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="text-left py-[11px] pr-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Code</th>
                <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Course</th>
                <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Type</th>
                <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">L-T-P</th>
                <th className="text-left p-[11px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Credits</th>
                <th className="text-left py-[11px] pl-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Resources</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((c, idx) => (
                <tr key={idx} className="border-b border-ds-row">
                  <td className="py-3.5 pr-3 font-medium text-[13px] leading-[1.3] text-ds-blue tabular-nums">{c.code}</td>
                  <td className="p-3.5 font-medium text-[14px] leading-[1.3] text-navy">{c.title}</td>
                  <td className="p-3.5 font-normal text-[13px] leading-[1.3] text-ds-ink-soft">{c.type}</td>
                  <td className="p-3.5 font-normal text-[13px] leading-[1.3] text-ds-ink-soft tabular-nums">{c.ltp}</td>
                  <td className="p-3.5 font-normal text-[13px] leading-[1.3] text-ds-ink-soft tabular-nums">{c.cr}</td>
                  <td className="py-3.5 pl-3 font-medium text-[12.5px] leading-[1.3] text-ds-red cursor-pointer" onClick={() => setOpenSubject(c)}>
                    Syllabus PDF
                  </td>
                </tr>
              ))}
              {allCourses.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-[13px] text-ds-ink-faint">
                    No courses found for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {activeSem === "Semester 5" && (
            <div className="border border-ds-edge p-[22px] flex flex-col gap-2.5">
              <span className="font-medium text-[10px] leading-none tracking-[.18em] uppercase text-ds-red">Course outline · AD3552</span>
              <h3 className="m-0 font-semibold text-[19px] leading-[1.25] text-navy">Machine Learning Techniques</h3>
              <p className="m-0 max-w-[82ch] font-normal text-[14px] leading-[1.75] text-[#3a3838]">
                Five units. Supervised learning and model selection, kernel methods and ensembles, unsupervised representation, neural network fundamentals and training practice, and a closing unit on evaluation, fairness and failure analysis. Assessment is two internal tests, a modelling assignment, a laboratory record and the end-semester examination.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PDF MODAL */}
      {openSubject && (
        <div className="fixed inset-0 bg-navy/70 flex justify-center items-center p-4 z-[9999]">
          <div className="bg-white border-2 border-navy w-[90%] max-w-5xl h-[90%] overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b-2 border-navy flex justify-between items-center bg-navy">
              <strong className="text-[17px] font-semibold text-white">{openSubject.title}</strong>
              <button 
                onClick={() => setOpenSubject(null)}
                className="px-4 py-2 font-semibold text-[12px] bg-white text-navy hover:bg-ds-ground"
              >
                Close
              </button>
            </div>
            <iframe
              title={openSubject.title}
              src={openSubject.url ? `${openSubject.url}#page=${openSubject.pdfPage || 1}` : `https://www.orimi.com/pdf-test.pdf#page=${openSubject.pdfPage}`}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
