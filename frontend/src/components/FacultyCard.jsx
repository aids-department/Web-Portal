import React from 'react';

const FacultyCard = ({ faculty }) => {
  const links = [
    faculty.googleSite && { label: 'Site', href: faculty.googleSite },
    faculty.googleScholar && { label: 'Scholar', href: faculty.googleScholar },
    faculty.orcid && { label: 'ORCiD', href: faculty.orcid },
  ].filter(Boolean);

  return (
    <div className="font-brand bg-white p-5 flex flex-col gap-2.5">
      <div className="w-fit self-center bg-brand-blue-tint border border-[#c3cfe3]">
        <img
          src={faculty.imageUrl}
          alt={faculty.name}
          className="max-w-[160px] h-auto block"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/6b7280/ffffff?text=No+Image';
          }}
        />
      </div>
      <h3 className="m-0 text-[16px] font-semibold leading-[1.25] text-brand-navy">{faculty.name}</h3>
      <span className="text-[11.5px] font-medium leading-[1.3] text-brand-blue">{faculty.title}</span>
      <span className="text-[11.5px] leading-[1.4] text-brand-ink-soft">{faculty.specialization}</span>
      <div className="mt-auto border-t border-brand-row pt-2.5 flex flex-col gap-1.5">
        <a href={`mailto:${faculty.email}`} className="text-[11px] text-brand-red font-medium truncate">
          {faculty.email}
        </a>
        {links.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-brand-blue"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyCard;
