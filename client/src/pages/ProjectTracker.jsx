import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaWhatsapp,
  FaExclamationCircle,
  FaRocket,
  FaCode,
  FaCompass,
  FaPaintBrush,
  FaCloud,
  FaShieldAlt,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const PHASES = [
  {
    key: 'Discovery & Planning',
    name: 'Discovery & Architecture',
    desc: 'Requirements gathering, sitemap definition, technical roadmap',
    icon: FaCompass,
    step: 1,
  },
  {
    key: 'UI/UX Design',
    name: 'UI/UX & Interactive Mockups',
    desc: 'Visual branding, color palettes, responsive desktop & mobile screens',
    icon: FaPaintBrush,
    step: 2,
  },
  {
    key: 'Development',
    name: 'Full-Stack MERN Engineering',
    desc: 'React frontend, Express REST APIs, database schemas, feature builds',
    icon: FaCode,
    step: 3,
  },
  {
    key: 'Testing & Revisions',
    name: 'QA Testing & Client Review',
    desc: 'Cross-browser testing, Core Web Vitals audit, revision polish',
    icon: FaShieldAlt,
    step: 4,
  },
  {
    key: 'Cloud Deployment',
    name: 'Google Cloud & Domain Launch',
    desc: 'Domain DNS routing, Google Cloud deployment, SSL provisioning, handover',
    icon: FaCloud,
    step: 5,
  },
];

