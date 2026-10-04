import React, { useEffect, useState } from "react";
import { Trash2, Download, Eye, FileText, User, Search, AlertTriangle, X } from "lucide-react";
import PageHeader from "./ui/PageHeader";
import SpotlightCard from "./ui/SpotlightCard";
import Modal from "./ui/Modal";
import { EmptyState } from "./ui/States";

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
      const res = await fetch("https://web-portal-760h.onrender.com/api/qp");
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
      const res = await fetch(`https://web-portal-760h.onrender.com/api/qp/${deleteId}`, {
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
    <div className="relative mx-auto max-w-4xl">

      {/* ✅ CUSTOM DELETE MODAL OVERLAY */}
      {deleteId && (
        <Modal z="z-50" className="max-w-md">
          <div className="p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-300">
                <AlertTriangle size={24} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-fg">Delete Resource?</h3>
                <p className="mt-1 text-[13.5px] text-fg-muted">This action cannot be undone. The file will be permanently removed.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="btn bg-rose-600 text-white shadow-[0_0_0_1px_rgba(244,63,94,0.5),0_4px_12px_rgba(244,63,94,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-rose-500"
              >
                {loading ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* HEADER + SEARCH BAR */}
      <PageHeader
        compact
        eyebrow="Question papers"
        title="Manage Resources"
        actions={<span className="pill font-mono text-[12px]">Total: {uploads.length}</span>}
      >
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" size={18} />
          <input
            type="text"
            placeholder="Search by subject, code, or author..."
            className="field py-3 pl-11 text-[14px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* LIST */}
      {filteredUploads.length === 0 ? (
        <EmptyState icon={FileText} title={uploads.length === 0 ? "No uploads found." : "No matches found."} />
      ) : (
        <div className="space-y-3">
          {filteredUploads.map((u) => {
            const niceName = `${u.subjectCode}_${u.examType}_Sem${u.semester}`;
            const isBank = u.examType === "Question Bank";

            return (
              <SpotlightCard key={u._id}>
                <div className="p-5 sm:p-6">
                  {/* AUTHOR BADGE */}
                  <div className="pill-neutral absolute right-4 top-4">
                    <User size={12} />
                    {u.author ? u.author.username : "Unknown"}
                  </div>

                  <div className="flex items-start gap-4 pr-28">
                    <div className={`icon-tile h-11 w-11 shrink-0 ${isBank ? 'text-violet-300' : 'text-fg-muted'}`}>
                       <FileText size={20} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-fg">
                        {u.subjectName}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-fg-muted">
                        <span className="rounded-md border border-line bg-white/[0.04] px-2 py-0.5 font-mono text-[11.5px] text-fg/80">
                          {u.subjectCode}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider ${
                          isBank ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-line-accent bg-accent/10 text-indigo-200'
                        }`}>
                          {u.examType}
                        </span>
                        <span className="text-fg-muted/50">•</span>
                        <span>Semester {u.semester}</span>
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-fg-muted">
                        Uploaded {new Date(u.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
                    <a href={u.fileUrl} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                      <Eye size={15} /> View
                    </a>

                    <a href={getDownloadUrl(u.fileUrl, niceName)} className="btn-ghost btn-sm">
                      <Download size={15} /> Download
                    </a>

                    {/* ✅ TRIGGER MODAL ON CLICK */}
                    <button onClick={() => confirmDelete(u._id)} className="btn-danger btn-sm ml-1">
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
