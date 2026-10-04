// frontend/src/components/UpcomingEventCard.jsx
import React from 'react';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { eventTagStyle } from '../utils/eventTagStyle';
import { Spotlight } from './ui/SpotlightCard';
import { useSpotlight } from './ui/useSpotlight';

export function EventTypeTag({ type, className = '' }) {
  const tag = eventTagStyle(type);
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] ${className}`}
      style={{ background: tag.bg, color: tag.fg, borderColor: tag.border }}
    >
      {type || 'Event'}
    </span>
  );
}

const UpcomingEventCard = ({ event, onOpenModal, layout = 'list' }) => {
  const { ref, onMouseMove } = useSpotlight();

  // --- DATE FORMATTER (unchanged) ---
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasRegistration = !!(event.registrationLink && event.registrationLink !== 'NO_LINK');
  const isGrid = layout === 'grid';
  const place = event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus';

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={() => onOpenModal(event)}
      className={`group surface edge-highlight surface-interactive w-full overflow-hidden text-left ${
        isGrid
          ? 'flex h-full flex-col'
          : 'grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)]'
      }`}
    >
      <Spotlight />
      <span aria-hidden="true" className="gradient-border" />

      {/* In list view the photo stretches to the row height on sm+ */}
      <div
        className={`relative grid place-items-center overflow-hidden bg-canvas-elevated ${
          isGrid ? 'h-[160px] border-b border-line' : 'h-[160px] border-b border-line sm:h-auto sm:border-b-0 sm:border-r'
        }`}
      >
        {event.poster || event.image ? (
          <img
            src={event.poster || event.image}
            alt={event.eventName}
            loading="lazy"
            className="h-full w-full object-cover opacity-80 grayscale transition-[filter,opacity,transform] duration-500 ease-expo group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <CalendarDays className="h-7 w-7 text-fg-muted/50" strokeWidth={1.25} />
        )}
      </div>

      {isGrid ? (
        <div className="relative flex min-w-0 flex-1 flex-col gap-2.5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <EventTypeTag type={event.eventType} />
            <span className="font-mono text-[11px] tabular-nums text-fg-muted">
              {formatDate(event.startDate || event.date)}
            </span>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-fg">
            {event.eventName || event.title}
          </h3>
          <span className="flex items-center gap-1.5 text-[13px] text-fg-muted">
            <MapPin className="h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
            {place}
          </span>
          <span className="mt-auto flex items-center gap-1 pt-2 text-[12.5px] font-medium text-accent-bright">
            {hasRegistration ? 'Details and registration' : 'Details'}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      ) : (
        // Compact list row: every line is clamped so all rows share one height
        <div className="relative flex min-w-0 flex-col gap-2 p-5">
          <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <EventTypeTag type={event.eventType} />
            <span className="min-w-0 truncate font-mono text-[11px] tabular-nums text-fg-muted">
              {formatDate(event.startDate || event.date)} · {place}
            </span>
            <span className="ml-auto hidden flex-none items-center gap-1 pl-2 text-[12.5px] font-medium text-accent-bright sm:flex">
              {hasRegistration ? 'Details and registration' : 'Details'}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
          <h3 className="line-clamp-1 text-[17px] font-semibold leading-snug tracking-tight text-fg">
            {event.eventName || event.title}
          </h3>
          <p className="line-clamp-2 min-h-[3.1em] text-[13px] leading-relaxed text-fg-muted">
            {event.description}
          </p>
          <span className="flex items-center gap-1 text-[12.5px] font-medium text-accent-bright sm:hidden">
            {hasRegistration ? 'Details and registration' : 'Details'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </button>
  );
};

export default UpcomingEventCard;
