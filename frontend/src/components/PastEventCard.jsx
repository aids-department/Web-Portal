// frontend/src/components/PastEventCard.jsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { eventTagStyle } from '../utils/eventTagStyle';

const PastEventCard = ({ event, onOpenModal, layout = 'grid' }) => {

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

  const tag = eventTagStyle(event.eventType);
  const winner = event.winner || event.winningTeam;
  const isList = layout === 'list';

  const thumbnail = (
    <div
      className={`bg-brand-blue-tint border border-[#c3cfe3] grid place-items-center overflow-hidden ${
        isList ? 'flex-none self-stretch w-[96px] sm:w-[150px]' : 'h-[88px]'
      }`}
    >
      {event.poster || event.image ? (
        <img
          src={event.poster || event.image}
          alt={event.eventName}
          className="w-full h-full object-cover grayscale"
        />
      ) : (
        <span className="text-[8.5px] font-medium tracking-[0.14em] uppercase text-[#5f6e88]">
          Photograph
        </span>
      )}
    </div>
  );

  const typeTag = (
    <span
      className="flex-none self-start px-2 py-1 text-[9.5px] font-semibold tracking-[0.1em] uppercase"
      style={{ background: tag.bg, color: tag.fg }}
    >
      {event.eventType || 'Event'}
    </span>
  );

  const winnerLine = winner && (
    <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-red min-w-0">
      <Trophy size={13} className="flex-none" />
      <span className="truncate">{winner}</span>
    </span>
  );

  const dateLine = (
    <span className={`text-[11.5px] leading-[1.4] text-brand-ink-soft tabular-nums ${isList ? 'truncate' : ''}`}>
      {formatDate(event.endDate || event.startDate)} ·{' '}
      {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
    </span>
  );

  if (isList) {
    // Compact list row: every line is clamped so all rows share one height
    return (
      <button
        onClick={() => onOpenModal(event)}
        className="font-brand w-full text-left bg-white p-4 hover:bg-[#f7f9fc] flex gap-4"
      >
        {thumbnail}
        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-3 min-w-0">
            {typeTag}
            {winnerLine}
          </div>
          <h3 className="m-0 text-[14.5px] font-semibold text-brand-navy leading-[1.3] line-clamp-1">
            {event.eventName || event.title}
          </h3>
          {dateLine}
          <p className="m-0 text-[12px] leading-[1.55] min-h-[3.1em] text-brand-ink-soft line-clamp-2">
            {event.description}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onOpenModal(event)}
      className="font-brand w-full text-left bg-white p-4 hover:bg-[#f7f9fc] flex flex-col gap-2"
    >
      {thumbnail}
      {typeTag}
      <h3 className="m-0 text-[14.5px] font-semibold text-brand-navy leading-[1.3]">
        {event.eventName || event.title}
      </h3>
      {dateLine}
      {winnerLine}
    </button>
  );
};

export default PastEventCard;
