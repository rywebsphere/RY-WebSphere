import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBriefcase, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center py-5 min-vh-75"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="container py-5" style={{ maxWidth: 600 }}>
        <div
          className="rounded-circle bg-danger bg-opacity-10 text-danger mx-auto mb-4 d-flex align-items-center justify-content-center"
          style={{ width: 90, height: 90 }}
        >
          <FaExclamationTriangle size={42} />
        </div>

        <h1 className="display-4 fw-extrabold mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
          404
        </h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page or digital resource you are looking for does not exist, has been moved, or has an invalid URL.
        </p>

        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2.5">
          <Link to="/" className="btn btn-ry-primary">
            <FaHome size={15} />
            <span>Return Home</span>
          </Link>
          <Link to="/services" className="btn btn-ry-secondary">
            <FaBriefcase size={15} />
            <span>Explore Services</span>
          </Link>
          <Link to="/contact" className="btn btn-ry-outline">
            <FaEnvelope size={15} />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
