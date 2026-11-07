import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaSlidersH,
  FaBolt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMobileAlt,
  FaTachometerAlt,
  FaShieldAlt,
} from 'react-icons/fa';

const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="ry-card p-4 p-md-5 overflow-hidden">
      <div className="row align-items-center mb-4">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary bg-opacity-15 text-primary px-3 py-1 rounded-pill small fw-bold">
              <FaSlidersH className="me-1.5" /> Interactive Website Transformation
            </span>
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Before vs After: The Power of Modern MERN Engineering
          </h3>
          <p className="text-muted small mb-0">
            Slide left and right to inspect how we transform cluttered, slow legacy websites into sleek, lightning-fast conversion engines.
          </p>
        </div>
        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${sliderPos > 70 ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setSliderPos(90)}
            >
              Show Legacy (Before)
            </button>
            <button
              type="button"
              className={`btn ${sliderPos < 30 ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setSliderPos(10)}
            >
              Show Redesign (After)
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        className="position-relative user-select-none rounded-4 overflow-hidden border"
        style={{
          height: '420px',
          borderColor: 'var(--border-color)',
          cursor: isDragging ? 'grabbing' : 'ew-resize',
          backgroundColor: '#0a0d14',
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* AFTER VIEW (Modern Site - Right side background) */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 p-4 p-md-5 d-flex flex-column justify-content-between"
          style={{
            background: 'linear-gradient(135deg, #091224 0%, #0d1b38 100%)',
            color: '#ffffff',
          }}
        >
          {/* Top Bar of After */}
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success px-3 py-1.5 rounded-pill fw-bold small shadow-sm d-flex align-items-center gap-1.5">
                <FaCheckCircle size={12} /> AFTER: RY WebSphere Modern Redesign
              </span>
              <span className="badge bg-primary bg-opacity-25 text-white border border-primary border-opacity-50 px-2.5 py-1 rounded-pill small">
                React + Vite + Google Cloud
              </span>
            </div>

            <div className="d-none d-sm-flex align-items-center gap-3">
              <div className="text-end">
                <div className="small fw-bold text-success d-flex align-items-center justify-content-end gap-1">
                  <FaBolt size={12} /> PageSpeed Score
                </div>
                <div className="fs-5 fw-extrabold text-success">98 / 100</div>
              </div>
            </div>
          </div>

          {/* Hero mockup preview inside After */}
          <div className="my-auto py-3">
            <div className="badge bg-primary bg-opacity-20 text-info border border-info border-opacity-25 px-2.5 py-1 rounded-pill mb-2 small">
              ⚡ 0.8s Ultra-Fast First Contentful Paint
            </div>
            <h2 className="display-6 fw-extrabold mb-2 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Scale Your Brand With <br />
              <span style={{ color: '#60a5fa' }}>Laser-Targeted Conversion.</span>
            </h2>
            <p className="text-white-50 small mb-3" style={{ maxWidth: '520px' }}>
              Clean typography, instant mobile responsiveness, zero render-blocking scripts, and seamless WhatsApp inquiry workflows.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary btn-sm px-3.5 py-2 fw-bold rounded-pill">
                Book Consultation
              </button>
              <button type="button" className="btn btn-outline-light btn-sm px-3.5 py-2 rounded-pill">
                Explore Portfolio
              </button>
            </div>
          </div>

          {/* Bottom Trust Badges of After */}
          <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top border-light border-opacity-10 small text-white-50">
            <span className="d-flex align-items-center gap-1 text-white">
              <FaShieldAlt className="text-success" size={13} /> 100% SSL & DDOS Protected
            </span>
            <span className="d-flex align-items-center gap-1 text-white">
              <FaMobileAlt className="text-primary" size={13} /> Mobile-First Layout
            </span>
            <span className="d-flex align-items-center gap-1 text-white">
              <FaTachometerAlt className="text-warning" size={13} /> SEO Optimized
            </span>
          </div>
        </div>

        {/* BEFORE VIEW (Outdated Site - Left side clipped) */}
        <div
          className="position-absolute top-0 start-0 h-100 p-4 p-md-5 d-flex flex-column justify-content-between overflow-hidden"
          style={{
            width: `${sliderPos}%`,
            background: 'linear-gradient(135deg, #2b2b2b 0%, #1e1e1e 100%)',
            color: '#d4d4d4',
            borderRight: '3px solid #3b82f6',
            boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
          }}
        >
          {/* Inner wrapper with fixed width matching parent so contents do not squish */}
          <div style={{ minWidth: '700px' }} className="h-100 d-flex flex-column justify-content-between">
            {/* Top Bar of Before */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger px-3 py-1.5 rounded-pill fw-bold small shadow-sm d-flex align-items-center gap-1.5">
                  <FaExclamationTriangle size={12} /> BEFORE: Outdated Legacy Website
                </span>
                <span className="badge bg-secondary bg-opacity-25 text-white-50 border border-secondary border-opacity-50 px-2.5 py-1 rounded-pill small">
                  Slow 2014 Architecture
                </span>
              </div>

              <div className="d-none d-sm-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="small fw-bold text-danger d-flex align-items-center justify-content-end gap-1">
                    <FaExclamationTriangle size={12} /> PageSpeed Score
                  </div>
                  <div className="fs-5 fw-extrabold text-danger">34 / 100 (Slow)</div>
                </div>
              </div>
            </div>

            {/* Cluttered Old Hero Preview */}
            <div className="my-auto py-3">
              <div className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25 px-2.5 py-1 rounded-pill mb-2 small">
                ⚠️ 5.8s Load Time • Broken Mobile Layout
              </div>
              <h2 className="display-6 fw-bold mb-2 text-white-50" style={{ fontFamily: 'Times New Roman, serif' }}>
                Welcome to Our Business Homepage <br />
                <span className="text-secondary small fs-5">Est. 2012 • Click here for services</span>
              </h2>
              <p className="text-secondary small mb-3" style={{ maxWidth: '480px' }}>
                Under construction. Not optimized for modern smartphones. Missing WhatsApp integration, blurry images, and unsecure HTTP connection.
              </p>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary btn-sm px-3 disabled">
                  Old Contact Form (Dead link)
                </button>
              </div>
            </div>

            {/* Bottom Frustrations of Before */}
            <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
              <span className="text-danger d-flex align-items-center gap-1">
                ❌ No SSL Certificate
              </span>
              <span className="text-danger d-flex align-items-center gap-1">
                ❌ High Bounce Rate (78%)
              </span>
              <span className="text-danger d-flex align-items-center gap-1">
                ❌ 0 Mobile Optimization
              </span>
            </div>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="position-absolute top-0 bottom-0 d-flex align-items-center justify-content-center"
          style={{
            left: `${sliderPos}%`,
            transform: 'translateX(-50%)',
            width: '40px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-lg"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: '3px solid #ffffff',
              cursor: 'ew-resize',
            }}
          >
            <FaSlidersH size={18} />
          </div>
        </div>
      </div>

      {/* Comparison Metrics Cards */}
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <div className="p-3 rounded-3 bg-surface border h-100 text-center">
            <div className="text-muted small fw-bold mb-1">LOAD SPEED</div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="text-danger fw-bold fs-6">5.8s</span>
              <span className="text-muted">➔</span>
              <span className="text-success fw-extrabold fs-5">0.8s (7x Faster)</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 rounded-3 bg-surface border h-100 text-center">
            <div className="text-muted small fw-bold mb-1">LEAD CONVERSION RATE</div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="text-danger fw-bold fs-6">1.2%</span>
              <span className="text-muted">➔</span>
              <span className="text-success fw-extrabold fs-5">5.4% (350% Boost)</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 rounded-3 bg-surface border h-100 text-center">
            <div className="text-muted small fw-bold mb-1">MOBILE RESPONSIVENESS</div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="text-danger fw-bold fs-6">Broken</span>
              <span className="text-muted">➔</span>
              <span className="text-success fw-extrabold fs-5">100% Fluid & Touch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
