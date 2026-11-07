import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaTimes,
  FaCheck,
  FaSearch,
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const categoryOptions = [
  'Gym',
  'Salon',
  'Healthcare',
  'Restaurant',
  'Education',
  'Business',
  'E-commerce',
  'Web Applications',
];

const emptyProjectForm = {
  title: '',
  slug: '',
  category: 'Business',
  description: '',
  problemObjective: '',
  highlights: '',
  features: '',
  technologies: '',
  thumbnail: '',
  screenshots: '',
  demoUrl: '',
  githubUrl: '',
  isDemo: true,
  isPublished: true,
};

const AdminProjects = () => {
  const { admin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProjectForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/projects');
      if (res.data?.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyProjectForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || 'Business',
      description: project.description || '',
      problemObjective: project.problemObjective || '',
      highlights: Array.isArray(project.highlights) ? project.highlights.join('\n') : '',
      features: Array.isArray(project.features) ? project.features.join('\n') : '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      thumbnail: project.thumbnail || '',
      screenshots: Array.isArray(project.screenshots) ? project.screenshots.join('\n') : '',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      isDemo: project.isDemo !== undefined ? project.isDemo : true,
      isPublished: project.isPublished !== undefined ? project.isPublished : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const res = await api.put(`/admin/projects/${editingId}`, formData);
        if (res.data?.success) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingId ? res.data.data : p))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/admin/projects', formData);
        if (res.data?.success) {
          setProjects((prev) => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      alert(`Error saving project: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await api.delete(`/admin/projects/${id}`);
      if (res.data?.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(`Error deleting project: ${err.message}`);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Portfolio & Project Showcases</h2>
          <p className="text-muted small mb-0">
            Create, update, and manage agency demo websites and client case studies.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-ry-primary btn-sm px-3 py-2 d-inline-flex align-items-center gap-2"
        >
          <FaPlus size={12} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="ry-card p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="position-relative" style={{ maxWidth: 400 }}>
          <input
            type="text"
            className="form-control-ry pe-5"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <LoadingSpinner text="Loading portfolio projects..." />
      ) : filteredProjects.length === 0 ? (
        <div className="ry-card p-5 text-center text-muted rounded-4">
          <h5>No projects found. Click "Add New Project" to create one.</h5>
        </div>
      ) : (
        <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="table-responsive">
            <table className="table ry-table mb-0">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Project Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Published</th>
                  <th>Live Demo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p._id}>
                    <td style={{ width: 80 }}>
                      <img
                        src={p.thumbnail || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80'}
                        alt={p.title}
                        className="rounded-2 object-fit-cover"
                        style={{ width: 64, height: 44 }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-white">{p.title}</div>
                      <div className="small text-muted font-monospace">{p.slug}</div>
                    </td>
                    <td>
                      <span className="badge bg-surface border text-light">{p.category}</span>
                    </td>
                    <td>
                      {p.isDemo ? (
                        <span className="ry-badge-demo px-2 py-0.5 rounded">Demo Project</span>
                      ) : (
                        <span className="badge bg-success bg-opacity-20 text-success">Client Project</span>
                      )}
                    </td>
                    <td>
                      {p.isPublished ? (
                        <span className="badge bg-success bg-opacity-20 text-success">Published</span>
                      ) : (
                        <span className="badge bg-secondary">Draft / Hidden</span>
                      )}
                    </td>
                    <td>
                      {p.demoUrl ? (
                        <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none">
                          View Demo <FaExternalLinkAlt size={10} />
                        </a>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-outline-primary btn-sm p-1.5"
                          title="Edit Project"
                        >
                          <FaEdit size={13} />
                        </button>
                        {admin?.role !== 'employee' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(p._id)}
                            className="btn btn-outline-danger btn-sm p-1.5"
                            title="Delete Project (Admin Only)"
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

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          onClick={() => setModalOpen(false)}
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
              <h4 className="fw-bold mb-0">
                {editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
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
                  <label className="form-label small fw-semibold text-light">Project Title</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="e.g. PulseFit Athletic & Gym Demo"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-light">Category</label>
                  <select
                    className="form-select-ry"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Custom Slug (optional)</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="pulsefit-gym-demo"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Technologies (comma separated)</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="React.js, Bootstrap 5, Framer Motion"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Short Description</label>
                  <textarea
                    rows="2"
                    className="form-control-ry"
                    placeholder="Brief summary of the project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Objective / Business Problem</label>
                  <textarea
                    rows="2"
                    className="form-control-ry"
                    placeholder="What challenge does this website solve for the business?"
                    value={formData.problemObjective}
                    onChange={(e) => setFormData({ ...formData, problemObjective: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Design Highlights (one per line)</label>
                  <textarea
                    rows="3"
                    className="form-control-ry"
                    placeholder="Mobile-first responsive cards&#10;Instant WhatsApp booking workflow"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Main Features (one per line)</label>
                  <textarea
                    rows="3"
                    className="form-control-ry"
                    placeholder="Class timetable schedule&#10;Google Maps directions"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Thumbnail Image URL</label>
                  <input
                    type="url"
                    className="form-control-ry"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Demo URL or Internal Route</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="/industries/gym-fitness or external link"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">GitHub URL (optional)</label>
                  <input
                    type="url"
                    className="form-control-ry"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>

                {/* Checkbox toggles */}
                <div className="col-md-6">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isDemoCheck"
                      className="form-check-input"
                      checked={formData.isDemo}
                      onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                    />
                    <label htmlFor="isDemoCheck" className="form-check-label text-light small">
                      Label as Demo Project (Maintains honesty & transparency)
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check pt-2">
                    <input
                      type="checkbox"
                      id="isPublishedCheck"
                      className="form-check-input"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <label htmlFor="isPublishedCheck" className="form-check-label text-light small">
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
                    {submitting ? 'Saving Project...' : editingId ? 'Update Project' : 'Create Project'}
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

export default AdminProjects;
