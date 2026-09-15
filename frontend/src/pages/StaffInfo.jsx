import React from "react";
import AboutTabs from "../components/AboutTabs";

// Import images properly
import kanagarajImg from "../assets/staff/kanagaraj.jpg";
import shaliniImg from "../assets/staff/shalini.jpg";

export default function StaffInfo() {
  const staffData = [
    {
      name: "Mr. R. Kanagaraj",
      role: "Instructor",
      img: kanagarajImg,
    },
    {
      name: "Ms. K. Shalini",
      role: "Junior Assistant",
      img: shaliniImg,
    },
  ];

  return (
    <div className="font-brand">
      <AboutTabs />

      <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Administrative and technical
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Staff
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-navy">
                <th className="text-left py-3 pr-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">
                  Name
                </th>
                <th className="text-left py-3 px-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-brand-navy">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff) => (
                <tr key={staff.name} className="border-b border-brand-row">
                  <td className="py-3.5 pr-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 overflow-hidden bg-brand-blue-tint">
                        <img
                          src={staff.img}
                          alt={staff.name}
                          className="w-full h-full object-cover grayscale"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64x64/6b7280/ffffff?text=No+Image";
                          }}
                        />
                      </div>
                      <span className="text-[14px] font-medium text-brand-navy">{staff.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 text-[13.5px] text-[#3a3838]">{staff.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
