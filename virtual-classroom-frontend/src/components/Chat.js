import React, { useState, useRef, useEffect } from 'react';
import '../css/Chat.css';

const Chat = ({ socket, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', () => {
        console.log('WebSocket Connected');
      });
  
      socket.addEventListener('close', () => {
        console.log('WebSocket Disconnected');
      });
  
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          setMessages(prev => [...prev, data]);
        }
      });
  
      return () => {
        socket.close();
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
    console.log(messages);  // Check if messages are updated
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
  
    const messageData = {
      type: 'chat_message',
      message: newMessage,
      sender: user.username,
      timestamp: new Date().toISOString()
    };
  
    console.log('Sending message:', messageData);  // Check if the message data is correct
    socket.send(JSON.stringify(messageData));
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === user.username ? 'own-message' : ''}`}
          >
            <div className="message-header">
              <span className="sender">{msg.sender}</span>
              <span className="time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
