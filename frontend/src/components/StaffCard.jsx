import React from 'react';

const StaffCard = ({ staff }) => {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg group"
    >
      <img
        src={staff.imageUrl}
        alt={staff.name}
        className="w-5/6 h-auto object-cover transition-transform duration-300 transform group-hover:scale-110 mx-auto"
      />
      {/* Overlay for the background */}
      <div
        className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-90 transition-opacity duration-300"
      ></div>
      {/* Overlay for the text content */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-gray-800 p-4 text-center"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
            <h3 className="text-xl font-bold mb-2">{staff.name}</h3>
            <p className="text-sm mb-1">{staff.designation}</p>
            <p className="text-xs mb-1">{staff.mailId}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
