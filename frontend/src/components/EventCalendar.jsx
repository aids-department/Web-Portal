import React from 'react';

const EventCalendar = () => {
  return (
    <div className="bg-white border border-ds-edge p-4">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=c_8c051af583a2abbcf59dafaa753954df357ef63678c4bcf71daf7d27c251bc92%40group.calendar.google.com&ctz=Asia%2FKolkata"
        className="w-full h-[600px]"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default EventCalendar;
