export default function PageHeader({ kicker, heading, children, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      {kicker && (
        <p className="text-kicker tracking-kicker uppercase text-ds-red mb-3">{kicker}</p>
      )}
      <h1 className="text-page-heading text-navy mb-4">{heading}</h1>
      {children && (
        <div className="max-w-[74ch] text-body text-ds-ink-soft">{children}</div>
      )}
    </div>
  );
}
