import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Code, DollarSign, User, LogIn, LogOut, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const links = [
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/books', label: 'Books', icon: BookOpen },
    { to: '/my-class', label: 'My Class', icon: GraduationCap },
    { to: '/ide', label: 'IDE', icon: Code },
    { to: '/pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={() => setIsOpen(false)}>
            <Code size={32} />
            <span>yarichard-international</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-menu">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="sidebar-link"
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="sidebar-link"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="sidebar-link sidebar-button"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="sidebar-link"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="sidebar-cta"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
