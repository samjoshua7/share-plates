import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";
import "./Messages.css";

export default function Messages() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch Sidebar Contacts
  const fetchContacts = async () => {
    try {
      const res = await api.get("/messages/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    }
  };

  // Fetch Message History
  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    fetchContacts();

    if (!socket) return;

    const handleReceive = (newMsg) => {
      // If we are currently chatting with the sender/receiver, append to local state
      setActiveContact((currentActive) => {
        if (
          currentActive &&
          (newMsg.sender._id === currentActive.user._id ||
            newMsg.receiver === currentActive.user._id)
        ) {
          setMessages((prev) => [...prev, newMsg]);
        }
        // Always refresh side contacts for the preview
        fetchContacts();
        return currentActive;
      });
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    fetchMessages(contact.user._id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;

    try {
      await api.post("/messages", {
        receiverId: activeContact.user._id,
        text,
      });
      setText("");
    } catch (err) {
      alert("Failed to send message: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="chat-layout">
      {/* LEFT: Contacts List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Messages</h3>
        </div>
        <div className="chat-contacts">
          {contacts.length === 0 ? (
            <p className="no-contacts">No message history yet.</p>
          ) : (
            contacts.map((c) => (
              <div
                key={c.user._id}
                className={`chat-contact-item ${activeContact?.user._id === c.user._id ? "active" : ""}`}
                onClick={() => handleSelectContact(c)}
              >
                <div className="sp-avatar">
                  {c.user.name ? c.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="chat-contact-info">
                  <div className="chat-contact-name">{c.user.organizationName || c.user.name}</div>
                  <div className="chat-contact-preview">{c.lastMessage}</div>
                </div>
                {c.unread && <span className="chat-unread-dot"></span>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Active Chat Window */}
      <div className="chat-window">
        {activeContact ? (
          <>
            <div className="chat-window-header">
              <div className="sp-avatar">
                {activeContact.user.name ? activeContact.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h4>{activeContact.user.organizationName || activeContact.user.name}</h4>
                <p className="chat-meta">{activeContact.user.role.toUpperCase()}</p>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <p className="no-messages">Say hello to start the conversation!</p>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender._id === user?._id;
                  return (
                    <div key={index} className={`chat-bubble-wrapper ${isMe ? "me" : "them"}`}>
                      <div className="chat-bubble">
                        <p>{msg.text}</p>
                        <span className="chat-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="sp-input"
              />
              <button type="submit" disabled={!text.trim()} className="btn btn-primary chat-send-btn">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-state">
            <span style={{ fontSize: "3rem" }}>💬</span>
            <p>Select a contact to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
