import React from 'react';
import SpotlightCard from './ui/SpotlightCard';

const StaffCard = ({ staff }) => {
  return (
    <SpotlightCard interactive className="overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl">
        <img
          src={staff.imageUrl}
          alt={staff.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-expo group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h3 className="h-card">{staff.name}</h3>
        <p className="text-[13px] text-accent-bright">{staff.designation}</p>
        <p className="truncate text-xs text-fg-muted">{staff.mailId}</p>
      </div>
    </SpotlightCard>
  );
};

export default StaffCard;
