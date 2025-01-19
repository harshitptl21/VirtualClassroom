import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Dashboard({ user, setIsAuthenticated, setUser }) {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroomName, setNewClassroomName] = useState('');
  const history = useHistory();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:8000/virtualclass/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setClassrooms(data.classrooms);
      }
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    }
  };

  const createClassroom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/virtualclass/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newClassroomName }),
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setClassrooms([...classrooms, data]);
        setNewClassroomName('');
      }
    } catch (error) {
      console.error('Failed to create classroom:', error);
    }
  };

  const joinClassroom = (classroomId) => {
    history.push(`/classroom/${classroomId}`);
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/virtualclass/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Update the parent component (App.js) state after logout
        setIsAuthenticated(false);
        setUser(null);

        // Redirect to the root URL (home page) after successful logout
        history.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Virtual Classroom Dashboard</h1>
        <p>Welcome, {user?.username || 'Guest'}</p>
        {user && (
          <button onClick={logout}>Logout</button>
        )}
      </div>

      <div className="classrooms-section">
        <div className="create-classroom">
          <h2>Create New Classroom</h2>
          <form onSubmit={createClassroom}>
            <input
              type="text"
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
              placeholder="Enter classroom name"
              required
            />
            <button type="submit">Create Classroom</button>
          </form>
        </div>

        <div className="classrooms-list">
          <h2>Your Classrooms</h2>
          {classrooms.length === 0 ? (
            <p>No classrooms available</p>
          ) : (
            <div className="classrooms-grid">
              {classrooms.map(classroom => (
                <div key={classroom.id} className="classroom-card">
                  <h3>{classroom.name}</h3>
                  <p>Created: {new Date(classroom.created_at).toLocaleDateString()}</p>
                  <button onClick={() => joinClassroom(classroom.id)}>
                    Join Classroom
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
