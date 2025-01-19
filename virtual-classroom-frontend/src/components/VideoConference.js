import React, { useEffect, useRef, useState } from 'react';
import '../css/VideoConference.css';

const VideoConference = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    // Request access to user's camera and microphone
    async function setupMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

    setupMediaStream();

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="video-conference">
      <div className="video-grid">
        <div className="local-video">
          <video ref={localVideoRef} autoPlay muted playsInline />
        </div>
        {remoteStreams.map((stream, index) => (
          <div key={index} className="remote-video">
            <video
              autoPlay
              playsInline
              ref={el => {
                if (el) el.srcObject = stream;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoConference;