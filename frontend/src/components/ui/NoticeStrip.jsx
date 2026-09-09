export default function NoticeStrip({ tagLabel = "Notice", message, className = "" }) {
  return (
    <div className={`w-full bg-ds-red-tint border-t-2 border-ds-red px-gutter-mobile sm:px-gutter py-3 flex items-center gap-4 ${className}`}>
      <span className="bg-ds-red text-white px-2.5 py-1 text-kicker tracking-kicker uppercase font-medium shrink-0">
        {tagLabel}
      </span>
      <p className="text-body text-ds-ink">{message}</p>
    </div>
  );
}
