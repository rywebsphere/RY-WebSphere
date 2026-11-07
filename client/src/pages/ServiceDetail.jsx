import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaArrowRight,
  FaCalendarCheck,
  FaWhatsapp,
  FaShieldAlt,
  FaClock,
  FaQuestionCircle,
  FaFileCode,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/public/services/${slug}`);
        if (res.data?.success) {
          setService(res.data.data);
        } else {
          setError('Service not found.');
        }
      } catch (err) {
        setError(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Loading service details..." minHeight="60vh" />;
  }

  if (error || !service) {
    return (
      <div className="container py-5 text-center my-5">
        <h2 className="fw-bold mb-3">Service Not Found</h2>
        <p className="text-muted mb-4">
          The requested service "{slug}" could not be located.
        </p>
        <Link to="/services" className="btn btn-ry-primary">
          Back to All Services
        </Link>
      </div>
    );
  }

  const whatsappNumber = settings?.whatsappNumber;
  const isRealNumber = whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER';
  const whatsappUrl = isRealNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hello%20RY%20WebSphere!%20I'm%20interested%20in%20your%20service:%20${encodeURIComponent(service.title)}`
    : '/contact';

  return (
    <div>
      <PageHeader
        badge={`Service #${service.order}`}
        title={service.title}
        subtitle={service.shortDescription}
        breadcrumbs={[
          { label: 'Services', path: '/services' },
          { label: service.title },
        ]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row g-5">
            {/* Main Content Column */}
            <div className="col-lg-8">
              {/* Detailed Description */}
              <div className="ry-card p-4 p-md-5 mb-4">
                <h3 className="fw-bold mb-3">Service Overview</h3>
                <p className="text-secondary lead" style={{ fontSize: '1.1rem' }}>
                  {service.fullDescription}
                </p>
                <p className="text-muted small">
                  At RY WebSphere, every website we build is crafted to deliver practical business outcomes—prioritizing mobile performance, clear user pathways, search visibility, and frictionless communication channels for your prospects.
                </p>
              </div>

              {/* What You Get (Deliverables) */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="ry-card p-4 p-md-5 mb-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FaFileCode className="text-primary" size={22} />
                    <h3 className="fw-bold mb-0">Project Deliverables</h3>
                  </div>
                  <p className="text-muted small mb-4">
                    Tangible deliverables included in this service package upon project completion:
                  </p>

                  <div className="row g-3">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="col-md-6">
                        <div
                          className="p-3 rounded-3 h-100 d-flex align-items-start gap-2.5"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={16} />
                          <span className="small fw-medium">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features & Architecture */}
              <div className="ry-card p-4 p-md-5 mb-4">
                <h3 className="fw-bold mb-3">Key Features & Technical Capabilities</h3>
                <p className="text-muted small mb-4">
                  Detailed technical features incorporated into our {service.title} engineering:
                </p>

                <div className="d-flex flex-column gap-3">
                  {service.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-3 d-flex align-items-center gap-3"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <span
                        className="badge bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 28, height: 28 }}
                      >
                        {idx + 1}
                      </span>
                      <span className="fw-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div className="ry-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaQuestionCircle className="text-primary" size={20} />
                  <h3 className="fw-bold mb-0">Frequently Asked Questions</h3>
                </div>

                <div className="accordion d-flex flex-column gap-3 pt-2">
                  <div className="p-3 rounded-3 bg-surface border">
                    <div className="fw-bold mb-1">How long does this project typically take?</div>
                    <div className="small text-muted">
                      Standard single-page sites take 3–5 business days, while multi-page business websites take 7–10 business days. Custom applications depend on specified feature scope.
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-surface border">
                    <div className="fw-bold mb-1">Are revisions included?</div>
                    <div className="small text-muted">
                      Yes. All our packages include agreed revision rounds (typically 2 to 4 rounds) during the staging review phase to ensure you are 100% satisfied before public launch.
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-surface border">
                    <div className="fw-bold mb-1">Do I own the code and website?</div>
                    <div className="small text-muted">
                      Yes. Upon full project handover and settlement, complete ownership of the website codebase and deployed assets belongs entirely to your business.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column: Sticky Action Box */}
            <div className="col-lg-4">
              <div className="position-sticky" style={{ top: 100 }}>
                <div
                  className="ry-card p-4 rounded-4 shadow-lg mb-4"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <span className="ry-badge mb-3">Project Consultation</span>
                  <h4 className="fw-bold mb-2">Ready to Get Started?</h4>
                  <p className="text-muted small mb-4">
                    Connect directly with Ranjan Yadav to discuss your requirements, receive an itemized quote, and schedule your kickoff.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/contact', {
                        state: { preselectedService: service.title },
                      })
                    }
                    className="btn btn-ry-primary w-100 py-3 mb-2.5 justify-content-center"
                  >
                    <FaCalendarCheck size={16} />
                    <span>Request a Quote for This Service</span>
                  </button>

                  {isRealNumber ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-success w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-3"
                    >
                      <FaWhatsapp size={18} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  ) : null}

                  <hr style={{ borderColor: 'var(--border-color)' }} />

                  <div className="d-flex flex-column gap-2 text-muted small">
                    <div className="d-flex align-items-center gap-2">
                      <FaShieldAlt className="text-success" />
                      <span>Transparent scope & no hidden costs</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaClock className="text-primary" />
                      <span>Packages starting at ₹2,999</span>
                    </div>
                  </div>
                </div>

                <div className="ry-card p-3 rounded-3 text-center">
                  <div className="small text-muted mb-1">Looking for packages?</div>
                  <Link to="/pricing" className="text-primary fw-semibold small">
                    Compare All Pricing Tiers →
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

export default ServiceDetail;
