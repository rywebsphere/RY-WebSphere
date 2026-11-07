import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaTimes,
  FaShieldAlt,
  FaCrown,
  FaBriefcase,
  FaArrowRight,
  FaSignOutAlt,
  FaUserShield,
  FaBolt,
  FaLock,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const AdminQuickAccessModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { admin, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  // Listen for global Alt+A shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + A (or Ctrl + Shift + A)
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-admin-portal', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-admin-portal', handleCustomOpen);
    };
  }, [isOpen]);

  const handleQuickLogin = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const res = await login(email, password);
      if (res.success) {
        setIsOpen(false);
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="ry-card p-4 rounded-4 shadow-2xl w-100 position-relative animate__animated animate__fadeInUp animate__faster"
        style={{
          maxWidth: 480,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="btn btn-sm text-muted position-absolute top-0 end-0 m-3 p-2"
          aria-label="Close"
        >
          <FaTimes size={16} />
        </button>

        {/* Modal Header */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="p-2 rounded-3 bg-primary bg-opacity-20 text-primary d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40 }}
          >
            <FaUserShield size={20} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
              RY WebSphere Portal Access
            </h5>
            <span className="small text-muted">Owner & Employee Quick Navigation</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3">
            {error}
          </div>
        )}

        {isAuthenticated ? (
          /* When Already Authenticated */
          <div>
            <div
              className="p-3 rounded-3 mb-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="small text-muted">Currently Logged In As</span>
                <span
                  className={`badge ${
                    admin?.role === 'superadmin'
                      ? 'bg-primary'
                      : admin?.role === 'admin'
                      ? 'bg-info'
                      : 'bg-success'
                  } text-white`}
                  style={{ fontSize: '0.68rem' }}
                >
                  {admin?.role === 'superadmin' ? '👑 Owner' : admin?.role === 'admin' ? 'Co-Admin' : '💼 Employee'}
                </span>
              </div>
              <div className="fw-bold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {admin?.name}
              </div>
              <div className="small text-muted">{admin?.email}</div>
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/dashboard');
                }}
                className="btn btn-ry-primary btn-sm w-100 py-2.5 justify-content-between px-3 fw-bold"
              >
                <span>Go to Dashboard</span>
                <FaArrowRight size={12} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/enquiries');
                }}
                className="btn btn-ry-secondary btn-sm w-100 py-2.5 justify-content-between px-3"
              >
                <span>View Incoming Inquiries</span>
                <FaArrowRight size={12} />
              </button>

              {(admin?.role === 'superadmin' || admin?.role === 'admin') && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/team');
                  }}
                  className="btn btn-ry-secondary btn-sm w-100 py-2.5 justify-content-between px-3"
                >
                  <span>Manage Team / Employees</span>
                  <FaArrowRight size={12} />
                </button>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
              <span className="small text-muted">Shortcut: <strong>Alt + A</strong></span>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline-danger btn-sm py-1 px-3 d-flex align-items-center gap-1.5"
                style={{ fontSize: '0.8rem' }}
              >
                <FaSignOutAlt size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* When NOT Authenticated - Secure Login Prompt */
          <div>
            <p className="small text-muted mb-3">
              Restricted portal gateway. Please enter your authorized agency email and password to access the console.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const emailVal = form.email.value;
                const passVal = form.password.value;
                await handleQuickLogin(emailVal, passVal);
              }}
              className="mb-3"
            >
              <div className="mb-2.5">
                <input
                  type="email"
                  name="email"
                  className="form-control-ry py-2"
                  placeholder="Enter email (e.g. yadavranjan1626@gmail.com)"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control-ry py-2"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-ry-primary btn-sm w-100 py-2.5 fw-bold justify-content-center"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
              <span className="small text-muted">Shortcut: <strong>Alt + A</strong></span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/login');
                }}
                className="btn btn-ry-secondary btn-sm py-1.5 px-3"
                style={{ fontSize: '0.82rem' }}
              >
                <FaLock className="me-1" size={11} />
                <span>Full Login Page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuickAccessModal;
