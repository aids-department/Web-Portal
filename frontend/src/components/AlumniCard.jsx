import { useState } from "react";
import { FaPhone, FaEnvelope, FaLinkedin, FaArrowLeft, FaTimes } from "react-icons/fa";

export default function AlumniCard({ alumni }) {
  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full h-[90vh] sm:h-[85vh] md:h-auto md:max-w-4xl md:max-h-[80vh] overflow-hidden flex flex-col animate-slideUp">
          {/* Header with Close Button */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-gray-50 p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 truncate">{alumni.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 truncate">{alumni.role}</p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="ml-4 text-gray-500 hover:text-gray-700 transition flex-shrink-0"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Professional Journey */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-4">Professional Journey</h3>
                <div className="space-y-4">
                  {/* Current Role */}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{alumni.role}</p>
                    <p className="text-blue-600 font-medium text-sm">{alumni.company}</p>
                    <p className="text-xs sm:text-sm text-gray-600">January 2020 - Present</p>
                    {alumni.bio && (
                      <>
                        <ul className="text-xs sm:text-sm text-gray-700 mt-2 space-y-1">
                          {alumni.bio.split("\n").slice(0, 2).map((line, idx) => (
                            <li key={idx}>• {line}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* Previous Roles */}
                  {alumni.achievements && alumni.achievements.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900 mt-4 text-sm sm:text-base">Data Analyst</p>
                      <p className="text-blue-600 font-medium text-sm">Innovate Labs</p>
                      <p className="text-xs sm:text-sm text-gray-600">June 2019 - December 2019</p>
                    </div>
                  )}

                  {/* Earlier Role */}
                  <div>
                    <p className="font-semibold text-gray-900 mt-4 text-sm sm:text-base">Junior Researcher</p>
                    <p className="text-blue-600 font-medium text-sm">University of California</p>
                    <p className="text-xs sm:text-sm text-gray-600">September 2018 - May 2019</p>
                  </div>
                </div>
              </div>

              {/* Contact & Details */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-4">Contact & Details</h3>

                {/* Email */}
                {alumni.email && (
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Email:</p>
                    <a
                      href={`mailto:${alumni.email}`}
                      className="text-blue-600 hover:text-blue-800 break-all transition text-xs sm:text-sm"
                    >
                      {alumni.email}
                    </a>
                  </div>
                )}

                {/* Phone */}
                {alumni.phone && (
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone:</p>
                    <a
                      href={`tel:${alumni.phone}`}
                      className="text-blue-600 hover:text-blue-800 transition text-xs sm:text-sm"
                    >
                      {alumni.phone}
                    </a>
                  </div>
                )}

                {/* LinkedIn */}
                {alumni.linkedinUrl && (
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">LinkedIn:</p>
                    <a
                      href={alumni.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all transition text-xs sm:text-sm"
                    >
                      {alumni.linkedinUrl}
                    </a>
                  </div>
                )}

                {/* Department */}
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Department:</p>
                  <p className="text-gray-900 text-xs sm:text-sm">Research & Development</p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Location:</p>
                  <p className="text-gray-900 text-xs sm:text-sm">San Francisco, CA</p>
                </div>

                {/* Skills */}
                {alumni.skills && alumni.skills.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {alumni.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Card Header with Placeholder Image */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 h-32 flex items-center justify-center border-b border-gray-200">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-4xl">
          {alumni.name.charAt(0)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Name and Pass Out Year */}
        <h3 className="text-lg font-bold text-blue-900">{alumni.name}</h3>
        <p className="text-sm text-gray-600 mb-3">Pass Out: {alumni.passOutYear}</p>

        {/* Company and Role */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-blue-600 font-semibold">{alumni.company}</span>
          </p>
          {alumni.role && (
            <p className="text-xs text-gray-600">{alumni.role}</p>
          )}
        </div>

        {/* Skills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {alumni.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {alumni.skills.length > 3 && (
                <span className="text-xs text-gray-600 px-2 py-1">
                  +{alumni.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View More Button */}
        <button
          onClick={() => setShowDetails(true)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
        >
          View More...
        </button>
      </div>
    </div>
  );
}
