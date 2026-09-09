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
    <div className="mb-12">
      <h4 className="text-card-title text-navy mb-5 text-center">
        {title}
      </h4>

      <div className="flex justify-center">
        <div
          className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 ${maxWidth} w-full`}
        >
          {members.map((member) => (
            <div key={member.id} className={centerSingle ? "mx-auto max-w-sm w-full" : ""}>
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
    <div>
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-ds-edge">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Leadership</span>
        <h1 className="text-page-heading text-navy mt-2.5">Association members</h1>
        <p className="text-body text-ds-ink-soft mt-3">
          Leadership and club representatives of the AI &amp; DS Association.
        </p>
      </div>

      {/* ===============================
         GENERAL ASSOCIATION MEMBERS
         =============================== */}
      <section className="pt-8 pb-4">
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
            <h4 className="text-card-title text-navy mb-5 text-center">
              Joint Secretary &amp; Joint Treasurer
            </h4>

            {/* Joint Secretaries */}
            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
                {(associationByRole["Joint Secretary"] || []).map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>

            {/* Joint Treasurer */}
            <div className="flex justify-center">
              {(associationByRole["Joint Treasurer"] || []).map((member) => (
                <div key={member.id} className="max-w-sm w-full">
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===============================
         CLUB REPRESENTATIVES
         =============================== */}
      <section className="pt-8 border-t-2 border-navy">
        <h3 className="text-section-heading text-navy mb-6">Club representatives</h3>

        {Object.entries(clubGroups).map(([clubName, members]) => (
          <div key={clubName} className="mb-10">
            <h4 className="text-card-title text-navy mb-1">{clubName}</h4>
            <p className="text-body text-ds-ink-faint mb-4">
              Representatives coordinating activities under {clubName}
            </p>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AssociationMembers;
