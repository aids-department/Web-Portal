import React from "react";
import Table from "../components/ui/Table";

const sampleNames = (prefix, count) =>
  Array.from({ length: count }).map((_, i) => `${prefix} ${i + 1}`);

export default function Codenigma() {
  const years = {
    1: sampleNames("Year1_Player", 10),
    2: sampleNames("Year2_Player", 10),
    3: sampleNames("Year3_Player", 10),
    4: sampleNames("Year4_Player", 10),
  };

  return (
    <div>
      <div className="mb-10 pb-6 border-b-2 border-navy">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">Coding contest</span>
        <h1 className="text-page-heading text-navy mt-2.5">Codenigma — top 10 by year</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(years).map(([year, list]) => (
          <div key={year}>
            <h3 className="text-card-title text-navy mb-4">Year {year}</h3>
            <Table>
              <Table.Head>
                <Table.HeadCell className="w-12">Rank</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
              </Table.Head>
              <tbody>
                {list.map((name, idx) => (
                  <Table.Row key={name}>
                    <Table.Cell><Table.RankChip rank={idx + 1} /></Table.Cell>
                    <Table.Cell className="font-medium text-navy">{name}</Table.Cell>
                  </Table.Row>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
