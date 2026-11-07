import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const defaultSettings = {
  brandName: 'RY WebSphere',
  ownerName: 'Ranjan Yadav',
  tagline: 'Your Vision. Our Web. Unlimited Possibilities.',
  announcementText: 'Professional Website Packages Starting at ₹2,999',
  announcementEnabled: true,
  businessEmail: 'rywebsphere@gmail.com',
  whatsappNumber: 'YOUR_WHATSAPP_NUMBER',
  portfolioUrl: 'YOUR_PORTFOLIO_URL',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  serviceAreas: [
    'India (All States & Cities)',
    'International Remote Clients (US, UK, UAE, Canada, Australia & Global)',
  ],
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/public/settings');
      if (res.data?.success && res.data?.data) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.warn('Could not load remote settings, using agency defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
