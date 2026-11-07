import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const AnnouncementBar = () => {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.announcementEnabled) {
    return null;
  }

  const announcementText = settings.announcementText || 'Professional Website Packages Starting at ₹2,999';

  return (
    <div
      className="ry-announcement-bar py-2 px-3 text-center position-relative text-white"
      data-force-white="true"
      style={{
        background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.25)',
        fontSize: '0.88rem',
        fontWeight: 500,
        zIndex: 1030,
      }}
    >
      <div className="container d-flex align-items-center justify-content-center flex-wrap gap-2">
        <span
          className="badge rounded-pill bg-primary px-2.5 py-1 text-white fw-bold d-inline-flex align-items-center gap-1"
          style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
        >
          <FaTag /> SPECIAL OFFER
        </span>

        <span className="text-light">
          {announcementText}
        </span>

        <Link
          to="/pricing"
          className="text-white text-decoration-none fw-semibold ms-1 d-inline-flex align-items-center gap-1"
          style={{ borderBottom: '1px dotted rgba(255,255,255,0.7)' }}
        >
          <span>View Packages</span>
          <FaArrowRight size={11} />
        </Link>

        <span className="d-none d-md-inline text-muted" style={{ fontSize: '0.75rem' }}>
          • Final pricing depends on project scope
        </span>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="btn btn-link text-white-50 p-0 position-absolute end-0 me-3 d-none d-sm-inline"
          style={{ textDecoration: 'none' }}
          aria-label="Dismiss announcement"
        >
          <FaTimes size={13} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
