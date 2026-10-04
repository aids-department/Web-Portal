// frontend/src/components/EventCalendar.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ExternalLink, Download } from 'lucide-react';
import { GOOGLE_CALENDAR_URL, VCALENDAR_ICS_URL, getGoogleCalendarUrl } from '../utils/calendarUtils';

const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const EventCalendar = ({ events = [], onViewFullCalendar, onSelectEvent }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(firstOfMonth);

  // Group events by matching dates
  const eventDatesMap = new Map();
  events.forEach((ev) => {
    const d = ev.startDate && new Date(ev.startDate);
    if (d && !isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!eventDatesMap.has(key)) eventDatesMap.set(key, []);
      eventDatesMap.get(key).push(ev);
    }
  });

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const key = `${year}-${month}-${d}`;
    const dayEvents = eventDatesMap.get(key) || [];
    const isMarked = dayEvents.length > 0;
    const isToday = sameDay(cellDate, today);
    const isSelected = selectedDate && sameDay(cellDate, selectedDate);
    cells.push({ n: d, date: cellDate, isMarked, isToday, isSelected, events: dayEvents });
  }

  // Selected date events
  const selectedDayEvents = selectedDate
    ? eventDatesMap.get(`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`) || []
    : [];

  return (
    <aside className="surface edge-highlight flex min-w-[280px] flex-col gap-4 p-5">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="text-[15px] font-semibold tracking-tight text-fg">
            {MONTH_NAMES[month]} {year}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">Google vCalendar Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={prevMonth} aria-label="Previous month" className="btn-icon h-7 w-7">
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={jumpToToday}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-fg-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:bg-white/[0.05] hover:text-fg"
            title="Go to current month"
          >
            Today
          </button>
          <button type="button" onClick={nextMonth} aria-label="Next month" className="btn-icon h-7 w-7">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d, i) => (
          <span
            key={i}
            className="pb-1 text-center font-mono text-[10px] font-medium uppercase text-fg-muted"
          >
            {d}
          </span>
        ))}
        {cells.map((c, i) =>
          c === null ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDate(c.date)}
              className={`relative grid aspect-square place-items-center rounded-lg text-[12px] tabular-nums transition-[background-color,box-shadow,color] duration-200 ${
                c.isSelected
                  ? 'bg-accent font-semibold text-white shadow-glow'
                  : c.isMarked
                  ? 'bg-accent/15 font-semibold text-indigo-200 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.4)] hover:bg-accent/25'
                  : 'text-fg/80 hover:bg-white/[0.06] hover:text-fg'
              } ${c.isToday && !c.isSelected ? 'font-semibold text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]' : ''}`}
              title={
                c.isMarked
                  ? `${c.events.length} event(s) on ${c.date.toLocaleDateString()}`
                  : c.date.toLocaleDateString()
              }
            >
              {c.n}
              {c.isMarked && !c.isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent-bright shadow-[0_0_6px_rgba(104,114,217,0.9)]" />
              )}
            </button>
          )
        )}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-white/[0.03] p-3 animate-fade-in">
          <div className="flex items-center justify-between text-[12px] font-medium text-fg">
            <span>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[11.5px] text-fg-muted transition-colors hover:text-fg"
            >
              Clear
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <span className="text-[12px] text-fg-muted">No events scheduled for this day.</span>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="flex flex-col gap-1 rounded-lg border border-line bg-canvas-elevated p-2.5 text-[12px]"
                >
                  <span className="font-medium text-fg">{ev.eventName || ev.title}</span>
                  <div className="flex items-center justify-between text-[11px] text-fg-muted">
                    <span>{ev.eventMode === 'Online' ? 'Online' : ev.venue || 'On Campus'}</span>
                    <a
                      href={getGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 font-medium text-accent-bright hover:underline"
                    >
                      + Google Cal
                    </a>
                  </div>
                  {onSelectEvent && (
                    <button
                      onClick={() => onSelectEvent(ev)}
                      className="mt-0.5 text-left text-[11.5px] font-medium text-fg-muted transition-colors hover:text-fg"
                    >
                      View details →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-line pt-3 text-[11.5px] text-fg-muted">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded bg-accent/30 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.6)]" />
          <span>Scheduled Event</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]" />
          <span>Today</span>
        </div>
      </div>

      {/* Google Calendar & vCalendar Integration Links */}
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        {onViewFullCalendar && (
          <button type="button" onClick={onViewFullCalendar} className="btn-primary btn-sm w-full">
            <CalendarIcon size={14} />
            Full Google Calendar View
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm text-[12px]"
            title="Open in Google Calendar"
          >
            <ExternalLink size={12} />
            Google Cal
          </a>
          <a
            href={VCALENDAR_ICS_URL}
            download="aids_department_calendar.ics"
            className="btn-secondary btn-sm text-[12px]"
            title="Download vCalendar (.ics) format"
          >
            <Download size={12} />
            vCalendar (.ics)
          </a>
        </div>
      </div>
    </aside>
  );
};

export default EventCalendar;
