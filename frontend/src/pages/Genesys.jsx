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
    <div className="min-h-screen bg-white p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-4xl sm:text-5xl font-bold mb-12 text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Genesys — Top 3 (by Year)</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(years).map(([year, list]) => (
              <div key={year} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Year {year}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-semibold">#</th>
                        <th className="text-left py-2 font-semibold">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((name, idx) => (
                        <tr key={name} className="border-b border-gray-200">
                          <td className="py-2 pr-4">{idx + 1}</td>
                          <td className="py-2">{name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
