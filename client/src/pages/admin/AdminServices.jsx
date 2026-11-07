import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaLayerGroup } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const emptyServiceForm = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  features: '',
  deliverables: '',
  icon: 'FaGlobe',
  order: 1,
  isPublished: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyServiceForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/services');
      if (res.data?.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyServiceForm, order: services.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      features: Array.isArray(service.features) ? service.features.join('\n') : '',
      deliverables: Array.isArray(service.deliverables) ? service.deliverables.join('\n') : '',
      icon: service.icon || 'FaGlobe',
      order: service.order || 1,
      isPublished: service.isPublished !== undefined ? service.isPublished : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const res = await api.put(`/admin/services/${editingId}`, formData);
        if (res.data?.success) {
          setServices((prev) =>
            prev.map((s) => (s._id === editingId ? res.data.data : s))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/admin/services', formData);
        if (res.data?.success) {
          setServices((prev) => [...prev, res.data.data]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      alert(`Error saving service: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await api.delete(`/admin/services/${id}`);
      if (res.data?.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      alert(`Error deleting service: ${err.message}`);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Agency Service Offerings</h2>
          <p className="text-muted small mb-0">
            Configure the 15 specialized web development capabilities, descriptions, and deliverables.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-ry-primary btn-sm px-3 py-2 d-inline-flex align-items-center gap-2"
        >
          <FaPlus size={12} />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="ry-card p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="position-relative" style={{ maxWidth: 400 }}>
          <input
            type="text"
            className="form-control-ry pe-5"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading services..." />
      ) : filteredServices.length === 0 ? (
        <div className="ry-card p-5 text-center text-muted rounded-4">
          <h5>No services found. Click "Add New Service" to create one.</h5>
        </div>
      ) : (
        <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="table-responsive">
            <table className="table ry-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: 60 }}># Order</th>
                  <th>Service Title</th>
                  <th>Slug</th>
                  <th>Icon</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((s) => (
                  <tr key={s._id}>
                    <td className="fw-bold text-center">{s.order}</td>
                    <td>
                      <div className="fw-bold text-white">{s.title}</div>
                      <div className="small text-muted" style={{ maxWidth: 380, lineClamp: 1 }}>
                        {s.shortDescription}
                      </div>
                    </td>
                    <td>
                      <span className="small text-muted font-monospace">{s.slug}</span>
                    </td>
                    <td>
                      <span className="badge bg-surface border text-info">{s.icon}</span>
                    </td>
                    <td>
                      {s.isPublished ? (
                        <span className="badge bg-success bg-opacity-20 text-success">Published</span>
                      ) : (
                        <span className="badge bg-secondary">Hidden</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-outline-primary btn-sm p-1.5"
                          title="Edit Service"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s._id)}
                          className="btn btn-outline-danger btn-sm p-1.5"
                          title="Delete Service"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              maxWidth: 750,
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h4 className="fw-bold mb-0">
                {editingId ? 'Edit Service' : 'Add New Service'}
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
                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-light">Service Title</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="e.g. Gym Website Development"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-light">Display Order</label>
                  <input
                    type="number"
                    className="form-control-ry"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Custom Slug (optional)</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="gym-website-development"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Icon Name</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="FaBriefcase, FaDumbbell, FaSpa, FaUserMd, FaGlobe"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Short Description</label>
                  <textarea
                    rows="2"
                    className="form-control-ry"
                    placeholder="One-sentence hook for card overview..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Full Detailed Description</label>
                  <textarea
                    rows="3"
                    className="form-control-ry"
                    placeholder="Comprehensive overview of this service..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Features (one per line)</label>
                  <textarea
                    rows="3"
                    className="form-control-ry"
                    placeholder="Mobile responsive design&#10;WhatsApp inquiry button"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Deliverables (one per line)</label>
                  <textarea
                    rows="3"
                    className="form-control-ry"
                    placeholder="Complete 5-page website&#10;Google Maps integration"
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isPublishedService"
                      className="form-check-input"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <label htmlFor="isPublishedService" className="form-check-label text-light small">
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
                    {submitting ? 'Saving Service...' : editingId ? 'Update Service' : 'Create Service'}
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

export default AdminServices;
