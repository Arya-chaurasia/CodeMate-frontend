import React, { useEffect, useState, useRef  } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const { id } = useParams();

  const messagesEndRef = useRef(null);

    const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + id, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt  } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt: createdAt || new Date().toISOString(),
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinchat", {
      firstName: user.firstName,
      userId,
      id,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt   }) => {
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, createdAt: createdAt || new Date().toISOString() },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, id]);

  const sendMessage = () => {
    if (!newMessages.trim()) return;
    const socket = createSocketConnection();
     const timestamp = new Date().toISOString();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      id,
      text: newMessages,
      createdAt: timestamp,
    });
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     text: newMessages,
    //     createdAt: timestamp,
    //   },
    // ]);
    setNewMessages("");
  };

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-3/4 mx-auto mt-6 shadow-xl rounded-2xl bg-gray-900 flex flex-col h-[80vh] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 text-white font-semibold text-lg">
        💬 Chat Room
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages?.map((msg, index) => {
          const isMe = user.firstName === msg.firstName;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-xs">
                <div
                  className={`text-sm font-semibold mb-1 ${
                    isMe ? "text-right text-gray-400" : "text-left text-gray-400"
                  }`}
                >
                  {msg.firstName} {msg.lastName}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl text-white ${
                    isMe ? "bg-gray-600 rounded-br-none" : "bg-blue-400 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isMe ? "text-right text-gray-400" : "text-left text-gray-400"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
        <input
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 cursor-pointer py-2 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
