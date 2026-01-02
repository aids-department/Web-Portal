import React from 'react';

const FacultyCard = ({ faculty }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="p-6">
        <img
          src={faculty.imageUrl}
          alt={faculty.name}
          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/128x128/6b7280/ffffff?text=No+Image";
          }}
        />
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{faculty.name}</h3>
        <p className="text-sm text-gray-600 text-center mb-2">{faculty.title}</p>
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {faculty.specialization.split(', ').map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {skill.trim()}
            </span>
          ))}
        </div>
        <div className="text-center">
          <a href={`mailto:${faculty.email}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium block mb-2">{faculty.email}</a>
          <div className="flex justify-center space-x-4 text-xs">
            {faculty.googleSite !== 'javascript:void(0)' && (
              <a href={faculty.googleSite} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Site</a>
            )}
            {faculty.googleScholar !== 'javascript:void(0)' && (
              <a href={faculty.googleScholar} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Scholar</a>
            )}
            {faculty.orcid !== 'javascript:void(0)' && (
              <a href={faculty.orcid} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">ORCiD</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
