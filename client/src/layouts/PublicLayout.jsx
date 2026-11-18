import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaEye, FaTimes } from 'react-icons/fa';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LaunchCountdown, { LAUNCH_DATE_ISO } from '../components/common/LaunchCountdown';
import { useSettings } from '../context/SettingsContext';

const PublicLayout = () => {
  const { pathname, search } = useLocation();
  const { settings } = useSettings();

  // Check launch date status
  const [isLive, setIsLive] = useState(() => new Date() >= new Date(LAUNCH_DATE_ISO));
  const [isPreview, setIsPreview] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('ry_preview_mode') === 'true';
  });

  // Handle ?preview=true in URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('preview') === 'true' || params.get('preview') === '1') {
      sessionStorage.setItem('ry_preview_mode', 'true');
      setIsPreview(true);
    }
  }, [search]);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleExitPreview = () => {
    sessionStorage.removeItem('ry_preview_mode');
    setIsPreview(false);
  };

  const whatsappNumber = settings?.whatsappNumber;
  const isRealNumber = whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER';
  const whatsappUrl = isRealNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hello%20RY%20WebSphere!%20I%20would%20like%20to%20discuss%20a%20website%20project.`
    : '/contact';

  // If website has not reached 20 Nov 8:00 AM IST and visitor is not in preview mode:
  if (!isLive && !isPreview) {
    return <LaunchCountdown targetDate={LAUNCH_DATE_ISO} onLaunch={() => setIsLive(true)} />;
  }

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      {/* Owner Preview Mode Notice Bar (Only visible in Preview before launch) */}
      {!isLive && isPreview && (
        <div
          className="bg-warning text-dark py-2 px-3 text-center fw-semibold d-flex justify-content-between align-items-center position-sticky top-0 shadow-sm"
          style={{ zIndex: 9999, fontSize: '0.85rem' }}
        >
          <div className="mx-auto d-inline-flex align-items-center gap-2">
            <FaEye size={16} />
            <span>
              <strong>Owner Preview Mode Active:</strong> Public visitors see the Countdown until <strong>20 Nov 2026, 08:00 AM IST</strong>.
            </span>
          </div>
          <button
            onClick={handleExitPreview}
            type="button"
            className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1 py-1 px-2 rounded-pill"
            style={{ fontSize: '0.75rem' }}
          >
            <FaTimes size={12} />
            <span>Show Countdown</span>
          </button>
        </div>
      )}

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action */}
      {isRealNumber ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ry-floating-whatsapp"
          title="Direct WhatsApp Consultation with RY WebSphere"
          aria-label="Contact RY WebSphere on WhatsApp"
        >
          <FaWhatsapp />
        </a>
      ) : (
        <a
          href="/contact"
          className="ry-floating-whatsapp"
          title="Contact RY WebSphere"
          aria-label="Contact RY WebSphere"
        >
          <FaWhatsapp />
        </a>
      )}
    </div>
  );
};

export default PublicLayout;