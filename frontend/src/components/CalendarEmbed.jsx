// frontend/src/components/CalendarEmbed.jsx
import React from 'react';
import { Calendar, ExternalLink, Download, CheckCircle2 } from 'lucide-react';
import {
  GOOGLE_CALENDAR_URL,
  VCALENDAR_ICS_URL,
  GOOGLE_CALENDAR_EMBED_URL,
} from '../utils/calendarUtils';

export default function CalendarEmbed() {
  const embedUrl = `${GOOGLE_CALENDAR_EMBED_URL}&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&mode=MONTH`;

  return (
    <div className="font-brand flex flex-col gap-5">
      {/* Top Banner / Controls */}
      <div className="border border-brand-edge p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-navy">
              Live Google Calendar
            </span>
          </div>
          <h2 className="m-0 text-[18px] sm:text-[20px] font-semibold text-brand-navy">
            AI &amp; DS Department Calendar
          </h2>
          <p className="m-0 text-[12.5px] text-brand-ink-soft">
            Synchronized with official Google Calendar &amp; vCalendar feed.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold bg-brand-navy text-white hover:bg-brand-blue transition-colors"
          >
            <Calendar size={14} />
            Open in Google Calendar
            <ExternalLink size={12} />
          </a>
          <a
            href={VCALENDAR_ICS_URL}
            download="aids_department_calendar.ics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold border border-brand-edge text-brand-navy hover:bg-brand-ground transition-colors"
            title="Subscribe via Apple Calendar, Outlook, or Google Calendar"
          >
            <Download size={14} />
            Subscribe (vCalendar)
          </a>
        </div>
      </div>

      {/* Calendar Iframe Container */}
      <div className="border-2 border-brand-navy bg-white shadow-sm overflow-hidden">
        <div className="p-3 bg-brand-ground border-b border-brand-edge flex items-center justify-between text-[11.5px] text-brand-ink-soft">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Interactive View — Click on any event to view schedule and room
          </span>
          <span className="hidden sm:inline text-[11px]">Timezone: Asia/Kolkata (IST)</span>
        </div>
        <div className="w-full h-[650px] relative bg-slate-50">
          <iframe
            src={embedUrl}
            title="AI & DS Department Google Calendar"
            style={{ border: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Sync instructions footnote */}
      <div className="p-4 border border-dashed border-brand-edge text-[12px] text-brand-ink-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span>
          💡 <strong>Tip for Students &amp; Faculty:</strong> You can add this calendar to your phone or laptop calendar app using the vCalendar link to automatically receive schedule alerts.
        </span>
        <a
          href={VCALENDAR_ICS_URL}
          className="text-brand-red font-semibold underline whitespace-nowrap"
        >
          Download .ics feed
        </a>
      </div>
    </div>
  );
}
