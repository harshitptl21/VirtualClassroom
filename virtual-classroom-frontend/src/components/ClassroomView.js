import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoConference from './VideoConference';
import Whiteboard from './Whiteboard';
import Chat from './Chat';
import FileSharing from './FileSharing';
import '../css/ClassroomView.css';  // Import the CSS file

function ClassroomView({ user }) {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/classroom/${id}/`);
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [id]);

  useEffect(() => {
    // Fetch classroom details
    const fetchClassroom = async () => {
      try {
        const response = await fetch(`http://localhost:8000/virtualclass/${id}/`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setClassroom(data);
        }
      } catch (error) {
        console.error('Failed to fetch classroom:', error);
      }
    };

    fetchClassroom();
  }, [id]);

  return (
    <div className="classroom-container">
      <div className="main-content">
        <VideoConference roomId={id} />
        <Whiteboard socket={socket} />
      </div>
      <div className="sidebar">
        <FileSharing classroomId={id} />
        <Chat socket={socket} user={user} />
      </div>
    </div>
  );
}

export default ClassroomView;
