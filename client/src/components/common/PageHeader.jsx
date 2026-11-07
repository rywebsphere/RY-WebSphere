import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const PageHeader = ({ badge, title, subtitle, breadcrumbs = [] }) => {
  return (
    <section
      className="position-relative py-5 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container position-relative py-4" style={{ zIndex: 1 }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="ry-breadcrumb list-unstyled mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <li>
                    <FaChevronRight size={10} className="mx-1" />
                  </li>
                  {crumb.path ? (
                    <li>
                      <Link to={crumb.path}>{crumb.label}</Link>
                    </li>
                  ) : (
                    <li className="text-primary fw-medium" aria-current="page">
                      {crumb.label}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <div className="mb-3">
            <span className="ry-badge">{badge}</span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="display-5 fw-bold mb-3" style={{ maxWidth: 850 }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="lead text-muted mb-0"
            style={{ maxWidth: 720, fontSize: '1.15rem' }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
};

export default PageHeader;
