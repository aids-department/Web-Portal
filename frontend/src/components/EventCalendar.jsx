import React from 'react';

const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Monday-first weekday index for a given Date (0 = Monday ... 6 = Sunday).
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const EventCalendar = ({ events = [] }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(firstOfMonth);

  const eventDates = events
    .map((e) => e.startDate && new Date(e.startDate))
    .filter(Boolean);

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isMarked = eventDates.some((ed) => sameDay(ed, date));
    const isToday = sameDay(date, today);
    cells.push({ n: d, isMarked, isToday });
  }

  return (
    <aside className="font-brand border border-brand-edge p-5 flex flex-col gap-4 min-w-[270px]">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-semibold text-brand-navy">
          {MONTH_NAMES[month]} {year}
        </span>
        <span className="text-[11.5px] text-brand-ink-soft">Calendar</span>
      </div>

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
            <span
              key={i}
              className={`aspect-square grid place-items-center text-[12px] tabular-nums ${
                c.isMarked || c.isToday ? 'font-semibold' : 'font-normal'
              } ${c.isMarked ? 'bg-brand-red text-white' : 'text-[#3a3838]'} ${
                c.isToday ? 'border border-brand-navy' : 'border border-transparent'
              }`}
            >
              {c.n}
            </span>
          )
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-brand-edge pt-3.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-brand-red" />
          <span className="text-[11.5px] text-[#3a3838]">Event scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 border border-brand-navy" />
          <span className="text-[11.5px] text-[#3a3838]">Today</span>
        </div>
      </div>
    </aside>
  );
};

export default EventCalendar;
