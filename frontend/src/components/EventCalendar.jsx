import React from 'react';

const EventCalendar = () => {
  return (
    <div className="w-full flex justify-center mt-10">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=c_8c051af583a2abbcf59dafaa753954df357ef63678c4bcf71daf7d27c251bc92%40group.calendar.google.com&ctz=Asia%2FKolkata"
        style={{ border: 0 }}
        width="1000"
        height="600"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default EventCalendar;