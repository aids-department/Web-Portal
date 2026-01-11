// frontend/src/components/EventDetails.jsx
import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, MapPin, Award,
  FileText, PenTool
} from 'lucide-react';

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
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">

      {/* Decorative orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      {/* Back */}
      <div className="relative z-10 px-6 py-4 border-b border-white/40">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium transition"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="flex flex-col lg:flex-row gap-10 mb-14">
          <img
            src={event.poster}
            alt={event.eventName}
            className="w-full lg:w-1/3 rounded-3xl object-cover shadow-xl"
          />

          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {event.eventName}
            </h1>

            <p className="text-gray-600 text-lg">
              Organized by <span className="font-semibold text-gray-800">
                {event.organizer || event.companyName}
              </span>
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <Info
                icon={<Calendar size={18} />}
                label="Date"
                value={formatDate(event.startDate)}
                sub={formatTime(event.startDate)}
              />
              <Info
                icon={<MapPin size={18} />}
                label="Venue"
                value={event.eventMode === 'Online' ? 'Online Event' : event.venue}
              />
            </div>

            {/* ACCORDIONS */}
            {event.hackProblemStatements && (
              <Accordion
                title="Problem Statements"
                icon={<FileText />}
                open={openSection === 'problem'}
                onClick={() => toggle('problem')}
                content={event.hackProblemStatements}
                theme="blue"
              />
            )}

            {event.hackJudgingCriteria && (
              <Accordion
                title="Judging Criteria"
                icon={<Award />}
                open={openSection === 'judging'}
                onClick={() => toggle('judging')}
                content={event.hackJudgingCriteria}
                theme="purple"
              />
            )}

            {event.hackRules && (
              <Accordion
                title="Rules"
                icon={<PenTool />}
                open={openSection === 'rules'}
                onClick={() => toggle('rules')}
                content={event.hackRules}
                theme="amber"
              />
            )}

            <div className="pt-4">
              {event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition"
                >
                  Register Now
                </a>
              ) : (
                <button
                  disabled
                  className="px-8 py-3 rounded-2xl bg-gray-200 text-gray-500 font-bold cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            About the Event
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const Info = ({ icon, label, value, sub }) => (
  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex gap-3 shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </p>
      <p className="font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  </div>
);

const Accordion = ({ title, icon, open, onClick, content, theme }) => {
  const themes = {
    blue: 'from-blue-50 to-blue-100 text-blue-800',
    purple: 'from-purple-50 to-purple-100 text-purple-800',
    amber: 'from-amber-50 to-amber-100 text-amber-800',
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-white/40 bg-white/60 backdrop-blur-md">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-4 font-bold bg-gradient-to-r ${themes[theme]} hover:opacity-90 transition`}
      >
        {icon}
        {title}
      </button>

      {open && (
        <div className="p-4 text-gray-700 whitespace-pre-line bg-white/70">
          {content}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
