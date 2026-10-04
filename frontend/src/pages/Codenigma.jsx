import React from "react";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import { Stagger, StaggerItem } from "../components/ui/Reveal";

const sampleNames = (prefix, count) =>
  Array.from({ length: count }).map((_, i) => `${prefix} ${i + 1}`);

// Shared by Codenigma and Genesys: one ranked list per year
export function YearBoards({ years }) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(years).map(([year, list]) => (
        <StaggerItem key={year} className="h-full">
          <SpotlightCard interactive className="h-full">
            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <h3 className="h-card">Year {year}</h3>
                <span className="pill-neutral font-mono">Top {list.length}</span>
              </div>
              <table className="table-ln text-[13px]">
                <thead>
                  <tr>
                    <th className="w-10 px-2">#</th>
                    <th className="px-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((name, idx) => (
                    <tr key={name}>
                      <td className="px-2 py-2 font-mono text-fg-muted">{idx + 1}</td>
                      <td className="px-2 py-2 font-medium">{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default function Codenigma() {
  const years = {
    1: sampleNames("Year1_Player", 10),
    2: sampleNames("Year2_Player", 10),
    3: sampleNames("Year3_Player", 10),
    4: sampleNames("Year4_Player", 10),
  };

  return (
    <div className="container-ln">
      <PageHeader eyebrow="Coding contest" title="Codenigma" accent="Top 10 (by Year)" />
      <YearBoards years={years} />
    </div>
  );
}
