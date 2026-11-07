import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaCheckCircle,
  FaKey,
} from 'react-icons/fa';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'request_access' | 'forgot_password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Staff Request Form State
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    title: 'Client Inquiries & Support Specialist',
  });

  // Password Recovery OTP State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newRecoveryPassword, setNewRecoveryPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(1);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
  }

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please provide your registered email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid credentials or account pending approval.');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!staffForm.name.trim() || !staffForm.email.trim() || !staffForm.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    if (staffForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/staff-request', staffForm);
      if (res.data?.success) {
        setSuccessMsg(
          res.data.message ||
            'Access request submitted! Owner Ranjan Yadav will review and approve your account.'
        );
        setStaffForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          title: 'Client Inquiries & Support Specialist',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Request submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryEmail.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email: recoveryEmail.trim() });
      setSuccessMsg(res.data?.message || 'A 6-digit recovery code has been sent from rywebsphere@gmail.com.');
      setRecoveryStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryOtp.trim() || !newRecoveryPassword) {
      setError('Please enter both the OTP code and new password.');
      return;
    }

    if (newRecoveryPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        email: recoveryEmail.trim(),
        otp: recoveryOtp.trim(),
        newPassword: newRecoveryPassword,
      });
      setSuccessMsg(res.data?.message || 'Password reset successfully! You can now sign in.');
      setMode('login');
      setEmail(recoveryEmail);
      setRecoveryStep(1);
      setRecoveryOtp('');
      setNewRecoveryPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-100" style={{ maxWidth: 460 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Logo size="large" className="mb-3" />
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Agency Staff & Admin Gateway
          </h4>
          <p className="text-muted small">
            Official RY WebSphere administrative control & employee CRM portal.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="d-flex rounded-3 p-1 mb-3" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`btn btn-sm flex-grow-1 rounded-2 py-2 fw-semibold transition-all ${
              mode === 'login'
                ? 'btn-primary text-white shadow-sm'
                : 'text-muted hover-text-primary'
            }`}
          >
            <FaLock className="me-1.5" size={12} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('request_access');
              setError('');
              setSuccessMsg('');
            }}
            className={`btn btn-sm flex-grow-1 rounded-2 py-2 fw-semibold transition-all ${
              mode === 'request_access'
                ? 'btn-primary text-white shadow-sm'
                : 'text-muted hover-text-primary'
            }`}
          >
            <FaUserPlus className="me-1.5" size={12} />
            Request Staff Access
          </button>
        </div>

        {/* Main Form Card */}
        <div
          className="ry-card p-4 rounded-4 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 small mb-3">
              <FaExclamationCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2.5 px-3 rounded-3 d-flex align-items-start gap-2 small mb-3">
              <FaCheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' && (
            /* Mode 1: Login Form */
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    className="form-control-ry ps-5"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <FaEnvelope className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={14} />
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label small fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-link p-0 text-muted small text-decoration-none"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {showPassword ? (
                      <>
                        <FaEyeSlash size={12} className="me-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <FaEye size={12} className="me-1" />
                        Show
                      </>
                    )}
                  </button>
                </div>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control-ry ps-5 pe-5"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <FaLock className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={14} />
                </div>
              </div>

              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setRecoveryEmail(email);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="btn btn-link p-0 text-muted small text-decoration-none hover-text-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Forgot Password? (Recover via OTP)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-ry-primary w-100 py-2.5 fw-bold justify-content-center"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Log In to Dashboard</span>
                )}
              </button>
            </form>
          )}

          {mode === 'request_access' && (
            /* Mode 2: Request Staff Access Form */
            <form onSubmit={handleRequestSubmit}>
              <p className="small text-muted mb-3">
                Newly hired employees can submit their details here. Your account will become active once <strong>Ranjan Yadav (Owner)</strong> approves your request.
              </p>

              <div className="mb-2.5">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control-ry"
                  placeholder="e.g. Aman Verma"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2.5">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Work / Personal Email *
                </label>
                <input
                  type="email"
                  className="form-control-ry"
                  placeholder="e.g. employee@domain.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2.5">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  className="form-control-ry"
                  placeholder="+91 98765 43210"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                />
              </div>

              <div className="mb-2.5">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Job Role / Title
                </label>
                <input
                  type="text"
                  className="form-control-ry"
                  placeholder="e.g. Client Inquiries & Support Specialist"
                  value={staffForm.title}
                  onChange={(e) => setStaffForm({ ...staffForm, title: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                  Choose Account Password *
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control-ry ps-5"
                    placeholder="Minimum 6 characters"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <FaLock className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={14} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-ry-primary w-100 py-2.5 fw-bold justify-content-center"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Submit Request for Approval</span>
                )}
              </button>
            </form>
          )}

          {mode === 'forgot_password' && (
            /* Mode 3: Forgot Password OTP Recovery */
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaKey className="text-primary" size={16} />
                <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                  Password Recovery via Email OTP
                </h6>
              </div>
              <p className="small text-muted mb-3">
                Enter your registered email address to receive an official 6-digit recovery code sent from <strong>rywebsphere@gmail.com</strong>.
              </p>

              {recoveryStep === 1 ? (
                <form onSubmit={handleRequestOtp}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      Registered Email Address
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control-ry ps-5"
                        placeholder="Enter your registered email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                      <FaEnvelope className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={14} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-ry-primary w-100 py-2.5 fw-bold justify-content-center mb-2"
                  >
                    {loading ? 'Dispatching OTP Code...' : 'Send Recovery OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="btn btn-outline-secondary w-100 py-2 small"
                  >
                    Back to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      className="form-control-ry text-center fw-bold fs-5 font-monospace"
                      placeholder="123456"
                      maxLength={6}
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <div className="form-text small text-muted text-center mt-1">
                      Check your inbox at <strong>{recoveryEmail}</strong> (sent from rywebsphere@gmail.com)
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      New Password (min 6 characters)
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control-ry ps-5"
                        placeholder="••••••••••••"
                        value={newRecoveryPassword}
                        onChange={(e) => setNewRecoveryPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <FaLock className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={14} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-ry-primary w-100 py-2.5 fw-bold justify-content-center mb-2"
                  >
                    {loading ? 'Resetting Password...' : 'Verify OTP & Reset Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="btn btn-link text-muted small w-100 text-decoration-none"
                  >
                    Didn't get code? Resend OTP
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="d-flex align-items-center justify-content-center gap-1.5 mt-4 pt-3 border-top text-muted small" style={{ borderColor: 'var(--border-color)', fontSize: '0.78rem' }}>
            <FaShieldAlt className="text-success" size={13} />
            <span>256-Bit SSL Encrypted • Official rywebsphere@gmail.com Service</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <Link to="/" className="text-muted small text-decoration-none hover-text-primary">
            ← Return to RY WebSphere Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
