import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaEnvelope, FaRocket, FaCheckCircle, FaLaptopCode, FaShieldAlt, FaBolt, FaStar } from 'react-icons/fa';
import Logo from './Logo';

// Official Launch Date: November 20, 2026 at 08:00:00 AM IST (GMT+5:30)
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

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      className="launch-countdown-wrapper min-vh-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
      data-force-white="true"
    >
      {/* Dynamic Cosmic Background Glows & Grid */}
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
              <span className="fw-semibold small">Grand Launch Countdown</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="container my-auto py-4 py-lg-5 position-relative z-2">
        <div className="row align-items-center g-5">
          {/* Left Column: Heading, Countdown & Action Buttons */}
          <div className="col-12 col-lg-7 text-center text-lg-start">
            {/* Launch Status Pill */}
            <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill launch-pill mb-4 shadow">
              <FaRocket className="text-warning" />
              <span className="small text-uppercase tracking-wider fw-bold">
                Official Launch • 20 November 2026 at 08:00 AM IST
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="launch-title display-4 mb-3">
              <span className="launch-white-text">Something Extraordinary</span>
              <br />
              <span className="launch-gradient-text">Is In The Works</span>
            </h1>

            {/* Subtitle */}
            <p className="lead launch-subtitle mb-4">
              We are engineering a next-generation web development experience for ambitious businesses and high-growth brands. Our official digital gates unlock in:
            </p>

            {/* Digital Countdown Timer Cards */}
            <div className="row g-2 g-sm-3 mb-4 justify-content-center justify-content-lg-start">
              <div className="col-3 col-sm-auto" style={{ minWidth: '95px' }}>
                <div className="launch-card text-center">
                  <div className="launch-card-number">{pad(timeLeft.days)}</div>
                  <div className="launch-card-label">Days</div>
                </div>
              </div>
              <div className="col-3 col-sm-auto" style={{ minWidth: '95px' }}>
                <div className="launch-card text-center">
                  <div className="launch-card-number">{pad(timeLeft.hours)}</div>
                  <div className="launch-card-label">Hours</div>
                </div>
              </div>
              <div className="col-3 col-sm-auto" style={{ minWidth: '95px' }}>
                <div className="launch-card text-center">
                  <div className="launch-card-number">{pad(timeLeft.minutes)}</div>
                  <div className="launch-card-label">Minutes</div>
                </div>
              </div>
              <div className="col-3 col-sm-auto" style={{ minWidth: '95px' }}>
                <div className="launch-card text-center">
                  <div className="launch-card-number">{pad(timeLeft.seconds)}</div>
                  <div className="launch-card-label">Seconds</div>
                </div>
              </div>
            </div>

            {/* Feature Chips */}
            <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-lg-start">
              <div className="launch-chip">
                <FaBolt className="text-info me-2" />
                <span>Ultra-Fast Web Speed</span>
              </div>
              <div className="launch-chip">
                <FaLaptopCode className="text-primary me-2" />
                <span>Full-Stack Engineering</span>
              </div>
              <div className="launch-chip">
                <FaShieldAlt className="text-success me-2" />
                <span>Enterprise Security</span>
              </div>
            </div>

            {/* Founder Inquiry Box */}
            <div className="launch-cta-box p-4 rounded-4 shadow-lg text-start">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary bg-opacity-25 text-info px-2 py-1 rounded-pill small">
                  Early Access
                </span>
                <span className="text-white fw-bold">Have a project in mind?</span>
              </div>
              <p className="small mb-3 text-light-silver">
                Connect directly with founder <strong>Ranjan Yadav</strong> for pre-launch booking or custom website consulting.
              </p>
              <div className="d-flex flex-wrap gap-3">
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
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Graphic Showcase */}
          <div className="col-12 col-lg-5 text-center">
            <div className="launch-visual-showcase position-relative mx-auto">
              {/* Backlight Ring */}
              <div className="launch-visual-glow" />

              {/* Main 3D Artwork */}
              <div className="launch-image-frame rounded-4 overflow-hidden shadow-2xl position-relative">
                <img
                  src="/launch-graphic.jpg"
                  alt="RY WebSphere 3D Architecture"
                  className="img-fluid w-100 h-100 object-fit-cover launch-hero-img"
                  onError={(e) => {
                    // Fallback to high-res aesthetic tech artwork if needed
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="launch-image-overlay" />
              </div>

              {/* Floating Hologram Badges */}
              <div className="floating-badge badge-top-left shadow">
                <FaStar className="text-warning me-2" />
                <span>Next-Gen Web Architecture</span>
              </div>

              <div className="floating-badge badge-bottom-right shadow">
                <span className="pulse-dot-green me-2" />
                <span>Launching 20 Nov • 08:00 AM IST</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (No Admin Login, Clean Agency Branding) */}
      <footer className="container py-4 position-relative z-2">
        <div className="text-center border-top border-secondary border-opacity-25 pt-3">
          <p className="mb-0 small text-light-silver">
            &copy; 2026 RY WebSphere. Crafted with excellence by Ranjan Yadav. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Embedded Component CSS */}
      <style>{`
        .launch-countdown-wrapper {
          background-color: #070a13 !important;
          background-image: radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.18) 0%, transparent 70%) !important;
          min-height: 100vh;
          color: #ffffff !important;
        }

        .launch-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 38px 38px;
          pointer-events: none;
        }

        .launch-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.65;
        }

        .glow-1 {
          width: 550px;
          height: 550px;
          background: rgba(99, 102, 241, 0.3);
          top: -150px;
          right: -80px;
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          background: rgba(6, 182, 212, 0.25);
          bottom: -80px;
          left: -120px;
        }

        .glow-3 {
          width: 380px;
          height: 380px;
          background: rgba(139, 92, 246, 0.22);
          top: 40%;
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

        .launch-title {
          font-size: clamp(2.3rem, 5.5vw, 3.8rem) !important;
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
          font-size: clamp(1rem, 2vw, 1.15rem) !important;
          line-height: 1.6 !important;
          color: #cbd5e1 !important;
          max-width: 620px;
        }

        /* DIGITAL COUNTDOWN CARDS */
        .launch-card {
          background: rgba(15, 23, 42, 0.85) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 20px;
          padding: 1.25rem 0.6rem;
          backdrop-filter: blur(18px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .launch-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.6) !important;
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.25);
        }

        .launch-card-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(2rem, 4vw, 2.8rem) !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          text-shadow: 0 0 25px rgba(56, 189, 248, 0.45) !important;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .launch-card-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #94a3b8 !important;
          font-weight: 700;
        }

        .launch-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.1rem;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.75) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          font-size: 0.85rem;
          color: #f1f5f9 !important;
          backdrop-filter: blur(10px);
        }

        .launch-cta-box {
          background: rgba(15, 23, 42, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          backdrop-filter: blur(16px);
          max-width: 620px;
        }

        .text-light-silver {
          color: #cbd5e1 !important;
        }

        /* 3D VISUAL SHOWCASE */
        .launch-visual-showcase {
          max-width: 480px;
          position: relative;
        }

        .launch-visual-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 75%);
          filter: blur(40px);
          border-radius: 30px;
          z-index: 1;
        }

        .launch-image-frame {
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          aspect-ratio: 1 / 1;
          background: #090e1a;
        }

        .launch-hero-img {
          transition: transform 0.6s ease;
        }

        .launch-image-frame:hover .launch-hero-img {
          transform: scale(1.04);
        }

        .launch-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 60%, rgba(7, 10, 19, 0.85) 100%);
          pointer-events: none;
        }

        /* FLOATING HOLOGRAPHIC BADGES */
        .floating-badge {
          position: absolute;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 1.1rem;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(14px);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          animation: floatAnimation 4s ease-in-out infinite;
        }

        .badge-top-left {
          top: 20px;
          left: -15px;
          animation-delay: 0s;
        }

        .badge-bottom-right {
          bottom: 25px;
          right: -15px;
          animation-delay: 2s;
        }

        .pulse-dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 991px) {
          .launch-visual-showcase {
            max-width: 360px;
            margin-top: 1rem;
          }
          .badge-top-left {
            left: 5px;
          }
          .badge-bottom-right {
            right: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default LaunchCountdown;