// frontend/src/pages/AssociationMembers.jsx
import React from "react";
import MemberCard from "../components/MemberCard";
import membersData from "../data/membersData";

/* ===============================
   Reusable Role Section Component
   =============================== */
const RoleSection = ({
  title,
  members,
  columns = 2,
  maxWidth = "max-w-4xl",
  centerSingle = false,
}) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="mb-16">
      <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {title}
      </h4>

      <div className="flex justify-center">
        <div
          className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 ${maxWidth} w-full`}
        >
          {members.map((member) => (
            <div
              key={member.id}
              className={`ring-1 ring-blue-200 rounded-2xl ${
                centerSingle ? "mx-auto max-w-sm" : ""
              }`}
            >
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AssociationMembers = () => {
  /* ===============================
     Separate Association & Clubs
     =============================== */
  const associationMembers = membersData.filter(
    (m) => m.domain === "Association"
  );

  const clubMembers = membersData.filter(
    (m) => m.domain !== "Association"
  );

  /* ===============================
     Group Association by Position
     =============================== */
  const associationByRole = associationMembers.reduce((acc, member) => {
    acc[member.position] = acc[member.position] || [];
    acc[member.position].push(member);
    return acc;
  }, {});

  /* ===============================
     Group Clubs by Club Name
     =============================== */
  const clubGroups = clubMembers.reduce((acc, member) => {
    acc[member.domain] = acc[member.domain] || [];
    acc[member.domain].push(member);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 rounded-2xl mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Association Members
        </h2>
        <p className="text-gray-500 mt-1">
          Leadership and club representatives of the AI & DS Association
        </p>
      </div>

      {/* ===============================
         GENERAL ASSOCIATION MEMBERS
         =============================== */}
      <section className="mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">

          {/* President */}
          <RoleSection
            title="President"
            members={associationByRole["President"]}
            columns={1}
            maxWidth="max-w-sm"
            centerSingle
          />

          {/* Vice Presidents */}
          <RoleSection
            title="Vice Presidents"
            members={associationByRole["Vice President"]}
            columns={2}
            maxWidth="max-w-4xl"
          />

          {/* Secretary & Treasurer */}
          <RoleSection
            title="Secretary & Treasurer"
            members={[
              ...(associationByRole["Secretary"] || []),
              ...(associationByRole["Treasurer"] || []),
            ]}
            columns={2}
            maxWidth="max-w-4xl"
          />

          {/* Joint Roles */}
          {(associationByRole["Joint Secretary"] ||
            associationByRole["Joint Treasurer"]) && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Joint Secretary & Joint Treasurer
              </h4>

              {/* Joint Secretaries */}
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                  {(associationByRole["Joint Secretary"] || []).map((member) => (
                    <div
                      key={member.id}
                      className="ring-1 ring-blue-200 rounded-2xl"
                    >
                      <MemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Joint Treasurer */}
              <div className="flex justify-center">
                {(associationByRole["Joint Treasurer"] || []).map((member) => (
                  <div
                    key={member.id}
                    className="ring-1 ring-blue-200 rounded-2xl max-w-sm w-full"
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===============================
         CLUB REPRESENTATIVES
         =============================== */}
      <section className="mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <h3 className="text-2xl font-bold text-blue-900 mb-1">
            Club Representatives
          </h3>

          <div className="w-20 h-1 bg-blue-800 rounded-full mb-6"></div>

          {Object.entries(clubGroups).map(([clubName, members]) => (
            <div key={clubName} className="mb-14">
              <h4 className="text-xl font-semibold text-gray-800 mb-1">
                {clubName}
              </h4>
              <p className="text-gray-500 mb-5">
                Representatives coordinating activities under {clubName}
              </p>

              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="ring-1 ring-blue-200 rounded-2xl"
                    >
                      <MemberCard member={member} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssociationMembers;
