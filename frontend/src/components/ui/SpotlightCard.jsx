// components/ui/SpotlightCard.jsx
// Elevated card with the signature mouse-tracking spotlight: a 300px radial
// accent glow follows the cursor, plus a gradient border that fades in on hover.
import { useSpotlight } from "./useSpotlight";

const VARIANTS = {
  default: "surface",
  glass: "surface-glass",
  solid: "surface-solid",
  gradient:
    "surface bg-[linear-gradient(to_bottom,rgba(94,106,210,0.10),rgba(255,255,255,0.02))]",
};

export function Spotlight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-expo group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(94,106,210,0.15), transparent 70%)",
      }}
    />
  );
}

export default function SpotlightCard({
  as: Tag = "div",
  variant = "default",
  interactive = false,
  className = "",
  children,
  ...rest
}) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group edge-highlight ${VARIANTS[variant] || VARIANTS.default} ${
        interactive ? "surface-interactive" : ""
      } ${className}`}
      {...rest}
    >
      <Spotlight />
      <span aria-hidden="true" className="gradient-border" />
      <div className="relative h-full">{children}</div>
    </Tag>
  );
}
