import React from "react";

export default function NotFound() {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-blue-900">Page not found</h2>
      <p className="text-gray-600 mt-2">Sorry, the page you requested doesn't exist.</p>
    </div>
  );
}
