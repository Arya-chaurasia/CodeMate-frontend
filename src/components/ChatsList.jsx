// src/pages/ChatsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chats", { withCredentials: true });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="text-gray-400 p-4 text-center">No chats yet</div>
          ) : (
            chats.map((chat) => {
              const other = chat.participants[0];
              const lastMsg = chat.lastMessage;

              return (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/chat/${other._id}`)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-800 border-b border-gray-700"
                >
                  <div className="relative">
                    <img
                      src={other.photoUrl || "/default-avatar.png"}
                      alt={other.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {lastMsg?.unread && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                        {lastMsg.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center">
                      <div className="text-white font-semibold truncate">
                        {other.firstName} {other.lastName}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {lastMsg ? formatTime(lastMsg.createdAt) : ""}
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm mt-1 truncate">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel (placeholder for selected chat) */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    </div>
  );
};

export default ChatsList;
