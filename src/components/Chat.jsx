import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const user = useSelector(store => store.user);
    const userId = user?._id
    const { id } = useParams()
    console.log(id);

    const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + id, {
      withCredentials: true,
    });

    console.log(chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
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
             firstName: user.firstName, userId, id
             });

             socket.on("messageReceived", ( {firstName,lastName, text}) => {
                console.log(firstName + " " + text);
                setMessages( (messages) => [ ...messages, {firstName,lastName, text}])
             })

        return () => {
            socket.disconnect()
        }
    }, [userId, id])


    const sendMessage = () => {
        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            firstName: user.firstName,
             lastName: user.lastName,
            userId,
            id,
            text: newMessages
        });
        setNewMessages("")
    }


    return (
        <div className='w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
            <h1 className='p-2 border-b border-gray-600'>
                Chat
            </h1>
            <div className='flex-1 overflow-scroll p-5'>
                {messages?.map((msg, index) => {
                    return (
                       <div
              key={index}
              className={
                "chat " +
                (user.firstName === msg.firstName ? "chat-end" : "chat-start")
              }
            >
                       <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                        <time className='text-xs opacity-50'>2 hours ago</time>
                        </div>
                        <div className='chat-bubble'>
{msg.text}
                        </div>


                            
                        </div>
                    )
                })}
            </div>
            <div className='p-5 border border-gray-600 flex items-center gap-2'>
                <input value={newMessages}
                    onChange={(e) => setNewMessages(e.target.value)}
                    className='flex-1 border border-gray-500 text-white rounded-b-md p-2' />
                <button
                    onClick={sendMessage}
                    className='btn btn-secondary'>Send</button>
            </div>
        </div>
    )
}

export default Chat