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

  return (
    <div className="font-brand">
      <div className="px-5 sm:px-8 lg:px-12 py-4 border-b border-brand-edge flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="text-[12px] font-medium text-brand-blue hover:underline">
          Events
        </button>
        <span className="text-[12px] text-brand-ink-faint">/</span>
        <span className="text-[12px] text-brand-ink-soft">{event.eventName}</span>
      </div>

      <div className="min-h-[220px] sm:min-h-[280px] bg-brand-blue grid place-items-center overflow-hidden">
        {event.poster ? (
          <img src={event.poster} alt={event.eventName} className="w-full h-full object-cover grayscale" />
        ) : (
          <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#a8b6cc]">
            Event photograph
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(240px,320px)]">
        <div className="min-w-0 px-5 sm:px-8 lg:px-12 py-8 sm:py-9 lg:py-10 flex flex-col gap-5 lg:border-r border-brand-edge">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.1em] uppercase"
                style={{ background: tag.bg, color: tag.fg }}
              >
                {event.eventType || 'Event'}
              </span>
              <span className="text-[12px] text-brand-ink-soft tabular-nums">
                {formatDate(event.startDate)}
              </span>
            </div>
            <h1 className="m-0 text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.1] font-semibold tracking-[-0.02em] text-brand-navy max-w-[24ch]">
              {event.eventName}
            </h1>
            {winner && (
              <span className="text-[13px] font-semibold text-brand-red">
                Champion: {winner}
              </span>
            )}
          </div>

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
