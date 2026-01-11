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
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 sm:p-8 md:p-12">
      
      {/* Decorative orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Genesys — Top 3 (by Year)
        </h1>

        {/* Glass Wrapper */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {Object.entries(years).map(([year, list]) => (
              <div
                key={year}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Year {year}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-300/60">
                        <th className="text-left py-2 font-semibold">#</th>
                        <th className="text-left py-2 font-semibold">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((name, idx) => (
                        <tr
                          key={name}
                          className="border-b border-gray-200/60 last:border-none"
                        >
                          <td className="py-2 pr-4 font-medium text-gray-600">
                            {idx + 1}
                          </td>
                          <td className="py-2 font-medium">{name}</td>
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
