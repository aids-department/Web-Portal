import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import PageHeader from "./ui/PageHeader";

export default function UpdateContent() {
    const [updateText, setUpdateText] = useState("");
    const [updates, setUpdates] = useState([]);

    // Fetch existing updates on component load
    const fetchUpdates = async () => {
        try {
            const res = await axios.get("https://web-portal-760h.onrender.com/api/updates");
            setUpdates(res.data);
        } catch (err) {
            console.error("Failed to fetch updates:", err);
        }
    };

    useEffect(() => {
        fetchUpdates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Post to the dedicated updates server
            await axios.post("https://web-portal-760h.onrender.com/api/updates", { title: updateText });
            toast.success("Dashboard update published!");
            setUpdateText("");
            fetchUpdates(); // Refresh the list
        } catch (err) {
            toast.error("Failed to connect to the updates server.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this update?")) {
            try {
                // You will need to add this DELETE route to your recent_updates_server.js
                await axios.delete(`https://web-portal-760h.onrender.com/api/updates/${id}`);
                toast.success("Update deleted");
                fetchUpdates(); // Refresh the list
            } catch (err) {
                toast.error("Failed to delete update");
            }
        }
    };

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
            <PageHeader compact eyebrow="Dashboard" title="Recent Updates" />

            {/* Post Update Form */}
            <div className="surface edge-highlight p-6">
                <div className="mb-4 flex items-center gap-2.5">
                    <span className="icon-tile h-8 w-8">
                        <Plus className="h-4 w-4 text-accent-bright" />
                    </span>
                    <h2 className="text-[15px] font-semibold tracking-tight text-fg">Post Recent Update</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        className="field min-h-[120px] resize-y py-3"
                        placeholder="Enter update message (e.g., Results are out!)..."
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary btn-lg w-full">
                        Publish Update
                    </button>
                </form>
            </div>

            {/* Existing Updates List */}
            <div className="surface p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-fg">
                        <MessageSquare className="h-4 w-4 text-fg-muted" />
                        Current Updates
                    </h2>
                    <span className="font-mono text-[11px] text-fg-muted">{updates.length}</span>
                </div>
                <div className="space-y-2">
                    {updates.length > 0 ? (
                        updates.map((u) => (
                            <div key={u._id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                                <div className="min-w-0">
                                    <p className="text-[14px] font-medium text-fg">{u.title}</p>
                                    <p className="truncate font-mono text-[11px] text-fg-muted">ID: {u._id}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(u._id)}
                                    className="btn-icon h-8 w-8 flex-none hover:bg-rose-500/10 hover:text-rose-300"
                                    title="Delete update"
                                    aria-label="Delete update"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="py-4 text-center text-[13px] text-fg-muted">No updates found in database.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
