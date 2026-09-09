// Every avatar/initials box in the mockups is square, grayscale-filtered
// when it's a real photo — "0 radius everywhere" has no exception in the
// actual page designs. Render every avatar through this component so it's
// applied consistently.
export default function Avatar({ src, alt = "", initials, size = 40, className = "" }) {
  const style = { width: size, height: size };
  return (
    <div
      className={`overflow-hidden bg-ds-blue-tint border border-ds-edge flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover grayscale" />
      ) : (
        <span className="text-label text-navy font-semibold">{initials}</span>
      )}
    </div>
  );
}
