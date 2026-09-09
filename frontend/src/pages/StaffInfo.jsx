import React from "react";
import { Link } from "react-router-dom";

export default function StaffInfo() {
  const staffData = [
    { name: "Mr. R. Kanagaraj", role: "Instructor", duty: "Hardware Lab & Systems", loc: "Lab 3", ext: "432" },
    { name: "Ms. K. Shalini", role: "Junior Assistant", duty: "Department Administration", loc: "Main Office", ext: "401" },
  ];

  return (
    <div className="bg-white">
      {/* Sub-nav tab strip */}
      <div className="flex gap-[26px] px-gutter border-b-2 border-navy bg-white">
        <Link to="/about/faculty" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Faculty</Link>
        <span className="py-4 text-[12.5px] leading-none font-semibold text-navy shadow-[inset_0_-3px_0_#dd2b0f]">Staff</span>
        <Link to="/about/syllabus" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Syllabus</Link>
        <span className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy cursor-pointer">The department</span>
      </div>

      {/* Page heading */}
      <div className="pt-10 px-gutter pb-[22px] bg-white flex flex-col gap-2.5">
        <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
          Administrative and technical
        </span>
        <h1 className="m-0 font-semibold text-[44px] leading-none tracking-display text-navy">
          Staff
        </h1>
        <p className="m-0 max-w-[74ch] font-normal text-[14px] leading-[1.7] text-ds-ink-soft">
          Office hours are 09:00 to 16:30 on working days. Lab access outside those hours is arranged through the technical staff a day in advance.
        </p>
      </div>

      {/* Staff table */}
      <div className="pt-3 px-gutter pb-12 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-3 pr-[14px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Name</th>
              <th className="text-left p-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Role</th>
              <th className="text-left p-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Responsible for</th>
              <th className="text-left p-3 font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Location</th>
              <th className="text-left py-3 pl-[14px] font-semibold text-[10.5px] leading-none tracking-table-head uppercase text-navy">Extension</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((s, idx) => (
              <tr key={idx} className="border-b border-ds-row">
                <td className="py-3.5 pr-[14px] font-medium text-[14px] leading-[1.3] text-navy">{s.name}</td>
                <td className="p-3.5 font-normal text-[13.5px] leading-[1.3] text-[#3a3838]">{s.role}</td>
                <td className="p-3.5 font-normal text-[13.5px] leading-[1.3] text-ds-ink-soft">{s.duty}</td>
                <td className="p-3.5 font-normal text-[13.5px] leading-[1.3] text-ds-ink-soft">{s.loc}</td>
                <td className="py-3.5 pl-[14px] font-normal text-[13.5px] leading-[1.3] text-ds-blue tabular-nums">{s.ext}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
