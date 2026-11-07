import React, { useState, useMemo } from 'react';
import {
  FaCalculator,
  FaCheck,
  FaWhatsapp,
  FaPaperPlane,
  FaArrowRight,
  FaCheckCircle,
  FaCloud,
  FaShieldAlt,
  FaClock,
} from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const PROJECT_TYPES = [
  {
    id: 'landing',
    name: 'Landing Page / Single Page',
    description: 'High-converting single sales funnel or digital portfolio card',
    basePriceINR: 2999,
    basePriceUSD: 49,
    baseDays: 4,
  },
  {
    id: 'business',
    name: 'Standard Business Website',
    description: 'Multi-section corporate or service enterprise web presence',
    basePriceINR: 5999,
    basePriceUSD: 89,
    baseDays: 7,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce / Custom Portal',
    description: 'Storefront or custom dynamic portal with interactive features',
    basePriceINR: 9999,
    basePriceUSD: 149,
    baseDays: 14,
  },
  {
    id: 'redesign',
    name: 'Website Redesign & Revamp',
    description: 'Complete visual and speed overhaul of an existing aging site',
    basePriceINR: 4499,
    basePriceUSD: 69,
    baseDays: 6,
  },
];

const PAGE_TIERS = [
  { id: '1p', label: '1 Single Page', addINR: 0, addUSD: 0, addDays: 0 },
  { id: '3-5p', label: 'Up to 5 Pages', addINR: 1500, addUSD: 25, addDays: 2 },
  { id: '6-10p', label: '6 to 10 Pages', addINR: 3500, addUSD: 55, addDays: 4 },
  { id: '10p+', label: '10+ Pages / Custom Catalog', addINR: 6500, addUSD: 95, addDays: 7 },
];

const ADDONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp Direct Chat Trigger',
    priceINR: 0,
    priceUSD: 0,
    isFree: true,
  },
  {
    id: 'cloud',
    label: 'Google Cloud Setup & SSL Config (Hosting billed at actuals)',
    priceINR: 0,
    priceUSD: 0,
    isFree: true,
  },
  {
    id: 'payment',
    label: 'Payment Gateway Integration (Razorpay / Stripe)',
    priceINR: 1999,
    priceUSD: 30,
    isFree: false,
  },
  {
    id: 'booking',
    label: 'Online Appointment / Table Booking Form',
    priceINR: 1799,
    priceUSD: 28,
    isFree: false,
  },
  {
    id: 'seo',
    label: 'Advanced SEO & Schema Rich Snippets',
    priceINR: 1499,
    priceUSD: 22,
    isFree: false,
  },
  {
    id: 'content',
    label: 'Professional Content Writing & Stock Visuals',
    priceINR: 1999,
    priceUSD: 30,
    isFree: false,
  },
  {
    id: 'logo',
    label: 'Brand Logo & Favicon Pack',
    priceINR: 999,
    priceUSD: 15,
    isFree: false,
  },
];

