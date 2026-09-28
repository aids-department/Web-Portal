import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { User } from "lucide-react";

const PlaceholderAvatar = ({ size = "md" }) => (
  <div
    className={`grid place-items-center ${
      size === "lg" ? "w-[180px] h-[180px] bg-brand-blue" : "w-[150px] h-[150px] bg-brand-blue-tint"
    }`}
  >
    <User className={size === "lg" ? "text-[#a8b6cc]" : "text-[#8a9bb8]"} size={size === "lg" ? 48 : 36} />
  </div>
);

// Form answers like "Nil", "-" or "None" mean "not applicable".
const PLACEHOLDER = /^(-+|n\/?a|nil+|none|no|null)$/i;
const present = (v) => (v !== null && v !== undefined && String(v).trim() && !PLACEHOLDER.test(String(v).trim()) ? v : null);

const FactGroup = ({ title, facts }) => (
  <div className="flex flex-col gap-3">
    <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
      {title}
    </span>
    <div
      className="grid gap-px bg-brand-edge border border-brand-edge"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {facts.map((f) => (
        <div key={f.k} className={`bg-white px-[18px] py-4 flex flex-col gap-1.5 ${f.wide ? "col-span-full" : ""}`}>
          <span className="text-[9.5px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
            {f.k}
          </span>
          <span
            className={`text-[13.5px] leading-[1.5] ${
              present(f.v) ? "font-medium text-brand-navy" : "text-brand-ink-faint"
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
        onClick={() => setOpen(true)}
        className="w-full font-brand text-left bg-white p-[18px] flex flex-col gap-2.5 hover:bg-[#f7f9fc]"
      >
        <div className="w-fit self-center bg-brand-blue-tint border border-[#c3cfe3]">
          {alumni.imageUrl ? (
            <img src={alumni.imageUrl} alt={alumni.name} className="max-w-[150px] h-auto block" />
          ) : (
            <PlaceholderAvatar />
          )}
        </div>
        <h3 className="m-0 text-[15px] font-semibold leading-[1.3] text-brand-navy">{alumni.name}</h3>
        <div className="flex justify-between gap-2 flex-wrap">
          <span className="text-[11.5px] leading-[1.3] text-brand-ink-soft">
            {roleDotCompany || present(alumni.currentStatus) || 'Company not specified'}
          </span>
          {alumni.passOutYear && (
            <span className="text-[11.5px] font-medium text-brand-blue tabular-nums">
              {alumni.passOutYear}
            </span>
          )}
        </div>
      </button>

      {/* ================= PROFILE (PORTAL) ================= */}
      {open &&
        createPortal(
          <div className="font-brand fixed inset-0 z-[9999] overflow-y-auto bg-brand-ground">
            <div className="px-5 sm:px-8 lg:px-12 py-4 border-b border-brand-edge flex items-center gap-2 flex-wrap bg-white">
              <button onClick={() => setOpen(false)} className="text-[12px] font-medium text-brand-blue hover:underline">
                Alumni directory
              </button>
              <span className="text-[12px] text-brand-ink-faint">/</span>
              <span className="text-[12px] text-brand-ink-soft">{alumni.name}</span>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-[12px] font-medium text-brand-ink-soft border border-brand-ink-faint px-3 py-1.5"
              >
                Close
              </button>
            </div>

            <div className="bg-brand-navy px-5 sm:px-8 lg:px-12 py-8 sm:py-9 lg:py-10 grid grid-cols-[minmax(150px,180px)_minmax(0,1fr)] gap-7 items-start">
              <div className="w-fit bg-brand-blue border border-[#3d5077]">
                {alumni.imageUrl ? (
                  <img src={alumni.imageUrl} alt={alumni.name} className="max-w-[180px] h-auto block" />
                ) : (
                  <PlaceholderAvatar size="lg" />
                )}
              </div>
              <div className="min-w-0 flex flex-col gap-2.5">
                {alumni.passOutYear && (
                  <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-brand-red">
                    Class of {alumni.passOutYear}
                  </span>
                )}
                <h1 className="m-0 text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.05] font-semibold tracking-[-0.02em] text-white">
                  {alumni.name}
                </h1>
                {roleAtCompany && (
                  <span className="text-[14.5px] leading-[1.5] text-brand-on-navy">
                    {roleAtCompany}
                  </span>
                )}
                {alumni.linkedinUrl && (
                  <div className="flex gap-2 flex-wrap pt-1.5">
                    <a
                      href={alumni.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-[15px] py-2.5 border border-[#4a5a7a] text-[12px] font-medium text-white"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 sm:px-8 lg:px-12 py-7 sm:py-8 lg:py-9 flex flex-col gap-7 bg-white">
              <FactGroup title="Current work" facts={workFacts} />
              <FactGroup title="Higher studies" facts={higherStudiesFacts} />
              <FactGroup title="Startup" facts={startupFacts} />

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
                  Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills?.length ? (
                    alumni.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-[7px] border border-brand-ink-faint text-[12.5px] text-[#3a3838]">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="m-0 text-[13px] text-brand-ink-soft">No skills listed</p>
                  )}
                </div>
              </div>

              {alumni.bio && (
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy border-b-2 border-brand-navy pb-2">
                    About
                  </span>
                  <p className="m-0 max-w-[76ch] text-[14px] leading-[1.7] text-[#3a3838] whitespace-pre-line">
                    {alumni.bio}
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
