function Label({ className = "", children, ...rest }) {
  return (
    <label
      className={`block text-label tracking-label uppercase text-ds-ink-soft mb-1.5 ${className}`}
      {...rest}
    >
      {children}
    </label>
  );
}

function Input({ className = "", ...rest }) {
  return (
    <input
      className={`w-full border border-ds-edge bg-white px-3 py-2.5 text-body text-ds-ink placeholder:text-ds-ink-faint focus:outline-none focus:border-navy ${className}`}
      {...rest}
    />
  );
}

function Textarea({ className = "", ...rest }) {
  return (
    <textarea
      className={`w-full border border-ds-edge bg-white px-3 py-2.5 text-body text-ds-ink placeholder:text-ds-ink-faint focus:outline-none focus:border-navy ${className}`}
      {...rest}
    />
  );
}

function Select({ className = "", children, ...rest }) {
  return (
    <select
      className={`w-full border border-ds-edge bg-white px-3 py-2.5 text-body text-ds-ink focus:outline-none focus:border-navy ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

function Checkbox({ className = "", ...rest }) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 accent-navy border border-ds-edge ${className}`}
      {...rest}
    />
  );
}

function Radio({ className = "", ...rest }) {
  return (
    <input
      type="radio"
      className={`h-4 w-4 accent-navy border border-ds-edge ${className}`}
      {...rest}
    />
  );
}

function SearchWithGo({ inputProps = {}, onGo, goLabel = "Go", className = "" }) {
  return (
    <div className={`flex border-2 border-navy ${className}`}>
      <input
        className="flex-1 px-3 py-2.5 text-body text-ds-ink placeholder:text-ds-ink-faint focus:outline-none"
        {...inputProps}
      />
      <button
        type="button"
        onClick={onGo}
        className="bg-navy text-white px-4 text-label font-medium hover:bg-navy-deep"
      >
        {goLabel}
      </button>
    </div>
  );
}

const Field = { Label, Input, Textarea, Select, Checkbox, Radio, SearchWithGo };

export default Field;
