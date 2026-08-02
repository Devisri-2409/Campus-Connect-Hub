import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { getMessages, sendMessage } from "../services/chatService";
import "../styles/Chat.css";

const GroupChat = () => {
  const { groupId } = useParams();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

const loadMessages = useCallback(async () => {
    try {
        const data = await getMessages(groupId);
        setMessages(data);
    } catch (err) {
        console.log(err);
    }
}, [groupId]);

useEffect(() => {
    loadMessages();

    socket.emit("joinGroup", groupId);

    socket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
    });

    return () => {
        socket.off("receiveMessage");
    };
}, [groupId, loadMessages]);


  const handleSend = async () => {
    if (!message.trim()) return;

    const data = {
      group_id: groupId,
      message,
    };

    await sendMessage(data);

    socket.emit("sendMessage", {
      ...data,
      full_name: "You",
      created_at: new Date(),
    });

    setMessage("");
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        Group Chat
      </div>

      <div className="chat-body">

        {messages.map((msg, index) => (

          <div className="chat-message" key={index}>

            <strong>{msg.full_name}</strong>

            <p>{msg.message}</p>

            <small>
              {new Date(msg.created_at).toLocaleTimeString()}
            </small>

          </div>

        ))}

      </div>

      <div className="chat-footer">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  );
};

export default GroupChat;