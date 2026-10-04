// Event type -> tag color for the dark "Linear" design system.
// Four quiet, translucent tints: competitive (accent), learning (sky),
// culture (rose) and neutral. Text colours keep >4.5:1 contrast on #050506.
const COMPETE = { bg: "rgba(94,106,210,0.16)", fg: "#C7CBF5", border: "rgba(94,106,210,0.35)" };
const LEARN = { bg: "rgba(56,189,248,0.10)", fg: "#9FDCF7", border: "rgba(56,189,248,0.25)" };
const CULTURE = { bg: "rgba(244,114,182,0.10)", fg: "#F5B3D3", border: "rgba(244,114,182,0.25)" };
const NEUTRAL = { bg: "rgba(255,255,255,0.05)", fg: "#A1A6AE", border: "rgba(255,255,255,0.10)" };

const TYPE_STYLES = {
  hackathon: COMPETE,
  contest: COMPETE,
  competition: COMPETE,
  sports: COMPETE,
  workshop: LEARN,
  seminar: LEARN,
  training: LEARN,
  trainings: LEARN,
  conference: LEARN,
  conferences: LEARN,
  talk: CULTURE,
  literary: CULTURE,
  "literary fests": CULTURE,
  cultural: CULTURE,
  "cultural fests": CULTURE,
  management: CULTURE,
  "management fests": CULTURE,
  internship: NEUTRAL,
  internships: NEUTRAL,
  online: NEUTRAL,
  "online events": NEUTRAL,
};

export function eventTagStyle(type) {
  return TYPE_STYLES[(type || "").toLowerCase()] || NEUTRAL;
}
