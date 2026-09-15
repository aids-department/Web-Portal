// frontend/src/components/PastEventCard.jsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { eventTagStyle } from '../utils/eventTagStyle';

const PastEventCard = ({ event, onOpenModal }) => {

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

  return (
    <button
      onClick={() => onOpenModal(event)}
      className="font-brand text-left bg-white p-4 flex flex-col gap-2 hover:bg-[#f7f9fc]"
    >
      <div className="h-[88px] bg-brand-blue-tint border border-[#c3cfe3] grid place-items-center overflow-hidden">
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
      <span
        className="self-start px-2 py-1 text-[9.5px] font-semibold tracking-[0.1em] uppercase"
        style={{ background: tag.bg, color: tag.fg }}
      >
        {event.eventType || 'Event'}
      </span>
      <h3 className="m-0 text-[14.5px] font-semibold text-brand-navy leading-[1.3]">
        {event.eventName || event.title}
      </h3>
      <span className="text-[11.5px] leading-[1.4] text-brand-ink-soft tabular-nums">
        {formatDate(event.endDate || event.startDate)} ·{' '}
        {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
      </span>
      {winner && (
        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-red">
          <Trophy size={13} />
          {winner}
        </span>
      )}
    </button>
  );
};

export default PastEventCard;
