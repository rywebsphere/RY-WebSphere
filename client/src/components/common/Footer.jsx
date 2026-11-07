import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaLock } from 'react-icons/fa';
import Logo from './Logo';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const businessEmail = settings.businessEmail || 'rywebsphere@gmail.com';
  const whatsappNumber = settings.whatsappNumber || 'YOUR_WHATSAPP_NUMBER';

  return (
    <footer
      className="pt-5 pb-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="container">
        <div className="row g-4 pb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          {/* Column 1: Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Logo size="large" className="mb-3" />
            <p className="small text-muted mb-3" style={{ maxWidth: 360 }}>
              <strong>RY WebSphere</strong> is a professional web development agency owned by{' '}
              <strong>Ranjan Yadav</strong>. We build modern, responsive, high-converting websites and custom web applications for businesses, startups, and professionals.
            </p>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="ry-badge" style={{ fontSize: '0.72rem' }}>
                📍 India & Global Remote
              </span>
              <span className="ry-badge" style={{ fontSize: '0.72rem' }}>
                ⚡ Fast Turnaround
              </span>
            </div>

            {/* Social Icons */}
            <div className="d-flex align-items-center gap-2">
              <a
                href={settings.socialLinks?.github || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 34, height: 34 }}
                aria-label="GitHub"
              >
                <FaGithub size={14} />
              </a>
              <a
                href={settings.socialLinks?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 34, height: 34 }}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
              <a
                href={settings.socialLinks?.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 34, height: 34 }}
                aria-label="Twitter / X"
              >
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Web Solutions */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              KEY SERVICES
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/services/business-website-development" className="text-secondary text-decoration-none">
                  Business Websites
                </Link>
              </li>
              <li>
                <Link to="/services/gym-website-development" className="text-secondary text-decoration-none">
                  Gym & Fitness Sites
                </Link>
              </li>
              <li>
                <Link to="/services/salon-website-development" className="text-secondary text-decoration-none">
                  Salon & Spa Sites
                </Link>
              </li>
              <li>
                <Link to="/services/doctor-clinic-websites" className="text-secondary text-decoration-none">
                  Doctor & Clinic Sites
                </Link>
              </li>
              <li>
                <Link to="/services/restaurant-cafe-websites" className="text-secondary text-decoration-none">
                  Restaurant & Cafe Sites
                </Link>
              </li>
              <li>
                <Link to="/services/ecommerce-websites" className="text-secondary text-decoration-none">
                  E-commerce Stores
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary fw-medium text-decoration-none">
                  View All 15 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industry Demos */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              INDUSTRY DEMOS
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/industries/gym-fitness" className="text-secondary text-decoration-none">
                  Gym & Fitness Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/salon-beauty" className="text-secondary text-decoration-none">
                  Salon & Beauty Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/doctor-clinic" className="text-secondary text-decoration-none">
                  Clinic & Doctor Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/restaurant-cafe" className="text-secondary text-decoration-none">
                  Restaurant & Cafe Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/coaching-education" className="text-secondary text-decoration-none">
                  Coaching Institute Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/real-estate" className="text-secondary text-decoration-none">
                  Real Estate Demo
                </Link>
              </li>
              <li>
                <Link to="/industries/local-business" className="text-secondary text-decoration-none">
                  Local Business Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Agency & Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              DIRECT CONTACT
            </h6>
            <p className="small text-muted mb-3">
              Ready to discuss your project? Reach out directly to receive a transparent quote and roadmap.
            </p>

            <div className="d-flex flex-column gap-2.5 small">
              <a
                href={whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER' ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}` : '/contact'}
                className="d-flex align-items-center gap-2 text-decoration-none text-secondary py-1"
              >
                <FaWhatsapp className="text-success" size={17} />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>

              <a
                href={`mailto:${businessEmail}`}
                className="d-flex align-items-center gap-2 text-decoration-none text-secondary py-1"
              >
                <FaEnvelope className="text-primary" size={16} />
                <span>Email: {businessEmail}</span>
              </a>

              <div className="d-flex gap-2 mt-2">
                <Link
                  to="/pricing"
                  className="btn btn-outline-primary btn-sm text-start px-2.5 py-1.5"
                  style={{ fontSize: '0.82rem' }}
                >
                  Packages →
                </Link>
                <Link
                  to="/track"
                  className="btn btn-ry-secondary btn-sm text-start px-2.5 py-1.5"
                  style={{ fontSize: '0.82rem' }}
                >
                  Track Project ➔
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 small text-muted">
          <div>
            © {currentYear}{' '}
            <span
              style={{ cursor: 'default' }}
              onDoubleClick={() => window.dispatchEvent(new CustomEvent('open-admin-portal'))}
              title=""
            >
              <strong>RY WebSphere</strong>
            </span>
            . Founded & Directed by{' '}
            <strong
              style={{ cursor: 'default' }}
              onDoubleClick={() => window.dispatchEvent(new CustomEvent('open-admin-portal'))}
            >
              Ranjan Yadav
            </strong>
            . All Rights Reserved.
          </div>

          <div className="d-flex align-items-center flex-wrap gap-3">
            <Link to="/track" className="text-muted text-decoration-none hover-text-primary">
              Live Tracker
            </Link>
            <span>•</span>
            <Link to="/about" className="text-muted text-decoration-none hover-text-primary">
              About Ranjan Yadav
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="text-muted text-decoration-none hover-text-primary">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="text-muted text-decoration-none hover-text-primary">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
