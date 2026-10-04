import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

const FacultyCard = ({ faculty }) => {
  const links = [
    faculty.googleSite && { label: 'Site', href: faculty.googleSite },
    faculty.googleScholar && { label: 'Scholar', href: faculty.googleScholar },
    faculty.orcid && { label: 'ORCiD', href: faculty.orcid },
  ].filter(Boolean);

  return (
    <SpotlightCard interactive className="h-full">
      <div className="flex h-full flex-col gap-4 p-5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-canvas-elevated">
          <img
            src={faculty.imageUrl}
            alt={faculty.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-expo group-hover:scale-[1.02]"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/6b7280/ffffff?text=No+Image';
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas/70 to-transparent" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="h-card leading-snug">{faculty.name}</h3>
          <span className="text-[13px] font-medium text-accent-bright">{faculty.title}</span>
          <span className="text-[13px] leading-relaxed text-fg-muted">{faculty.specialization}</span>
        </div>
        <div className="mt-auto flex flex-col gap-2.5 border-t border-line pt-3.5">
          <a
            href={`mailto:${faculty.email}`}
            className="flex min-w-0 items-center gap-2 text-[12.5px] text-fg-muted transition-colors hover:text-fg"
          >
            <Mail className="h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
            <span className="truncate">{faculty.email}</span>
          </a>
          {links.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-neutral transition-colors hover:border-line-accent hover:text-fg"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default FacultyCard;
