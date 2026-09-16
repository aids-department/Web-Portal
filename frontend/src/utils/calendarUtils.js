// frontend/src/utils/calendarUtils.js

export const DEPT_CALENDAR_ID =
  '6f398d7d0a6f98b5503eb1b0872ad4b8c83af1467534879a24d046bd04e5bbb8@group.calendar.google.com';

export const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/u/0/r?cid=${DEPT_CALENDAR_ID}`;

export const VCALENDAR_ICS_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(
  DEPT_CALENDAR_ID
)}/public/basic.ics`;

export const GOOGLE_CALENDAR_EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
  DEPT_CALENDAR_ID
)}&ctz=Asia%2FKolkata`;

function formatGCalDate(d) {
  return d.toISOString().replace(/-|:|\.\d+/g, '');
}

/**
 * Generates an 'Add to Google Calendar' template URL for a given event.
 */
export function getGoogleCalendarUrl(event) {
  const title = encodeURIComponent(event.eventName || event.title || 'Department Event');
  const details = encodeURIComponent(
    (event.description || '') +
      (event.registrationLink && event.registrationLink !== 'NO_LINK'
        ? `\n\nRegister: ${event.registrationLink}`
        : '')
  );
  const location = encodeURIComponent(
    event.venue || (event.eventMode === 'Online' ? 'Online' : 'PSG iTech - AI & DS Department')
  );

  const start = event.startDate ? new Date(event.startDate) : new Date();
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Triggers a download of a standard vCalendar (.ics) file for an event.
 */
export function downloadVCalendar(event) {
  const title = (event.eventName || event.title || 'Department Event').replace(/\n/g, ' ');
  const description = (event.description || '').replace(/\n/g, '\\n');
  const location = (
    event.venue || (event.eventMode === 'Online' ? 'Online' : 'PSG iTech - AI & DS Department')
  ).replace(/\n/g, ' ');

  const start = event.startDate ? new Date(event.startDate) : new Date();
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatICSDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PSG iTech//AI & DS Department//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${(event._id || Date.now()) + '@aids.psgitech.ac.in'}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
