import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClassroomView from './components/ClassroomView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/virtualclass/api/auth/check/', {
          credentials: 'include',  // Make sure credentials are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);  // If there's an error, consider the user unauthenticated
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
          </Route>
          <Route path="/dashboard">
            {isAuthenticated ? <Dashboard user={user} /> : <Redirect to="/" />}
          </Route>
          <Route path="/classroom/:id">
            {isAuthenticated ? <ClassroomView user={user} /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
