import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaStar, FaShieldAlt } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const emptyTestimonial = {
  clientName: '',
  companyName: '',
  projectType: '',
  feedback: '',
  rating: 5,
  avatarUrl: '',
  isPublished: false,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/testimonials');
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching testimonials:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyTestimonial);
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      clientName: t.clientName || '',
      companyName: t.companyName || '',
      projectType: t.projectType || '',
      feedback: t.feedback || '',
      rating: t.rating || 5,
      avatarUrl: t.avatarUrl || '',
      isPublished: t.isPublished !== undefined ? t.isPublished : false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const res = await api.put(`/admin/testimonials/${editingId}`, formData);
        if (res.data?.success) {
          setTestimonials((prev) =>
            prev.map((t) => (t._id === editingId ? res.data.data : t))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/admin/testimonials', formData);
        if (res.data?.success) {
          setTestimonials((prev) => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      alert(`Error saving testimonial: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await api.delete(`/admin/testimonials/${id}`);
      if (res.data?.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert(`Error deleting testimonial: ${err.message}`);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Client Feedback & Testimonials</h2>
          <p className="text-muted small mb-0">
            Publish authentic client reviews and project feedback.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-ry-primary btn-sm px-3 py-2 d-inline-flex align-items-center gap-2"
        >
          <FaPlus size={12} />
          <span>Add Genuine Review</span>
        </button>
      </div>

      {/* Strict Ethical Guidelines Callout */}
      <div
        className="alert py-3 px-4 rounded-3 d-flex align-items-center gap-3 mb-4"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderColor: 'rgba(59, 130, 246, 0.25)',
          color: 'var(--text-primary)',
        }}
      >
        <FaShieldAlt className="text-primary flex-shrink-0" size={22} />
        <div className="small">
          <strong>Authenticity Commitment:</strong> In strict accordance with RY WebSphere brand standards, no fake client testimonials, artificial metrics, or fabricated avatars may ever be published. Only genuine, verified feedback provided by real paying clients should be entered and published.
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading testimonials..." />
      ) : testimonials.length === 0 ? (
        <div className="ry-card p-5 text-center text-muted rounded-4">
          <h5>No client testimonials currently registered.</h5>
          <p className="small mb-3">
            As genuine client projects are completed and feedback is received, add them here to display on the agency portal.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-ry-secondary btn-sm"
          >
            Add Real Review
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {testimonials.map((t) => (
            <div key={t._id} className="col-lg-4 col-md-6">
              <div className="ry-card p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex text-warning">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <span className={`badge ${t.isPublished ? 'bg-success bg-opacity-20 text-success' : 'bg-secondary'}`}>
                      {t.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-light small mb-3 fst-italic">"{t.feedback}"</p>

                  <div className="pt-2">
                    <div className="fw-bold text-white">{t.clientName}</div>
                    <div className="small text-muted">{t.companyName || t.projectType}</div>
                  </div>
                </div>

                <div className="pt-3 border-top mt-3 d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(t)}
                    className="btn btn-outline-primary btn-sm px-2.5"
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t._id)}
                    className="btn btn-outline-danger btn-sm p-1.5"
                  >
                    <FaTrash size={13} />
                  </button>
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
              maxWidth: 640,
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h4 className="fw-bold mb-0">
                {editingId ? 'Edit Testimonial' : 'Record Client Testimonial'}
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
                  <label className="form-label small fw-semibold text-light">Client Full Name</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="Real Client Name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Company / Organization</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="Company Name (if applicable)"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Project Scope Delivered</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="e.g. Clinic Website Development"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Rating (1 to 5 Stars)</label>
                  <select
                    className="form-select-ry"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Client Feedback Text</label>
                  <textarea
                    rows="4"
                    className="form-control-ry"
                    placeholder="Actual verified feedback received from client..."
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isPublishedTestimonial"
                      className="form-check-input"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <label htmlFor="isPublishedTestimonial" className="form-check-label text-light small">
                      Publish on Public Website
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
                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
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

export default AdminTestimonials;
