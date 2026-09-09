// frontend/src/components/EventDetails.jsx
import React, { useState } from 'react';
import {
  ArrowLeft, FileText, PenTool
} from 'lucide-react';
import Button from './ui/Button';
import Tag from './ui/Tag';

const EventDetails = ({ event, onBack }) => {
  const [openSection, setOpenSection] = useState(null);
  if (!event) return null;

  const toggle = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric'
    }) : '';

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    }) : '';

  return (
    <div className="bg-white border border-ds-edge">
      {/* Back */}
      <div className="px-6 py-4 border-b border-ds-edge">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-label font-medium text-ds-ink-soft hover:text-navy"
        >
          <ArrowLeft size={16} />
          Back to events
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="lg:border-r border-ds-edge">
          <div className="h-[280px] bg-navy overflow-hidden">
            <img
              src={event.poster}
              alt={event.eventName}
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="p-8 flex flex-col gap-5">
            <Tag variant="outline" className="self-start">
              {event.organizer || event.companyName || 'Event'}
            </Tag>
            <h1 className="text-page-heading text-navy max-w-[20ch]">{event.eventName}</h1>
            <div className="h-0.5 bg-navy" />

            <p className="text-body text-ds-ink whitespace-pre-line">
              {event.description || 'No description provided.'}
            </p>

            {/* ACCORDIONS */}
            {event.hackProblemStatements && (
              <Accordion
                title="Problem statements"
                icon={<FileText size={16} />}
                open={openSection === 'problem'}
                onClick={() => toggle('problem')}
                content={event.hackProblemStatements}
              />
            )}

            {event.hackJudgingCriteria && (
              <Accordion
                title="Judging criteria"
                icon={<PenTool size={16} />}
                open={openSection === 'judging'}
                onClick={() => toggle('judging')}
                content={event.hackJudgingCriteria}
              />
            )}

            {event.hackRules && (
              <Accordion
                title="Rules"
                icon={<PenTool size={16} />}
                open={openSection === 'rules'}
                onClick={() => toggle('rules')}
                content={event.hackRules}
              />
            )}
          </div>
        </div>

        <aside className="bg-ds-ground p-7 flex flex-col gap-5">
          <div className="border border-ds-edge bg-white p-5 flex flex-col gap-4">
            <Fact label="Date" value={formatDate(event.startDate)} sub={formatTime(event.startDate)} />
            <Fact
              label="Venue"
              value={event.eventMode === 'Online' ? 'Online event' : event.venue}
            />
            {(event.organizer || event.companyName) && (
              <Fact label="Organised by" value={event.organizer || event.companyName} />
            )}
          </div>

          <div className="border-2 border-ds-red bg-white p-5 flex flex-col gap-3.5">
            <span className="text-kicker tracking-kicker uppercase text-ds-red">Registration</span>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                if (!event.registrationLink || event.registrationLink === "NO_LINK") {
                  alert("No registration link has been provided for this event.");
                  return;
                }
                window.open(event.registrationLink, "_blank");
              }}
            >
              Register now
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const Fact = ({ label, value, sub }) => (
  <div className="flex flex-col gap-1">
    <span className="text-kicker tracking-kicker uppercase text-ds-ink-faint">{label}</span>
    <span className="text-label font-medium text-navy">{value}</span>
    {sub && <span className="text-label text-ds-ink-faint">{sub}</span>}
  </div>
);

const Accordion = ({ title, icon, open, onClick, content }) => {
  return (
    <div className="border border-ds-edge">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2.5 p-4 text-label font-medium text-navy bg-ds-ground"
      >
        {icon}
        {title}
      </button>

      {open && (
        <div className="p-4 text-body text-ds-ink-soft whitespace-pre-line border-t border-ds-edge">
          {content}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
