// components/ui/PageHeader.jsx
// Consistent page intro used across every public page:
// mono eyebrow → gradient headline → muted lead → optional actions.
import { motion } from "framer-motion";
import { EASE } from "./motion";

const DEFAULT_SPACING = "pt-14 pb-10 sm:pt-20 sm:pb-12 lg:pt-24";

// `compact` is for admin screens, which sit under their own toolbar.
// `spacing` replaces the default vertical padding (Tailwind can't reliably
// override one padding utility with another via className).
export default function PageHeader({ eyebrow, title, accent, description, actions, children, compact = false, spacing, className = "" }) {
  const pad = spacing || (compact ? "pb-8 pt-2" : DEFAULT_SPACING);
  return (
    <header className={`relative ${pad} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex max-w-3xl flex-col gap-4">
          {eyebrow && (
            <span className="eyebrow-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(94,106,210,0.9)]" />
              {eyebrow}
            </span>
          )}
          <h1 className="h-page">
            <span className="text-gradient">{title}</span>
            {accent && (
              <>
                {" "}
                <span className="text-shimmer">{accent}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </motion.div>
      {children}
    </header>
  );
}
