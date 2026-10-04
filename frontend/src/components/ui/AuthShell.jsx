// components/ui/AuthShell.jsx
// Split auth card used by sign in, sign up and admin sign in:
// an atmospheric info panel beside a glass form panel.
import { motion } from "framer-motion";
import HeroCanvas from "../HeroCanvas";
import { EASE } from "./motion";

export function BrandMark({ label = "AI & DS" }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.03] shadow-inner-hl">
        <span className="h-2 w-2 rounded-[3px] bg-accent shadow-[0_0_12px_2px_rgba(94,106,210,0.8)]" />
      </span>
      <span className="text-[13px] font-semibold tracking-tight text-fg">{label}</span>
    </div>
  );
}

export default function AuthShell({ aside, children, canvas = false, maxWidth = "max-w-[980px]" }) {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`relative mx-auto ${maxWidth}`}
      >
        <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-6 rounded-[48px] bg-accent/10 blur-[80px]" />
        <div className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-canvas-elevated/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.6),0_0_120px_rgba(94,106,210,0.12)] backdrop-blur-xl md:grid-cols-2">
          {/* Info panel */}
          <div className="relative flex min-h-[280px] flex-col justify-between gap-10 overflow-hidden border-b border-line bg-[radial-gradient(ellipse_at_top_left,rgba(94,106,210,0.22),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)] p-8 md:min-h-[460px] md:border-b-0 md:border-r">
            {canvas && (
              <div className="absolute inset-0 opacity-70">
                <HeroCanvas />
              </div>
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-[0.03]" />
            {/* pointer-events pass through to the canvas so it still reacts to the cursor */}
            <div className={`relative z-10 flex h-full flex-col justify-between gap-10 ${canvas ? "pointer-events-none" : ""}`}>{aside}</div>
          </div>

          {/* Form panel */}
          <div className="relative flex flex-col gap-5 p-8 sm:p-10">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
