// frontend/src/components/PastEventCard.jsx
import React from 'react';
import { Calendar, MapPin, Trophy, Users, Award, Mic, Video, Building, BookOpen } from 'lucide-react';

const PastEventCard = ({ event, onOpenModal }) => {
  // --- DYNAMIC BADGE COLORS (same logic as UpcomingEventCard) ---
  const getBadgeStyle = (type) => {
    const normalizeType = type ? type.toLowerCase() : '';
    switch (normalizeType) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'sports':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'literary':
      case 'literary fests':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'cultural':
      case 'cultural fests':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'management':
      case 'management fests':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'competition':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'workshop':
      case 'seminar':
      case 'training':
      case 'trainings':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'conference':
      case 'conferences':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'internship':
      case 'internships':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'online':
      case 'online events':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // --- DATE FORMATTER ---
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

  // Icon selector based on type
  const getEventIcon = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes('hackathon')) return <Trophy size={18} />;
    if (t?.includes('sports')) return <Trophy size={18} />;
    if (t?.includes('cultural')) return <Mic size={18} />;
    if (t?.includes('management')) return <Building size={18} />;
    if (t?.includes('literary')) return <BookOpen size={18} />;
    if (t?.includes('conference')) return <Users size={18} />;
    if (t?.includes('online')) return <Video size={18} />;
    if (t?.includes('internship') || t?.includes('training')) return <Award size={18} />;
    return <Trophy size={18} />;
  };

  return (
    <div className="group flex flex-col md:flex-row w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 h-auto md:h-56">
      
      {/* LEFT: POSTER + DATE OVERLAY */}
      <div className="w-full md:w-64 relative bg-gray-100 shrink-0 h-48 md:h-full">
        <img
          src={event.poster || event.image}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
        {/* Mobile Date */}
        <div className="md:hidden absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
          {getEventIcon(event.eventType)}
          {formatDate(event.startDate || event.date)}
        </div>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
        
        {/* Badge + Posted Date */}
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border flex items-center gap-1.5 ${getBadgeStyle(event.eventType)}`}>
            {getEventIcon(event.eventType)}
            {event.eventType || 'Event'}
          </span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            Completed {formatDate(event.endDate || event.startDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
          {event.eventName || event.title}
        </h3>

        {/* Organizer / Company */}
        <p className="text-sm text-gray-500 font-medium mb-4">
          {event.eventType?.toLowerCase().includes('internship')
            ? event.companyName
            : event.organizer || event.conductedBy}
        </p>

        {/* Quick Highlights Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium">
            <Calendar size={16} className="text-gray-400" />
            <span>{formatDate(event.startDate || event.date)}</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <MapPin size={16} className="text-gray-400" />
            <span>{event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On Campus'}</span>
          </div>
        </div>

        {/* Winner / Key Result Preview */}
        {event.winner && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Trophy size={18} className="text-amber-500" />
            <span>Champion: {event.winner}</span>
          </div>
        )}
        {event.winningTeam && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Trophy size={18} className="text-amber-500" />
            <span>{event.winningTeam}</span>
          </div>
        )}
      </div>

      {/* RIGHT: ACTION + SUMMARY */}
      <div className="p-5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 min-w-[160px] gap-4 shrink-0">
        <button
          onClick={() => onOpenModal(event)}
          className="w-full px-5 py-2.5 bg-white text-gray-900 text-sm font-bold border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm whitespace-nowrap"
        >
          View Results
        </button>

        {/* Optional Quick Stat */}
        {event.totalParticipants && (
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Participants</p>
            <p className="text-lg font-bold text-gray-800">{event.totalParticipants}</p>
          </div>
        )}
        {event.prizeAmount && (
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Prize Pool</p>
            <p className="text-lg font-bold text-green-600">₹{event.prizeAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEventCard;