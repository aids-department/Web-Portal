// components/ui/Modal.jsx
// Shared dialog shell: blurred near-black backdrop + elevated glass panel that
// scales in with expo-out. Render it conditionally ({open && <Modal …/>}).
// `onBackdropClick` is optional so each dialog keeps its original close behaviour.
import { useEffect } from "react";
import { motion } from "framer-motion";
import { EASE } from "./motion";

export default function Modal({ onBackdropClick, onEscape, className = "max-w-lg", z = "z-[999]", children, labelledBy }) {
  useEffect(() => {
    if (!onEscape) return;
    const onKey = (e) => e.key === "Escape" && onEscape();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEscape]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 ${z} flex items-center justify-center bg-canvas-deep/70 p-4 backdrop-blur-md`}
      onClick={onBackdropClick}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-canvas-elevated/95 shadow-popover backdrop-blur-xl edge-highlight ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
