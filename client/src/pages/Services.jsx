import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
  FaBriefcase,
  FaDumbbell,
  FaSpa,
  FaUserMd,
  FaUtensils,
  FaGraduationCap,
  FaShoppingCart,
  FaLaptopCode,
  FaRocket,
  FaSyncAlt,
  FaBug,
  FaShieldAlt,
  FaCogs,
  FaCode,
  FaServer,
  FaGlobe,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const iconMap = {
  FaBriefcase: FaBriefcase,
  FaDumbbell: FaDumbbell,
  FaSpa: FaSpa,
  FaUserMd: FaUserMd,
  FaUtensils: FaUtensils,
  FaGraduationCap: FaGraduationCap,
  FaShoppingCart: FaShoppingCart,
  FaLaptopCode: FaLaptopCode,
  FaRocket: FaRocket,
  FaSyncAlt: FaSyncAlt,
  FaBug: FaBug,
  FaShieldAlt: FaShieldAlt,
  FaCogs: FaCogs,
  FaCode: FaCode,
  FaServer: FaServer,
  FaGlobe: FaGlobe,
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/public/services');
        if (res.data?.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.warn('Error fetching services:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        badge="RY WebSphere Capabilities"
        title="Web Development & Digital Solutions"
        subtitle="Explore our comprehensive suite of 15 specialized web engineering services—from high-impact local business websites to custom full-stack web applications."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 col-md-8">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control-ry pe-5 py-3"
                  placeholder="Search services (e.g. Gym, Doctor, E-commerce, Redesign)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch
                  className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                  size={18}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading agency services..." />
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No services match your search term "{searchTerm}".</h5>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="btn btn-ry-secondary btn-sm mt-3"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredServices.map((service) => {
                const IconComponent = iconMap[service.icon] || FaGlobe;
                return (
                  <div key={service.slug} className="col-lg-4 col-md-6">
                    <div className="ry-card p-4 h-100 d-flex flex-column justify-content-between ry-card-interactive">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div
                            className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary"
                            style={{ border: '1px solid var(--border-color)' }}
                          >
                            <IconComponent size={24} />
                          </div>
                          <span
                            className="badge bg-surface text-muted border"
                            style={{ fontSize: '0.72rem' }}
                          >
                            Service #{service.order}
                          </span>
                        </div>

                        <h4 className="fw-bold mb-2 h5">{service.title}</h4>
                        <p className="text-muted small mb-3">{service.shortDescription}</p>

                        <div className="mb-4">
                          <div className="small fw-semibold text-secondary mb-2">Key Features:</div>
                          <ul className="list-unstyled d-flex flex-column gap-1.5 small text-muted">
                            {service.features?.slice(0, 3).map((feat, i) => (
                              <li key={i} className="d-flex align-items-start gap-2">
                                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={12} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div
                        className="d-flex align-items-center gap-2 pt-3 border-top"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <Link
                          to={`/services/${service.slug}`}
                          className="btn btn-ry-secondary btn-sm flex-grow-1"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/contact', {
                              state: { preselectedService: service.title },
                            })
                          }
                          className="btn btn-ry-primary btn-sm flex-grow-1"
                        >
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Banner */}
          <div
            className="p-4 p-md-5 rounded-4 ry-card mt-5 text-center position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 className="fw-bold mb-2">Need a Custom Web Solution Not Listed Here?</h3>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 600 }}>
              We design and build bespoke software, APIs, database architectures, and integrations tailored to your specific business requirements.
            </p>
            <Link to="/contact" className="btn btn-ry-primary px-4 py-2.5">
              <span>Discuss Your Custom Project</span>
              <FaArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
