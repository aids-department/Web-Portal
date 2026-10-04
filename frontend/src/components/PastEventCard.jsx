// frontend/src/components/PastEventCard.jsx
import React from 'react';
import { Trophy, CalendarDays } from 'lucide-react';
import { EventTypeTag } from './UpcomingEventCard';
import { Spotlight } from './ui/SpotlightCard';
import { useSpotlight } from './ui/useSpotlight';

const PastEventCard = ({ event, onOpenModal, layout = 'grid' }) => {
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

  const winner = event.winner || event.winningTeam;
  const isList = layout === 'list';

  const thumbnail = (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-xl border border-line bg-canvas-elevated ${
        isList ? 'w-[96px] flex-none self-stretch sm:w-[150px]' : 'h-[120px]'
      }`}
    >
      {event.poster || event.image ? (
        <img
          src={event.poster || event.image}
          alt={event.eventName}
          loading="lazy"
          className="h-full w-full object-cover opacity-70 grayscale transition-[filter,opacity,transform] duration-500 ease-expo group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <CalendarDays className="h-6 w-6 text-fg-muted/50" strokeWidth={1.25} />
      )}
    </div>
  );

  const winnerLine = winner && (
    <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-amber-300/90">
      <Trophy size={13} className="flex-none" />
      <span className="truncate">{winner}</span>
    </span>
  );

  const dateLine = (
    <span className={`font-mono text-[11px] leading-[1.5] tabular-nums text-fg-muted ${isList ? 'truncate' : ''}`}>
      {formatDate(event.endDate || event.startDate)} ·{' '}
      {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
    </span>
  );

  const shell =
    'group surface edge-highlight surface-interactive w-full text-left p-4';

  if (isList) {
    // Compact list row: every line is clamped so all rows share one height
    return (
      <button ref={ref} onMouseMove={onMouseMove} onClick={() => onOpenModal(event)} className={`${shell} flex gap-4`}>
        <Spotlight />
        <span aria-hidden="true" className="gradient-border" />
        {thumbnail}
        <div className="relative flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-3">
            <EventTypeTag type={event.eventType} />
            {winnerLine}
          </div>
          <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug tracking-tight text-fg">
            {event.eventName || event.title}
          </h3>
          {dateLine}
          <p className="line-clamp-2 min-h-[3.1em] text-[12.5px] leading-relaxed text-fg-muted">
            {event.description}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button ref={ref} onMouseMove={onMouseMove} onClick={() => onOpenModal(event)} className={`${shell} flex h-full flex-col gap-2.5`}>
      <Spotlight />
      <span aria-hidden="true" className="gradient-border" />
      {thumbnail}
      <EventTypeTag type={event.eventType} className="relative self-start" />
      <h3 className="relative text-[15px] font-semibold leading-snug tracking-tight text-fg">
        {event.eventName || event.title}
      </h3>
      <span className="relative">{dateLine}</span>
      {winnerLine && <span className="relative mt-auto">{winnerLine}</span>}
    </button>
  );
};

export default PastEventCard;
