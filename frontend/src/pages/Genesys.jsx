import React from "react";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Genesys — Top 3 (by Year)</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(years).map(([year, list]) => (
          <div key={year} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Year {year}</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {list.map((name, idx) => (
                <li key={name} className="py-1">
                  <div className="flex items-center justify-between">
                    <span>{name}</span>
                    <span className="text-sm text-gray-400">#{idx + 1}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
