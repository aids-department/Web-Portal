// Event type -> tag color, following the AI & DS design system's four-tag
// palette (see newdesign/AIDS Portal.dc.html "tag" map in the events views).
const NAVY = { bg: "#0e1c3d", fg: "#ffffff" };
const BLUE_TINT = { bg: "#e4eaf4", fg: "#1b3a6b" };
const RED_TINT = { bg: "#ffe0d9", fg: "#ae1800" };
const NEUTRAL = { bg: "#eae7e7", fg: "#444141" };

const TYPE_STYLES = {
  hackathon: NAVY,
  contest: NAVY,
  competition: NAVY,
  sports: NAVY,
  workshop: BLUE_TINT,
  seminar: BLUE_TINT,
  training: BLUE_TINT,
  trainings: BLUE_TINT,
  conference: BLUE_TINT,
  conferences: BLUE_TINT,
  talk: RED_TINT,
  literary: RED_TINT,
  "literary fests": RED_TINT,
  cultural: RED_TINT,
  "cultural fests": RED_TINT,
  management: RED_TINT,
  "management fests": RED_TINT,
  internship: NEUTRAL,
  internships: NEUTRAL,
  online: NEUTRAL,
  "online events": NEUTRAL,
};

export function eventTagStyle(type) {
  return TYPE_STYLES[(type || "").toLowerCase()] || NEUTRAL;
}
