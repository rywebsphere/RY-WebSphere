import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaSearch, FaCheckCircle, FaFilter } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const categories = [
  'All Projects',
  'Gym',
  'Salon',
  'Healthcare',
  'Restaurant',
  'Education',
  'Business',
  'E-commerce',
  'Web Applications',
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const query = activeCategory === 'All Projects' ? '' : `?category=${encodeURIComponent(activeCategory)}`;
        const res = await api.get(`/public/projects${query}`);
        if (res.data?.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.warn('Error fetching portfolio:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.technologies?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        badge="Demonstrated Technical Capability"
        title="Portfolio & Agency Showcases"
        subtitle="Explore our working prototypes, live industry demos, and web application architectures. All sample projects are transparently marked with real live demos."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Transparency Disclaimer */}
          <div
            className="alert py-3 px-4 rounded-3 d-flex align-items-center gap-3 mb-4"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              borderColor: 'rgba(245, 158, 11, 0.25)',
              color: 'var(--text-primary)',
            }}
          >
            <span className="ry-badge-demo px-2 py-0.5 rounded">Transparency Commitment</span>
            <span className="small text-muted">
              We never fabricate client counts, fictitious logos, or fake business outcomes. Interactive projects in this showcase are labeled as <strong>Demo Project</strong> to truthfully demonstrate design quality, clean frontend engineering, and responsive functionality.
            </span>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="row g-3 align-items-center justify-content-between mb-4">
            {/* Search */}
            <div className="col-lg-4 col-md-6">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control-ry pe-5"
                  placeholder="Search projects by tech or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="col-lg-8">
              <div className="d-flex align-items-center flex-wrap gap-1.5 justify-content-lg-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`btn btn-sm rounded-pill px-3 py-1.5 transition-all ${
                      activeCategory === cat
                        ? 'btn-primary text-white fw-bold shadow-sm'
                        : 'btn-outline-secondary text-secondary'
                    }`}
                    style={{ fontSize: '0.82rem' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <LoadingSpinner text="Loading portfolio showcases..." />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No projects found in category "{activeCategory}".</h5>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All Projects');
                  setSearchTerm('');
                }}
                className="btn btn-ry-secondary btn-sm mt-3"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProjects.map((proj) => (
                <div key={proj.slug} className="col-lg-4 col-md-6">
                  <div className="ry-card overflow-hidden h-100 d-flex flex-column justify-content-between ry-card-interactive">
                    <div>
                      {/* Thumbnail Container */}
                      <div className="position-relative overflow-hidden" style={{ height: 220 }}>
                        <img
                          src={proj.thumbnail || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'}
                          alt={proj.title}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                        />
                        <div className="position-absolute top-0 start-0 m-2.5">
                          <span className="ry-badge-demo px-2.5 py-1 rounded-2 shadow-sm">
                            Demo Project
                          </span>
                        </div>
                        <div className="position-absolute top-0 end-0 m-2.5">
                          <span className="badge bg-dark bg-opacity-75 text-light px-2 py-1" style={{ fontSize: '0.72rem' }}>
                            {proj.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h5 className="fw-bold mb-2">{proj.title}</h5>
                        <p className="text-muted small mb-3" style={{ lineClamp: 2 }}>
                          {proj.description}
                        </p>

                        <div className="d-flex flex-wrap gap-1.5 mb-3">
                          {proj.technologies?.map((tech, idx) => (
                            <span
                              key={idx}
                              className="badge bg-surface text-secondary border"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 d-flex align-items-center gap-2">
                      {proj.demoUrl && (
                        <Link
                          to={proj.demoUrl}
                          className="btn btn-ry-primary btn-sm flex-grow-1"
                          style={{ fontSize: '0.85rem' }}
                        >
                          Live Demo
                        </Link>
                      )}
                      <Link
                        to={`/portfolio/${proj.slug}`}
                        className="btn btn-ry-secondary btn-sm flex-grow-1"
                        style={{ fontSize: '0.85rem' }}
                      >
                        Project Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
