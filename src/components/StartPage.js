import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import logo from '../peach.png'

function StartPage({ setIsAuthenticated }) {
  return (
    <div>
      <h1 className='start-page-title'>Welcome to the Todo App</h1>
      <div className="forms-container">
        <RegistrationForm setIsAuthenticated={setIsAuthenticated} />
        <LoginForm setIsAuthenticated={setIsAuthenticated} />
      </div>
    </div>
  );
}

export default StartPage;
