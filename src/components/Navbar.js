import React from 'react';
import logo from '../peach.png';
function Navbar() {
  return (
    <nav className="Navbar">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>What's On The List?</h1>
    </nav>
  );
}

export default Navbar;
