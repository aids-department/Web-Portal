// frontend/src/components/MemberCard.jsx
import React from "react";

const MemberCard = ({ member }) => {
  const isAssociationRole = member.domain === "Association";

  return (
    <div className="bg-white border border-ds-edge p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <img
        src={member.image}
        alt={member.name}
        className="w-24 h-24 object-cover grayscale border border-ds-edge shrink-0"
        loading="eager"
      />

      <div className="flex-1 text-center sm:text-left w-full">
        <h3 className="text-card-title text-navy">{member.name}</h3>

        <p className="text-label text-ds-ink-soft mt-1.5">
          <span className="font-medium text-navy">{member.position}</span>
          {" · "}
          <span>{isAssociationRole ? "Association" : member.domain}</span>
        </p>

        <div className="mt-3 flex flex-col gap-1 text-label text-ds-ink-faint">
          <p><span className="font-medium text-ds-ink-soft">Year:</span> {member.year}</p>
          <p className="break-all"><span className="font-medium text-ds-ink-soft">Email:</span> {member.email}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
