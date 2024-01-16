import React from 'react';
import logo from '../peach.png';
function Navbar() {
  return (
    <nav className="Navbar">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>What I gotta do.</h1>
    </nav>
  );
}

export default Navbar;
