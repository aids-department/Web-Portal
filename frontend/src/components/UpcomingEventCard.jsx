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
import Tag from './ui/Tag';
import Button from './ui/Button';

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
    <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-5 border border-ds-edge p-4 bg-white">

      {/* LEFT: POSTER */}
      <div className="w-full h-48 md:h-full bg-ds-blue-tint border border-ds-edge shrink-0 overflow-hidden">
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
          <Tag variant="outline" className="inline-flex items-center gap-1.5">
            {getEventIcon(event.eventType)}
            {event.eventType || 'Event'}
          </Tag>
          <span className="text-label text-ds-ink-faint tabular-nums whitespace-nowrap">
            {formatDate(event.startDate || event.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-card-title text-navy leading-tight line-clamp-2">
          {event.eventName || event.title}
        </h3>

        {/* Organizer */}
        <p className="text-label text-ds-ink-soft">
          {event.eventType?.toLowerCase().includes('internship')
            ? event.companyName
            : event.organizer || event.conductedBy}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-5 text-label text-ds-ink-soft">
          <span className="flex items-center gap-1.5 tabular-nums">
            <Calendar size={14} className="text-ds-ink-faint" />
            {formatDate(event.startDate || event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-ds-ink-faint" />
            {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-ds-row flex items-center justify-between gap-4">
          {event.totalParticipants ? (
            <span className="text-label text-ds-ink-faint">
              <span className="font-medium text-ds-ink-soft tabular-nums">{event.totalParticipants}</span> participants
            </span>
          ) : <span />}
          <Button variant="secondary" onClick={() => onOpenModal(event)}>
            View details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
