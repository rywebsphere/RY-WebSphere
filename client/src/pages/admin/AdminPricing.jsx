import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaTag, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emptyPricingForm = {
  name: '',
  slug: '',
  price: 2999,
  currency: '₹',
  period: 'starting price',
  description: '',
  features: '',
  revisionLimit: 'Up to 2 revision rounds',
  deliveryEstimate: '3 to 5 business days',
  isPopular: false,
  isPublished: true,
  order: 1,
};

const AdminPricing = () => {
  const { admin } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyPricingForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/pricing');
      if (res.data?.success) {
        setPackages(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching pricing:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyPricingForm, order: packages.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      name: pkg.name || '',
      slug: pkg.slug || '',
      price: pkg.price || 0,
      currency: pkg.currency || '₹',
      period: pkg.period || '',
      description: pkg.description || '',
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      revisionLimit: pkg.revisionLimit || '',
      deliveryEstimate: pkg.deliveryEstimate || '',
      isPopular: !!pkg.isPopular,
      isPublished: pkg.isPublished !== undefined ? pkg.isPublished : true,
      order: pkg.order || 1,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const res = await api.put(`/admin/pricing/${editingId}`, formData);
        if (res.data?.success) {
          setPackages((prev) =>
            prev.map((p) => (p._id === editingId ? res.data.data : p))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/admin/pricing', formData);
        if (res.data?.success) {
          setPackages((prev) => [...prev, res.data.data]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      alert(`Error saving pricing package: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing package?')) return;
    try {
      const res = await api.delete(`/admin/pricing/${id}`);
      if (res.data?.success) {
        setPackages((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(`Error deleting package: ${err.message}`);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Pricing & Package Management</h2>
          <p className="text-muted small mb-0">
            Configure rates, revision limits, and included deliverables for client website packages.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-ry-primary btn-sm px-3 py-2 d-inline-flex align-items-center gap-2"
        >
          <FaPlus size={12} />
          <span>Add Custom Package</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading pricing packages..." />
      ) : (
        <div className="row g-4">
          {packages.map((pkg) => (
            <div key={pkg._id} className="col-lg-4 col-md-6">
              <div
                className={`ry-card p-4 h-100 d-flex flex-column justify-content-between position-relative ${
                  pkg.isPopular ? 'border-primary' : ''
                }`}
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                {pkg.isPopular && (
                  <span className="badge bg-primary text-white position-absolute top-0 end-0 m-3">
                    ★ Most Popular
                  </span>
                )}

                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="fw-bold mb-0 text-white">{pkg.name}</h4>
                  </div>
                  <div className="display-6 fw-bold text-primary mb-2">
                    {pkg.currency}{pkg.price?.toLocaleString('en-IN')}
                    <span className="small text-muted fs-6"> /{pkg.period}</span>
                  </div>
                  <p className="text-muted small mb-3">{pkg.description}</p>

                  <div className="p-2.5 rounded-2 bg-surface border mb-3 small">
                    <div><strong>Turnaround:</strong> {pkg.deliveryEstimate}</div>
                    <div><strong>Revisions:</strong> {pkg.revisionLimit}</div>
                  </div>

                  <div className="mb-4">
                    <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                      Features:
                    </div>
                    <ul className="list-unstyled d-flex flex-column gap-1.5 small text-secondary">
                      {pkg.features?.map((f, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={12} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                  <span className={`badge ${pkg.isPublished ? 'bg-success bg-opacity-20 text-success' : 'bg-secondary'}`}>
                    {pkg.isPublished ? 'Published' : 'Hidden'}
                  </span>

                  <div className="d-flex align-items-center gap-1.5">
                    {admin?.role !== 'employee' && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(pkg)}
                        className="btn btn-outline-primary btn-sm px-3"
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                    )}
                    {admin?.role !== 'employee' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg._id)}
                        className="btn btn-outline-danger btn-sm p-1.5"
                        title="Delete"
                      >
                        <FaTrash size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="ry-card p-4 p-md-5 rounded-4 shadow-lg w-100 overflow-auto"
            style={{
              maxWidth: 720,
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h4 className="fw-bold mb-0">
                {editingId ? 'Edit Package Rates' : 'Add New Pricing Package'}
              </h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setModalOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Package Name</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="e.g. Starter Website"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Price (₹ INR)</label>
                  <input
                    type="number"
                    className="form-control-ry"
                    placeholder="2999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Pricing Note / Period</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="starting price (single page)"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Delivery Estimate</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="3 to 5 business days"
                    value={formData.deliveryEstimate}
                    onChange={(e) => setFormData({ ...formData, deliveryEstimate: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Revision Limit Policy</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="Up to 2 revision rounds"
                    value={formData.revisionLimit}
                    onChange={(e) => setFormData({ ...formData, revisionLimit: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Sort Order</label>
                  <input
                    type="number"
                    className="form-control-ry"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Description</label>
                  <textarea
                    rows="2"
                    className="form-control-ry"
                    placeholder="Ideal for local businesses, freelancers, and professionals..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Included Features (one per line)</label>
                  <textarea
                    rows="4"
                    className="form-control-ry"
                    placeholder="Single-page modern business website&#10;Mobile-responsive layout&#10;WhatsApp enquiry button"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isPopularCheck"
                      className="form-check-input"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    />
                    <label htmlFor="isPopularCheck" className="form-check-label text-light small">
                      Mark as "Most Popular Choice"
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isPublishedPricing"
                      className="form-check-input"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <label htmlFor="isPublishedPricing" className="form-check-label text-light small">
                      Published on Public Website
                    </label>
                  </div>
                </div>

                <div className="col-12 pt-3 border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-ry-secondary btn-sm px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-ry-primary btn-sm px-4"
                  >
                    {submitting ? 'Saving Package...' : editingId ? 'Update Package' : 'Create Package'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
