import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Alumni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filters = [
    { label: "City", value: "Any location" },
    { label: "Company", value: "Any company" },
    { label: "Role", value: "Any role" },
    { label: "Batch", value: "Any year" },
  ];

  const alumni = [
    { id: 1, initials: "PS", name: "Priya Sundaram", year: "2022", home: "Madurai", role: "Software Engineer at Amazon", company: "Amazon", city: "Bengaluru", skills: ["Python", "AWS", "Backend"] },
    { id: 2, initials: "RK", name: "Rahul Kumar", year: "2021", home: "Chennai", role: "Data Scientist at MuSigma", company: "MuSigma", city: "Bengaluru", skills: ["R", "Machine Learning", "SQL"] },
    { id: 3, initials: "SJ", name: "Sneha Jacob", year: "2023", home: "Kochi", role: "Product Manager at Zoho", company: "Zoho", city: "Chennai", skills: ["Product Strategy", "Agile", "UI/UX"] },
    { id: 4, initials: "MK", name: "Manoj Karthik", year: "2020", home: "Coimbatore", role: "Senior Developer at Freshworks", company: "Freshworks", city: "Chennai", skills: ["JavaScript", "React", "Node.js"] },
    { id: 5, initials: "AM", name: "Arun M", year: "2022", home: "Salem", role: "Cloud Architect at TCS", company: "TCS", city: "Chennai", skills: ["Azure", "Kubernetes", "Docker"] },
    { id: 6, initials: "NK", name: "Nisha K", year: "2021", home: "Trichy", role: "ML Engineer at Infosys", company: "Infosys", city: "Pune", skills: ["TensorFlow", "Deep Learning", "Python"] },
  ];

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#e8e6e3] min-h-screen pb-12">
      <div className="max-w-[1280px] mx-auto bg-white border border-[#0e1c3d]/20 shadow-[0_2px_10px_rgba(14,28,61,0.08)]">
        
        {/* Header */}
        <div className="pt-[36px] px-gutter pb-6 bg-white flex items-end justify-between border-b border-ds-edge">
          <div className="flex flex-col gap-[9px]">
            <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
              870 members · 2019 onwards
            </span>
            <h1 className="m-0 font-semibold text-[42px] leading-none tracking-display text-navy">
              Alumni directory
            </h1>
          </div>
          <div className="flex items-stretch w-[420px] border-2 border-navy">
            <span className="px-3 grid place-items-center font-normal text-[13px] leading-none text-[#7d7979]">
              Search
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, company, city or skill" 
              className="flex-1 border-none outline-none py-3 font-normal text-[13.5px] leading-none text-ds-ink"
            />
            <button className="px-[18px] bg-navy text-white border-none font-semibold text-[12px] leading-none cursor-pointer hover:bg-navy-deep">
              Go
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[266px_1fr] bg-white">
          
          {/* Sidebar */}
          <aside className="p-[28px_24px_40px] border-r border-ds-edge bg-ds-ground flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[11px] leading-none tracking-[.18em] uppercase text-navy">Filters</span>
              <span className="font-normal text-[11.5px] leading-none text-ds-red cursor-pointer hover:underline">Clear</span>
            </div>

            {filters.map((f, i) => (
              <div key={i} className="flex flex-col gap-[9px]">
                <span className="font-medium text-[10px] leading-none tracking-[.16em] uppercase text-[#7d7979]">
                  {f.label}
                </span>
                <div className="border border-[#bab6b6] bg-white px-3 py-2.5 flex justify-between items-center cursor-pointer">
                  <span className="font-normal text-[13px] leading-none text-navy">{f.value}</span>
                  <span className="font-normal text-[10px] leading-none text-[#9b9797]">▾</span>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-[7px] pt-1">
              <span className="px-[9px] py-[5px] bg-navy text-white font-medium text-[11px] leading-none cursor-pointer">
                Bengaluru ×
              </span>
              <span className="px-[9px] py-[5px] bg-navy text-white font-medium text-[11px] leading-none cursor-pointer">
                2022 ×
              </span>
            </div>
          </aside>

          {/* Directory Results */}
          <div className="pt-[26px] px-[40px] pb-[46px] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-normal text-[12.5px] leading-none text-ds-ink-soft">
                Showing {filteredAlumni.length} matches
              </span>
              <span className="font-normal text-[12.5px] leading-none text-ds-ink-soft">
                Sort: batch, newest first
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-ds-edge border border-ds-edge">
              {filteredAlumni.map((p) => (
                <div 
                  key={p.id} 
                  className="bg-white p-[22px] flex flex-col gap-[14px] cursor-pointer hover:bg-ds-ground"
                  onClick={() => setSelectedProfile(p)}
                >
                  <div className="flex gap-[14px] items-start">
                    <div className="w-[66px] h-[66px] flex-none bg-ds-blue-tint border border-[#c3cfe3] grid place-items-center grayscale">
                      <span className="font-semibold text-[15px] leading-none text-[#7d8ba6]">{p.initials}</span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                      <span className="font-semibold text-[16px] leading-[1.2] text-navy">{p.name}</span>
                      <span className="font-normal text-[12px] leading-none text-[#7d7979] tabular-nums">Batch of {p.year}</span>
                      <span className="font-normal text-[12px] leading-none text-[#7d7979]">{p.home}</span>
                    </div>
                  </div>
                  <div className="border-t border-ds-row pt-[11px] flex justify-between items-center mt-auto">
                    <span className="font-medium text-[12px] leading-[1.3] text-ds-blue line-clamp-1 mr-2">{p.role}</span>
                    <span className="font-medium text-[11.5px] leading-none text-ds-red flex-none">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal (1g match) */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-navy/60 flex items-center justify-center p-4 z-50">
          <div className="w-[760px] max-w-full bg-white flex flex-col shadow-2xl relative">
            <div className="bg-navy p-[28px_32px] flex gap-[22px] items-start relative">
              <div className="w-[96px] h-[96px] flex-none bg-ds-blue border border-[#3d5077] grid place-items-center grayscale">
                <span className="font-semibold text-[24px] leading-none text-[#a8b6cc]">{selectedProfile.initials}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="m-0 font-semibold text-[30px] leading-[1.05] text-white">{selectedProfile.name}</h2>
                <span className="font-normal text-[13.5px] leading-none text-[#b6c2d8] tabular-nums">
                  Batch of {selectedProfile.year} · Hometown {selectedProfile.home}
                </span>
                <div className="flex gap-2 pt-1.5">
                  <span className="px-3 py-[7px] border border-[#4a5a7a] text-white font-medium text-[11.5px] leading-none cursor-pointer hover:bg-ds-blue">Message</span>
                  <span className="px-3 py-[7px] bg-ds-red text-white font-semibold text-[11.5px] leading-none cursor-pointer hover:bg-ds-red-deep">Invite to mentor</span>
                </div>
              </div>
              <span 
                onClick={() => setSelectedProfile(null)} 
                className="absolute top-[28px] right-[32px] font-normal text-[24px] leading-none text-[#8c9ab5] cursor-pointer hover:text-white"
              >
                ×
              </span>
            </div>

            <div className="bg-white p-[28px_32px_34px] flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ds-edge border border-ds-edge">
                {[
                  { k: "Current Role", v: selectedProfile.role },
                  { k: "Company", v: selectedProfile.company },
                  { k: "Location", v: selectedProfile.city },
                  { k: "Experience", v: "3 years" },
                  { k: "LinkedIn", v: `linkedin.com/in/${selectedProfile.name.toLowerCase().replace(' ','')}` },
                  { k: "Email", v: `${selectedProfile.name.toLowerCase().replace(' ','')}@example.com` },
                ].map((f, i) => (
                  <div key={i} className="bg-white px-4 py-3.5 flex flex-col gap-[5px]">
                    <span className="font-medium text-[9.5px] leading-none tracking-[.16em] uppercase text-[#7d7979]">{f.k}</span>
                    <span className="font-medium text-[13.5px] leading-[1.35] text-navy">{f.v}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-[11px]">
                <span className="font-medium text-[10.5px] leading-none tracking-[.18em] uppercase text-navy">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills.map((s, i) => (
                    <span key={i} className="px-3 py-[7px] border border-[#bab6b6] font-normal text-[12.5px] leading-none text-[#3a3838]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
