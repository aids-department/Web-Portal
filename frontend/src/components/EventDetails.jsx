import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, MapPin, Share2, Users, Phone, Award,
  FileText, Briefcase, Dribbble, PenTool, Download, Clock, Check
} from 'lucide-react';

const EventDetails = ({ event, onBack }) => {
  const [shareStatus, setShareStatus] = useState('');
  const [openSection, setOpenSection] = useState(null);

  if (!event) return null;

  const toggle = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '';

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="bg-white min-h-full w-full">
      <div className="px-6 py-4 border-b">
        <button onClick={onBack} className="flex gap-2 text-gray-600 hover:text-blue-600">
          <ArrowLeft /> Back to Events
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">

        {/* HERO */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <img src={event.poster} className="w-full lg:w-1/3 rounded-2xl object-cover" />

          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold">{event.eventName}</h1>
            <p className="text-gray-500">
              Organized by <b>{event.organizer || event.companyName}</b>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Info label="Date" icon={<Calendar />} value={formatDate(event.startDate)} sub={formatTime(event.startDate)} />
              <Info label="Venue" icon={<MapPin />} value={event.eventMode === 'Online' ? 'Online' : event.venue} />
            </div>

            {/* ACCORDION SECTIONS */}
            {event.hackProblemStatements && (
              <Accordion
                title="Problem Statements"
                icon={<FileText />}
                open={openSection === 'problem'}
                onClick={() => toggle('problem')}
                content={event.hackProblemStatements}
              />
            )}

            {event.hackJudgingCriteria && (
              <Accordion
                title="Judging Criteria"
                icon={<Award />}
                open={openSection === 'judging'}
                onClick={() => toggle('judging')}
                content={event.hackJudgingCriteria}
              />
            )}

            {event.hackRules && (
              <Accordion
                title="Rules"
                icon={<PenTool />}
                open={openSection === 'rules'}
                onClick={() => toggle('rules')}
                content={event.hackRules}
              />
            )}

            <div className="flex gap-4 mt-6">
              {event.registrationLink ? (
                <a href={event.registrationLink} target="_blank"
                  className="flex-1 bg-black text-white py-3 rounded-xl text-center">
                  Register Now
                </a>
              ) : (
                <button disabled className="flex-1 bg-gray-200 py-3 rounded-xl">
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <h3 className="text-xl font-bold mb-3">About the Event</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {event.description || "No description provided."}
        </p>
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const Info = ({ icon, label, value, sub }) => (
  <div className="border p-4 rounded-xl flex gap-3">
    {icon}
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  </div>
);

const Accordion = ({ title, icon, open, onClick, content }) => {
  let colors = {
    container: "bg-gray-50 border-gray-200",
    title: "text-gray-800",
    body: "bg-white text-gray-700"
  };

  if (title === "Problem Statements") {
    colors = {
      container: "bg-blue-50 border-blue-100",
      title: "text-blue-800",
      body: "bg-blue-50 text-blue-700"
    };
  }

  if (title === "Judging Criteria") {
    colors = {
      container: "bg-purple-50 border-purple-100",
      title: "text-purple-800",
      body: "bg-purple-50 text-purple-700"
    };
  }

  if (title === "Rules") {
    colors = {
      container: "bg-yellow-50 border-yellow-100",
      title: "text-yellow-800",
      body: "bg-yellow-50 text-yellow-700"
    };
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${colors.container}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-4 hover:opacity-90 transition"
      >
        {icon}
        <span className={`font-bold ${colors.title}`}>{title}</span>
      </button>

      {open && (
        <div className={`p-4 whitespace-pre-line ${colors.body}`}>
          {content}
        </div>
      )}
    </div>
  );
};


export default EventDetails;
