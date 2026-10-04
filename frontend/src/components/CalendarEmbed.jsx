// frontend/src/components/CalendarEmbed.jsx
import React from 'react';
import { Calendar, ExternalLink, Download, CheckCircle2, Lightbulb } from 'lucide-react';
import {
  GOOGLE_CALENDAR_URL,
  VCALENDAR_ICS_URL,
  GOOGLE_CALENDAR_EMBED_URL,
} from '../utils/calendarUtils';
import { Reveal } from './ui/Reveal';

export default function CalendarEmbed() {
  const embedUrl = `${GOOGLE_CALENDAR_EMBED_URL}&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&mode=MONTH`;

  return (
    <Reveal className="flex flex-col gap-5">
      {/* Top Banner / Controls */}
      <div className="surface edge-highlight flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-fg-muted">
              Live Google Calendar
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-fg">
            AI &amp; DS Department Calendar
          </h2>
          <p className="text-[13px] text-fg-muted">
            Synchronized with official Google Calendar &amp; vCalendar feed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Calendar size={14} />
            Open in Google Calendar
            <ExternalLink size={12} />
          </a>
          <a
            href={VCALENDAR_ICS_URL}
            download="aids_department_calendar.ics"
            className="btn-secondary"
            title="Subscribe via Apple Calendar, Outlook, or Google Calendar"
          >
            <Download size={14} />
            Subscribe (vCalendar)
          </a>
        </div>
      </div>

      {/* Calendar Iframe Container */}
      <div className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 text-[12px] text-fg-muted">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Interactive View — Click on any event to view schedule and room
          </span>
          <span className="hidden font-mono text-[11px] sm:inline">Timezone: Asia/Kolkata (IST)</span>
        </div>
        <div className="relative h-[650px] w-full bg-canvas-elevated">
          {/* Google's embed is light-only; invert + hue-rotate renders it in the dark palette */}
          <iframe
            src={embedUrl}
            title="AI & DS Department Google Calendar"
            style={{ border: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            className="h-full w-full [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.8)]"
          />
        </div>
      </div>

      {/* Sync instructions footnote */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-white/10 p-4 text-[13px] text-fg-muted sm:flex-row sm:items-center">
        <span className="flex items-start gap-2.5">
          <Lightbulb size={16} className="mt-0.5 flex-none text-accent-bright" />
          <span>
            <strong className="font-medium text-fg">Tip for Students &amp; Faculty:</strong> You can add this calendar to your phone or laptop calendar app using the vCalendar link to automatically receive schedule alerts.
          </span>
        </span>
        <a href={VCALENDAR_ICS_URL} className="btn-ghost btn-sm whitespace-nowrap text-accent-bright">
          Download .ics feed
        </a>
      </div>
    </Reveal>
  );
}
