// frontend/src/pages/UserAchievements.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Award, ExternalLink, X, Image as ImageIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import Modal from "../components/ui/Modal";
import { Reveal } from "../components/ui/Reveal";
import { LoadingState, EmptyState } from "../components/ui/States";

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
    <div className="container-ln pb-8">
      <PageHeader
        eyebrow="Student achievements"
        title="Achievements"
        description="What students of the department have won, published and built."
      />

      {loading ? (
        <LoadingState label="Loading achievements" />
      ) : achievements.length === 0 ? (
        <EmptyState icon={Award} title="No student achievements published yet." />
      ) : (
        <div style={{ columns: "3 300px", columnGap: "20px" }}>
          {achievements.map((a, i) => {
            const certUrl = a.certificate?.url || a.image || a.certificateUrl;

            return (
              <Reveal key={a._id} delay={Math.min(i, 6) * 0.05} className="mb-5 break-inside-avoid">
                <SpotlightCard interactive className="overflow-hidden">
                  <div className="relative h-[200px] overflow-hidden rounded-t-2xl border-b border-line bg-canvas-elevated">
                    {certUrl ? (
                      <img
                        src={certUrl}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full cursor-zoom-in object-cover opacity-85 transition-[transform,opacity] duration-500 ease-expo group-hover:scale-[1.03] group-hover:opacity-100"
                        onClick={() => setSelectedCert({ title: a.title, url: certUrl })}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.18),transparent_70%)]">
                        <span className="icon-tile h-12 w-12">
                          <Award className="text-accent-bright" size={22} strokeWidth={1.5} />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
                          Student Achievement
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 p-5">
                    <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-fg">
                      {a.title}
                    </h3>
                    <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-fg-muted">
                      {a.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-line pt-3">
                      <span className="text-[12.5px] font-medium text-fg">
                        {a.userId?.fullName || a.userId?.username || "Student"}{" "}
                        <span className="text-fg-muted">{a.userId?.year ? `(${a.userId.year} Year)` : ""}</span>
                      </span>
                      {a.createdAt && (
                        <span className="font-mono text-[11px] text-fg-muted">
                          {format(new Date(a.createdAt), "dd MMM yyyy")}
                        </span>
                      )}
                    </div>

                    {certUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedCert({ title: a.title, url: certUrl })}
                        className="flex w-fit items-center gap-1.5 text-left text-[12.5px] font-medium text-accent-bright transition-colors hover:text-indigo-300"
                      >
                        <ImageIcon size={13} />
                        View Certificate / Photo
                      </button>
                    )}
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <Modal
          onBackdropClick={() => setSelectedCert(null)}
          onEscape={() => setSelectedCert(null)}
          className="flex max-h-[90vh] max-w-3xl flex-col"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <strong className="truncate text-[14px] font-medium text-fg">{selectedCert.title}</strong>
            <div className="flex shrink-0 items-center gap-1">
              <a
                href={selectedCert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-sm"
              >
                <ExternalLink size={13} />
                Open full size
              </a>
              <button onClick={() => setSelectedCert(null)} aria-label="Close" className="btn-icon h-8 w-8">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto bg-canvas-deep p-2">
            <img
              src={selectedCert.url}
              alt={selectedCert.title}
              className="max-h-[75vh] max-w-full object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
