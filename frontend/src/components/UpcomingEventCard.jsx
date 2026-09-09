// frontend/src/components/UpcomingEventCard.jsx
import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Award,
  Mic,
  Video,
  Building,
  BookOpen
} from 'lucide-react';

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

  // --- ICON SELECTOR (unchanged) ---
  const getEventIcon = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes('hackathon')) return <Trophy size={13} />;
    if (t?.includes('sports')) return <Trophy size={13} />;
    if (t?.includes('cultural')) return <Mic size={13} />;
    if (t?.includes('management')) return <Building size={13} />;
    if (t?.includes('literary')) return <BookOpen size={13} />;
    if (t?.includes('conference')) return <Users size={13} />;
    if (t?.includes('online')) return <Video size={13} />;
    if (t?.includes('internship') || t?.includes('training')) return <Award size={13} />;
    return <Trophy size={13} />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-5 border border-ds-edge p-4 bg-white hover:bg-ds-ground transition-colors">

      {/* LEFT: POSTER */}
      <div className="w-full h-44 md:h-full bg-ds-blue-tint border border-ds-edge shrink-0 overflow-hidden">
        <img
          src={event.poster || event.image}
          alt={event.eventName}
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex flex-col gap-2.5">

        {/* Badge + Date */}
        <div className="flex justify-between items-start gap-3">
          <span className="px-2 py-1 text-[9.5px] font-semibold tracking-wider uppercase bg-navy text-white inline-flex items-center gap-1.5">
            {getEventIcon(event.eventType)}
            {event.eventType || 'Event'}
          </span>
          <span className="text-[11.5px] text-ds-ink-faint tabular-nums whitespace-nowrap">
            {formatDate(event.startDate || event.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold text-navy leading-tight line-clamp-2 m-0">
          {event.eventName || event.title}
        </h3>

        {/* Organizer */}
        <p className="text-[12.5px] text-ds-ink-soft m-0">
          {event.eventType?.toLowerCase().includes('internship')
            ? event.companyName
            : event.organizer || event.conductedBy}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-5 text-[12px] text-ds-ink-soft">
          <span className="flex items-center gap-1.5 tabular-nums">
            <Calendar size={13} className="text-ds-ink-faint" />
            {formatDate(event.startDate || event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-ds-ink-faint" />
            {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
          </span>
        </div>

        <div className="mt-auto pt-2.5 border-t border-ds-row flex items-center justify-between gap-4">
          {event.totalParticipants ? (
            <span className="text-[12px] text-ds-ink-faint">
              <span className="font-medium text-ds-ink-soft tabular-nums">{event.totalParticipants}</span> participants
            </span>
          ) : <span />}
          <button
            onClick={() => onOpenModal(event)}
            className="px-3.5 py-1.5 text-[11.5px] font-semibold text-ds-red border border-ds-red hover:bg-ds-red hover:text-white transition-colors"
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
