import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png';

const NavigationBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const gotoProfile = () => {
    window.location.href = '/profile';
  };

  const gotoLogin = () => {
    window.location.href = '/login';
  };

  const gotoHome = () => {
    window.location.href = '/';
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() !== '') {
      window.location.href = `/search?query=${searchQuery}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={gotoHome}>
        <img src={logo} />
      </div>
      <div className='navbar-search'>
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
          />
          <button type="submit">Rechercher</button>
        </form>
      </div>
      <div className='navbar-redirect'>
        <ul className="navbar-links">
          <li><Link to="/selling" className="navbar-link">Achat</Link></li>
          <li><Link to="/location" className="navbar-link">Location</Link></li>
          {localStorage.getItem('token') ? (
            <li>
              <button onClick={gotoProfile} className="navbar-button">Profil</button>
            </li>
          ) : (
            <li>
              <button onClick={gotoLogin} className="navbar-button">Se connecter</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
