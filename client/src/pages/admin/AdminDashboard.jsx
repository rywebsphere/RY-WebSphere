import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaInbox,
  FaCheckCircle,
  FaComments,
  FaTrophy,
  FaFolderOpen,
  FaLayerGroup,
  FaArrowRight,
  FaClock,
  FaUser,
  FaUsers,
  FaBriefcase,
  FaWhatsapp,
  FaEnvelope,
  FaSearchLocation,
  FaCrosshairs,
  FaBookmark,
  FaPhoneAlt,
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusBadgeMap = {
  New: 'badge bg-danger text-white',
  Contacted: 'badge bg-info text-white',
  'In Discussion': 'badge bg-warning text-dark',
  'Proposal Sent': 'badge bg-primary text-white',
  Won: 'badge bg-success text-white',
  Lost: 'badge bg-secondary text-white',
};

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEmployee = admin?.role === 'employee';

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        if (res.data?.success) {
          setStats(res.data.data.stats);
          setRecentEnquiries(res.data.data.recentEnquiries);
        }
      } catch (err) {
        console.warn('Dashboard stats error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling dashboard analytics..." />;
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.totalEnquiries || 0,
      icon: FaInbox,
      color: 'var(--accent-blue)',
      path: '/admin/enquiries',
    },
    {
      title: 'New Leads',
      value: stats?.newEnquiries || 0,
      icon: FaClock,
      color: '#ef4444',
      badge: 'Action Required',
      path: '/admin/enquiries?status=New',
    },
    {
      title: 'In Discussion',
      value: stats?.inDiscussion || 0,
      icon: FaComments,
      color: '#f59e0b',
      path: '/admin/enquiries?status=In Discussion',
    },
    {
      title: 'Won Projects',
      value: stats?.wonProjects || 0,
      icon: FaTrophy,
      color: '#10b981',
      path: '/admin/enquiries?status=Won',
    },
    {
      title: 'Showcase Projects',
      value: stats?.totalProjects || 0,
      icon: FaFolderOpen,
      color: 'var(--accent-violet)',
      path: '/admin/projects',
    },
    {
      title: 'Active Services',
      value: stats?.totalServices || 0,
      icon: FaLayerGroup,
      color: '#06b6d4',
      path: '/admin/services',
    },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Role-Aware Banner */}
      {isEmployee ? (
        <div
          className="alert py-3 px-4 rounded-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 shadow-sm"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-2.5 rounded-3 bg-success bg-opacity-20 text-success d-flex align-items-center justify-content-center"
              style={{ width: 44, height: 44 }}
            >
              <FaBriefcase size={20} />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: '1.05rem' }}>
                Employee Portal • Welcome, {admin?.name}!
              </div>
              <div className="small text-muted">
                Here are the latest website inquiries. You can view contact details, initiate client talks, and update query statuses.
              </div>
            </div>
          </div>
          <Link to="/admin/enquiries" className="btn btn-success btn-sm px-3.5 py-2 fw-semibold text-white">
            <span>View All Inquiries ({stats?.totalEnquiries || 0})</span>
            <FaArrowRight className="ms-1" size={11} />
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Executive Dashboard</h2>
            <p className="text-muted small mb-0">
              Real-time pipeline overview, lead acquisition metrics, team members, and content management.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/admin/team" className="btn btn-ry-secondary btn-sm px-3 position-relative">
              <FaUsers size={12} />
              <span>Manage Team</span>
              {stats?.pendingApprovals > 0 && (
                <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>
                  {stats.pendingApprovals}
                </span>
              )}
            </Link>
            <Link to="/admin/enquiries" className="btn btn-ry-primary btn-sm px-3">
              <span>Manage Inquiries</span>
              <FaArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {/* Pending Approvals Alert for Owner */}
      {!isEmployee && stats?.pendingApprovals > 0 && (
        <div
          className="alert py-3 px-4 rounded-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 shadow-sm"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="d-flex align-items-center gap-2.5">
            <span className="badge bg-warning text-dark fw-bold">
              {stats.pendingApprovals} Action Required
            </span>
            <span className="small">
              You have <strong>{stats.pendingApprovals} new employee access request(s)</strong> awaiting your approval.
            </span>
          </div>
          <Link to="/admin/team" className="btn btn-warning btn-sm text-dark fw-bold px-3">
            Review & Approve →
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="col-xl-2 col-lg-4 col-md-4 col-6">
              <Link to={card.path} className="text-decoration-none">
                <div
                  className="ry-card p-3.5 h-100 d-flex flex-column justify-content-between ry-card-interactive"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-muted fw-semibold">{card.title}</span>
                    <div
                      className="p-2 rounded-2"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: card.color,
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <div>
                    <div className="display-6 fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {card.value}
                    </div>
                    {card.badge && (
                      <span className="badge bg-danger bg-opacity-20 text-danger" style={{ fontSize: '0.65rem' }}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Smart Lead Finder & Outreach CRM Quick Hub */}
      <div className="ry-card p-4 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-white px-2.5 py-1 rounded-pill small fw-bold">
                <FaSearchLocation className="me-1" /> Smart Lead Finder & Outreach CRM
              </span>
              {stats?.followUpsDue > 0 && (
                <span className="badge bg-danger text-white px-2 py-0.5 rounded-pill small fw-bold animate-pulse">
                  {stats.followUpsDue} Follow-Up Due Today
                </span>
              )}
            </div>
            <h5 className="fw-bold mb-0 text-white">Outreach Pipeline & Client Prospecting</h5>
            <div className="text-muted small">
              Discover real Google Maps businesses, find clients with no website, and pitch directly on WhatsApp.
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/admin/lead-finder"
              className="btn btn-primary btn-sm px-3.5 py-2 fw-semibold d-flex align-items-center gap-1.5 shadow-sm"
            >
              <FaSearchLocation size={13} />
              <span>Smart Lead Finder</span>
            </Link>
            <Link
              to="/admin/leads"
              className="btn btn-outline-secondary btn-sm px-3.5 py-2 fw-semibold d-flex align-items-center gap-1.5"
            >
              <FaCrosshairs size={13} />
              <span>Outreach CRM ({stats?.totalLeads || 0})</span>
            </Link>
          </div>
        </div>

        {/* Outreach CRM Stats Counters */}
        <div className="row g-2">
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>SAVED LEADS</span>
              <strong className="fs-5 text-primary">{stats?.totalLeads || 0}</strong>
            </div>
          </div>
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>NEW PROSPECTS</span>
              <strong className="fs-5 text-danger">{stats?.newLeads || 0}</strong>
            </div>
          </div>
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>CONTACTED</span>
              <strong className="fs-5 text-info">{stats?.contactedLeads || 0}</strong>
            </div>
          </div>
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>INTERESTED</span>
              <strong className="fs-5 text-warning">{stats?.interestedLeads || 0}</strong>
            </div>
          </div>
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>PROPOSALS</span>
              <strong className="fs-5 text-violet" style={{ color: 'var(--accent-violet)' }}>{stats?.proposalSentLeads || 0}</strong>
            </div>
          </div>
          <div className="col-md-2 col-4">
            <div className="p-2.5 rounded-3 bg-surface border text-center">
              <span className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>CONVERTED</span>
              <strong className="fs-5 text-success">{stats?.convertedLeads || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-1">Recent Client Inquiries</h5>
            <span className="text-muted small">Latest leads received from public website forms.</span>
          </div>
          <Link to="/admin/enquiries" className="text-primary small fw-semibold text-decoration-none">
            View All Enquiries →
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No inquiries received yet. New website submissions will appear here automatically.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table ry-table mb-0">
              <thead>
                <tr>
                  <th>Client / Contact</th>
                  <th>Business Category</th>
                  <th>Required Service</th>
                  <th>Selected Package</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td>
                      <div className="fw-bold text-white">{enq.fullName}</div>
                      <div className="small text-muted">{enq.email} • {enq.phone}</div>
                    </td>
                    <td>
                      <div className="small fw-medium text-light">{enq.businessName}</div>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{enq.businessCategory}</div>
                    </td>
                    <td>
                      <span className="small text-secondary">{enq.requiredService}</span>
                    </td>
                    <td>
                      <span className="badge bg-surface border text-light" style={{ fontSize: '0.72rem' }}>
                        {enq.selectedPackage}
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted">{enq.budget}</span>
                    </td>
                    <td>
                      <span className={statusBadgeMap[enq.status] || 'badge bg-secondary'} style={{ fontSize: '0.72rem' }}>
                        {enq.status}
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/admin/enquiries?id=${enq._id}`}
                        className="btn btn-outline-primary btn-sm py-1 px-2.5"
                        style={{ fontSize: '0.78rem' }}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
