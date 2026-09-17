// frontend/src/pages/UserAchievements.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Award, ExternalLink, X, Image as ImageIcon } from "lucide-react";

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetch("https://web-portal-760h.onrender.com/api/achievements/approved/recent")
      .then((res) => res.json())
      .then((data) => {
        setAchievements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load achievements:", err);
        setAchievements([]);
        setLoading(false);
      });
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

      {loading ? (
        <p className="text-brand-ink-soft italic text-[13.5px]">Loading achievements…</p>
      ) : achievements.length === 0 ? (
        <div className="border border-brand-edge p-12 text-center flex flex-col items-center gap-3">
          <Award className="text-brand-ink-faint" size={36} />
          <p className="m-0 text-brand-ink-soft text-[14px]">No student achievements published yet.</p>
        </div>
      ) : (
        <div style={{ columns: "3 300px", columnGap: "20px" }}>
          {achievements.map((a) => {
            const certUrl = a.certificate?.url || a.image || a.certificateUrl;

            return (
              <div
                key={a._id}
                className="break-inside-avoid mb-5 border border-brand-edge bg-white flex flex-col hover:border-brand-navy transition-colors shadow-sm"
              >
                <div className="h-[180px] bg-brand-ground border-b border-brand-edge overflow-hidden relative group">
                  {certUrl ? (
                    <img
                      src={certUrl}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => setSelectedCert({ title: a.title, url: certUrl })}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-navy flex flex-col items-center justify-center gap-2">
                      <Award className="text-brand-red" size={28} />
                      <span className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-[#a8b6cc]">
                        Student Achievement
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-[18px] flex flex-col gap-2.5">
                  <h3 className="m-0 text-[16.5px] leading-[1.3] font-semibold text-brand-navy">
                    {a.title}
                  </h3>
                  <p className="m-0 text-[13px] leading-[1.65] text-[#3a3838] whitespace-pre-line">
                    {a.description}
                  </p>

                  <div className="border-t border-brand-row pt-2.5 flex items-center justify-between gap-2.5 flex-wrap">
                    <span className="text-[11.5px] font-medium text-brand-blue">
                      {a.userId?.fullName || a.userId?.username || "Student"}{" "}
                      {a.userId?.year ? `(${a.userId.year} Year)` : ""}
                    </span>
                    {a.createdAt && (
                      <span className="text-[11.5px] text-brand-ink-soft">
                        {format(new Date(a.createdAt), "dd MMM yyyy")}
                      </span>
                    )}
                  </div>

                  {certUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedCert({ title: a.title, url: certUrl })}
                      className="mt-1 text-left text-[11.5px] font-medium text-brand-red flex items-center gap-1 hover:underline"
                    >
                      <ImageIcon size={12} />
                      View Certificate / Photo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[999]"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white max-w-3xl w-full max-h-[90vh] border-2 border-brand-navy flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-brand-navy text-white flex items-center justify-between gap-3">
              <strong className="text-[14px] truncate">{selectedCert.title}</strong>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={selectedCert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-brand-on-navy hover:text-white flex items-center gap-1"
                >
                  <ExternalLink size={13} />
                  Open full size
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1 hover:text-brand-red transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-900 flex items-center justify-center p-2">
              <img
                src={selectedCert.url}
                alt={selectedCert.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
