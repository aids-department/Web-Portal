import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, ArrowLeft, ArrowUpRight, ChevronRight, ChevronDown, CalendarDays, MapPin, Trophy } from 'lucide-react';
import { EventTypeTag } from './UpcomingEventCard';
import { Reveal } from './ui/Reveal';
import { EASE } from './ui/motion';
import { getGoogleCalendarUrl, downloadVCalendar } from '../utils/calendarUtils';

const EventDetails = ({ event, onBack }) => {
  const [openSection, setOpenSection] = useState(null);
  if (!event) return null;

  const toggle = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
    }) : '';

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    }) : '';

  const hasRegistration = !!(event.registrationLink && event.registrationLink !== 'NO_LINK');

  const facts = [
    { k: 'Date', v: formatDate(event.startDate) },
    event.startDate && { k: 'Time', v: formatTime(event.startDate) },
    { k: 'Venue', v: event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On campus' },
    (event.organizer || event.companyName || event.conductedBy) && {
      k: 'Conducted by',
      v: event.organizer || event.companyName || event.conductedBy,
    },
    event.totalParticipants && { k: 'Participants', v: event.totalParticipants },
    event.prizeAmount && { k: 'Prize pool', v: `₹${event.prizeAmount}` },
  ].filter(Boolean);

  const extraSections = [
    event.hackProblemStatements && { key: 'problem', title: 'Problem Statements', content: event.hackProblemStatements },
    event.hackJudgingCriteria && { key: 'judging', title: 'Judging Criteria', content: event.hackJudgingCriteria },
    event.hackRules && { key: 'rules', title: 'Rules', content: event.hackRules },
  ].filter(Boolean);

  const winner = event.winner || event.winningTeam;
  const posterSrc = event.poster || event.image;

  return (
    <div className="container-ln pb-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 pt-8 text-[13px]">
        <button onClick={onBack} className="btn-ghost btn-sm -ml-3">
          <ArrowLeft size={14} />
          Events
        </button>
        <ChevronRight size={14} className="text-fg-muted/60" />
        <span className="truncate text-fg-muted">{event.eventName}</span>
      </nav>

      {/* Split header: poster at its natural proportions beside the event summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="surface edge-highlight mt-5 flex flex-col overflow-hidden md:h-[360px] md:flex-row lg:h-[420px]"
      >
        {posterSrc && (
          <div className="relative grid flex-none place-items-center overflow-hidden border-b border-line bg-canvas-deep md:max-w-[55%] md:border-b-0 md:border-r">
            <img
              src={posterSrc}
              alt={event.eventName}
              className="block max-h-[420px] w-full object-contain md:h-full md:max-h-none md:w-auto"
            />
          </div>
        )}
        <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-5 px-6 py-8 sm:px-10 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px]" />
          <div className="relative flex flex-wrap items-center gap-2.5">
            <EventTypeTag type={event.eventType} />
            {winner && (
              <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-amber-300/90">
                <Trophy size={13} />
                Champion: {winner}
              </span>
            )}
          </div>
          <h1 className="relative max-w-[22ch] text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl md:line-clamp-3">
            <span className="text-gradient">{event.eventName}</span>
          </h1>
          <div className="relative flex flex-col gap-1.5 text-[14px] leading-[1.5] text-fg-muted">
            <span className="flex items-center gap-2 tabular-nums">
              <CalendarDays size={14} />
              {formatDate(event.startDate)}
              {event.startDate && ` · ${formatTime(event.startDate)}`}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On campus'}
            </span>
          </div>
          {hasRegistration && (
            <div className="relative pt-1">
              <button
                onClick={() => window.open(event.registrationLink, '_blank')}
                className="btn-primary btn-lg"
              >
                Register now
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,340px)]">
        <Reveal className="flex min-w-0 flex-col gap-5">
          <span className="eyebrow-accent">About this event</span>

          <p className="max-w-[76ch] whitespace-pre-line text-[15px] leading-[1.8] text-fg/85">
            {event.description || 'No description provided.'}
          </p>

          {extraSections.map((s) => (
            <div key={s.key} className={`surface overflow-hidden transition-colors ${openSection === s.key ? 'border-line-accent' : ''}`}>
              <button
                onClick={() => toggle(s.key)}
                aria-expanded={openSection === s.key}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-[14px] font-medium text-fg transition-colors hover:bg-white/[0.03]"
              >
                {s.title}
                <ChevronDown
                  size={16}
                  className={`text-fg-muted transition-transform duration-300 ease-expo ${openSection === s.key ? 'rotate-180' : ''}`}
                />
              </button>
              {openSection === s.key && (
                <div className="animate-fade-in whitespace-pre-line border-t border-line px-5 py-4 text-[13.5px] leading-[1.7] text-fg-muted">
                  {s.content}
                </div>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal as="aside" delay={0.08} className="flex min-w-[260px] flex-col gap-4">
          <div className="surface flex flex-col p-5">
            {facts.map((f, i) => (
              <div key={f.k} className={`flex flex-col gap-1 py-3 ${i > 0 ? 'border-t border-line' : 'pt-0'}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
                  {f.k}
                </span>
                <span className="text-[14px] font-medium text-fg">{f.v}</span>
              </div>
            ))}
          </div>

          {hasRegistration ? (
            <div className="surface flex flex-col gap-3 border-line-accent bg-[linear-gradient(to_bottom,rgba(94,106,210,0.12),rgba(255,255,255,0.02))] p-5">
              <span className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-bright">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Registration open
              </span>
              <button
                onClick={() => window.open(event.registrationLink, '_blank')}
                className="btn-primary w-full"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="surface flex flex-col gap-2 p-5">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-muted">
                No registration
              </span>
              <span className="text-[13px] leading-[1.6] text-fg/85">
                Open to all students of the department.
              </span>
            </div>
          )}

          {/* Google Calendar & vCalendar Sync */}
          <div className="surface flex flex-col gap-2.5 p-5">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-muted">
              Calendar Sync
            </span>
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full"
            >
              <Calendar size={14} />
              Add to Google Calendar
            </a>
            <button
              type="button"
              onClick={() => downloadVCalendar(event)}
              className="btn-ghost btn-sm w-full"
            >
              <Download size={13} />
              Download vCalendar (.ics)
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default EventDetails;
