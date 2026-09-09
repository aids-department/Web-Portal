import React from 'react';

const FacultyCard = ({ faculty }) => {
  const specs = faculty.specialization.split(',').map((s) => s.trim()).filter(Boolean);
  return (
    <div className="bg-white border border-ds-edge flex flex-col">
      <div className="h-[150px] bg-ds-blue-tint border-b border-ds-edge grid place-items-center overflow-hidden">
        <img
          src={faculty.imageUrl}
          alt={faculty.name}
          className="w-full h-full object-cover grayscale"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <h3 className="text-card-title text-navy">{faculty.name}</h3>
        <span className="text-label font-medium text-ds-blue">{faculty.title}</span>
        <span className="text-label text-ds-ink-faint">{specs.join(' · ')}</span>
        <div className="border-t border-ds-row pt-2.5 mt-auto flex justify-between items-center">
          <a href={`mailto:${faculty.email}`} className="text-label text-ds-ink-faint truncate">
            {faculty.email}
          </a>
          {faculty.googleSite && (
            <a href={faculty.googleSite} target="_blank" rel="noreferrer" className="text-label font-medium text-ds-red shrink-0">
              Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
