import React from 'react';

const FacultyCard = ({ faculty }) => {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg group"
    >
      <img
        src={faculty.imageUrl}
        alt={faculty.name}
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
            <h3 className="text-xl font-bold mb-2">{faculty.name}</h3>
            <p className="text-sm mb-1">{faculty.specialization}</p>
            <a href={`mailto:${faculty.email}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1">{faculty.email}</a>
            <div className="flex flex-col items-center mt-2">
              <a href={faculty.googleSite} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1" target="_blank" rel="noopener noreferrer">Google Site</a>
              <a href={faculty.googleScholar} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1" target="_blank" rel="noopener noreferrer">Google Scholar</a>
              <a href={faculty.orcid} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py.jsx-1" target="_blank" rel="noopener noreferrer">ORCiD</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
