// frontend/src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, CalendarDays, List, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/States';
import { Stagger, StaggerItem } from '../components/ui/Reveal';
import { EASE } from '../components/ui/motion';

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
    <div className="container-ln pb-8">
      <PageHeader
        eyebrow="What's on"
        title="Events"
        description="Workshops, talks, contests and everything else happening in the department."
        actions={
          /* Tab Switcher */
          <div className="tabs" role="tablist" aria-label="Event views">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
              { id: 'past', label: 'Past', count: pastEvents.length },
              { id: 'calendar', label: 'Google Calendar', Icon: CalendarDays },
            ].map(({ id, label, count, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`tab relative isolate flex items-center gap-1.5 ${activeTab === id ? 'text-fg' : ''}`}
              >
                {activeTab === id && (
                  <motion.span
                    layoutId="events-tab"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_1px_8px_rgba(0,0,0,0.35)]"
                  />
                )}
                {Icon && <Icon size={14} />}
                {label}
                {count !== undefined && eventsData.length > 0 && (
                  <span className="font-mono text-[10.5px] text-fg-muted">{count}</span>
                )}
              </button>
            ))}
          </div>
        }
      />

      {/* When Google Calendar Tab is Active */}
      {activeTab === 'calendar' ? (
        <CalendarEmbed />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Search + Layout Toggle */}
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="relative min-w-[220px] max-w-md flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
                className="field py-2.5 pl-10"
              />
            </div>
            <div className="tabs" role="group" aria-label="Layout">
              {[
                { mode: 'list', label: 'List', Icon: List },
                { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
              ].map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(v => ({ ...v, [activeTab]: mode }))}
                  aria-pressed={layout === mode}
                  className={`tab flex items-center gap-1.5 ${layout === mode ? 'tab-active' : ''}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List & Dynamic Sidebar Calendar */}
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(280px,340px)]">
            <div className="flex min-w-0 flex-col gap-3.5">
              {filteredEvents.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No events found"
                  description="Try adjusting your search or check back later."
                />
              ) : layout === 'list' ? (
                <Stagger key={`${activeTab}-list`} className="flex flex-col gap-3.5">
                  {filteredEvents.map(event => (
                    <StaggerItem key={event._id}>
                      <EventCard event={event} onOpenModal={setSelectedEvent} layout="list" />
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <Stagger
                  key={`${activeTab}-grid`}
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${activeTab === 'upcoming' ? 240 : 200}px, 1fr))` }}
                >
                  {filteredEvents.map(event => (
                    <StaggerItem key={event._id} className="h-full">
                      <EventCard event={event} onOpenModal={setSelectedEvent} layout="grid" />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>

            <div className="sticky top-24 hidden lg:block">
              <EventCalendar
                events={eventsData}
                onViewFullCalendar={() => setActiveTab('calendar')}
                onSelectEvent={setSelectedEvent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
