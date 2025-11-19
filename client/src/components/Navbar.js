import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Athena Nexus
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/challenges" className="navbar-link">Challenges</Link>
          <Link to="/gallery" className="navbar-link">Gallery</Link>
          <Link to="/about" className="navbar-link">About</Link>
          
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              {isAdmin && (
                <Link to="/admin" className="navbar-link">Admin</Link>
              )}
              <span className="navbar-link" style={{ color: 'var(--text-secondary)' }}>
                {user?.displayName || user?.username}
              </span>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

