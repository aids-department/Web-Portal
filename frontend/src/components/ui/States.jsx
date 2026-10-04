// components/ui/States.jsx
// Shared loading / empty states so every page reads the same while data loads.
import { Inbox, AlertCircle, CheckCircle2, Info } from "lucide-react";

const ALERT_TONES = {
  error: { cls: "border-rose-500/25 bg-rose-500/10 text-rose-200", Icon: AlertCircle },
  success: { cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200", Icon: CheckCircle2 },
  info: { cls: "border-line-accent bg-accent/10 text-indigo-100", Icon: Info },
};

export function Alert({ tone = "error", children, className = "" }) {
  const { cls, Icon } = ALERT_TONES[tone] || ALERT_TONES.error;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed animate-fade-in ${cls} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-none" strokeWidth={1.75} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-white/10 border-t-accent ${className}`}
    />
  );
}

export function LoadingState({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-24 text-sm text-fg-muted ${className}`}>
      <Spinner className="h-7 w-7" />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action, className = "" }) {
  return (
    <div
      className={`surface flex flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}
    >
      <div className="icon-tile h-12 w-12">
        <Icon className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
      </div>
      <p className="text-base font-medium text-fg">{title}</p>
      {description && <p className="max-w-sm text-sm leading-relaxed text-fg-muted">{description}</p>}
      {action}
    </div>
  );
}