const ProjectTracker = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [inputCode, setInputCode] = useState(code || '');
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState('');

  const fetchTrackData = async (trackingCode) => {
    if (!trackingCode?.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/public/track/${trackingCode.trim()}`);
      if (res.data?.success) {
        setProjectData(res.data.data);
      } else {
        setError(res.data?.message || 'Could not locate project record.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No project found with this tracking ID. Please check your reference code or contact our support.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      setInputCode(code);
      fetchTrackData(code);
    }
  }, [code]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/track/${inputCode.trim().toUpperCase()}`);
      fetchTrackData(inputCode.trim().toUpperCase());
    }
  };

  const getPhaseStepIndex = (phaseName) => {
    if (!phaseName) return 0;
    const lower = String(phaseName).toLowerCase();
    if (lower.includes('discover')) return 0;
    if (lower.includes('ui') || lower.includes('design') || lower.includes('wireframe')) return 1;
    if (lower.includes('develop') || lower.includes('mern') || lower.includes('code')) return 2;
    if (lower.includes('test') || lower.includes('revision') || lower.includes('qa')) return 3;
    if (lower.includes('cloud') || lower.includes('deploy') || lower.includes('launch') || lower.includes('domain')) return 4;
    if (lower.includes('complete')) return 5;
    return 0;
  };

  const currentPhaseIndex = projectData ? getPhaseStepIndex(projectData.projectPhase) : 0;
  const whatsappPhone = settings?.whatsappNumber || '917800462309';

  const handleWhatsAppInquiry = () => {
    if (!projectData) return;
    const msg = `Hello RY WebSphere team! I am checking my project status for:
- Tracking Code: ${projectData.trackingCode}
- Business: ${projectData.businessName || projectData.fullName}
- Service: ${projectData.serviceRequested}
- Current Phase: ${projectData.projectPhase} (${projectData.projectProgressPercent}%)

Could you please provide an update?`;

    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div>
      <PageHeader
        badge="Live Status Portal"
        title="Real-Time Client Project Tracker"
        subtitle="Track your website build progress from initial discovery through to live Google Cloud deployment."
        breadcrumbs={[{ label: 'Project Tracker' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container max-w-900">
          {/* Tracker Search Bar */}
          <div className="ry-card p-4 p-md-5 mb-5 shadow-sm">
            <h4 className="fw-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
              Enter Your Project Reference Code
            </h4>
            <p className="text-muted small text-center mb-4">
              Your tracking code was sent to you upon consultation submission (e.g., <code>RY-A1B2C</code>).
            </p>

            <form onSubmit={handleSearch} className="max-w-600 mx-auto">
              <div className="input-group input-group-lg">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FaSearch />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. RY-XXXXX or Project Reference"
                  className="form-control border-start-0 text-uppercase font-monospace"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-ry-primary px-4 fw-bold"
                >
                  {loading ? <FaSpinner className="spin-animation" /> : 'Track Status'}
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger mt-4 mb-0 py-2.5 small d-flex align-items-center gap-2 max-w-600 mx-auto">
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Active Tracker Card */}
          {projectData && (
            <div className="ry-card p-4 p-md-5 animate-fade-in shadow-lg border-primary">
              {/* Header Info */}
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-primary text-white font-monospace px-3 py-1.5 rounded-pill fw-bold">
                      {projectData.trackingCode}
                    </span>
                    <span className="badge bg-secondary bg-opacity-15 text-primary px-2.5 py-1 rounded-pill small">
                      {projectData.serviceRequested || 'Website Development'}
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 mt-2" style={{ color: 'var(--text-primary)' }}>
                    {projectData.businessName || projectData.fullName}
                  </h3>
                  <div className="text-muted small mt-1">
                    Client: <strong>{projectData.fullName}</strong>
                  </div>
                </div>

                <div className="text-md-end">
                  <div className="small text-muted fw-bold mb-1">Overall Completion</div>
                  <div className="display-6 fw-extrabold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                    {projectData.projectProgressPercent}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="progress rounded-pill" style={{ height: 12, backgroundColor: 'var(--bg-surface)' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    role="progressbar"
                    style={{ width: `${projectData.projectProgressPercent}%` }}
                    aria-valuenow={projectData.projectProgressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>

              {/* Development Phases Stepper */}
              <div className="mb-5">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Milestone Phases
                </h5>
                <div className="d-flex flex-column gap-3">
                  {PHASES.map((phase, index) => {
                    const isCompleted = index < currentPhaseIndex;
                    const isCurrent = index === currentPhaseIndex;
                    const isUpcoming = index > currentPhaseIndex;
                    const IconComponent = phase.icon;

                    return (
                      <div
                        key={phase.key}
                        className="p-3.5 px-4 rounded-3 d-flex align-items-center justify-content-between transition-all"
                        style={{
                          backgroundColor: isCurrent
                            ? 'rgba(59, 130, 246, 0.1)'
                            : isCompleted
                            ? 'rgba(16, 185, 129, 0.06)'
                            : 'var(--bg-surface)',
                          border: isCurrent
                            ? '2px solid var(--accent-blue)'
                            : isCompleted
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid var(--border-color)',
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: 42,
                              height: 42,
                              backgroundColor: isCompleted
                                ? '#10b981'
                                : isCurrent
                                ? 'var(--accent-blue)'
                                : 'var(--border-color)',
                              color: '#ffffff',
                            }}
                          >
                            {isCompleted ? <FaCheckCircle size={18} /> : <IconComponent size={18} />}
                          </div>

                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                                {phase.name}
                              </h6>
                              {isCurrent && (
                                <span className="badge bg-primary text-white rounded-pill px-2.5 py-0.5 small" style={{ fontSize: '0.7rem' }}>
                                  IN PROGRESS
                                </span>
                              )}
                              {isCompleted && (
                                <span className="badge bg-success text-white rounded-pill px-2 py-0.5 small" style={{ fontSize: '0.7rem' }}>
                                  COMPLETED
                                </span>
                              )}
                            </div>
                            <div className="text-muted small mt-0.5" style={{ fontSize: '0.82rem' }}>
                              {phase.desc}
                            </div>
                          </div>
                        </div>

                        <div className="d-none d-sm-block text-end">
                          <span className="small fw-semibold text-muted">
                            Stage {phase.step} of 5
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Note & Launch Target */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <div className="p-3.5 rounded-3 bg-surface border h-100">
                    <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem' }}>
                      Lead Developer Status Note
                    </div>
                    <p className="mb-0 small text-secondary" style={{ lineHeight: 1.5 }}>
                      {projectData.projectStatusNote || 'Project is proceeding according to timeline. Our development team is actively building features.'}
                    </p>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="p-3.5 rounded-3 bg-surface border h-100">
                    <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem' }}>
                      Estimated Completion
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <FaClock className="text-primary" size={16} />
                      <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                        {projectData.estimatedCompletionDate
                          ? new Date(projectData.estimatedCompletionDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'As agreed in timeline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain & Hosting Commercial Notice */}
              <div
                className="p-3.5 rounded-3 mb-4 d-flex align-items-start gap-2.5"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                }}
              >
                <FaCloud className="text-primary flex-shrink-0 mt-1" size={16} />
                <div className="small text-secondary" style={{ lineHeight: 1.45 }}>
                  <strong className="text-primary">Fulfillment Assurance:</strong> RY WebSphere buys the custom domain and deploys your application on Google Cloud servers directly. Cloud hosting and domain registry fees are billed at actuals transparently on your invoice.
                </div>
              </div>

              {/* Direct Support Actions */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <div className="small text-muted">
                  Questions regarding your build? Connect with your assigned engineer.
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="btn btn-success fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                >
                  <FaWhatsapp size={16} />
                  <span>Message Project Lead</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectTracker;
