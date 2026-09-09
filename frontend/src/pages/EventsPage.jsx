// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

import UpcomingEventCard from '../components/UpcomingEventCard';
import PastEventCard from '../components/PastEventCard';
import EventCalendar from '../components/EventCalendar';
import EventDetails from '../components/EventDetails';
import Field from '../components/ui/Field';

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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 pb-6 border-b-2 border-navy">
        <div>
          <span className="text-kicker tracking-kicker uppercase text-ds-red">Department calendar</span>
          <h1 className="text-page-heading text-navy mt-2.5">Events</h1>
        </div>
        <div className="flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4.5 py-2.5 text-label font-medium border ${
              activeTab === 'upcoming'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-ds-ink-soft border-ds-edge'
            }`}
          >
            Upcoming · {upcomingEvents.length}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4.5 py-2.5 text-label font-medium border border-l-0 ${
              activeTab === 'past'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-ds-ink-soft border-ds-edge'
            }`}
          >
            Past · {pastEvents.length}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <Field.Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events…"
        />
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="flex flex-col gap-5">
          {displayedEvents.length === 0 ? (
            <div className="border border-ds-edge p-10 text-center">
              <CalendarDays className="w-8 h-8 mx-auto text-ds-ink-faint mb-3" />
              <h3 className="text-card-title text-navy mb-1.5">No events found</h3>
              <p className="text-body text-ds-ink-soft">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            displayedEvents
              .filter(e =>
                (e.eventName || '').toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(event => (
                activeTab === 'upcoming'
                  ? <UpcomingEventCard key={event._id} event={event} onOpenModal={setSelectedEvent} />
                  : <PastEventCard key={event._id} event={event} onOpenModal={setSelectedEvent} />
              ))
          )}
        </div>

        <div className="hidden lg:block sticky top-24 h-fit">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
