import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaCheckCircle,
  FaArrowRight,
  FaCalendarCheck,
  FaImages,
  FaLaptopCode,
  FaLayerGroup,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/public/projects/${slug}`);
        if (res.data?.success) {
          setProject(res.data.data);
          if (res.data.data.thumbnail) {
            setSelectedImage(res.data.data.thumbnail);
          }
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Loading project details..." minHeight="60vh" />;
  }

  if (error || !project) {
    return (
      <div className="container py-5 text-center my-5">
        <h2 className="fw-bold mb-3">Project Showcase Not Found</h2>
        <p className="text-muted mb-4">
          The requested project "{slug}" could not be located.
        </p>
        <Link to="/portfolio" className="btn btn-ry-primary">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge={project.isDemo ? 'Sample Demo Project' : 'Portfolio Project'}
        title={project.title}
        subtitle={project.description}
        breadcrumbs={[
          { label: 'Portfolio', path: '/portfolio' },
          { label: project.title },
        ]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row g-5">
            {/* Left Column: Visual Showcase & Details */}
            <div className="col-lg-8">
              {/* Main Screenshot Viewer */}
              <div className="ry-card p-3 rounded-4 mb-4 overflow-hidden">
                <div
                  className="rounded-3 overflow-hidden position-relative"
                  style={{ maxHeight: 480, backgroundColor: 'var(--bg-surface)' }}
                >
                  <img
                    src={selectedImage || project.thumbnail}
                    alt={project.title}
                    className="w-100 h-100 object-fit-cover rounded-3"
                    style={{ minHeight: 320 }}
                  />
                  {project.isDemo && (
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="ry-badge-demo px-3 py-1 rounded-2 shadow">
                        Demo Project
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Screenshots Carousel/Thumbnails */}
                {project.screenshots && project.screenshots.length > 1 && (
                  <div className="d-flex align-items-center gap-2 mt-3 overflow-auto pb-1">
                    {project.screenshots.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`btn p-0 rounded-2 border overflow-hidden ${
                          selectedImage === img ? 'border-primary' : 'border-secondary'
                        }`}
                        style={{ width: 90, height: 60, flexShrink: 0 }}
                      >
                        <img src={img} alt={`Screenshot ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Problem / Objective */}
              {project.problemObjective && (
                <div className="ry-card p-4 p-md-5 mb-4">
                  <h4 className="fw-bold mb-3">Project Objective & Business Problem</h4>
                  <p className="text-secondary lead" style={{ fontSize: '1.05rem' }}>
                    {project.problemObjective}
                  </p>
                </div>
              )}

              {/* Design Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="ry-card p-4 p-md-5 mb-4">
                  <h4 className="fw-bold mb-3">Design Highlights</h4>
                  <div className="d-flex flex-column gap-3">
                    {project.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-3 d-flex align-items-start gap-3"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <FaCheckCircle className="text-primary mt-1 flex-shrink-0" size={16} />
                        <span className="text-secondary">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Features */}
              {project.features && project.features.length > 0 && (
                <div className="ry-card p-4 p-md-5 mb-4">
                  <h4 className="fw-bold mb-3">Main Implemented Features</h4>
                  <div className="row g-3">
                    {project.features.map((f, idx) => (
                      <div key={idx} className="col-md-6">
                        <div
                          className="p-3 rounded-3 h-100 d-flex align-items-center gap-2.5 bg-surface border"
                        >
                          <FaCheckCircle className="text-success flex-shrink-0" size={14} />
                          <span className="small fw-medium">{f}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Meta & Actions */}
            <div className="col-lg-4">
              <div className="position-sticky" style={{ top: 100 }}>
                {/* Action Card */}
                <div
                  className="ry-card p-4 rounded-4 shadow-lg mb-4"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <span className="badge bg-primary bg-opacity-20 text-primary mb-2 px-2.5 py-1">
                    {project.category}
                  </span>
                  <h4 className="fw-bold mb-3">{project.title}</h4>

                  {/* Action buttons */}
                  <div className="d-flex flex-column gap-2.5 mb-4">
                    {project.demoUrl && (
                      <Link
                        to={project.demoUrl}
                        className="btn btn-ry-primary py-2.5 justify-content-center"
                      >
                        <span>Launch Live Demo</span>
                        <FaExternalLinkAlt size={13} />
                      </Link>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ry-secondary py-2.5 justify-content-center"
                      >
                        <FaGithub size={16} />
                        <span>View on GitHub</span>
                      </a>
                    )}
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)' }} />

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>
                      Technologies Used
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {project.technologies?.map((tech, idx) => (
                        <span
                          key={idx}
                          className="badge bg-surface border px-2.5 py-1.5"
                          style={{ fontSize: '0.78rem' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hire CTA */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/contact', {
                        state: {
                          preselectedService: `${project.category} Website Development`,
                        },
                      })
                    }
                    className="btn btn-outline-primary w-100 py-2.5"
                  >
                    <span>Request Similar Project</span>
                    <FaArrowRight size={12} className="ms-1" />
                  </button>
                </div>

                <div className="ry-card p-3 text-center">
                  <div className="small text-muted mb-1">Looking for standard pricing?</div>
                  <Link to="/pricing" className="text-primary fw-semibold small">
                    Explore Website Packages from ₹2,999 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
