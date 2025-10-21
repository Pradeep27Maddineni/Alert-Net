import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";



const ChatBox = ({ incidentId, receiverId }) => {
    const { socket } = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!socket || !user || !receiverId || !incidentId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/chat/${incidentId}/${receiverId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await res.json();
                setMessages(data.messages || []);
            } catch (err) {
                console.error("❌ Failed to fetch chat messages:", err);
            }
        };

        fetchMessages();

        const roomId = `${incidentId}_${[user._id, receiverId].sort().join("_")}`;
        socket.emit("joinChatRoom", roomId);

        const handleReceive = (msg) => {
            // Allow receiving any message belonging to this chat
            if (
                (msg.sender === user._id && msg.receiver === receiverId) ||
                (msg.sender === receiverId && msg.receiver === user._id)
            ) {
                setMessages((prev) => {
                    if (prev.find((m) => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });

                // Notify the user if they are the receiver
              
            }
        };

        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.off("receiveMessage", handleReceive);
        };
    }, [socket, user, receiverId, incidentId]);

    const handleSend = () => {
        if (!input.trim()) return;
        const message = {
            incidentId,
            senderId: user._id,
            receiverId,
            text: input.trim(),
        };

        socket.emit("sendMessage", message);
        setInput("");
    };

  return (
    <div className="w-full max-w-md h-[80vh] flex flex-col justify-between bg-violet-300/90 rounded-xl p-5 shadow-lg border border-slate-700 backdrop-blur-sm">
        <h2 className="text-center text-xl font-bold text-red-500 mb-3">
            💬 Chat with Reporter
        </h2>
        <div className="flex-1 overflow-y-auto bg-slate-900 p-3 rounded-md mb-3 space-y-2">
            {messages.map((msg, idx) => (
                <div
                    key={msg._id || idx}
                    className={`p-2 rounded-md max-w-xs break-words ${
                        ((msg.sender && msg.sender._id) || msg.sender) === user._id
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-gray-700 text-white mr-auto"
                    }`}
                >
                    {msg.text}
                    <div className="text-[10px] text-gray-300 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
        <div className="flex space-x-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 rounded-md p-2 bg-slate-700 text-white outline-none"
            />
            <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
            >
                Send
            </button>
        </div>
    </div>
);

};

export default ChatBox;
