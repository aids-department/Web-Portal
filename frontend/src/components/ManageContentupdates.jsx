import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, MessageSquare } from "lucide-react";

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
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
            {/* Post Update Form */}
            <div className="bg-white   border border-ds-edge p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Plus className="w-5 h-5 text-ds-blue" />
                    <h2 className="text-xl font-bold text-ds-ink">Post Recent Update</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        className="w-full p-3 border border-ds-edge   focus:border-navy outline-none transition-all min-h-[120px]"
                        placeholder="Enter update message (e.g., Results are out!)..."
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-navy text-white font-medium hover:bg-navy-deep transition-all"
                    >
                        Publish Update
                    </button>
                </form>
            </div>

            {/* Existing Updates List */}
            <div className="bg-white   border border-ds-edge p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-ds-ink-soft" />
                    <h2 className="text-lg font-bold text-ds-ink">Current Updates</h2>
                </div>
                <div className="space-y-3">
                    {updates.length > 0 ? (
                        updates.map((u) => (
                            <div key={u._id} className="flex justify-between items-center p-3 border border-ds-edge  hover:bg-ds-ground transition-colors">
                                <div>
                                    <p className="text-navy font-medium text-sm">{u.title}</p>
                                    <p className="text-ds-ink-faint text-xs">ID: {u._id}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(u._id)}
                                    className="p-2 text-ds-red hover:bg-ds-red-tint  transition-colors"
                                    title="Delete update"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-ds-ink-soft italic text-center text-sm">No updates found in database.</p>
                    )}
                </div>
            </div>
        </div>
    );
}