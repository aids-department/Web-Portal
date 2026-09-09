import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaLinkedin } from "react-icons/fa";
import Avatar from "./ui/Avatar";
import Tag from "./ui/Tag";

export default function AlumniCard({ alumni }) {
  const [open, setOpen] = useState(false);

  if (!alumni) return null;

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const initials = alumni.name?.charAt(0)?.toUpperCase();

  return (
    <>
      {/* ================= CARD ================= */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white border border-ds-edge p-5 flex flex-col gap-3.5 text-left w-full"
      >
        <div className="flex gap-3.5 items-start">
          <Avatar initials={initials} size={66} />
          <div className="flex flex-col gap-1">
            <span className="text-card-title text-navy">{alumni.name}</span>
            <span className="text-label text-ds-ink-faint tabular-nums">Batch of {alumni.passOutYear}</span>
          </div>
        </div>
        <div className="border-t border-ds-row pt-2.5 flex justify-between items-center">
          <span className="text-label font-medium text-ds-blue">{alumni.company || "Company not specified"}</span>
          <span className="text-label font-medium text-ds-red">View</span>
        </div>
      </button>

      {/* ================= MODAL (PORTAL) ================= */}
      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-navy/60 z-[9999]"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
              <div className="w-full max-w-2xl max-h-[90vh] bg-white border-2 border-navy flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-navy px-8 py-7 flex items-start justify-between gap-6">
                  <div className="flex gap-4 items-start">
                    <Avatar initials={initials} size={72} className="border-blue" />
                    <div className="flex flex-col gap-1.5">
                      <h2 className="text-section-heading text-white">{alumni.name}</h2>
                      <span className="text-label text-on-navy tabular-nums">
                        Batch of {alumni.passOutYear}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-on-navy-muted hover:text-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ds-edge border border-ds-edge">
                    <Fact label="Current role" value={alumni.role} />
                    <Fact label="Company" value={alumni.company || "Not specified"} />
                    <Fact label="Pass out year" value={alumni.passOutYear} />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <span className="text-label font-medium tracking-label uppercase text-navy">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {alumni.skills?.length ? (
                        alumni.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1.5 border border-ds-edge text-label text-ds-ink">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-body text-ds-ink-faint">No skills listed</p>
                      )}
                    </div>
                  </div>

                  {alumni.bio && (
                    <div className="flex flex-col gap-2.5 border-t-2 border-navy pt-5">
                      <span className="text-label font-medium tracking-label uppercase text-navy">About</span>
                      <p className="text-body text-ds-ink-soft">{alumni.bio}</p>
                    </div>
                  )}

                  {alumni.linkedin && (
                    <a
                      href={alumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-navy text-white text-label font-medium self-start"
                    >
                      <FaLinkedin size={16} />
                      LinkedIn profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-1">
      <span className="text-kicker tracking-kicker uppercase text-ds-ink-faint">{label}</span>
      <span className="text-label font-medium text-navy">{value}</span>
    </div>
  );
}
