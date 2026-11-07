import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import AnnouncementBar from '../components/common/AnnouncementBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSettings } from '../context/SettingsContext';

const PublicLayout = () => {
  const { pathname } = useLocation();
  const { settings } = useSettings();

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const whatsappNumber = settings?.whatsappNumber;
  const isRealNumber = whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER';
  const whatsappUrl = isRealNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hello%20RY%20WebSphere!%20I%20would%20like%20to%20discuss%20a%20website%20project.`
    : '/contact';

  return (
    <div className="d-flex flex-column min-vh-100">
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
