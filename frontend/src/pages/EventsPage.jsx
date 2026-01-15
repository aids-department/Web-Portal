// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, CalendarDays } from 'lucide-react';

import UpcomingEventCard from '../components/UpcomingEventCard';
import PastEventCard from '../components/PastEventCard';
import EventCalendar from '../components/EventCalendar';
import EventDetails from '../components/EventDetails';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    fetch('https://web-portal-760h.onrender.com/api/events')
      .then(res => res.json())
      .then(data => setEventsData(data))
      .catch(() => setEventsData([]));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = eventsData.filter(e => new Date(e.startDate) >= today);
  const pastEvents = eventsData.filter(e => new Date(e.startDate) < today);

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (selectedEvent) {
    return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-4 md:p-8 overflow-hidden min-h-[80vh]">

      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">

        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 md:mb-4 font-cursive">
            Events & Workshops
          </h1>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-3 md:mb-4"></div>
          <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Discover upcoming opportunities and relive our past events
          </p>
        </div>

        {/* Search & Tabs */}
        {/* Search Bar */}

        {/* Search Bar */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10 mb-6 md:mb-12">
          <div className="lg:col-span-2">
            <div className="relative w-full">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="
                  w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 rounded-2xl text-sm md:text-base
                  bg-white/70 backdrop-blur-md
                  border border-gray-300
                  shadow-sm
                  focus:ring-2 focus:ring-blue-400/40
                  focus:border-gray-300
                  outline-none
                  transition-all duration-200
                "
              />
            </div>
          </div>
        </div>



        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {displayedEvents.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center shadow-lg border border-white/40">
                <CalendarDays className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                  No events found
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Try adjusting your search or check back later.
                </p>
              </div>
            ) : (
              displayedEvents
                .filter(e =>
                  (e.eventName || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(event => (
                  <div key={event._id} className="hover:scale-[1.015] transition">
                    {activeTab === 'upcoming'
                      ? <UpcomingEventCard event={event} onOpenModal={setSelectedEvent} />
                      : <PastEventCard event={event} onOpenModal={setSelectedEvent} />}
                  </div>
                ))
            )}
          </div>

          <div className="hidden lg:block sticky top-8">
            <EventCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
