import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes, FaCalendarCheck, FaUserShield, FaLock } from 'react-icons/fa';
import Logo from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currency, symbol, toggleCurrency } = useCurrency();
  const { admin, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Industries', path: '/industries' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Track Project', path: '/track' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky-top transition-all ${isScrolled ? 'shadow-sm' : ''}`}
      style={{
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid var(--navbar-border)`,
        zIndex: 1020,
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container py-2.5">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-3 text-decoration-none fw-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary bg-opacity-10 fw-semibold'
                      : 'text-secondary hover-text-primary'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontSize: '0.95rem',
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="d-flex align-items-center gap-2">
            {/* Currency Switcher Toggle */}
            <button
              type="button"
              onClick={toggleCurrency}
              className="btn btn-sm d-flex align-items-center justify-content-center px-2.5 py-1 rounded-pill fw-bold"
              style={{
                height: 38,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
              }}
              title={`Switch Currency (Current: ${currency === 'INR' ? '₹ INR' : '$ USD'})`}
              aria-label="Toggle currency"
            >
              <span className="text-primary me-1">{symbol}</span>
              <span>{currency}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 38,
                height: 38,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle visual theme"
            >
              {isDark ? <FaSun className="text-warning" size={16} /> : <FaMoon className="text-primary" size={15} />}
            </button>

            {/* Private Console Button - ONLY shown to already logged-in administrators / staff */}
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="btn btn-sm btn-primary d-none d-sm-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-sm fw-semibold"
                style={{ fontSize: '0.82rem' }}
                title="Go to Admin & Staff Dashboard"
              >
                <FaUserShield size={13} />
                <span>Console ({admin?.role === 'employee' ? 'Staff' : 'Owner'})</span>
              </Link>
            )}

            {/* Consultation CTA */}
            <Link
              to="/contact"
              className="btn btn-ry-primary btn-sm d-none d-sm-inline-flex px-3.5 py-2"
              style={{ fontSize: '0.9rem' }}
            >
              <FaCalendarCheck size={14} />
              <span>Get a Free Consultation</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn btn-sm d-lg-none d-flex align-items-center justify-content-center p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="d-lg-none pt-3 pb-4 border-top mt-2"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="d-flex flex-column gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-3 text-decoration-none fw-medium ${
                      isActive
                        ? 'text-primary bg-primary bg-opacity-10 fw-bold'
                        : 'text-secondary'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  })}
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-2 mt-2 border-top d-flex flex-column gap-2" style={{ borderColor: 'var(--border-color)' }}>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-ry-primary w-100 justify-content-center py-2.5"
                >
                  <FaCalendarCheck size={14} />
                  <span>Get a Free Consultation</span>
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-ry-secondary w-100 justify-content-center py-2"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <FaUserShield size={13} className="text-primary" />
                    <span>Go to Staff / Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
