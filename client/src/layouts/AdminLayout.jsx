import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FaChartPie,
  FaInbox,
  FaUsers,
  FaFolderOpen,
  FaLayerGroup,
  FaTag,
  FaCommentDots,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUserShield,
  FaBriefcase,
  FaSearchLocation,
  FaCrosshairs,
  FaCheckCircle,
  FaChevronDown,
} from 'react-icons/fa';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const { admin, logout, updateWorkStatus } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(admin?.workStatus || 'active');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    if (admin?.workStatus) {
      setCurrentStatus(admin.workStatus);
    }
  }, [admin?.workStatus]);

  // Close status dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      setCurrentStatus(newStatus);
      setStatusDropdownOpen(false);
      if (updateWorkStatus) {
        await updateWorkStatus(newStatus);
      }
    } catch (err) {
      console.warn('Status change error:', err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isOwnerOrAdmin = admin?.role === 'superadmin' || admin?.role === 'admin';

  const allNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaChartPie, allowed: true },
    { name: 'Smart Lead Finder', path: '/admin/lead-finder', icon: FaSearchLocation, allowed: true },
    { name: 'Outreach CRM Leads', path: '/admin/leads', icon: FaCrosshairs, allowed: true },
    { name: 'Client Inquiries', path: '/admin/enquiries', icon: FaInbox, allowed: true },
    { name: 'Team & Employees', path: '/admin/team', icon: FaUsers, allowed: isOwnerOrAdmin },
    { name: 'Projects', path: '/admin/projects', icon: FaFolderOpen, allowed: true },
    { name: 'Services', path: '/admin/services', icon: FaLayerGroup, allowed: true },
    { name: 'Pricing Packages', path: '/admin/pricing', icon: FaTag, allowed: true },
    { name: 'Testimonials', path: '/admin/testimonials', icon: FaCommentDots, allowed: true },
    { name: 'Website Settings', path: '/admin/settings', icon: FaCog, allowed: isOwnerOrAdmin },
  ];

  const navItems = allNavItems.filter((item) => item.allowed);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar - Desktop */}
      <aside
        className={`d-none d-lg-flex flex-column p-3 border-end`}
        style={{
          width: 270,
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 1020,
        }}
      >
        <div className="pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-color)' }}>
          <Logo size="normal" />
          <div className="mt-2 d-flex align-items-center gap-1.5 small text-muted">
            {admin?.role === 'employee' ? (
              <>
                <FaBriefcase size={12} className="text-success" />
                <span className="text-success fw-medium">Staff & CRM Portal</span>
              </>
            ) : (
              <>
                <FaUserShield size={12} className="text-primary" />
                <span>Admin & Owner Console</span>
              </>
            )}
          </div>
        </div>

        <nav className="nav flex-column gap-1 flex-grow-1" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover-text-primary'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
                })}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2 px-2 small">
            <div className="d-flex align-items-center gap-1.5 text-truncate" style={{ maxWidth: 160 }}>
              <span
                className={`rounded-circle d-inline-block flex-shrink-0 ${
                  currentStatus === 'active'
                    ? 'bg-success'
                    : currentStatus === 'away'
                    ? 'bg-warning'
                    : 'bg-secondary'
                }`}
                style={{ width: 8, height: 8 }}
                title={`Status: ${currentStatus}`}
              />
              <span className="text-muted text-truncate" style={{ maxWidth: 140 }}>
                {admin?.email}
              </span>
            </div>
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
              {admin?.role === 'superadmin' ? 'Owner' : admin?.role === 'admin' ? 'Admin' : 'Employee'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <FaSignOutAlt size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden">
        {/* Top Navbar */}
        <header
          className="py-2.5 px-4 d-flex align-items-center justify-content-between border-bottom"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            zIndex: 1010,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-sm d-lg-none p-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              aria-label="Toggle Navigation"
            >
              <FaBars size={16} />
            </button>
            <div>
              <span className="fw-semibold text-primary">RY WebSphere Portal</span>
              <span className="text-muted ms-2 small d-none d-md-inline">
                • Logged in as <strong>{admin?.name || 'Ranjan Yadav'}</strong> (
                {admin?.role === 'superadmin' ? 'Agency Owner' : admin?.role === 'admin' ? 'Administrator' : 'Staff Member'}
                )
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Live Employee Work Status Switcher (React State Controlled) */}
            <div className="position-relative" ref={statusDropdownRef}>
              <button
                className={`btn btn-sm d-flex align-items-center gap-2 fw-bold px-3 py-1.5 rounded-pill shadow-sm border ${
                  currentStatus === 'active'
                    ? 'btn-outline-success text-success bg-success bg-opacity-10 border-success'
                    : currentStatus === 'away'
                    ? 'btn-outline-warning text-warning bg-warning bg-opacity-10 border-warning'
                    : 'btn-outline-secondary text-secondary bg-surface'
                }`}
                type="button"
                id="workStatusDropdown"
                onClick={() => setStatusDropdownOpen((prev) => !prev)}
                style={{ fontSize: '0.82rem', cursor: 'pointer' }}
                disabled={statusUpdating}
                title="Click to toggle your live shift status (Active / Away / Off Duty)"
              >
                <span
                  className={`rounded-circle d-inline-block ${
                    currentStatus === 'active'
                      ? 'bg-success animate-pulse'
                      : currentStatus === 'away'
                      ? 'bg-warning'
                      : 'bg-secondary'
                  }`}
                  style={{ width: 9, height: 9 }}
                />
                <span>
                  {currentStatus === 'active'
                    ? '🟢 Active'
                    : currentStatus === 'away'
                    ? '🟡 Away'
                    : '🔴 Off Duty'}
                </span>
                <FaChevronDown size={9} className="opacity-75 ms-0.5" />
              </button>

              {statusDropdownOpen && (
                <div
                  className="shadow-lg rounded-3 p-1 position-absolute end-0"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    minWidth: 215,
                    zIndex: 1080,
                    top: 'calc(100% + 6px)',
                  }}
                >
                  <div
                    className="px-3 py-1.5 text-muted small fw-bold text-uppercase border-bottom mb-1"
                    style={{ fontSize: '0.66rem', letterSpacing: '0.05em', borderColor: 'var(--border-color)' }}
                  >
                    Set My Shift Status
                  </div>

                  <button
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-between rounded-2 py-2 px-3 small border-0 mb-1 text-start ${
                      currentStatus === 'active'
                        ? 'bg-success bg-opacity-15 text-success fw-bold'
                        : 'text-body'
                    }`}
                    type="button"
                    onClick={() => handleStatusChange('active')}
                    style={{ color: currentStatus === 'active' ? '#10b981' : 'var(--text-primary)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-circle p-1"> </span>
                      <span>Active (Working)</span>
                    </div>
                    {currentStatus === 'active' && <FaCheckCircle size={12} className="text-success" />}
                  </button>

                  <button
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-between rounded-2 py-2 px-3 small border-0 mb-1 text-start ${
                      currentStatus === 'away'
                        ? 'bg-warning bg-opacity-15 text-warning fw-bold'
                        : 'text-body'
                    }`}
                    type="button"
                    onClick={() => handleStatusChange('away')}
                    style={{ color: currentStatus === 'away' ? '#f59e0b' : 'var(--text-primary)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-warning rounded-circle p-1"> </span>
                      <span>Away (On Break)</span>
                    </div>
                    {currentStatus === 'away' && <FaCheckCircle size={12} className="text-warning" />}
                  </button>

                  <div className="border-top my-1" style={{ borderColor: 'var(--border-color)' }} />

                  <button
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-between rounded-2 py-2 px-3 small border-0 text-start ${
                      currentStatus === 'off_duty'
                        ? 'bg-danger bg-opacity-15 text-danger fw-bold'
                        : 'text-body'
                    }`}
                    type="button"
                    onClick={() => handleStatusChange('off_duty')}
                    style={{ color: currentStatus === 'off_duty' ? '#ef4444' : 'var(--text-primary)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-secondary rounded-circle p-1"> </span>
                      <span>Off Duty (End Shift)</span>
                    </div>
                    {currentStatus === 'off_duty' && <FaCheckCircle size={12} className="text-danger" />}
                  </button>
                </div>
              )}
            </div>

            {/* View Live Public Site */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ry-secondary btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
              style={{ fontSize: '0.85rem' }}
            >
              <span>View Live Site</span>
              <FaExternalLinkAlt size={11} />
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Toggle theme"
            >
              {isDark ? <FaSun className="text-warning" size={15} /> : <FaMoon className="text-primary" size={14} />}
            </button>

            {/* Logout Mobile */}
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger d-lg-none"
              title="Sign Out"
            >
              <FaSignOutAlt size={14} />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {sidebarOpen && (
          <div
            className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="h-100 p-4 d-flex flex-column"
              style={{
                width: 280,
                backgroundColor: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-color)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <Logo size="normal" />
                <button
                  type="button"
                  className="btn btn-sm text-secondary"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <nav className="nav flex-column gap-1 flex-grow-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-secondary'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
                      })}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                {/* Mobile Work Status Switcher */}
                <div className="mb-3">
                  <div className="text-muted small fw-bold text-uppercase mb-2" style={{ fontSize: '0.68rem' }}>
                    Shift Status ({currentStatus})
                  </div>
                  <div className="d-flex gap-1.5">
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('active')}
                      className={`btn btn-sm flex-grow-1 p-1.5 ${
                        currentStatus === 'active' ? 'btn-success fw-bold' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      🟢 Active
                    </button>
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('away')}
                      className={`btn btn-sm flex-grow-1 p-1.5 ${
                        currentStatus === 'away' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      🟡 Away
                    </button>
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange('off_duty')}
                      className={`btn btn-sm flex-grow-1 p-1.5 ${
                        currentStatus === 'off_duty' ? 'btn-secondary text-white fw-bold' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      🔴 Off
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSignOutAlt size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Area */}
        <main className="flex-grow-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
