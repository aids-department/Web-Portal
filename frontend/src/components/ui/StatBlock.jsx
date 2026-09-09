export default function StatBlock({ stats = [], className = "" }) {
  return (
    <div className={`bg-navy px-gutter-mobile sm:px-gutter py-6 flex flex-wrap gap-x-10 gap-y-4 ${className}`}>
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-figure text-white tabular-nums">{stat.value}</span>
          <span className="text-label tracking-label uppercase text-on-navy-muted">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
