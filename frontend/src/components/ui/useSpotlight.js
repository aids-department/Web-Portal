// components/ui/useSpotlight.js
// Tracks the cursor inside an element and exposes it as --mx / --my CSS vars,
// which <Spotlight /> reads to position its radial glow.
import { useRef } from "react";

export function useSpotlight() {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return { ref, onMouseMove };
}
