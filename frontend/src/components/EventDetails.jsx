import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { eventTagStyle } from '../utils/eventTagStyle';
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

  const tag = eventTagStyle(event.eventType);
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
    <div className="font-brand">
      <div className="px-5 sm:px-8 lg:px-12 py-4 border-b border-brand-edge flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="text-[12px] font-medium text-brand-blue hover:underline">
          Events
        </button>
        <span className="text-[12px] text-brand-ink-faint">/</span>
        <span className="text-[12px] text-brand-ink-soft">{event.eventName}</span>
      </div>

      {/* Split header: poster at its natural proportions beside the event summary */}
      <div className="bg-brand-navy flex flex-col md:flex-row md:h-[360px] lg:h-[420px]">
        {posterSrc && (
          <div className="flex-none md:max-w-[55%] bg-brand-navy-deep grid place-items-center overflow-hidden md:border-r-2 border-brand-blue">
            <img
              src={posterSrc}
              alt={event.eventName}
              className="block w-full max-h-[420px] md:w-auto md:max-h-none md:h-full object-contain grayscale"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 sm:py-10 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.1em] uppercase"
              style={{ background: tag.bg, color: tag.fg }}
            >
              {event.eventType || 'Event'}
            </span>
            {winner && (
              <span className="text-[12px] font-semibold text-brand-red">Champion: {winner}</span>
            )}
          </div>
          <h1 className="m-0 text-[28px] sm:text-[34px] lg:text-[42px] leading-[1.08] font-semibold tracking-[-0.02em] text-white max-w-[22ch] md:line-clamp-3">
            {event.eventName}
          </h1>
          <div className="flex flex-col gap-1 text-[13px] leading-[1.5] text-brand-on-navy">
            <span className="tabular-nums">
              {formatDate(event.startDate)}
              {event.startDate && ` · ${formatTime(event.startDate)}`}
            </span>
            <span className="text-brand-on-navy-muted">
              {event.eventMode === 'Online' ? 'Online Event' : event.venue || 'On campus'}
            </span>
          </div>
          {hasRegistration && (
            <div className="pt-1">
              <button
                onClick={() => window.open(event.registrationLink, '_blank')}
                className="px-5 py-[13px] bg-brand-red text-white text-[12.5px] font-semibold"
              >
                Register now
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(240px,320px)]">
        <div className="min-w-0 px-5 sm:px-8 lg:px-12 py-8 sm:py-9 lg:py-10 flex flex-col gap-5 lg:border-r border-brand-edge">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            About this event
          </span>

          <p className="m-0 max-w-[76ch] text-[15px] leading-[1.75] text-[#3a3838] whitespace-pre-line">
            {event.description || 'No description provided.'}
          </p>

          {extraSections.map((s) => (
            <div key={s.key} className="border border-brand-edge">
              <button
                onClick={() => toggle(s.key)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-[12.5px] font-semibold text-brand-navy hover:bg-brand-ground"
              >
                {s.title}
                <span className="text-brand-ink-faint">{openSection === s.key ? '−' : '+'}</span>
              </button>
              {openSection === s.key && (
                <div className="px-4 py-3 text-[13px] leading-[1.6] text-brand-ink-soft whitespace-pre-line border-t border-brand-row">
                  {s.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <aside className="px-5 sm:px-8 lg:px-8 py-8 sm:py-9 lg:py-10 bg-brand-ground flex flex-col gap-5 min-w-[260px]">
          <div className="flex flex-col gap-3">
            {facts.map((f) => (
              <div key={f.k} className="border-t border-brand-edge pt-2.5 flex flex-col gap-1">
                <span className="text-[9.5px] font-medium tracking-[0.16em] uppercase text-brand-ink-soft">
                  {f.k}
                </span>
                <span className="text-[13.5px] font-medium text-brand-navy">{f.v}</span>
              </div>
            ))}
          </div>

          {hasRegistration ? (
            <div className="border border-brand-navy bg-white p-[18px] flex flex-col gap-2.5">
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-brand-red">
                Registration open
              </span>
              <button
                onClick={() => window.open(event.registrationLink, '_blank')}
                className="px-[18px] py-[13px] bg-brand-red text-white text-[12.5px] font-semibold"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="border border-brand-edge bg-white p-[18px] flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-brand-ink-soft">
                No registration
              </span>
              <span className="text-[12.5px] leading-[1.6] text-[#3a3838]">
                Open to all students of the department.
              </span>
            </div>
          )}

          {/* Google Calendar & vCalendar Sync */}
          <div className="border border-brand-edge bg-white p-[18px] flex flex-col gap-2.5">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-brand-navy">
              Calendar Sync
            </span>
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 bg-brand-navy text-white text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors text-center"
            >
              <Calendar size={14} />
              Add to Google Calendar
            </a>
            <button
              type="button"
              onClick={() => downloadVCalendar(event)}
              className="px-3 py-2 border border-brand-edge text-brand-navy text-[11.5px] font-medium flex items-center justify-center gap-1.5 hover:bg-brand-ground transition-colors"
            >
              <Download size={13} />
              Download vCalendar (.ics)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetails;
