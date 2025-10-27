import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import img6 from "../assets/img6.png";
import img7 from "../assets/img7.png";

const ChatInbox = () => {
    const { token } = useContext(AuthContext);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch(`https://alert-net.onrender.com/api/chat/my-chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setChats(data);
            } catch (err) {
                console.error("❌ Failed to fetch chats:", err);
            }
        };
        fetchChats();
    }, [token]);

    const handleDelete = async (incidentId, otherUserId) => {
        if (!confirm("Are you sure you want to delete this chat for both users?")) return;

        try {
            const res = await fetch(
                `https://alertnet-backend-mnnu.onrender.com/api/chat/${incidentId}/${otherUserId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            if (res.ok) {
                setChats((prev) => prev.filter(chat => !(chat.incidentId._id === incidentId && chat.sender._id === otherUserId)));
                toast.success("Chat deleted successfully for both users.");
            } else {
                toast.error(data.message || "Failed to delete chat.");
            }
        } catch (err) {
            console.error("❌ Error deleting chat:", err);
            toast.error("Server error while deleting chat.");
        }
    };

    return (
        <div className="relative min-h-[93vh] flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 overflow-hidden">

            {/* Top-left image */}
            <img
                src={img6}
                alt="Person sending message"
                className="hidden md:block  absolute top-4 left-4 w-98 opacity-70 animate-float pointer-events-none"
            />

            {/* Bottom-right image */}
            <img
                src={img7}
                alt="Person receiving message"
                className="hidden md:block  absolute bottom-4 right-4 w-98 opacity-80 animate-float-reverse pointer-events-none"
            />

            <div className="w-full max-w-2xl flex flex-col item-center">
                <h1 className="text-3xl font-bold mb-6 text-center text-red-400">📥 My Chat Inbox</h1>

                {chats.length === 0 ? (
                    <p className="text-center text-gray-400">No chats yet.</p>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        {chats.map((chat, idx) => (
                            <div
                                key={idx}
                                className="
                                    bg-slate-800 rounded-xl p-4 shadow 
                                    hover:shadow-lg hover:shadow-red-400/80
                                    flex justify-between items-center
                                    transition-all duration-300
                                "
                            >
                                <Link
                                    to={`/chat/${chat.incidentId._id}/${chat.sender._id}`}
                                    className="flex-1"
                                >
                                    <div className="font-semibold text-lg text-blue-300">{chat.sender.name}</div>
                                    <div className="text-gray-400 text-sm">Incident: {chat.incidentId.type}</div>
                                    <div className="text-gray-300 mt-1 line-clamp-2">{chat.lastMessage}</div>
                                    <div className="text-gray-500 text-xs mt-1">
                                        {new Date(chat.updatedAt).toLocaleString()}
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleDelete(chat.incidentId._id, chat.sender._id)}
                                    className="ml-4 text-md border rounded bg-red-600 text-white px-2 hover:cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInbox;
