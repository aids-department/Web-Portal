// frontend/src/components/MemberCard.jsx
import React from "react";
import { Mail } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const MemberCard = ({ member }) => {
  const isAssociationRole = member.domain === "Association";

  return (
    <SpotlightCard interactive className="h-full">
      <div className="flex flex-col items-center gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div aria-hidden="true" className="absolute -inset-1 rounded-full bg-gradient-to-b from-accent/50 to-transparent opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          <img
            src={member.image}
            alt={member.name}
            className="relative h-20 w-20 rounded-full border border-white/10 object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
            loading="eager"
          />
        </div>

        {/* Details */}
        <div className="w-full flex-1 text-center sm:text-left">
          {/* Name */}
          <h3 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
            {member.name}
          </h3>

          {/* Position + Domain */}
          <p className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-[13px] text-fg-muted sm:justify-start">
            <span className="pill">{member.position}</span>
            <span>{isAssociationRole ? "Association" : member.domain}</span>
          </p>

          {/* Meta Information */}
          <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-line pt-3 text-[13px] text-fg-muted">
            <p>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]">Year</span>{" "}
              <span className="text-fg">{member.year}</span>
            </p>
            <p className="flex items-center justify-center gap-1.5 break-all sm:justify-start">
              <Mail className="h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
              {member.email}
            </p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default MemberCard;
