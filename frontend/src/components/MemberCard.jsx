// frontend/src/components/MemberCard.jsx
import React from "react";

const MemberCard = ({ member }) => {
  const isAssociationRole = member.domain === "Association";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <img
          src={member.image}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />

        {/* Details */}
        <div className="flex-1">
          {/* Name */}
          <h3 className="text-xl font-bold text-blue-900">
            {member.name}
          </h3>

          {/* Position + Domain */}
          <p className="text-sm text-gray-600 mt-1">
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
          <div className="mt-4 grid grid-cols-1 gap-1 text-sm text-gray-500">
            <p>
              <span className="font-medium text-gray-700">Year:</span>{" "}
              {member.year}
            </p>
            <p>
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
