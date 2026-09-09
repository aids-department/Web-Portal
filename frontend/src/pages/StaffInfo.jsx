import React from "react";
import { Link } from "react-router-dom";
import Tabs from "../components/ui/Tabs";

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
    <div>
      <Tabs className="mb-8 -mt-2">
        <Link to="/about/faculty"><Tabs.Tab>Faculty</Tabs.Tab></Link>
        <Tabs.Tab active>Staff</Tabs.Tab>
        <Link to="/about/syllabus"><Tabs.Tab>Syllabus</Tabs.Tab></Link>
      </Tabs>

      <div className="mb-10">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Administrative and technical</span>
        <h1 className="text-page-heading text-navy mt-2.5">Staff</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ds-edge border border-ds-edge max-w-2xl">
        {staffData.map((staff) => (
          <div key={staff.name} className="bg-white flex flex-col">
            <div className="h-[150px] bg-ds-blue-tint overflow-hidden">
              <img
                src={staff.img}
                alt={staff.name}
                className="w-full h-full object-cover grayscale"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="p-5">
              <h2 className="text-card-title text-navy">{staff.name}</h2>
              <p className="text-label text-ds-ink-soft mt-1.5">{staff.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
