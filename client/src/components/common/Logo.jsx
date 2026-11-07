import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ markOnly = false, size = 'normal', className = '' }) => {
  // Dimensions
  const markSize = size === 'large' ? 44 : size === 'small' ? 30 : 36;
  const fontSize = size === 'large' ? '1.5rem' : size === 'small' ? '1.1rem' : '1.3rem';
  const subFontSize = size === 'large' ? '0.75rem' : '0.68rem';

  return (
    <Link
      to="/"
      className={`d-inline-flex align-items-center text-decoration-none ${className}`}
      aria-label="RY WebSphere Homepage"
    >
      {/* Brand Mark SVG */}
      <div
        style={{
          width: markSize,
          height: markSize,
          position: 'relative',
          flexShrink: 0,
        }}
        className="me-2"
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="ringGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Rounded shield container */}
          <rect width="100" height="100" rx="22" fill="#090d16" />
          <rect
            width="96"
            height="96"
            x="2"
            y="2"
            rx="20"
            fill="none"
            stroke="url(#logoGrad)"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Digital Web Orbit Rings */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="18"
            fill="none"
            stroke="url(#ringGrad2)"
            strokeWidth="3"
            strokeDasharray="4 3"
            transform="rotate(-25 50 50)"
            opacity="0.85"
          />
          <circle cx="20" cy="38" r="3" fill="#06b6d4" />
          <circle cx="80" cy="62" r="3" fill="#8b5cf6" />

          {/* RY Monogram */}
          <text
            x="50"
            y="63"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontSize="36"
            fontWeight="900"
            fill="url(#logoGrad)"
            textAnchor="middle"
            letterSpacing="-1.5"
          >
            RY
          </text>
        </svg>
      </div>

      {/* Brand Typography */}
      {!markOnly && (
        <div className="d-flex flex-column justify-content-center">
          <div
            className="lh-1"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: fontSize,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            <span>RY </span>
            <span className="ry-gradient-text">WebSphere</span>
          </div>
          <span
            className="text-uppercase"
            style={{
              fontSize: subFontSize,
              letterSpacing: '0.14em',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            Web Agency
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
