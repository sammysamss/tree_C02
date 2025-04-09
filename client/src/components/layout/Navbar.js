import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-tree"></i>
          <span>TreeTrack RFID</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-tree" className="nav-links">
              Add Tree
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;