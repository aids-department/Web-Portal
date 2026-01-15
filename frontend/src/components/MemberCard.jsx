// frontend/src/components/MemberCard.jsx
import React from "react";

const MemberCard = ({ member }) => {
  const isAssociationRole = member.domain === "Association";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Profile Image */}
        <img
          src={member.image}
          alt={member.name}
          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover border border-gray-300 flex-shrink-0"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          loading="eager"
        />

        {/* Details */}
        <div className="flex-1 text-center sm:text-left w-full">
          {/* Name */}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
            {member.name}
          </h3>

          {/* Position + Domain */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-1.5 lg:mt-2">
            <span className="font-semibold text-gray-800">
              {member.position}
            </span>
            {" "}
            ·{" "}
            <span>
              {isAssociationRole ? "Association" : member.domain}
            </span>
          </p>

          {/* Meta Information */}
          <div className="mt-2 sm:mt-3 lg:mt-4 grid grid-cols-1 gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm lg:text-base text-gray-500">
            <p>
              <span className="font-medium text-gray-700">Year:</span>{" "}
              {member.year}
            </p>
            <p className="break-all">
              <span className="font-medium text-gray-700">Email:</span>{" "}
              {member.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
