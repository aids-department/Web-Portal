import React, { useEffect, useState } from "react";
import { Trash2, Download, Eye, FileText, User, Search, AlertTriangle, X } from "lucide-react";

export default function ManageUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // ✅ NEW: State for Delete Modal
  const [deleteId, setDeleteId] = useState(null); // Stores ID of item to delete

  // Helper to force download
  const getDownloadUrl = (url, fileName) => {
    if (!url) return "#";
    const cleanName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    return url.replace("/upload/", `/upload/fl_attachment:${cleanName}/`);
  };

  const fetchUploads = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/qp");
      const data = await res.json();
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // ✅ Trigger the custom modal instead of window.confirm
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/qp/${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setUploads(uploads.filter((u) => u._id !== deleteId));
        setDeleteId(null); // Close modal on success
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting file.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUploads = uploads.filter((u) => {
    const query = searchQuery.toLowerCase();
    const subjectName = u.subjectName?.toLowerCase() || "";
    const subjectCode = u.subjectCode?.toLowerCase() || "";
    const authorName = u.author?.username?.toLowerCase() || "";
    return subjectName.includes(query) || subjectCode.includes(query) || authorName.includes(query);
  });

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans relative">
      
      {/* ✅ CUSTOM DELETE MODAL OVERLAY */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform scale-100 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Resource?</h3>
                <p className="text-gray-500 text-sm mt-1">This action cannot be undone. The file will be permanently removed.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md flex items-center gap-2"
              >
                {loading ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER + SEARCH BAR */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Manage Resources</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            Total: {uploads.length}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by subject, code, or author..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-base transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      {filteredUploads.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            {uploads.length === 0 ? "No uploads found." : "No matches found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUploads.map((u) => {
            const niceName = `${u.subjectCode}_${u.examType}_Sem${u.semester}`;
            const isBank = u.examType === "Question Bank";

            return (
              <div key={u._id} className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                
                {/* AUTHOR BADGE */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                  <User size={12} />
                  {u.author ? u.author.username : "Unknown"}
                </div>

                <div className="flex items-start gap-4 pr-32">
                  <div className={`p-3 rounded-lg shrink-0 ${isBank ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                     <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {u.subjectName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-500">
                        {u.subjectCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        isBank ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {u.examType}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>Semester {u.semester}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Uploaded {new Date(u.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <a
                    href={u.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Eye size={16} /> View
                  </a>

                  <a
                    href={getDownloadUrl(u.fileUrl, niceName)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Download size={16} /> Download
                  </a>

                  {/* ✅ TRIGGER MODAL ON CLICK */}
                  <button
                    onClick={() => confirmDelete(u._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition ml-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}