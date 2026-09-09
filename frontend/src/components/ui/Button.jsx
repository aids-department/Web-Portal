const VARIANTS = {
  primary: "bg-ds-red text-white hover:bg-ds-red-deep",
  navy: "bg-navy text-white hover:bg-navy-deep",
  secondary: "bg-white text-navy border border-navy hover:bg-ds-ground",
  quiet: "bg-ds-ground text-ds-ink hover:bg-ds-edge",
  "on-navy": "bg-transparent text-white border border-on-navy hover:bg-white/10",
};

export default function Button({
  variant = "secondary",
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-start gap-2 px-4 py-2.5 text-label font-medium disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.secondary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
