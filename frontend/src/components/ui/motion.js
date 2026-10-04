// components/ui/motion.js
// Shared motion tokens. Kept out of the component files so React Fast Refresh
// keeps working (it only hot-reloads files that export components alone).

// Expo-out: swift, decisive, never overshoots.
export const EASE = [0.16, 1, 0.3, 1];

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
