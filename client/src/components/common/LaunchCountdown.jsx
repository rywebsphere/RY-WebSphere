import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope, FaRocket, FaEye, FaLock, FaCheckCircle, FaLaptopCode, FaShieldAlt, FaBolt } from 'react-icons/fa';
import Logo from './Logo';

// Launch Date: November 20, 2026 at 08:00:00 AM IST (GMT+5:30)
export const LAUNCH_DATE_ISO = '2026-11-20T08:00:00+05:30';

const LaunchCountdown = ({ targetDate = LAUNCH_DATE_ISO, onLaunch }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [copiedEmail, setCopiedEmail] = useState(false);

  function calculateTimeLeft(target) {
    const difference = new Date(target).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      setTimeLeft(remaining);
      if (remaining.isPast) {
        clearInterval(timer);
        if (onLaunch) onLaunch();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onLaunch]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('rywebsphere@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleEnablePreview = () => {
    sessionStorage.setItem('ry_preview_mode', 'true');
    window.location.reload();
  };

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      className="launch-countdown-wrapper min-vh-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
      data-force-white="true"
    >
      {/* Background Ambient Glows & Grid */}
      <div className="launch-bg-glow glow-1" />
      <div className="launch-bg-glow glow-2" />
      <div className="launch-bg-glow glow-3" />
      <div className="launch-bg-grid" />

      {/* Top Header */}
      <header className="container py-4 position-relative z-2">
        <div className="d-flex justify-content-between align-items-center">
          <Logo size="normal" />
          <div className="d-flex align-items-center gap-2">
            <span className="launch-live-badge d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill">
              <span className="launch-pulse-dot" />
              <span className="fw-semibold small">Grand Launch</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Countdown Hero */}
      <main className="container my-auto py-4 py-md-5 position-relative z-2 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            {/* Status Pill */}
            <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill launch-pill mb-4 shadow">
              <FaRocket className="text-warning" />
              <span className="small text-uppercase tracking-wider fw-bold">
                Official Launch • 20 November 2026 at 08:00 AM IST
              </span>
            </div>

            {/* Main Headline - Ultra High Contrast & Glowing */}
            <h1 className="launch-title display-4 mb-3">
              <span className="launch-white-text">Something Extraordinary</span>
              <br />
              <span className="launch-gradient-text">Is In The Works</span>
            </h1>

            {/* Subtitle */}
            <p className="lead launch-subtitle mx-auto mb-5" style={{ maxWidth: '680px' }}>
              We are engineering a next-generation web development experience for ambitious businesses and modern enterprises. Our official digital gates unlock in:
            </p>

            {/* Countdown Cards */}
            <div className="row g-3 g-md-4 justify-content-center mb-5">
              <div className="col-6 col-sm-3 col-md-2">
                <div className="launch-card">
                  <div className="launch-card-number">{pad(timeLeft.days)}</div>
                  <div className="launch-card-label">Days</div>
                </div>
              </div>
              <div className="col-6 col-sm-3 col-md-2">
                <div className="launch-card">
                  <div className="launch-card-number">{pad(timeLeft.hours)}</div>
                  <div className="launch-card-label">Hours</div>
                </div>
              </div>
              <div className="col-6 col-sm-3 col-md-2">
                <div className="launch-card">
                  <div className="launch-card-number">{pad(timeLeft.minutes)}</div>
                  <div className="launch-card-label">Minutes</div>
                </div>
              </div>
              <div className="col-6 col-sm-3 col-md-2">
                <div className="launch-card">
                  <div className="launch-card-number">{pad(timeLeft.seconds)}</div>
                  <div className="launch-card-label">Seconds</div>
                </div>
              </div>
            </div>

            {/* Teaser Feature Chips */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <div className="launch-chip">
                <FaBolt className="text-info me-2" />
                <span>Ultra-Fast Web Solutions</span>
              </div>
              <div className="launch-chip">
                <FaLaptopCode className="text-primary me-2" />
                <span>Bespoke Full-Stack Engineering</span>
              </div>
              <div className="launch-chip">
                <FaShieldAlt className="text-success me-2" />
                <span>Enterprise Security & Scale</span>
              </div>
            </div>

            {/* Direct Connect / Founder Inquiry */}
            <div className="launch-cta-box p-4 rounded-4 mx-auto" style={{ maxWidth: '640px' }}>
              <h5 className="fw-bold mb-2">Have a project or want early access?</h5>
              <p className="small mb-3">
                Reach out directly to founder <strong>Ranjan Yadav</strong> for pre-launch project booking or bespoke web consulting.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a
                  href="https://wa.me/919026402646?text=Hi%20Ranjan,%20I%20saw%20the%20upcoming%20RY%20WebSphere%20launch!%20I'd%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill shadow"
                >
                  <FaWhatsapp size={18} />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="btn btn-outline-light d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill"
                >
                  {copiedEmail ? <FaCheckCircle className="text-success" /> : <FaEnvelope />}
                  <span>{copiedEmail ? 'Email Copied!' : 'Email Founder'}</span>
                </button>

                <button
                  onClick={handleEnablePreview}
                  type="button"
                  className="btn btn-link text-decoration-none d-inline-flex align-items-center gap-1 small px-2 py-1 launch-preview-btn"
                  title="Owner / Developer preview mode"
                >
                  <FaEye size={14} />
                  <span>Preview Full Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-4 position-relative z-2">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border-top border-secondary border-opacity-25 pt-3">
          <p className="mb-0 small text-light-silver">
            &copy; 2026 RY WebSphere. Crafted with excellence by Ranjan Yadav.
          </p>
          <div className="d-flex align-items-center gap-3 small">
            <Link to="/admin/login" className="launch-admin-link text-decoration-none d-inline-flex align-items-center gap-1">
              <FaLock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Embedded Component CSS */}
      <style>{`
        .launch-countdown-wrapper {
          background-color: #070a13 !important;
          background-image: radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.18) 0%, transparent 65%) !important;
          min-height: 100vh;
          color: #ffffff !important;
        }

        .launch-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        .launch-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          opacity: 0.65;
        }

        .glow-1 {
          width: 500px;
          height: 500px;
          background: rgba(99, 102, 241, 0.3);
          top: -120px;
          right: -80px;
        }

        .glow-2 {
          width: 450px;
          height: 450px;
          background: rgba(6, 182, 212, 0.25);
          bottom: -50px;
          left: -120px;
        }

        .glow-3 {
          width: 350px;
          height: 350px;
          background: rgba(139, 92, 246, 0.22);
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .launch-live-badge {
          background: rgba(59, 130, 246, 0.18) !important;
          border: 1px solid rgba(96, 165, 250, 0.45) !important;
          color: #bfdbfe !important;
        }

        .launch-pulse-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 12px #38bdf8;
          animation: launchPulse 2s infinite ease-in-out;
        }

        @keyframes launchPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .launch-pill {
          background: rgba(15, 23, 42, 0.85) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #f8fafc !important;
          backdrop-filter: blur(14px);
        }

        .launch-pill span {
          color: #f1f5f9 !important;
          letter-spacing: 0.08em;
        }

        /* HEADING CONTRAST FIX */
        .launch-title {
          font-size: clamp(2.2rem, 5.5vw, 4rem) !important;
          line-height: 1.15 !important;
          letter-spacing: -0.03em !important;
          font-weight: 800 !important;
          color: #ffffff !important;
        }

        .launch-white-text {
          color: #ffffff !important;
          text-shadow: 0 2px 25px rgba(255, 255, 255, 0.3) !important;
          display: inline-block;
        }

        .launch-gradient-text {
          display: inline-block;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          color: transparent !important;
          filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.5));
        }

        .launch-subtitle {
          font-size: clamp(1rem, 2vw, 1.18rem) !important;
          line-height: 1.6 !important;
          color: #cbd5e1 !important;
        }

        .launch-card {
          background: rgba(15, 23, 42, 0.85) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          border-radius: 20px;
          padding: 1.35rem 0.75rem;
          backdrop-filter: blur(18px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .launch-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.6) !important;
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.25);
        }

        .launch-card-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(2.2rem, 4.5vw, 3.1rem) !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          text-shadow: 0 0 24px rgba(56, 189, 248, 0.45) !important;
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .launch-card-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #94a3b8 !important;
          font-weight: 700;
        }

        .launch-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.2rem;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.75) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          font-size: 0.88rem;
          color: #f1f5f9 !important;
          backdrop-filter: blur(10px);
        }

        .launch-cta-box {
          background: rgba(15, 23, 42, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
        }

        .launch-cta-box h5 {
          color: #ffffff !important;
        }

        .launch-cta-box p {
          color: #cbd5e1 !important;
        }

        .launch-preview-btn {
          color: #94a3b8 !important;
        }

        .launch-preview-btn:hover {
          color: #ffffff !important;
        }

        .text-light-silver {
          color: #94a3b8 !important;
        }

        .launch-admin-link {
          color: #94a3b8 !important;
          transition: color 0.2s ease;
        }

        .launch-admin-link:hover {
          color: #38bdf8 !important;
        }
      `}</style>
    </div>
  );
};

export default LaunchCountdown;