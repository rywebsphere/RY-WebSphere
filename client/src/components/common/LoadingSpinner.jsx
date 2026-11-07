import React from 'react';

const LoadingSpinner = ({ text = 'Loading RY WebSphere data...', minHeight = '300px' }) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center p-5 text-center"
      style={{ minHeight }}
    >
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: '3rem', height: '3rem', borderWidth: '0.25rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small fw-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