const ProjectCostCalculator = ({ onEstimateCalculated }) => {
  const { currency, formatPrice } = useCurrency();
  const { settings } = useSettings();

  const [selectedType, setSelectedType] = useState('business');
  const [selectedTier, setSelectedTier] = useState('3-5p');
  const [selectedAddons, setSelectedAddons] = useState(['whatsapp', 'cloud', 'seo']);

  // Modal / Form state for direct enquiry
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const toggleAddon = (id) => {
    // Keep free essentials checked
    if (id === 'whatsapp' || id === 'cloud') return;
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedEstimate = useMemo(() => {
    const typeObj = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[1];
    const tierObj = PAGE_TIERS.find((p) => p.id === selectedTier) || PAGE_TIERS[1];

    let totalINR = typeObj.basePriceINR + tierObj.addINR;
    let totalUSD = typeObj.basePriceUSD + tierObj.addUSD;
    let totalDays = typeObj.baseDays + tierObj.addDays;

    selectedAddons.forEach((addonId) => {
      const addonObj = ADDONS.find((a) => a.id === addonId);
      if (addonObj) {
        totalINR += addonObj.priceINR;
        totalUSD += addonObj.priceUSD;
      }
    });

    return {
      typeObj,
      tierObj,
      totalINR,
      totalUSD,
      totalDays,
    };
  }, [selectedType, selectedTier, selectedAddons]);

  const activeAddonNames = useMemo(() => {
    return selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean);
  }, [selectedAddons]);

  const whatsappPhone = settings?.whatsappNumber || '919026402646';

  const handleWhatsAppShare = () => {
    const priceFormatted = formatPrice(calculatedEstimate.totalINR, calculatedEstimate.totalUSD);
    const msg = `Hello RY WebSphere team! I just used your Project Cost Calculator:
- Project: ${calculatedEstimate.typeObj.name}
- Scope: ${calculatedEstimate.tierObj.label}
- Selected Add-ons: ${activeAddonNames.join(', ')}
- Estimated Cost: ${priceFormatted} (${currency})
- Delivery Target: ~${calculatedEstimate.totalDays} business days

Note: Domain & Google Cloud server will be purchased by RY WebSphere and billed at actuals.
Can we discuss this project?`;

    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const priceFormatted = formatPrice(calculatedEstimate.totalINR, calculatedEstimate.totalUSD);
      const enquiryPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName || 'Not Specified',
        serviceRequested: calculatedEstimate.typeObj.name,
        budget: `${priceFormatted} (${currency})`,
        timeline: `${calculatedEstimate.totalDays} Days`,
        message: `Generated via Instant Cost Calculator:
- Scope: ${calculatedEstimate.tierObj.label}
- Add-ons: ${activeAddonNames.join(', ')}
- Estimated Investment: ${priceFormatted} (${currency})
- Client accepts transparent Domain & Google Cloud hosting fulfillment billed at actuals.`,
      };

      const res = await api.post('/public/enquiries', enquiryPayload);
      if (res.data?.success) {
        setSubmitSuccess(res.data);
      } else {
        setSubmitError(res.data?.message || 'Could not submit estimation.');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit enquiry. Please try WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ry-card p-4 p-lg-5 position-relative overflow-hidden shadow-lg border-primary">
      {/* Background ambient glow */}
      <div
        className="position-absolute"
        style={{
          top: -100,
          right: -100,
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary text-white px-2.5 py-1 rounded-pill small fw-bold">
              <FaCalculator className="me-1.5" size={12} /> Instant Cost & Scope Estimator
            </span>
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Calculate Your Website Investment in Real-Time
          </h3>
          <p className="text-muted small mb-0">
            Pick your scope and features to view an instant estimate. No hidden fees.
          </p>
        </div>

        <div className="text-md-end">
          <span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-1.5 rounded-pill small">
            Currency: <strong className="text-primary">{currency}</strong>
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Selections */}
        <div className="col-lg-7">
          {/* Step 1: Project Type */}
          <div className="mb-4">
            <label className="fw-bold text-uppercase small text-muted mb-2.5 d-block" style={{ letterSpacing: '0.05em' }}>
              Step 1: Choose Website Category
            </label>
            <div className="row g-2">
              {PROJECT_TYPES.map((t) => {
                const isSelected = selectedType === t.id;
                return (
                  <div key={t.id} className="col-sm-6">
                    <button
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`btn w-100 text-start p-3 rounded-3 h-100 transition-all ${
                        isSelected ? 'border-primary' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-surface)',
                        border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <strong className="small" style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                          {t.name}
                        </strong>
                        {isSelected && <FaCheck className="text-primary" size={13} />}
                      </div>
                      <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                        {t.description}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Page Scale */}
          <div className="mb-4">
            <label className="fw-bold text-uppercase small text-muted mb-2.5 d-block" style={{ letterSpacing: '0.05em' }}>
              Step 2: Number of Pages / Content Scale
            </label>
            <div className="row g-2">
              {PAGE_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <div key={tier.id} className="col-6 col-sm-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`btn w-100 text-center py-2.5 px-2 rounded-3 transition-all ${
                        isSelected ? 'border-primary' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-surface)',
                        border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? '700' : '500',
                      }}
                    >
                      {tier.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Add-on Capabilities */}
          <div>
            <label className="fw-bold text-uppercase small text-muted mb-2.5 d-block" style={{ letterSpacing: '0.05em' }}>
              Step 3: Select Features & Enhancements
            </label>
            <div className="d-flex flex-column gap-2">
              {ADDONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className="p-2.5 px-3 rounded-3 d-flex align-items-center justify-content-between transition-all"
                    style={{
                      backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)',
                      border: isChecked ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-color)',
                      cursor: addon.isFree ? 'default' : 'pointer',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2.5">
                      <div
                        className="rounded d-flex align-items-center justify-content-center"
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: isChecked ? 'var(--accent-blue)' : 'transparent',
                          border: isChecked ? 'none' : '2px solid var(--border-color)',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      >
                        {isChecked && <FaCheck />}
                      </div>
                      <span className="small fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                        {addon.label}
                      </span>
                    </div>

                    <div>
                      {addon.isFree ? (
                        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 fw-bold" style={{ fontSize: '0.75rem' }}>
                          INCLUDED
                        </span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-15 text-primary fw-bold" style={{ fontSize: '0.78rem' }}>
                          +{formatPrice(addon.priceINR, addon.priceUSD)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Estimate Summary Card */}
        <div className="col-lg-5">
          <div
            className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--glow-card)',
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>
                  Estimated Project Investment
                </span>
                <span className="badge bg-primary bg-opacity-15 text-primary px-2.5 py-1 rounded-pill small fw-bold">
                  Transparent Quote
                </span>
              </div>

              {/* Display Calculated Price */}
              <div className="mb-3 text-center text-lg-start">
                <div
                  className="display-4 fw-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--accent-blue)',
                    lineHeight: 1.1,
                  }}
                >
                  {formatPrice(calculatedEstimate.totalINR, calculatedEstimate.totalUSD)}
                </div>
                <div className="text-muted small mt-1">
                  Estimated starting budget ({currency})
                </div>
              </div>

              {/* Delivery Speed Target */}
              <div
                className="p-2.5 rounded-3 mb-3 d-flex align-items-center gap-2.5"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                <FaClock className="text-primary flex-shrink-0" size={16} />
                <div className="small">
                  Estimated Timeline: <strong>~{calculatedEstimate.totalDays} Business Days</strong>
                </div>
              </div>

              {/* Domain & Hosting Commercial Notice */}
              <div
                className="p-3 rounded-3 mb-4"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.82rem',
                }}
              >
                <div className="d-flex align-items-center gap-1.5 text-success fw-bold mb-1">
                  <FaCloud size={13} /> Domain & Google Cloud Fulfillment:
                </div>
                <div className="text-secondary" style={{ lineHeight: 1.45 }}>
                  RY WebSphere handles 100% of domain purchase (.com/.in) and high-speed Google Cloud hosting setup on your behalf. Domain registry & Google Cloud server charges are billed to you directly at transparent actual costs on your setup invoice.
                </div>
              </div>

              {/* Scope Breakdown */}
              <div className="small mb-4">
                <div className="text-muted fw-bold mb-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Configuration Summary:
                </div>
                <ul className="list-unstyled d-flex flex-column gap-1.5 text-secondary mb-0" style={{ fontSize: '0.84rem' }}>
                  <li className="d-flex align-items-center gap-1.5">
                    <FaCheckCircle className="text-success" size={12} />
                    <span><strong>Category:</strong> {calculatedEstimate.typeObj.name}</span>
                  </li>
                  <li className="d-flex align-items-center gap-1.5">
                    <FaCheckCircle className="text-success" size={12} />
                    <span><strong>Scope:</strong> {calculatedEstimate.tierObj.label}</span>
                  </li>
                  <li className="d-flex align-items-center gap-1.5">
                    <FaCheckCircle className="text-success" size={12} />
                    <span><strong>Active Add-ons:</strong> {activeAddonNames.length} selected</span>
                  </li>
                  <li className="d-flex align-items-center gap-1.5">
                    <FaShieldAlt className="text-primary" size={12} />
                    <span>50% Advance / 50% on Launch Milestone</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions: WhatsApp or Direct Form */}
            <div className="d-flex flex-column gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="btn btn-success w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <FaWhatsapp size={18} />
                <span>Book on WhatsApp with Estimate</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-ry-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <FaPaperPlane size={14} />
                <span>Lock In This Estimate (Submit Request)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Lock-in Modal */}
      {showSubmitModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--glow-card)',
              }}
            >
              <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <h5 className="modal-title fw-bold mb-0">Lock In Your Custom Estimate</h5>
                  <div className="small text-muted">
                    Estimated Cost: <strong className="text-primary">{formatPrice(calculatedEstimate.totalINR, calculatedEstimate.totalUSD)}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSubmitModal(false)}
                  style={{ filter: 'var(--btn-close-filter)' }}
                />
              </div>

              <div className="modal-body p-4">
                {submitSuccess ? (
                  <div className="text-center py-4">
                    <div
                      className="rounded-circle bg-success bg-opacity-15 text-success d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: 64, height: 64 }}
                    >
                      <FaCheckCircle size={32} />
                    </div>
                    <h4 className="fw-bold mb-2">Estimate Submitted Successfully!</h4>
                    <p className="text-muted small mb-3">
                      We have logged your quotation request. Your unique live tracking code is:
                    </p>
                    <div className="p-3 rounded-3 bg-surface border mb-3 font-monospace fw-bold fs-5 text-primary">
                      {submitSuccess.trackingCode}
                    </div>
                    <p className="small text-muted mb-4">
                      You can track your project status anytime at <code>/track/{submitSuccess.trackingCode}</code>.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSubmitModal(false);
                          setSubmitSuccess(null);
                        }}
                        className="btn btn-ry-primary px-4"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitEnquiry}>
                    {submitError && (
                      <div className="alert alert-danger py-2 small mb-3">
                        {submitError}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-bold">Email Address *</label>
                        <input
                          type="email"
                          required
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@example.com"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-bold">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          className="form-control"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Business / Brand Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Apex Dental Clinic"
                      />
                    </div>

                    <div className="p-2.5 rounded-2 bg-surface border mb-3 small text-muted">
                      <strong>Fulfillment Notice:</strong> RY WebSphere buys the domain & configures Google Cloud servers on your behalf. Charges will be billed at actuals on the setup invoice.
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowSubmitModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-ry-primary fw-bold px-4"
                      >
                        {submitting ? 'Submitting...' : 'Submit & Receive Tracking Code'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCostCalculator;
