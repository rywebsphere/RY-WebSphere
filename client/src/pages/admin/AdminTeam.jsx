import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaTrash,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
  FaBriefcase,
  FaEnvelope,
  FaPhoneAlt,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaClock,
  FaHistory,
  FaTrophy,
  FaRedo,
  FaTimes,
  FaCalendarDay,
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Helper: Format minutes into "Xh Ym"
const formatMinutes = (mins) => {
  if (!mins || mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

// Helper: Format ISO timestamp to readable time string "10:15 AM"
const formatTimeOnly = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '—';
  }
};

const AdminTeam = () => {
  const { admin: currentUser, updateWorkStatus } = useAuth();

  // Active Tab: 'monitor' (Live Shift & Performance) or 'directory' (Accounts & Permissions)
  const [activeTab, setActiveTab] = useState('monitor');

  // Directory state
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Live Shift Monitoring state
  const [monitoringData, setMonitoringData] = useState(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Attendance History Modal state
  const [historyModalMember, setHistoryModalMember] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add Member form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    title: 'Client Inquiries & Support Specialist',
    phone: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Directory Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/team');
      if (res.data?.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching team members:', err.message);
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Live Shift & Attendance Monitoring
  const fetchMonitoringData = async () => {
    try {
      setMonitoringLoading(true);
      const res = await api.get('/admin/team/monitoring');
      if (res.data?.success) {
        setMonitoringData(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.warn('Error fetching monitoring data:', err.message);
    } finally {
      setMonitoringLoading(false);
    }
  };

  // Quick switch status directly from Team Monitoring page
  const handleQuickStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      if (updateWorkStatus) {
        await updateWorkStatus(newStatus);
      }
      await fetchMonitoringData();
    } catch (err) {
      console.warn('Status change err:', err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMembers();
    fetchMonitoringData();

    // Auto-refresh live monitoring every 45 seconds
    const interval = setInterval(() => {
      fetchMonitoringData();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Fetch specific employee shift history
  const openHistoryModal = async (member) => {
    setHistoryModalMember(member);
    setHistoryLoading(true);
    try {
      const memberId = member._id || member.id;
      const res = await api.get(`/admin/team/${memberId}/attendance`);
      if (res.data?.success) {
        setHistoryRecords(res.data.history || []);
      }
    } catch (err) {
      alert(`Could not load shift history: ${err.message}`);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFeedback({ type: 'danger', text: 'Name, email, and password are required.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/admin/team', formData);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: `Employee account "${res.data.data.name}" created successfully! They can now log in at /admin/login.`,
        });
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'employee',
          title: 'Client Inquiries & Support Specialist',
          phone: '',
        });
        setShowAddModal(false);
        fetchMembers();
        fetchMonitoringData();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (member) => {
    if (member.role === 'superadmin') {
      alert('The primary owner account cannot be deactivated.');
      return;
    }

    const action = member.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${member.name}'s account?`)) {
      return;
    }

    try {
      const res = await api.put(`/admin/team/${member._id}`, { isActive: !member.isActive });
      if (res.data?.success) {
        setMembers((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isActive: !member.isActive } : m))
        );
        setFeedback({
          type: 'success',
          text: `Account for ${member.name} is now ${!member.isActive ? 'Active' : 'Deactivated'}.`,
        });
        fetchMonitoringData();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    }
  };

  const handleApprove = async (member) => {
    try {
      const res = await api.put(`/admin/team/${member._id}`, { status: 'approved' });
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: `Account for "${member.name}" has been APPROVED! They can now log in to the employee CRM portal.`,
        });
        fetchMembers();
        fetchMonitoringData();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    }
  };

  const handleReject = async (member) => {
    if (!window.confirm(`Are you sure you want to reject the staff request from ${member.name}?`)) return;
    try {
      const res = await api.put(`/admin/team/${member._id}`, { status: 'rejected' });
      if (res.data?.success) {
        setFeedback({
          type: 'warning',
          text: `Access request from "${member.name}" was rejected.`,
        });
        fetchMembers();
        fetchMonitoringData();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedMember || !newPassword.trim() || newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/admin/team/${selectedMember._id}`, { newPassword: newPassword.trim() });
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: `Password updated successfully for ${selectedMember.name}.`,
        });
        setShowPasswordModal(false);
        setSelectedMember(null);
        setNewPassword('');
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (member) => {
    if (member.role === 'superadmin') {
      alert('The primary owner account cannot be deleted.');
      return;
    }
    if (member._id === currentUser?.id) {
      alert('You cannot delete your own active account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete employee account "${member.name}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/team/${member._id}`);
      if (res.data?.success) {
        setMembers((prev) => prev.filter((m) => m._id !== member._id));
        setFeedback({
          type: 'success',
          text: `Account for "${member.name}" deleted successfully.`,
        });
        fetchMonitoringData();
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || err.message });
    }
  };

  const totalEmployees = members.filter((m) => m.role === 'employee').length;
  const activeMembers = members.filter((m) => m.isActive !== false && m.status !== 'pending_approval').length;
  const pendingMembers = members.filter((m) => m.status === 'pending_approval');
  const summary = monitoringData?.summary;

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '0.78rem' }}>
              <FaUsers className="me-1" /> Staff Management & Shift Monitor
            </span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Employee Shifts, Attendance & Performance
          </h2>
          <p className="text-muted small mb-0">
            Monitor real-time login/logout times, active working hours, employee work statuses, and closed client deals.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Tab Switcher Buttons */}
          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('monitor')}
              className={`btn px-3 py-2 fw-bold d-flex align-items-center gap-2 ${
                activeTab === 'monitor' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
            >
              <FaClock size={13} />
              <span>Live Shift Monitor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`btn px-3 py-2 fw-bold d-flex align-items-center gap-2 ${
                activeTab === 'directory' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
            >
              <FaUsers size={13} />
              <span>Team Directory</span>
              {pendingMembers.length > 0 && (
                <span className="badge bg-warning text-dark rounded-pill ms-1">
                  {pendingMembers.length}
                </span>
              )}
            </button>
          </div>

          {/* Add Employee Button */}
          <button
            type="button"
            onClick={() => {
              setFeedback({ type: '', text: '' });
              setShowAddModal(true);
            }}
            className="btn btn-ry-primary btn-sm px-3.5 py-2 fw-semibold d-flex align-items-center gap-1.5"
          >
            <FaUserPlus size={14} />
            <span className="d-none d-sm-inline">Hire Employee</span>
          </button>
        </div>
      </div>

      {/* Alert feedback */}
      {feedback.text && (
        <div
          className={`alert alert-${feedback.type} py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 small mb-4`}
        >
          {feedback.type === 'success' ? <FaCheckCircle size={15} /> : <FaExclamationCircle size={15} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Pending Access Requests Banner for Owner */}
      {pendingMembers.length > 0 && (
        <div
          className="ry-card p-4 rounded-4 mb-4 border border-warning"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark fw-bold">
                {pendingMembers.length} Action Required
              </span>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                New Employee Access Requests Awaiting Your Approval
              </h5>
            </div>
          </div>
          <p className="small text-muted mb-3">
            The following individuals requested access to your employee CRM portal. Click <strong>Approve</strong> to activate their account and allow them to view client inquiries.
          </p>
          <div className="row g-3">
            {pendingMembers.map((pm) => (
              <div key={pm._id} className="col-lg-6">
                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-3"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                      {pm.name}
                    </div>
                    <div className="small text-muted">{pm.email} • {pm.phone || 'No phone'}</div>
                    <div className="small text-primary">{pm.title || 'Client Inquiries Specialist'}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(pm)}
                      className="btn btn-success btn-sm px-3 fw-bold"
                    >
                      <FaCheckCircle className="me-1" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(pm)}
                      className="btn btn-outline-danger btn-sm px-2.5"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: LIVE SHIFT & PERFORMANCE MONITOR */}
      {/* ========================================================================= */}
      {activeTab === 'monitor' && (
        <div>
          {/* Quick Work Status Bar for Current User */}
          <div
            className="ry-card p-3 rounded-4 mb-4 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor:
                      (currentUser?.workStatus || 'active') === 'active'
                        ? '#10b981'
                        : (currentUser?.workStatus || 'active') === 'away'
                        ? '#f59e0b'
                        : '#6b7280',
                  }}
                >
                  {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                      {currentUser?.name || 'My Profile'} &mdash; Work Status:
                    </span>
                    <span
                      className={`badge px-2.5 py-1 ${
                        (currentUser?.workStatus || 'active') === 'active'
                          ? 'bg-success text-white'
                          : (currentUser?.workStatus || 'active') === 'away'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                    >
                      {(currentUser?.workStatus || 'active') === 'active'
                        ? '🟢 Active (Working Now)'
                        : (currentUser?.workStatus || 'active') === 'away'
                        ? '🟡 Away (On Break)'
                        : '🔴 Off Duty (Shift Ended)'}
                    </span>
                    {statusUpdating && (
                      <span className="text-muted small ms-2 animate-pulse">Updating status...</span>
                    )}
                  </div>
                  <div className="text-muted small mt-0.5">
                    Click any status button below to switch your live shift state. Your daily hours and break time are recorded automatically.
                  </div>
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatusChange('active')}
                  className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-3 transition-all ${
                    (currentUser?.workStatus || 'active') === 'active'
                      ? 'btn-success fw-bold shadow-sm'
                      : 'btn-outline-success'
                  }`}
                  title="Mark yourself as Active & Working"
                >
                  <span className="badge rounded-circle bg-white p-1" />
                  <span>🟢 Active</span>
                </button>

                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatusChange('away')}
                  className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-3 transition-all ${
                    (currentUser?.workStatus || 'active') === 'away'
                      ? 'btn-warning text-dark fw-bold shadow-sm'
                      : 'btn-outline-warning text-warning'
                  }`}
                  title="Mark yourself as Away / On Break"
                >
                  <span className="badge rounded-circle bg-dark p-1" />
                  <span>🟡 Away (Break)</span>
                </button>

                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatusChange('off_duty')}
                  className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-3 transition-all ${
                    (currentUser?.workStatus || 'active') === 'off_duty'
                      ? 'btn-secondary text-white fw-bold shadow-sm'
                      : 'btn-outline-secondary'
                  }`}
                  title="Mark yourself as Off Duty"
                >
                  <span className="badge rounded-circle bg-white p-1" />
                  <span>🔴 Off Duty</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shift Monitoring KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">TOTAL STAFF</div>
                <div className="fs-4 fw-extrabold text-primary">{summary?.totalStaff || members.length}</div>
              </div>
            </div>

            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">WORKING NOW</div>
                <div className="fs-4 fw-extrabold text-success d-flex align-items-center justify-content-center gap-1.5">
                  <span className="badge rounded-circle bg-success p-1 animate-pulse" />
                  <span>{summary?.activeNow || 0}</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">ON BREAK (AWAY)</div>
                <div className="fs-4 fw-extrabold text-warning">{summary?.awayNow || 0}</div>
              </div>
            </div>

            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">OFF DUTY</div>
                <div className="fs-4 fw-extrabold text-secondary">{summary?.offDutyNow || 0}</div>
              </div>
            </div>

            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">DEALS CONVERTED</div>
                <div className="fs-4 fw-extrabold text-success">{summary?.totalDealsClosed || 0}</div>
              </div>
            </div>

            <div className="col-6 col-md-4 col-xl-2">
              <div className="ry-card p-3 rounded-3 text-center h-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-muted small fw-bold mb-1">OUTREACH LOGS</div>
                <div className="fs-4 fw-extrabold text-info">{summary?.totalContactAttempts || 0}</div>
              </div>
            </div>
          </div>

          {/* Live Staff Monitor Table Card */}
          <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Today's Live Shift & Attendance Board
                </h5>
                <span className="text-muted small">
                  Auto-refreshes every 45s. Login time, logout time, active working hours, and deals closed are tracked live.
                </span>
              </div>
              <button
                type="button"
                onClick={fetchMonitoringData}
                disabled={monitoringLoading}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
                title="Refresh live monitoring"
              >
                <FaRedo size={12} className={monitoringLoading ? 'animate-spin' : ''} />
                <span>Refresh Live</span>
                <span className="text-muted small ms-1" style={{ fontSize: '0.7rem' }}>
                  ({formatTimeOnly(lastRefreshed)})
                </span>
              </button>
            </div>

            {monitoringLoading && !monitoringData ? (
              <LoadingSpinner text="Retrieving live shifts and staff activities..." />
            ) : (
              <div className="table-responsive">
                <table className="table ry-table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Employee / Staff</th>
                      <th>Work Status</th>
                      <th>Today Login</th>
                      <th>Today Logout</th>
                      <th>Working Hours Today</th>
                      <th>Deals Converted</th>
                      <th>Outreach Made</th>
                      <th className="text-end">Shift History</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoringData?.members?.map((m) => (
                      <tr key={m._id}>
                        {/* Member */}
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                              style={{
                                width: 38,
                                height: 38,
                                backgroundColor:
                                  m.role === 'superadmin'
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(16, 185, 129, 0.2)',
                                color: m.role === 'superadmin' ? 'var(--accent-blue)' : '#10b981',
                                fontSize: '0.9rem',
                              }}
                            >
                              {m.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold text-white d-flex align-items-center gap-1.5">
                                <span>{m.name}</span>
                                {m.role === 'superadmin' && (
                                  <span className="badge bg-primary bg-opacity-20 text-primary" style={{ fontSize: '0.65rem' }}>
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="small text-muted">{m.title || (m.role === 'employee' ? 'Staff Member' : 'Admin')}</div>
                            </div>
                          </div>
                        </td>

                        {/* Live Work Status */}
                        <td>
                          {m.workStatus === 'active' ? (
                            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 px-2.5 py-1 rounded-pill small fw-bold d-inline-flex align-items-center gap-1.5">
                              <span className="badge rounded-circle bg-success p-1 animate-pulse" />
                              <span>Active / Working</span>
                            </span>
                          ) : m.workStatus === 'away' ? (
                            <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 px-2.5 py-1 rounded-pill small fw-bold d-inline-flex align-items-center gap-1.5">
                              <span className="badge rounded-circle bg-warning p-1" />
                              <span>Away / Break</span>
                            </span>
                          ) : (
                            <span className="badge bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-30 px-2.5 py-1 rounded-pill small fw-bold d-inline-flex align-items-center gap-1.5">
                              <span className="badge rounded-circle bg-secondary p-1" />
                              <span>Off Duty</span>
                            </span>
                          )}
                        </td>

                        {/* Login Time */}
                        <td>
                          {m.todayLoginTime ? (
                            <div className="d-flex align-items-center gap-1 text-light small fw-medium">
                              <FaClock size={11} className="text-success" />
                              <span>{formatTimeOnly(m.todayLoginTime)}</span>
                            </div>
                          ) : (
                            <span className="text-muted small">— Not Logged In</span>
                          )}
                        </td>

                        {/* Logout Time */}
                        <td>
                          {m.todayLogoutTime ? (
                            <div className="d-flex align-items-center gap-1 text-secondary small fw-medium">
                              <FaClock size={11} className="text-muted" />
                              <span>{formatTimeOnly(m.todayLogoutTime)}</span>
                            </div>
                          ) : m.workStatus === 'active' || m.workStatus === 'away' ? (
                            <span className="badge bg-primary bg-opacity-15 text-primary small">Working...</span>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>

                        {/* Working Hours Today */}
                        <td>
                          <div className="d-flex align-items-center gap-1.5">
                            <span className="fw-bold fs-6" style={{ color: m.todayActiveMinutes > 0 ? '#10b981' : 'var(--text-secondary)' }}>
                              {formatMinutes(m.todayActiveMinutes)}
                            </span>
                            {m.todayAwayMinutes > 0 && (
                              <span className="badge bg-warning bg-opacity-15 text-warning small" style={{ fontSize: '0.68rem' }}>
                                ({formatMinutes(m.todayAwayMinutes)} break)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Closed Leads */}
                        <td>
                          {m.closedLeadsCount > 0 ? (
                            <span className="badge bg-success px-2.5 py-1 rounded-pill fw-bold">
                              <FaTrophy className="me-1" size={10} /> {m.closedLeadsCount} Deals Closed
                            </span>
                          ) : (
                            <span className="text-muted small">0 Deals</span>
                          )}
                        </td>

                        {/* Outreach Made */}
                        <td>
                          <span className="small text-secondary fw-semibold">
                            📞 {m.contactAttemptsCount || 0} contacted
                          </span>
                        </td>

                        {/* Shift History Button */}
                        <td className="text-end">
                          <button
                            type="button"
                            onClick={() => openHistoryModal(m)}
                            className="btn btn-outline-secondary btn-sm px-2.5 py-1 small d-inline-flex align-items-center gap-1"
                            title="View past attendance & shifts"
                          >
                            <FaHistory size={11} />
                            <span>Shift History</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TEAM DIRECTORY & ACCOUNT MANAGEMENT (EXISTING CRUD) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div>
          {/* Team KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4 col-sm-6">
              <div className="ry-card p-3.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small text-muted fw-semibold">Total Team Members</span>
                  <div
                    className="p-2 rounded-2"
                    style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--accent-blue)' }}
                  >
                    <FaUsers size={16} />
                  </div>
                </div>
                <div className="display-6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {members.length}
                </div>
                <span className="small text-muted">Registered administrators and staff</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="ry-card p-3.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small text-muted fw-semibold">Hired Staff / Employees</span>
                  <div
                    className="p-2 rounded-2"
                    style={{ backgroundColor: 'var(--bg-surface)', color: '#10b981' }}
                  >
                    <FaBriefcase size={16} />
                  </div>
                </div>
                <div className="display-6 fw-bold mb-1" style={{ color: '#10b981' }}>
                  {totalEmployees}
                </div>
                <span className="small text-muted">Have access to view and reply to queries</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="ry-card p-3.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small text-muted fw-semibold">Active Portal Accounts</span>
                  <div
                    className="p-2 rounded-2"
                    style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--accent-violet)' }}
                  >
                    <FaUserCheck size={16} />
                  </div>
                </div>
                <div className="display-6 fw-bold mb-1" style={{ color: 'var(--accent-violet)' }}>
                  {activeMembers}
                </div>
                <span className="small text-muted">Able to log in to the portal right now</span>
              </div>
            </div>
          </div>

          {/* Team Table Card */}
          <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold mb-1">Active Team Directory</h5>
                <span className="text-muted small">
                  Employees can log in with their email and password to view incoming customer enquiries.
                </span>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading team members..." />
            ) : (
              <div className="table-responsive">
                <table className="table ry-table mb-0">
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      <th>Role & Permissions</th>
                      <th>Contact Information</th>
                      <th>Account Status</th>
                      <th>Member Since</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: 38,
                                height: 38,
                                backgroundColor:
                                  member.role === 'superadmin'
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : member.role === 'admin'
                                    ? 'rgba(99, 102, 241, 0.2)'
                                    : 'rgba(16, 185, 129, 0.2)',
                                color:
                                  member.role === 'superadmin'
                                    ? 'var(--accent-blue)'
                                    : member.role === 'admin'
                                    ? 'var(--accent-violet)'
                                    : '#10b981',
                                fontSize: '0.9rem',
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                                {member.name}
                                {member.role === 'superadmin' && (
                                  <span className="badge bg-primary bg-opacity-20 text-primary ms-2" style={{ fontSize: '0.65rem' }}>
                                    Owner / Founder
                                  </span>
                                )}
                              </div>
                              <div className="small text-muted">{member.title || 'Team Member'}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {member.role === 'superadmin' ? (
                            <span className="badge bg-primary px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                              <FaShieldAlt className="me-1" size={10} /> Superadmin (Full Control)
                            </span>
                          ) : member.role === 'admin' ? (
                            <span className="badge bg-info text-white px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                              Co-Admin (Settings & CRM)
                            </span>
                          ) : (
                            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                              <FaBriefcase className="me-1" size={10} /> Employee (Queries & CRM)
                            </span>
                          )}
                          <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                            {member.role === 'employee'
                              ? 'Can see all client inquiries, pipeline stats & status updates'
                              : 'Full control of website services, pricing & projects'}
                          </div>
                        </td>

                        <td>
                          <div className="small d-flex align-items-center gap-1.5 mb-0.5">
                            <FaEnvelope size={11} className="text-muted" />
                            <span style={{ color: 'var(--text-primary)' }}>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="small text-muted d-flex align-items-center gap-1.5">
                              <FaPhoneAlt size={10} />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </td>

                        <td>
                          {member.status === 'pending_approval' ? (
                            <span className="badge bg-warning text-dark px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                              Pending Approval
                            </span>
                          ) : member.isActive ? (
                            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                              Active Account
                            </span>
                          ) : (
                            <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25 px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                              Deactivated
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="small text-muted">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Initial'}
                          </span>
                        </td>

                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-1.5">
                            {member.role !== 'superadmin' && (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(member)}
                                className={`btn btn-sm ${
                                  member.isActive ? 'btn-outline-warning' : 'btn-outline-success'
                                } p-1.5`}
                                title={member.isActive ? 'Deactivate Account' : 'Activate Account'}
                              >
                                {member.isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMember(member);
                                setNewPassword('');
                                setShowPasswordModal(true);
                              }}
                              className="btn btn-outline-secondary btn-sm p-1.5"
                              title="Reset Password"
                            >
                              <FaKey size={13} />
                            </button>

                            {member.role !== 'superadmin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMember(member)}
                                className="btn btn-outline-danger btn-sm p-1.5"
                                title="Delete Employee"
                              >
                                <FaTrash size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SHIFT & ATTENDANCE HISTORY (PAST 30 DAYS) */}
      {/* ========================================================================= */}
      {historyModalMember && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }}
          onClick={() => setHistoryModalMember(null)}
        >
          <div
            className="ry-card p-4 p-md-5 rounded-4 shadow-lg w-100 overflow-auto"
            style={{
              maxWidth: 780,
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="badge bg-primary px-2.5 py-1 rounded-pill small fw-bold mb-1">
                  <FaHistory className="me-1" /> Shift Attendance Record
                </span>
                <h4 className="fw-bold mb-0 text-white">{historyModalMember.name}</h4>
                <div className="small text-muted">{historyModalMember.email} • {historyModalMember.title || 'Staff Member'}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setHistoryModalMember(null)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {historyLoading ? (
              <LoadingSpinner text="Retrieving shift history..." />
            ) : historyRecords.length === 0 ? (
              <div className="text-center py-5">
                <FaCalendarDay size={36} className="text-muted mb-2 opacity-50" />
                <h6 className="fw-bold text-light">No shift records found yet for this employee.</h6>
                <p className="text-muted small">
                  Shift attendance begins automatically when the employee logs in and performs work.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table ry-table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Shift Date</th>
                      <th>Login Time</th>
                      <th>Logout Time</th>
                      <th>Working Hours</th>
                      <th>Break Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRecords.map((rec) => (
                      <tr key={rec._id}>
                        <td>
                          <span className="fw-bold text-light">{rec.dateString}</span>
                        </td>
                        <td>
                          <span className="small text-success fw-medium">
                            {formatTimeOnly(rec.loginTime)}
                          </span>
                        </td>
                        <td>
                          <span className="small text-secondary fw-medium">
                            {rec.logoutTime ? formatTimeOnly(rec.logoutTime) : '— In Progress'}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-success fs-6">
                            {formatMinutes(rec.totalActiveMinutes)}
                          </span>
                        </td>
                        <td>
                          <span className="small text-warning">
                            {formatMinutes(rec.totalAwayMinutes)}
                          </span>
                        </td>
                        <td>
                          {rec.isCompleted ? (
                            <span className="badge bg-secondary small">Completed</span>
                          ) : (
                            <span className="badge bg-success bg-opacity-20 text-success small">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-3 border-top d-flex justify-content-end mt-4" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setHistoryModalMember(null)}
                className="btn btn-ry-primary btn-sm px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      {showAddModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content ry-card border-0 p-4 rounded-4 shadow-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-primary)' }}>
                  <FaUserPlus className="text-primary me-2" />
                  Register & Hire New Employee
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                />
              </div>

              <form onSubmit={handleAddMember}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Employee Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control-ry"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address (Login Username) *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control-ry"
                    placeholder="e.g. rahul@rywebsphere.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Login Password * (minimum 6 chars)</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control-ry"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <div className="form-text small text-muted">
                    Share this password with your hired employee so they can log in.
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Role *</label>
                    <select
                      name="role"
                      className="form-select-ry"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="employee">Employee (View & Respond to Queries)</option>
                      <option value="admin">Co-Admin (Queries + Full Site Settings)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control-ry"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Job Title / Designation</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control-ry"
                    placeholder="e.g. Client Inquiries & Support Specialist"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-ry-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-ry-primary btn-sm px-4"
                  >
                    {submitting ? 'Creating...' : 'Register Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showPasswordModal && selectedMember && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content ry-card border-0 p-4 rounded-4 shadow-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-primary)' }}>
                  <FaKey className="text-warning me-2" />
                  Reset Password for {selectedMember.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPasswordModal(false)}
                />
              </div>

              <form onSubmit={handleResetPassword}>
                <p className="small text-muted mb-3">
                  Set a new password for account <strong>{selectedMember.email}</strong>.
                </p>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">New Password (minimum 6 chars)</label>
                  <input
                    type="password"
                    className="form-control-ry"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="btn btn-ry-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-ry-primary btn-sm px-4"
                  >
                    {submitting ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
