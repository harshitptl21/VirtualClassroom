import React, { useState, useEffect } from 'react';
import '../css//FileSharing.css';
const FileSharing = ({ classroomId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [classroomId]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://localhost:8000/virtualclass/files/${classroomId}/`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('classroom_id', classroomId);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:8000/virtualclass/upload/', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-sharing">
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <span>Uploading...</span>}
      </div>
      <div className="files-list">
        {files.map(file => (
          <div key={file.id} className="file-item">
            <span>{file.name}</span>
            <a href={file.url} download>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSharing;
