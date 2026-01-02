import React from "react";

// Import images properly
import kanagarajImg from "../assets/staff/kanagaraj.jpg";
import shaliniImg from "../assets/staff/shalini.jpg";

export default function StaffInfo() {
  const staffData = [
    {
      name: "Mr. R. Kanagaraj",
      role: "Instructor",
      img: kanagarajImg,
    },
    {
      name: "Ms. K. Shalini",
      role: "Junior Assistant",
      img: shaliniImg,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-4 sm:p-6 md:p-10">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200/10 to-transparent rounded-full -translate-y-48 translate-x-48 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/10 to-transparent rounded-full translate-y-40 -translate-x-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-center text-4xl sm:text-5xl font-bold mb-12 text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Staff Information</h1>
        
        <div className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                {staffData.map((staff, index) => (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer p-6 text-center"
                  >
                    <img
                      src={staff.img}
                      alt={staff.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/128x128/6b7280/ffffff?text=No+Image";
                      }}
                    />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{staff.name}</h2>
                    <p className="text-sm text-gray-600">{staff.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
