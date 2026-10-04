import React from "react";
import AboutTabs from "../components/AboutTabs";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import { Stagger, StaggerItem } from "../components/ui/Reveal";

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
      <AboutTabs />

      <div className="container-ln">
        <PageHeader
          spacing="pt-10 pb-10 sm:pt-12 sm:pb-12"
          eyebrow="Administrative and technical"
          title="Staff"
          description="The people who keep the department's labs and offices running."
        />

        <Stagger className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {staffData.map((staff) => (
            <StaggerItem key={staff.name}>
              <SpotlightCard interactive>
                <div className="flex flex-col gap-4 p-5">
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-canvas-elevated">
                    <img
                      src={staff.img}
                      alt={staff.name}
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-expo group-hover:scale-[1.02]"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300/6b7280/ffffff?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="h-card">{staff.name}</h3>
                    <span className="text-[13px] font-medium text-accent-bright">{staff.role}</span>
                  </div>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
