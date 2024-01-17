import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import TodoApp from './components/TodoApp';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import StartPage from './components/StartPage'; // Import StartPage

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className='App'>
        <header className='header'>
          <Navbar />
        </header>
        <Routes>
        <Route path="/" element={<StartPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegistrationForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/app" element={isAuthenticated ? <TodoApp /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
