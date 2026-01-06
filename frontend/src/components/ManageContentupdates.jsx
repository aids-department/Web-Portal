import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react"; // Make sure lucide-react is installed

export default function UpdateContent() {
    const [updateText, setUpdateText] = useState("");
    const [updates, setUpdates] = useState([]);

    // Fetch existing updates on component load
    const fetchUpdates = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/updates");
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
            await axios.post("http://localhost:5000/api/updates", { title: updateText });
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
                await axios.delete(`http://localhost:5000/api/updates/${id}`);
                toast.success("Update deleted");
                fetchUpdates(); // Refresh the list
            } catch (err) {
                toast.error("Failed to delete update");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 flex flex-col gap-8">
            {/* Post Update Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 font-cursive">Post Recent Update</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[150px]"
                        placeholder="Enter update message (e.g., Results are out!)..."
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg"
                    >
                        Publish Update
                    </button>
                </form>
            </div>

            {/* Existing Updates List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Updates</h2>
                <div className="space-y-4">
                    {updates.length > 0 ? (
                        updates.map((u) => (
                            <div key={u._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-gray-900 font-medium">{u.title}</p>
                                    <p className="text-gray-400 text-xs">ID: {u._id}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(u._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete update"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center">No updates found in database.</p>
                    )}
                </div>
            </div>
        </div>
    );
}