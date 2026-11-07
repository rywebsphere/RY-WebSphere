import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaEye,
  FaBriefcase,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaDownload,
  FaPrint,
  FaExternalLinkAlt,
  FaCopy,
  FaCloud,
  FaClock,
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusList = ['All', 'New', 'Contacted', 'In Discussion', 'Proposal Sent', 'Won', 'Lost'];

const projectPhases = [
  'Discovery & Planning',
  'UI/UX Design',
  'Development',
  'Testing & Revisions',
  'Cloud Deployment',
  'Completed',
];

const statusBadgeMap = {
  New: 'badge bg-danger text-white',
  Contacted: 'badge bg-info text-white',
  'In Discussion': 'badge bg-warning text-dark fw-bold',
  'Proposal Sent': 'badge bg-primary text-white',
  Won: 'badge bg-success text-white',
  Lost: 'badge bg-secondary text-white',
};

const AdminEnquiries = () => {
  const { admin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';
  const targetId = searchParams.get('id');

  const isEmployee = admin?.role === 'employee';

  const [enquiries, setEnquiries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');

  // Invoice Modal State
  const [invoiceEnquiry, setInvoiceEnquiry] = useState(null);
  const [invoiceCustomAmount, setInvoiceCustomAmount] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');

  // Live Tracker State inside Enquiry Modal
  const [trackerState, setTrackerState] = useState({
    projectPhase: 'Discovery & Planning',
    projectProgressPercent: 10,
    projectStatusNote: '',
  });
  const [savingTracker, setSavingTracker] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendTrackingEmail = async (enquiryId) => {
    try {
      setSendingEmail(true);
      const res = await api.post(`/admin/enquiries/${enquiryId}/send-tracking`);
      setCopyFeedback(res.data?.message || 'Tracking email dispatched from rywebsphere@gmail.com!');
      setTimeout(() => setCopyFeedback(''), 4500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch email.');
    } finally {
      setSendingEmail(false);
    }
  };
  const [copyFeedback, setCopyFeedback] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const query = selectedStatus === 'All' ? '' : `?status=${encodeURIComponent(selectedStatus)}`;
      const res = await api.get(`/admin/enquiries${query}`);
      if (res.data?.success) {
        setEnquiries(res.data.data);
        if (targetId) {
          const found = res.data.data.find((e) => e._id === targetId);
          if (found) setSelectedEnquiry(found);
        }
      }
    } catch (err) {
      console.warn('Error fetching enquiries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedStatus]);

  useEffect(() => {
    if (selectedEnquiry) {
      setTrackerState({
        projectPhase: selectedEnquiry.projectPhase || 'Discovery & Planning',
        projectProgressPercent: selectedEnquiry.projectProgressPercent || 10,
        projectStatusNote: selectedEnquiry.projectStatusNote || '',
      });
    }
  }, [selectedEnquiry]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/enquiries/${id}`, { status: newStatus });
      if (res.data?.success) {
        setStatusUpdateMessage(`Status changed to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(''), 3000);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      setSavingNote(true);
      const res = await api.put(`/admin/enquiries/${id}`, { internalNotes: notes });
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, internalNotes: notes } : e))
        );
        alert('Internal notes saved successfully.');
      }
    } catch (err) {
      alert(`Error saving notes: ${err.message}`);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveTracker = async () => {
    if (!selectedEnquiry) return;
    try {
      setSavingTracker(true);
      const res = await api.put(`/admin/enquiries/${selectedEnquiry._id}`, {
        projectPhase: trackerState.projectPhase,
        projectProgressPercent: Number(trackerState.projectProgressPercent),
        projectStatusNote: trackerState.projectStatusNote,
      });
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === selectedEnquiry._id ? { ...e, ...trackerState } : e))
        );
        setSelectedEnquiry((prev) => ({ ...prev, ...trackerState }));
        alert('Live Client Tracker updated! Client can see changes at /track/' + (selectedEnquiry.trackingCode || selectedEnquiry._id));
      }
    } catch (err) {
      alert(`Error updating tracker: ${err.message}`);
    } finally {
      setSavingTracker(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;

    try {
      const res = await api.delete(`/admin/enquiries/${id}`);
      if (res.data?.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) setSelectedEnquiry(null);
      }
    } catch (err) {
      alert(`Error deleting enquiry: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = [
      'Tracking Code',
      'Full Name',
      'Business Name',
      'Category',
      'Service',
      'Package',
      'Budget',
      'Status',
      'Phase',
      'Progress %',
      'Phone',
      'Email',
      'Created Date',
    ];

    const rows = filteredEnquiries.map((e) => [
      `"${e.trackingCode || e._id}"`,
      `"${(e.fullName || '').replace(/"/g, '""')}"`,
      `"${(e.businessName || '').replace(/"/g, '""')}"`,
      `"${(e.businessCategory || '').replace(/"/g, '""')}"`,
      `"${(e.requiredService || e.serviceRequested || '').replace(/"/g, '""')}"`,
      `"${(e.selectedPackage || '').replace(/"/g, '""')}"`,
      `"${(e.budget || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.projectPhase || 'Discovery & Planning'}"`,
      `"${e.projectProgressPercent || 0}%"`,
      `"${e.phone || ''}"`,
      `"${e.email || ''}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ry_websphere_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.includes(searchTerm) ||
      e.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openInvoiceModal = (enq) => {
    setInvoiceEnquiry(enq);
    setInvoiceCustomAmount(enq.budget?.replace(/[^0-9]/g, '') || '5999');
    setInvoiceNotes(
      'Fulfillment terms: RY WebSphere handles complete custom domain purchase & Google Cloud server deployment directly. Third-party registrar & GCP usage billed at actuals.'
    );
  };

  const copyTrackingLink = (code) => {
    const fullUrl = `${window.location.origin}/track/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopyFeedback('Tracking link copied to clipboard!');
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  return (
    <div className="container-fluid p-0">
      {/* Page Title & Top Actions */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Client Inquiries & CRM</h2>
          <p className="text-muted small mb-0">
            Track, qualify, update incoming customer leads, manage milestones, and generate quotations.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {statusUpdateMessage && (
            <div className="alert alert-success py-1.5 px-3 mb-0 small rounded-3">
              <FaCheckCircle className="me-1" /> {statusUpdateMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-pill fw-semibold"
            title="Download Excel / CSV of current filtered leads"
          >
            <FaDownload size={13} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ry-card p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="row g-3 align-items-center justify-content-between">
          {/* Search */}
          <div className="col-lg-4 col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control-ry pe-5 py-2"
                placeholder="Search name, phone, code, business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-1.5 justify-content-lg-end">
              {statusList.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 ${
                    selectedStatus === st
                      ? 'btn-primary text-white fw-bold shadow-sm'
                      : 'btn-outline-secondary text-secondary'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving enquiries..." />
      ) : filteredEnquiries.length === 0 ? (
        <div className="ry-card p-5 text-center text-muted rounded-4">
          <h5>No enquiries found for status "{selectedStatus}".</h5>
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('All');
              setSearchTerm('');
            }}
            className="btn btn-ry-secondary btn-sm mt-3"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="table-responsive">
            <table className="table ry-table mb-0">
              <thead>
                <tr>
                  <th>Client & Tracking</th>
                  <th>Business</th>
                  <th>Service / Budget</th>
                  <th>Contact Info</th>
                  <th>Project Phase</th>
                  <th>Status Workflow</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td>
                      <div className="fw-bold text-white">{enq.fullName}</div>
                      <div className="d-flex align-items-center gap-1.5 mt-0.5">
                        <span className="badge bg-primary bg-opacity-20 text-primary font-monospace fw-bold" style={{ fontSize: '0.72rem' }}>
                          {enq.trackingCode || 'RY-' + enq._id.slice(-5).toUpperCase()}
                        </span>
                        <Link
                          to={`/track/${enq.trackingCode || enq._id}`}
                          target="_blank"
                          className="text-muted hover-text-primary"
                          title="Open Live Public Tracker"
                        >
                          <FaExternalLinkAlt size={10} />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-semibold text-light">{enq.businessName || 'Independent'}</div>
                      <span className="badge bg-surface border text-muted" style={{ fontSize: '0.68rem' }}>
                        {enq.businessCategory || 'General'}
                      </span>
                    </td>
                    <td>
                      <div className="small text-white">{enq.requiredService || enq.serviceRequested}</div>
                      <span className="small text-success fw-bold" style={{ fontSize: '0.75rem' }}>
                        {enq.budget || 'Custom Quote'}
                      </span>
                    </td>
                    <td>
                      <div className="small text-light">{enq.email}</div>
                      <div className="small text-muted">{enq.phone}</div>
                    </td>
                    <td>
                      <div className="small text-primary fw-semibold">
                        {enq.projectPhase || 'Discovery & Planning'}
                      </div>
                      <div className="progress mt-1" style={{ height: 4, width: 90 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${enq.projectProgressPercent || 10}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select-ry py-1 px-2"
                        style={{ fontSize: '0.78rem', width: 'auto' }}
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>
                      <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1.5">
                        {/* View & Edit Milestones Modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="btn btn-outline-primary btn-sm p-1.5"
                          title="View Details & Live Tracker"
                        >
                          <FaEye size={13} />
                        </button>

                        {/* Generate Quotation / Invoice Modal */}
                        <button
                          type="button"
                          onClick={() => openInvoiceModal(enq)}
                          className="btn btn-outline-info btn-sm p-1.5"
                          title="Generate Quotation / Invoice"
                        >
                          <FaFileInvoiceDollar size={13} />
                        </button>

                        {/* WhatsApp Direct */}
                        {enq.phone && (
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^\d]/g, '')}?text=Hello%20${encodeURIComponent(enq.fullName)}!%20This%20is%20RY%20WebSphere%20team%20regarding%20your%20website%20inquiry.`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-success btn-sm p-1.5"
                            title="Direct WhatsApp Message"
                          >
                            <FaWhatsapp size={13} />
                          </a>
                        )}

                        {!isEmployee && (
                          <button
                            type="button"
                            onClick={() => handleDeleteEnquiry(enq._id)}
                            className="btn btn-outline-danger btn-sm p-1.5"
                            title="Delete Record (Admin Only)"
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
        </div>
      )}

      {/* Enquiry Details & Live Tracker Controls Modal */}
      {selectedEnquiry && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          onClick={() => setSelectedEnquiry(null)}
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
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className={statusBadgeMap[selectedEnquiry.status] || 'badge bg-secondary'} style={{ fontSize: '0.75rem' }}>
                    {selectedEnquiry.status}
                  </span>
                  <span className="badge bg-primary font-monospace fw-bold">
                    {selectedEnquiry.trackingCode || 'RY-' + selectedEnquiry._id.slice(-5).toUpperCase()}
                  </span>
                </div>
                <h4 className="fw-bold mb-0">{selectedEnquiry.fullName}</h4>
                <span className="small text-muted">
                  {selectedEnquiry.businessName} • {selectedEnquiry.businessCategory}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedEnquiry(null)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Quick Contact & Public Tracker Link */}
            <div className="p-3 rounded-3 bg-surface border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-3 small">
                <div>
                  <FaEnvelope className="text-primary me-1" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-light text-decoration-none">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <FaPhoneAlt className="text-success me-1" />
                  <span className="text-light">{selectedEnquiry.phone}</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendTrackingEmail(selectedEnquiry._id)}
                  disabled={sendingEmail}
                  className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                  title="Send Tracking Code Email to client from rywebsphere@gmail.com"
                >
                  <FaEnvelope size={12} />
                  <span>{sendingEmail ? 'Sending...' : 'Email Tracker Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyTrackingLink(selectedEnquiry.trackingCode || selectedEnquiry._id)}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  title="Copy Client Public Tracker Link"
                >
                  <FaCopy size={12} />
                  <span>Copy Tracker Link</span>
                </button>
                <Link
                  to={`/track/${selectedEnquiry.trackingCode || selectedEnquiry._id}`}
                  target="_blank"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Open Tracker</span>
                </Link>
              </div>
            </div>

            {copyFeedback && (
              <div className="alert alert-success py-1.5 small mb-3">
                {copyFeedback}
              </div>
            )}

            {/* LIVE PROJECT TRACKER MANAGER */}
            <div className="p-4 rounded-3 border mb-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                  <FaClock /> Client Live Tracker Controller
                </h6>
                <span className="badge bg-primary bg-opacity-25 text-primary small">
                  Client Views Real-Time
                </span>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Active Project Phase</label>
                  <select
                    className="form-select-ry"
                    value={trackerState.projectPhase}
                    onChange={(e) => setTrackerState({ ...trackerState, projectPhase: e.target.value })}
                  >
                    {projectPhases.map((phase) => (
                      <option key={phase} value={phase}>
                        {phase}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Completion Percentage ({trackerState.projectProgressPercent}%)
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    step="5"
                    value={trackerState.projectProgressPercent}
                    onChange={(e) => setTrackerState({ ...trackerState, projectProgressPercent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Live Status Update Note for Client</label>
                <input
                  type="text"
                  className="form-control-ry"
                  placeholder="e.g. Completed initial design mockups. Full-stack coding underway."
                  value={trackerState.projectStatusNote}
                  onChange={(e) => setTrackerState({ ...trackerState, projectStatusNote: e.target.value })}
                />
              </div>

              <button
                type="button"
                disabled={savingTracker}
                onClick={handleSaveTracker}
                className="btn btn-primary btn-sm fw-bold px-3"
              >
                {savingTracker ? 'Updating...' : 'Publish Status to Client Live Tracker'}
              </button>
            </div>

            {/* Project Requirements */}
            <div className="mb-4">
              <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                Customer Project Requirements
              </div>
              <div className="p-3 rounded-3 bg-surface border text-light small" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                {selectedEnquiry.projectDescription || selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="mb-4">
              <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                Internal Agency Notes (Private to Team)
              </div>
              <textarea
                rows="3"
                className="form-control-ry"
                placeholder="Add private discussion notes, calls summary, agreed pricing..."
                defaultValue={selectedEnquiry.internalNotes || ''}
                id="internalNotesField"
              />
              <button
                type="button"
                disabled={savingNote}
                onClick={() => {
                  const val = document.getElementById('internalNotesField').value;
                  handleSaveNotes(selectedEnquiry._id, val);
                }}
                className="btn btn-ry-secondary btn-sm mt-2"
              >
                {savingNote ? 'Saving Notes...' : 'Save Internal Notes'}
              </button>
            </div>

            {/* Change Status & Close */}
            <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Lead Status:</span>
                <select
                  className="form-select-ry py-1.5 px-3"
                  style={{ width: 'auto' }}
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry._id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="btn btn-ry-primary btn-sm px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE QUOTATION / INVOICE GENERATOR MODAL */}
      {invoiceEnquiry && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1070 }}
        >
          <div
            className="rounded-4 shadow-2xl w-100 overflow-auto text-dark bg-white"
            style={{
              maxWidth: 820,
              maxHeight: '94vh',
            }}
          >
            {/* Action Bar (Not Printed) */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light no-print">
              <span className="fw-bold small text-muted">
                1-Click Project Quotation & Milestone Invoice Generator
              </span>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 fw-bold px-3"
                >
                  <FaPrint size={13} />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceEnquiry(null)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-5" id="printableInvoiceSheet" style={{ fontFamily: 'var(--font-sans)', color: '#1f2937' }}>
              {/* Header */}
              <div className="d-flex align-items-start justify-content-between pb-4 border-bottom mb-4">
                <div>
                  <h3 className="fw-extrabold text-primary mb-1" style={{ letterSpacing: '-0.02em' }}>
                    RY WebSphere
                  </h3>
                  <div className="small text-secondary fw-semibold">
                    Digital Engineering & Web Development
                  </div>
                  <div className="small text-muted mt-1">
                    Founded & Directed by: <strong>Ranjan Yadav</strong> <br />
                    Official WhatsApp / Contact: +91 90264 02646 <br />
                    Email: rywebsphere@gmail.com
                  </div>
                </div>

                <div className="text-end">
                  <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill fw-bold fs-6 mb-2">
                    OFFICIAL QUOTATION
                  </span>
                  <div className="small text-muted font-monospace">
                    Ref: INV-RY-{(invoiceEnquiry.trackingCode || invoiceEnquiry._id.slice(-6)).toUpperCase()}
                  </div>
                  <div className="small text-muted mt-0.5">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="small text-primary fw-bold mt-1">
                    Tracking Code: {invoiceEnquiry.trackingCode || 'RY-' + invoiceEnquiry._id.slice(-5).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Billed To / Client Info */}
              <div className="p-3.5 rounded-3 bg-light border mb-4">
                <div className="small text-uppercase fw-bold text-muted mb-2" style={{ letterSpacing: '0.05em' }}>
                  Prepared Exclusively For:
                </div>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <div className="fw-bold fs-6 text-dark">{invoiceEnquiry.fullName}</div>
                    <div className="small text-secondary">{invoiceEnquiry.businessName || 'Independent Client'}</div>
                    <div className="small text-muted">{invoiceEnquiry.businessCategory || 'Commercial'}</div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="small text-dark fw-medium">Phone: {invoiceEnquiry.phone}</div>
                    <div className="small text-dark fw-medium">Email: {invoiceEnquiry.email}</div>
                    <div className="small text-muted">Delivery Timeline: ~7-10 Business Days</div>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="table table-bordered mb-4" style={{ borderColor: '#e5e7eb' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ width: '60%' }}>Scope & Deliverables Description</th>
                    <th className="text-end" style={{ width: '40%' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Full-Stack Web Development: {invoiceEnquiry.requiredService || invoiceEnquiry.serviceRequested || 'Custom Website'}</strong>
                      <div className="small text-muted mt-1">
                        - Responsive layout tested across mobile, tablet, and widescreen displays<br />
                        - Clean React + Node.js MERN architecture with high-speed PageSpeed scoring<br />
                        - Direct WhatsApp chat integration & interactive lead contact form<br />
                        - On-Page Search Engine Optimization (SEO) & Google sitemap integration
                      </div>
                    </td>
                    <td className="text-end fw-bold align-middle fs-6">
                      ₹{Number(invoiceCustomAmount || 5999).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Domain Registration & Google Cloud Hosting Fulfillment</strong>
                      <div className="small text-muted mt-1">
                        - RY WebSphere manages 100% of domain purchase and Google Cloud server deployment<br />
                        - Direct DNS routing, SSL HTTPS encryption setup, and Google Cloud CDN config<br />
                        <em className="text-primary fw-medium">* Official registrar & Google Cloud usage billed transparently at actual costs upon staging delivery</em>
                      </div>
                    </td>
                    <td className="text-end align-middle small text-muted">
                      Setup Included <br />
                      <span className="small text-secondary">(Usage at actuals)</span>
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <td className="text-end fw-bold">TOTAL ESTIMATED INVESTMENT:</td>
                    <td className="text-end fw-extrabold text-primary fs-5">
                      ₹{Number(invoiceCustomAmount || 5999).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Milestone Breakdown */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 rounded-3 border bg-white h-100">
                    <div className="small fw-bold text-muted text-uppercase mb-1">
                      Milestone 1: 50% Kickoff Advance
                    </div>
                    <div className="fs-5 fw-extrabold text-success">
                      ₹{Math.round(Number(invoiceCustomAmount || 5999) * 0.5).toLocaleString('en-IN')}
                    </div>
                    <div className="small text-muted mt-0.5">Due upon project commencement & wireframe briefing.</div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-3 border bg-white h-100">
                    <div className="small fw-bold text-muted text-uppercase mb-1">
                      Milestone 2: 50% Upon Final Launch
                    </div>
                    <div className="fs-5 fw-extrabold text-primary">
                      ₹{Math.round(Number(invoiceCustomAmount || 5999) * 0.5).toLocaleString('en-IN')}
                    </div>
                    <div className="small text-muted mt-0.5">Due after staging approval before live DNS cutover.</div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-3 rounded-3 bg-light border mb-4">
                <div className="small fw-bold text-dark text-uppercase mb-1">
                  Official Payment Details (UPI / Bank Transfer):
                </div>
                <div className="small text-secondary">
                  <strong>UPI ID:</strong> <code>9026402646@ybl</code> (Name: Ranjan Yadav)<br />
                  <strong>WhatsApp Payment Confirmation:</strong> +91 90264 02646
                </div>
              </div>

              {/* Domain & Hosting Commercial Clause */}
              <div className="small text-muted border-top pt-3">
                <strong>Commercial Policy & Legal Transparency:</strong> RY WebSphere purchases custom domains and provisions Google Cloud hosting on the client's behalf to ensure seamless technical configuration. Domain renewal and Google Cloud server hosting are billed transparently at actual billing invoices provided by the registrar and Google Cloud.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
