function Tabs({ className = "", children, ...rest }) {
  return (
    <div className={`flex items-end gap-6 border-b border-ds-edge ${className}`} {...rest}>
      {children}
    </div>
  );
}

function Tab({ active = false, className = "", children, ...rest }) {
  return (
    <button
      className={`pb-2.5 text-label font-medium border-b-3 -mb-px ${
        active
          ? "text-navy font-semibold border-ds-red"
          : "text-ds-ink-soft border-transparent hover:text-ds-ink"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

Tabs.Tab = Tab;

export default Tabs;
