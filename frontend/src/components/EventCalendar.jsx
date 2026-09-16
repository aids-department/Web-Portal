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
    <aside className="font-brand border border-brand-edge p-5 flex flex-col gap-4 min-w-[280px] bg-white shadow-sm">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between gap-2 border-b border-brand-edge pb-3">
        <div>
          <span className="text-[15px] font-semibold text-brand-navy">
            {MONTH_NAMES[month]} {year}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10.5px] text-brand-ink-soft">Google vCalendar Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-1 border border-brand-edge hover:border-brand-navy text-brand-navy transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={jumpToToday}
            className="px-2 py-1 text-[10.5px] font-semibold border border-brand-edge hover:border-brand-navy text-brand-navy"
            title="Go to current month"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1 border border-brand-edge hover:border-brand-navy text-brand-navy transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d, i) => (
          <span
            key={i}
            className="text-center text-[9.5px] font-semibold tracking-[0.08em] uppercase text-brand-ink-soft pb-1"
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
              className={`aspect-square grid place-items-center text-[12px] tabular-nums transition-all relative ${
                c.isSelected
                  ? 'bg-brand-navy text-white font-bold ring-2 ring-brand-red'
                  : c.isMarked
                  ? 'bg-brand-red text-white font-semibold hover:opacity-90'
                  : 'text-[#3a3838] hover:bg-brand-ground'
              } ${c.isToday && !c.isSelected ? 'border border-brand-navy font-semibold' : 'border border-transparent'}`}
              title={
                c.isMarked
                  ? `${c.events.length} event(s) on ${c.date.toLocaleDateString()}`
                  : c.date.toLocaleDateString()
              }
            >
              {c.n}
              {c.isMarked && !c.isSelected && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          )
        )}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border border-brand-edge bg-brand-ground p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11.5px] font-semibold text-brand-navy">
            <span>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[11px] text-brand-ink-soft hover:text-brand-red underline"
            >
              Clear
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <span className="text-[12px] text-brand-ink-soft italic">No events scheduled for this day.</span>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-white border border-brand-edge p-2 flex flex-col gap-1 text-[12px]"
                >
                  <span className="font-semibold text-brand-navy">{ev.eventName || ev.title}</span>
                  <div className="flex items-center justify-between text-[10.5px] text-brand-ink-soft">
                    <span>{ev.eventMode === 'Online' ? 'Online' : ev.venue || 'On Campus'}</span>
                    <a
                      href={getGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-red font-medium hover:underline flex items-center gap-0.5"
                    >
                      + Google Cal
                    </a>
                  </div>
                  {onSelectEvent && (
                    <button
                      onClick={() => onSelectEvent(ev)}
                      className="text-left text-[11px] text-brand-blue font-medium hover:underline mt-0.5"
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
      <div className="flex flex-col gap-1.5 border-t border-brand-edge pt-3 text-[11.5px] text-[#3a3838]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-brand-red shrink-0" />
          <span>Scheduled Event</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 border border-brand-navy shrink-0" />
          <span>Today</span>
        </div>
      </div>

      {/* Google Calendar & vCalendar Integration Links */}
      <div className="flex flex-col gap-2 border-t border-brand-edge pt-3">
        {onViewFullCalendar && (
          <button
            type="button"
            onClick={onViewFullCalendar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-brand-navy text-white text-[11.5px] font-semibold hover:bg-brand-blue transition-colors"
          >
            <CalendarIcon size={14} />
            Full Google Calendar View
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 border border-brand-edge text-brand-navy text-[11px] font-medium hover:bg-brand-ground transition-colors"
            title="Open in Google Calendar"
          >
            <ExternalLink size={12} />
            Google Cal
          </a>
          <a
            href={VCALENDAR_ICS_URL}
            download="aids_department_calendar.ics"
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 border border-brand-edge text-brand-navy text-[11px] font-medium hover:bg-brand-ground transition-colors"
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
