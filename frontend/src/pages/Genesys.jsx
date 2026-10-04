import React from "react";
import PageHeader from "../components/ui/PageHeader";
import { YearBoards } from "./Codenigma";

const sampleNames = (prefix, count) =>
  Array.from({ length: count }).map((_, i) => `${prefix} ${i + 1}`);

export default function Genesys() {
  const years = {
    1: sampleNames("Year1_Player", 3),
    2: sampleNames("Year2_Player", 3),
    3: sampleNames("Year3_Player", 3),
    4: sampleNames("Year4_Player", 3),
  };

  return (
    <div className="container-ln">
      <PageHeader eyebrow="Project expo" title="Genesys" accent="Top 3 (by Year)" />
      <YearBoards years={years} />
    </div>
  );
}
