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

      <div className="px-5 sm:px-8 lg:px-12 pt-7 sm:pt-9 lg:pt-[42px] pb-6 flex items-end justify-between gap-5 flex-wrap">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            Administrative and technical
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Staff
          </h1>
        </div>
      </div>

      {/* Staff grid */}
      <div
        className="mx-5 sm:mx-8 lg:mx-12 mb-7 sm:mb-9 lg:mb-12 grid gap-px bg-brand-edge border border-brand-edge"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
      >
        {staffData.map((staff) => (
          <div key={staff.name} className="font-brand bg-white p-5 flex flex-col gap-2.5">
            <div className="w-fit mx-auto bg-brand-blue-tint border border-[#c3cfe3]">
              <img
                src={staff.img}
                alt={staff.name}
                className="max-w-[160px] h-auto block"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x300/6b7280/ffffff?text=No+Image";
                }}
              />
            </div>
            <h3 className="m-0 text-[16px] font-semibold leading-[1.25] text-brand-navy text-center">{staff.name}</h3>
            <span className="text-[11.5px] font-medium leading-[1.3] text-brand-blue text-center">{staff.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
