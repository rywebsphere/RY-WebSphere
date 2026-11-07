import React, { useState, useEffect } from 'react';
import { FaSave, FaLock, FaCheckCircle, FaExclamationCircle, FaCog } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const AdminSettings = () => {
  const { refreshSettings } = useSettings();
  const [settingsData, setSettingsData] = useState({
    brandName: '',
    ownerName: '',
    tagline: '',
    announcementText: '',
    announcementEnabled: true,
    businessEmail: '',
    whatsappNumber: '',
    portfolioUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/settings');
        if (res.data?.success && res.data?.data) {
          setSettingsData(res.data.data);
        }
      } catch (err) {
        console.warn('Error fetching admin settings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    try {
      setSavingSettings(true);
      const res = await api.put('/admin/settings', settingsData);
      if (res.data?.success) {
        setSettingsSuccess('Website settings updated successfully.');
        refreshSettings();
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      alert(`Error updating settings: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setPasswordSuccess('Password updated successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err) {
      setPasswordError(err.message || 'Error updating password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading website settings..." />;
  }

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Website Settings & Administration</h2>
        <p className="text-muted small mb-0">
          Configure agency brand constants, announcement bar, contact channels, and security credentials.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Website Settings */}
        <div className="col-lg-7">
          <div className="ry-card p-4 p-md-5 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaCog className="text-primary" />
              <span>Agency Brand & Contact Details</span>
            </h4>

            {settingsSuccess && (
              <div className="alert alert-success py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 small mb-4">
                <FaCheckCircle size={15} />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Official Brand Name</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    value={settingsData.brandName || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, brandName: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Brand Owner Name</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    value={settingsData.ownerName || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, ownerName: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Official Tagline</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    value={settingsData.tagline || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-light">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    value={settingsData.announcementText || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, announcementText: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="announcementCheck"
                      className="form-check-input"
                      checked={!!settingsData.announcementEnabled}
                      onChange={(e) => setSettingsData({ ...settingsData, announcementEnabled: e.target.checked })}
                    />
                    <label htmlFor="announcementCheck" className="form-check-label text-light small">
                      Enable Top Announcement Bar on Public Website
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Business Email Address</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="rywebsphere@gmail.com"
                    value={settingsData.businessEmail || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, businessEmail: e.target.value })}
                  />
                  <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                    Replace placeholder with your actual email.
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-light">Official WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-control-ry"
                    placeholder="YOUR_WHATSAPP_NUMBER"
                    value={settingsData.whatsappNumber || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, whatsappNumber: e.target.value })}
                  />
                  <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                    Includes country code (e.g. +91 9876543210).
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-light">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="form-control-ry"
                    value={settingsData.socialLinks?.github || ''}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        socialLinks: { ...settingsData.socialLinks, github: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-light">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-control-ry"
                    value={settingsData.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        socialLinks: { ...settingsData.socialLinks, linkedin: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-light">Twitter / X Profile URL</label>
                  <input
                    type="url"
                    className="form-control-ry"
                    value={settingsData.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        socialLinks: { ...settingsData.socialLinks, twitter: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="btn btn-ry-primary px-4 py-2.5"
                  >
                    <FaSave size={14} className="me-2" />
                    <span>{savingSettings ? 'Saving Settings...' : 'Save Website Settings'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security Credentials */}
        <div className="col-lg-5">
          <div className="ry-card p-4 p-md-5 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaLock className="text-warning" />
              <span>Change Admin Password</span>
            </h4>

            {passwordSuccess && (
              <div className="alert alert-success py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 small mb-4">
                <FaCheckCircle size={15} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="alert alert-danger py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 small mb-4">
                <FaExclamationCircle size={15} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-light">Current Password</label>
                <input
                  type="password"
                  className="form-control-ry"
                  placeholder="Current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-light">New Password (min 8 chars)</label>
                <input
                  type="password"
                  className="form-control-ry"
                  placeholder="New strong password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-light">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control-ry"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-outline-warning w-100 py-2.5 fw-semibold"
              >
                {savingPassword ? 'Updating Password...' : 'Update Admin Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
