// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, CalendarDays, List, LayoutGrid } from 'lucide-react';

import UpcomingEventCard from '../components/UpcomingEventCard';
import PastEventCard from '../components/PastEventCard';
import EventCalendar from '../components/EventCalendar';
import EventDetails from '../components/EventDetails';
import CalendarEmbed from '../components/CalendarEmbed';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'calendar'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  // Each tab keeps its own layout; defaults match the original design
  const [viewMode, setViewMode] = useState({ upcoming: 'list', past: 'grid' });

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
  const filteredEvents = displayedEvents.filter(e =>
    (e.eventName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const layout = viewMode[activeTab];
  const EventCard = activeTab === 'upcoming' ? UpcomingEventCard : PastEventCard;

  if (selectedEvent) {
    return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="font-brand px-5 sm:px-8 lg:px-12 py-7 sm:py-9 lg:py-[42px] flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            What&apos;s on
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Events
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-2 text-[11.5px] font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-brand-navy text-white'
                : 'border border-brand-edge text-brand-ink-soft hover:bg-brand-ground'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3.5 py-2 text-[11.5px] font-semibold transition-colors ${
              activeTab === 'past'
                ? 'bg-brand-navy text-white'
                : 'border border-brand-edge text-brand-ink-soft hover:bg-brand-ground'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-semibold transition-colors ${
              activeTab === 'calendar'
                ? 'bg-brand-navy text-white'
                : 'border border-brand-edge text-brand-ink-soft hover:bg-brand-ground'
            }`}
          >
            <CalendarDays size={14} />
            Google Calendar
          </button>
        </div>
      </div>

      {/* When Google Calendar Tab is Active */}
      {activeTab === 'calendar' ? (
        <CalendarEmbed />
      ) : (
        <>
          {/* Search + Layout Toggle */}
          <div className="flex items-stretch gap-3 flex-wrap">
            <div className="flex items-stretch border-2 border-brand-navy flex-1 min-w-[220px] max-w-md">
              <span className="px-3 grid place-items-center text-brand-ink-faint">
                <Search size={16} />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="flex-1 min-w-0 py-3 text-[13.5px] text-brand-ink outline-none placeholder:text-brand-ink-faint"
              />
            </div>
            <div className="flex border-2 border-brand-navy" role="group" aria-label="Layout">
              {[
                { mode: 'list', label: 'List', Icon: List },
                { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
              ].map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(v => ({ ...v, [activeTab]: mode }))}
                  aria-pressed={layout === mode}
                  className={`flex items-center gap-1.5 px-3.5 text-[11.5px] font-semibold transition-colors ${
                    layout === mode
                      ? 'bg-brand-navy text-white'
                      : 'text-brand-ink-soft hover:bg-brand-ground'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List & Dynamic Sidebar Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,340px)] gap-7 items-start">
            <div className="min-w-0 flex flex-col gap-3.5">
              {filteredEvents.length === 0 ? (
                <div className="border border-brand-edge p-10 text-center flex flex-col items-center gap-3">
                  <CalendarDays className="text-brand-ink-faint" size={32} />
                  <h3 className="m-0 text-[17px] font-semibold text-brand-navy">No events found</h3>
                  <p className="m-0 text-[13px] text-brand-ink-soft">
                    Try adjusting your search or check back later.
                  </p>
                </div>
              ) : layout === 'list' ? (
                <div
                  className={
                    activeTab === 'upcoming'
                      ? 'flex flex-col gap-3.5'
                      : 'flex flex-col gap-px bg-brand-edge border border-brand-edge'
                  }
                >
                  {filteredEvents.map(event => (
                    <EventCard key={event._id} event={event} onOpenModal={setSelectedEvent} layout="list" />
                  ))}
                </div>
              ) : (
                <div
                  className={
                    activeTab === 'upcoming'
                      ? 'grid gap-3.5'
                      : 'grid gap-px bg-brand-edge border border-brand-edge'
                  }
                  style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${activeTab === 'upcoming' ? 240 : 200}px, 1fr))` }}
                >
                  {filteredEvents.map(event => (
                    <EventCard key={event._id} event={event} onOpenModal={setSelectedEvent} layout="grid" />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block sticky top-8">
              <EventCalendar
                events={eventsData}
                onViewFullCalendar={() => setActiveTab('calendar')}
                onSelectEvent={setSelectedEvent}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventsPage;
