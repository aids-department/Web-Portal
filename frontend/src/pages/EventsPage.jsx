// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// Components
import UpcomingEventCard from '../components/UpcomingEventCard';
import PastEventCard from '../components/PastEventCard';
import EventCalendar from '../components/EventCalendar';
import EventDetails from '../components/EventDetails';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState([]);

  // Fetch events from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEventsData(data))
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setEventsData([]);
      });
  }, []);

  // Auto-split events by date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const upcomingEvents = eventsData
    .filter(event => new Date(event.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const pastEvents = eventsData
    .filter(event => new Date(event.startDate) < today)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Most recent first

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  // Show details page if an event is selected
  if (selectedEvent) {
    return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 rounded-2xl mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Events</h2>
        <p className="text-gray-500 mt-1">Discover upcoming events and explore past achievements</p>
      </div>

      <div className="flex-1 flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-10 mb-7 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-1 font-semibold text-lg transition-all relative ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-600 after:rounded-t-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming <span className="ml-2 text-sm font-medium opacity-70">({upcomingEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 px-1 font-semibold text-lg transition-all relative ${
                activeTab === 'past'
                  ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-600 after:rounded-t-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past <span className="ml-2 text-sm font-medium opacity-70">({pastEvents.length})</span>
            </button>
          </div>

          {/* Unified Events Feed – Same for Upcoming & Past */}
          <div className="flex-1 overflow-y-auto pr-1">
            {displayedEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search size={40} className="text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 font-medium">No {activeTab} events found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or check back later!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pb-8">
                {displayedEvents
                  .filter(event => {
                    const search = searchQuery.toLowerCase();
                    const title = (event.eventName || event.title || '').toLowerCase();
                    const type = (event.eventType || event.type || '').toLowerCase();
                    const organizer = (event.organizer || event.companyName || '').toLowerCase();
                    return title.includes(search) || type.includes(search) || organizer.includes(search);
                  })
                  .map(event => (
                    <div key={event.id} className="transform transition-all duration-200 hover:scale-[1.01]">
                      {activeTab === 'upcoming' ? (
                        <UpcomingEventCard event={event} onOpenModal={setSelectedEvent} />
                      ) : (
                        <PastEventCard event={event} onOpenModal={setSelectedEvent} />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Sidebar */}
        <div className="w-96 flex-shrink-0 hidden 2xl:block">
          <div className="sticky top-6">
            <EventCalendar events={eventsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;