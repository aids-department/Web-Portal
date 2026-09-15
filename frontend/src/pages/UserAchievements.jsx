import React, { useEffect, useState } from "react";
import { format } from "date-fns";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent")
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, []);

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
          Student achievements
        </span>
        <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
          Achievements
        </h1>
        <p className="m-0 max-w-[70ch] text-[14px] leading-[1.7] text-brand-ink-soft">
          What students of the department have won, published and built.
        </p>
      </div>

      {achievements.length === 0 ? (
        <p className="text-brand-ink-soft italic text-[13.5px]">No achievements to show yet.</p>
      ) : (
        <div style={{ columns: "3 300px", columnGap: "20px" }}>
          {achievements.map((a) => (
            <div
              key={a._id}
              className="break-inside-avoid mb-5 border border-brand-edge bg-white flex flex-col"
            >
              <div className="h-[140px] bg-brand-blue grid place-items-center">
                <span className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-[#a8b6cc]">
                  Photograph
                </span>
              </div>
              <div className="p-[18px] flex flex-col gap-2.5">
                <h3 className="m-0 text-[16.5px] leading-[1.3] font-semibold text-brand-navy">
                  {a.title}
                </h3>
                <p className="m-0 text-[13px] leading-[1.65] text-[#3a3838]">{a.description}</p>
                <div className="border-t border-brand-row pt-2.5 flex justify-between gap-2.5 flex-wrap">
                  <span className="text-[11.5px] font-medium text-brand-blue">
                    {a.userId?.fullName} {a.userId?.year ? `(${a.userId.year} Year)` : ''}
                  </span>
                  {a.createdAt && (
                    <span className="text-[11.5px] text-brand-ink-soft">
                      {format(new Date(a.createdAt), 'dd MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
