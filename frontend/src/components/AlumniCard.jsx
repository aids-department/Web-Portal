import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { User, ArrowLeft, X, ChevronRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Spotlight } from "./ui/SpotlightCard";
import { useSpotlight } from "./ui/useSpotlight";
import { EASE } from "./ui/motion";

const PlaceholderAvatar = ({ size = "md" }) => (
  <div className="grid h-full w-full place-items-center bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.18),transparent_70%)]">
    <User className="text-fg-muted/60" size={size === "lg" ? 48 : 36} strokeWidth={1.25} />
  </div>
);

// Form answers like "Nil", "-" or "None" mean "not applicable".
const PLACEHOLDER = /^(-+|n\/?a|nil+|none|no|null)$/i;
const present = (v) => (v !== null && v !== undefined && String(v).trim() && !PLACEHOLDER.test(String(v).trim()) ? v : null);

const SectionLabel = ({ children }) => (
  <span className="eyebrow border-b border-line pb-3">{children}</span>
);

const FactGroup = ({ title, facts }) => (
  <div className="flex flex-col gap-4">
    <SectionLabel>{title}</SectionLabel>
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {facts.map((f) => (
        <div
          key={f.k}
          className={`flex flex-col gap-1.5 rounded-xl border border-line bg-white/[0.03] px-4 py-3.5 ${f.wide ? "col-span-full" : ""}`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
            {f.k}
          </span>
          <span
            className={`text-[14px] leading-[1.5] ${
              present(f.v) ? "font-medium text-fg" : "text-fg-muted/60"
            }`}
          >
            {present(f.v) ?? "NA"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function AlumniCard({ alumni }) {
  const [open, setOpen] = useState(false);
  const { ref, onMouseMove } = useSpotlight();

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!alumni) return null;

  const role = present(alumni.role);
  const company = present(alumni.company);

  const workFacts = [
    { k: "Status", v: alumni.currentStatus },
    { k: "Current role", v: role },
    { k: "Company", v: company },
    { k: "Work location", v: alumni.workLocation },
    { k: "Industry / domain", v: alumni.industry },
    { k: "Pass out year", v: alumni.passOutYear },
  ];
  const higherStudiesFacts = [
    { k: "Degree", v: alumni.higherStudiesDegree },
    { k: "University", v: alumni.higherStudiesUniversity },
    { k: "Location", v: alumni.higherStudiesLocation },
    { k: "Area of specialization", v: alumni.higherStudiesSpecialization },
  ];
  const startupFacts = [
    { k: "Startup", v: alumni.startupName },
    { k: "Role in the company", v: alumni.startupRole },
    { k: "Company location", v: alumni.startupLocation },
    { k: "About the company", v: alumni.startupDescription, wide: true },
  ];

  const roleAtCompany = [role, company ? `at ${company}` : null].filter(Boolean).join(' ');
  const roleDotCompany = [role, company].filter(Boolean).join(' · ');

  return (
    <>
      {/* ================= DIRECTORY TILE ================= */}
      <button
        ref={ref}
        onMouseMove={onMouseMove}
        onClick={() => setOpen(true)}
        className="group surface edge-highlight surface-interactive flex h-full w-full flex-col gap-3 p-4 text-left"
      >
        <Spotlight />
        <span aria-hidden="true" className="gradient-border" />
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-canvas-elevated">
          {alumni.imageUrl ? (
            <img
              src={alumni.imageUrl}
              alt={alumni.name}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-expo group-hover:scale-[1.03]"
            />
          ) : (
            <PlaceholderAvatar />
          )}
        </div>
        <div className="relative flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-fg">{alumni.name}</h3>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="line-clamp-1 text-[12.5px] leading-[1.4] text-fg-muted">
              {roleDotCompany || present(alumni.currentStatus) || 'Company not specified'}
            </span>
            {alumni.passOutYear && (
              <span className="font-mono text-[11px] tabular-nums text-accent-bright">
                {alumni.passOutYear}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* ================= PROFILE (PORTAL) ================= */}
      {open &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] overflow-y-auto bg-canvas"
            role="dialog"
            aria-modal="true"
            aria-label={alumni.name}
          >
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.18),transparent_70%)]" />

            <div className="sticky top-0 z-10 border-b border-line bg-canvas/80 backdrop-blur-xl">
              <div className="container-ln flex h-14 items-center gap-2 text-[13px]">
                <button onClick={() => setOpen(false)} className="btn-ghost btn-sm -ml-3">
                  <ArrowLeft size={14} />
                  Alumni directory
                </button>
                <ChevronRight size={14} className="text-fg-muted/60" />
                <span className="truncate text-fg-muted">{alumni.name}</span>
                <button onClick={() => setOpen(false)} className="btn-secondary btn-sm ml-auto">
                  <X size={14} />
                  Close
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="container-ln relative flex flex-col gap-10 py-10 sm:py-14"
            >
              <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[minmax(150px,200px)_minmax(0,1fr)]">
                <div className="relative w-full max-w-[200px]">
                  <div aria-hidden="true" className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-canvas-elevated">
                    {alumni.imageUrl ? (
                      <img src={alumni.imageUrl} alt={alumni.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <PlaceholderAvatar size="lg" />
                    )}
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-3">
                  {alumni.passOutYear && (
                    <span className="eyebrow-accent">Class of {alumni.passOutYear}</span>
                  )}
                  <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                    <span className="text-gradient">{alumni.name}</span>
                  </h1>
                  {roleAtCompany && (
                    <span className="text-base leading-[1.5] text-fg-muted sm:text-lg">
                      {roleAtCompany}
                    </span>
                  )}
                  {alumni.linkedinUrl && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={alumni.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        <FaLinkedin size={14} />
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="surface flex flex-col gap-9 p-6 sm:p-8">
                <FactGroup title="Current work" facts={workFacts} />
                <FactGroup title="Higher studies" facts={higherStudiesFacts} />
                <FactGroup title="Startup" facts={startupFacts} />

                <div className="flex flex-col gap-4">
                  <SectionLabel>Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {alumni.skills?.length ? (
                      alumni.skills.map((skill, i) => (
                        <span key={i} className="pill-neutral px-3 py-1 text-[12.5px] text-fg/85">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-[13px] text-fg-muted">No skills listed</p>
                    )}
                  </div>
                </div>

                {alumni.bio && (
                  <div className="flex flex-col gap-4">
                    <SectionLabel>About</SectionLabel>
                    <p className="max-w-[76ch] whitespace-pre-line text-[15px] leading-[1.75] text-fg/85">
                      {alumni.bio}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
