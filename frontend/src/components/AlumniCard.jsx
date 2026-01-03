import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaLinkedin } from "react-icons/fa";

/* Skill color palette (cycled) */
const SKILL_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-teal-100 text-teal-800",
  "bg-pink-100 text-pink-800",
];

export default function AlumniCard({ alumni }) {
  const [open, setOpen] = useState(false);

  if (!alumni) return null;

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-700 ring-4 ring-white shadow-md group-hover:scale-105 transition">
              {alumni.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-6 pb-6">
          <h3 className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
            {alumni.name}
          </h3>

          <p className="text-sm font-semibold text-indigo-600">
            {alumni.role}
          </p>

          <p className="text-xs text-gray-500 mb-4">
            {alumni.company || "Company not specified"}
          </p>

          {/* Skills preview */}
          <div className="flex flex-wrap gap-2 mb-5">
            {alumni.skills?.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  SKILL_COLORS[i % SKILL_COLORS.length]
                }`}
              >
                {skill}
              </span>
            ))}

            {alumni.skills?.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                +{alumni.skills.length - 3}
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition"
          >
            View Full Profile
          </button>
        </div>
      </div>

      {/* ================= MODAL (PORTAL) ================= */}
      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
              <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
                      {alumni.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
                        {alumni.name}
                      </h2>
                      <p className="text-sm font-medium text-indigo-600">
                        {alumni.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* LEFT */}
                    <Section title="Professional Information" accent="indigo">
                      <Info label="Current Role" value={alumni.role} />
                      <Info label="Company" value={alumni.company || "Not specified"} />
                      <Info label="Pass Out Year" value={alumni.passOutYear} />
                    </Section>

                    {/* RIGHT */}
                    <Section title="Technical Skills" accent="blue">
                      <div className="flex flex-wrap gap-2">
                        {alumni.skills?.length ? (
                          alumni.skills.map((skill, i) => (
                            <span
                              key={i}
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                SKILL_COLORS[i % SKILL_COLORS.length]
                              }`}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No skills listed
                          </p>
                        )}
                      </div>
                    </Section>

                    {alumni.bio && (
                      <Section title="About" accent="purple">
                        <p className="text-gray-700 leading-relaxed">
                          {alumni.bio}
                        </p>
                      </Section>
                    )}

                    {alumni.linkedin && (
                      <Section title="Connect" accent="blue">
                        <a
                          href={alumni.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          <FaLinkedin size={20} />
                          LinkedIn Profile
                        </a>
                      </Section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, accent = "indigo", children }) {
  const accentMap = {
    indigo: "text-indigo-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
  };

  return (
    <div>
      <h3 className={`text-lg font-bold mb-4 ${accentMap[accent]}`}>
        {title}
      </h3>
      <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
