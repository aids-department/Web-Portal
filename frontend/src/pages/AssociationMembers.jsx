// frontend/src/pages/AssociationMembers.jsx
import React from "react";
import MemberCard from "../components/MemberCard";
import membersData from "../data/membersData";
import PageHeader from "../components/ui/PageHeader";
import { Reveal, Stagger, StaggerItem } from "../components/ui/Reveal";

/* ===============================
   Reusable Role Section Component
   =============================== */
const RoleTitle = ({ children }) => (
  <h4 className="mb-6 flex items-center justify-center gap-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted">
    <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
    {children}
    <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
  </h4>
);

const RoleSection = ({
  title,
  members,
  columns = 2,
  maxWidth = "max-w-4xl",
  centerSingle = false,
}) => {
  if (!members || members.length === 0) return null;

  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : columns === 4
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div className="mb-14 last:mb-0">
      <RoleTitle>{title}</RoleTitle>

      <div className="flex justify-center">
        <Stagger className={`grid ${gridCols} w-full gap-5 ${maxWidth}`}>
          {members.map((member) => (
            <StaggerItem
              key={member.id}
              className={centerSingle ? "mx-auto w-full max-w-sm" : ""}
            >
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
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
    <div className="flex flex-col">
      {/* Header */}
      <PageHeader
        eyebrow="AI & DS Association"
        title="Association Members"
        description="Leadership and club representatives of the AI & DS Association"
        spacing="pt-6 pb-10 sm:pt-10 sm:pb-12 lg:pt-12"
      />

      {/* ===============================
         GENERAL ASSOCIATION MEMBERS
         =============================== */}
      <section className="surface edge-highlight relative mb-12 overflow-hidden px-5 py-10 sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative">
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
              <RoleTitle>Joint Secretary &amp; Joint Treasurer</RoleTitle>

              {/* Joint Secretaries */}
              <div className="mb-5 flex justify-center">
                <Stagger className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
                  {(associationByRole["Joint Secretary"] || []).map((member) => (
                    <StaggerItem key={member.id}>
                      <MemberCard member={member} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              {/* Joint Treasurer */}
              <div className="flex justify-center">
                {(associationByRole["Joint Treasurer"] || []).map((member) => (
                  <Reveal key={member.id} className="w-full max-w-sm">
                    <MemberCard member={member} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===============================
         CLUB REPRESENTATIVES
         =============================== */}
      <section className="surface edge-highlight relative mb-8 overflow-hidden px-5 py-10 sm:px-8">
        <div className="relative">
          <Reveal className="mb-10 flex flex-col gap-3">
            <span className="eyebrow-accent">Clubs</span>
            <h3 className="h-section">
              <span className="text-gradient">Club Representatives</span>
            </h3>
          </Reveal>

          {Object.entries(clubGroups).map(([clubName, members]) => (
            <div key={clubName} className="mb-12 border-t border-line pt-8 last:mb-0">
              <h4 className="text-lg font-semibold tracking-tight text-fg">
                {clubName}
              </h4>
              <p className="mb-6 mt-1 text-[14px] text-fg-muted">
                Representatives coordinating activities under {clubName}
              </p>

              <div className="flex justify-center">
                <Stagger className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
                  {members.map((member) => (
                    <StaggerItem key={member.id}>
                      <MemberCard member={member} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssociationMembers;
