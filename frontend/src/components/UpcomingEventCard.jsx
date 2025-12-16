import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const UpcomingEventCard = ({ event, onOpenModal }) => {
  
  // --- 1. DYNAMIC BADGE COLORS ---
  const getBadgeStyle = (type) => {
    const normalizeType = type ? type.toLowerCase() : '';
    
    switch (normalizeType) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'sports':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'literary':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'competition':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'workshop':
      case 'seminar':
      case 'training':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'conference':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'internship':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // --- 2. DATE FORMATTERS ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  };

  const formatDeadline = (dateString) => {
    if (!dateString || dateString === 'N/A') return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', 
    });
  };

  const deadlineDate = formatDeadline(event.deadlines);

  return (
    <div className="group flex flex-col md:flex-row w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 h-auto md:h-52">
      
      {/* POSTER IMAGE */}
      <div className="w-full md:w-64 relative bg-gray-100 shrink-0 h-48 md:h-full">
        <img 
          src={event.poster} 
          alt={event.eventName} 
          className="w-full h-full object-cover"
        />
        {/* Mobile Date Overlay (Optional, helpful for mobile view) */}
        <div className="md:hidden absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
           {formatDate(event.startDate)}
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
        
        {/* Badge Row */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getBadgeStyle(event.eventType)}`}>
            {event.eventType}
          </span>
          <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2 uppercase tracking-wide">
            Posted Nov 14
          </span>
        </div>

        {/* Title & Organizer Row */}
        <div className="mb-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 leading-tight line-clamp-1" title={event.eventName}>
            {event.eventName}
          </h3>
          <p className="text-sm text-gray-500 font-medium line-clamp-1">
            {/* Logic: Show Company if it's an internship, otherwise show Organizer */}
            {event.eventType === 'Internship' ? event.companyName : event.organizer}
          </p>
        </div>

        {/* Icons Row */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-auto">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <span className="truncate">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <MapPin size={16} className="text-gray-400 shrink-0" />
            <span className="truncate">{event.eventMode === 'Online' ? 'Online' : event.venue}</span>
          </div>
        </div>
      </div>

      {/* RIGHT ACTION BUTTON */}
      <div className="p-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 bg-white min-w-[160px] gap-3 shrink-0">
        <button 
          onClick={() => onOpenModal(event)}
          className="w-full md:w-auto px-5 py-2.5 bg-white text-gray-900 text-sm font-bold border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm whitespace-nowrap"
        >
          View Details
        </button>

        {deadlineDate && (
          <div className="text-center animate-in fade-in">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Deadline</p>
            <p className="text-sm font-bold text-red-500 leading-tight">
              {deadlineDate}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default UpcomingEventCard;