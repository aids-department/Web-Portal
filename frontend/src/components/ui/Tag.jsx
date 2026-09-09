const VARIANTS = {
  live: "bg-ds-red text-white",
  "question-paper": "bg-ds-red-tint text-ds-red-deep",
  workshop: "bg-ds-blue-tint text-ds-blue",
  past: "bg-ds-ground text-ds-ink-soft",
  outline: "bg-transparent text-ds-ink border border-ds-edge",
};

export default function Tag({ variant = "outline", className = "", children, ...rest }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-kicker tracking-kicker uppercase font-medium ${VARIANTS[variant] || VARIANTS.outline} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
