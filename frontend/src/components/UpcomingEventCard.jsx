// frontend/src/components/UpcomingEventCard.jsx
import React from 'react';
import { eventTagStyle } from '../utils/eventTagStyle';

const UpcomingEventCard = ({ event, onOpenModal }) => {

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
  const hasRegistration = !!(event.registrationLink && event.registrationLink !== 'NO_LINK');

  return (
    <button
      onClick={() => onOpenModal(event)}
      className="font-brand w-full text-left grid grid-cols-1 sm:grid-cols-[minmax(120px,180px)_minmax(0,2fr)] gap-4 border border-brand-edge p-4 hover:border-brand-navy"
    >
      <div className="min-h-[120px] bg-brand-blue grid place-items-center overflow-hidden">
        {event.poster || event.image ? (
          <img
            src={event.poster || event.image}
            alt={event.eventName}
            className="w-full h-full object-cover grayscale"
          />
        ) : (
          <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-[#a8b6cc]">
            Photograph
          </span>
        )}
      </div>
      <div className="min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-1 text-[9.5px] font-semibold tracking-[0.1em] uppercase"
            style={{ background: tag.bg, color: tag.fg }}
          >
            {event.eventType || 'Event'}
          </span>
          <span className="text-[11.5px] text-brand-ink-soft tabular-nums">
            {formatDate(event.startDate || event.date)}
          </span>
        </div>
        <h3 className="m-0 text-[17px] font-semibold text-brand-navy leading-[1.3]">
          {event.eventName || event.title}
        </h3>
        <span className="text-[12.5px] leading-[1.5] text-brand-ink-soft">
          {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
        </span>
        <span className="mt-auto text-[11.5px] font-semibold text-brand-red">
          {hasRegistration ? 'Details and registration' : 'Details'}
        </span>
      </div>
    </button>
  );
};

export default UpcomingEventCard;
