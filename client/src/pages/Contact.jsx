import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaPaperPlane,
  FaWhatsapp,
  FaEnvelope,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExclamationCircle,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const serviceOptions = [
  'Business Website Development',
  'Gym Website Development',
  'Salon Website Development',
  'Doctor and Clinic Websites',
  'Restaurant and Cafe Websites',
  'Coaching Institute Websites',
  'E-commerce Websites',
  'Portfolio Websites',
  'Landing Page Development',
  'Website Redesign',
  'Website Bug Fixes',
  'Website Maintenance',
  'Custom Web Applications',
  'Frontend Development',
  'Backend API Development',
];

const packageOptions = [
  'Custom / Discussion',
  'Starter Website (₹2,999)',
  'Business Website (₹5,999)',
  'Premium Website (₹9,999)',
];

const budgetOptions = [
  'Flexible / Based on Scope',
  '₹2,999 – ₹5,000',
  '₹5,000 – ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000+',
];

const Contact = () => {
  const location = useLocation();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessCategory: '',
    email: '',
    phone: '',
    requiredService: 'Business Website Development',
    selectedPackage: 'Custom / Discussion',
    budget: 'Flexible / Based on Scope',
    projectDescription: '',
    preferredContactMethod: 'WhatsApp',
    trapField: '', // Honeypot trap
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle pre-selected state from navigation
  useEffect(() => {
    if (location.state?.preselectedPackage) {
      setFormData((prev) => ({
        ...prev,
        selectedPackage: location.state.preselectedPackage,
        budget: location.state.preselectedBudget || prev.budget,
      }));
    }
    if (location.state?.preselectedService) {
      setFormData((prev) => ({
        ...prev,
        requiredService: location.state.preselectedService,
      }));
    }
    if (location.state?.preselectedCategory) {
      setFormData((prev) => ({
        ...prev,
        businessCategory: location.state.preselectedCategory,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessResponse(null);

    // Basic client validation
    if (!formData.fullName.trim() || !formData.businessName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.projectDescription.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Name, Business Name, Email, Phone, Description).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/public/enquiries', formData);
      if (res.data?.success) {
        setSuccessResponse({
          message: res.data.message,
          referenceId: res.data.referenceId,
        });
        // Reset form
        setFormData({
          fullName: '',
          businessName: '',
          businessCategory: '',
          email: '',
          phone: '',
          requiredService: 'Business Website Development',
          selectedPackage: 'Custom / Discussion',
          budget: 'Flexible / Based on Scope',
          projectDescription: '',
          preferredContactMethod: 'WhatsApp',
          trapField: '',
        });
      } else {
        setErrorMessage(res.data?.message || 'Submission failed. Please check your information.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while submitting your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const businessEmail = settings.businessEmail || 'rywebsphere@gmail.com';
  const whatsappNumber = settings.whatsappNumber || 'YOUR_WHATSAPP_NUMBER';
  const isRealNumber = whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER';

  return (
    <div>
      <PageHeader
        badge="Direct Project Inquiries"
        title="Start Your Project With RY WebSphere"
        subtitle="Tell us about your business and your website requirements. We will review your goals and provide a straightforward roadmap, transparent pricing, and next steps."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="row g-5">
            {/* Left Column: Contact Form */}
            <div className="col-lg-7">
              <div
                className="ry-card p-4 p-md-5 rounded-4 shadow-lg position-relative"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="mb-4">
                  <h3 className="fw-bold mb-1">Project Enquiry & Free Consultation</h3>
                  <p className="text-muted small">
                    Fields marked with an asterisk (<span className="text-danger">*</span>) are required.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="alert alert-danger py-3 px-4 rounded-3 d-flex align-items-center gap-2 mb-4">
                    <FaExclamationCircle size={18} />
                    <span className="small">{errorMessage}</span>
                  </div>
                )}

                {/* Success Confirmation Modal/Banner */}
                {successResponse ? (
                  <div className="p-4 rounded-3 bg-success bg-opacity-10 border border-success text-center mb-4">
                    <FaCheckCircle className="text-success mb-2" size={36} />
                    <h4 className="fw-bold text-success mb-2">Enquiry Received!</h4>
                    <p className="text-light small mb-3">
                      {successResponse.message}
                    </p>
                    {successResponse.referenceId && (
                      <div className="badge bg-dark text-muted p-2 font-monospace mb-3">
                        Reference ID: {successResponse.referenceId}
                      </div>
                    )}
                    <div className="p-3 rounded-2 bg-surface border text-start small">
                      <div className="fw-bold text-primary mb-1">What Happens Next?</div>
                      <ol className="mb-0 ps-3 text-secondary">
                        <li>Ranjan Yadav will review your project requirements within 24 business hours.</li>
                        <li>We will connect via your preferred contact channel ({formData.preferredContactMethod || 'WhatsApp'}) with a recommended approach and scope proposal.</li>
                        <li>No obligations or spam—strictly honest web advice for your business.</li>
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSuccessResponse(null)}
                      className="btn btn-ry-secondary btn-sm mt-3"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Bot Honeypot Trap - hidden from real humans */}
                    <input
                      type="text"
                      name="trapField"
                      value={formData.trapField}
                      onChange={handleChange}
                      style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                      tabIndex="-1"
                      autoComplete="off"
                    />

                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control-ry"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Business Name */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Business / Firm Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          className="form-control-ry"
                          placeholder="e.g. Apex Dental Clinic"
                          value={formData.businessName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Business Category */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Business Category <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="businessCategory"
                          className="form-control-ry"
                          placeholder="e.g. Healthcare / Clinic, Gym, Salon, Cafe"
                          value={formData.businessCategory}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email Address */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control-ry"
                          placeholder="name@business.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Phone / WhatsApp Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control-ry"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Preferred Contact Method */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Preferred Contact Method
                        </label>
                        <select
                          name="preferredContactMethod"
                          className="form-select-ry"
                          value={formData.preferredContactMethod}
                          onChange={handleChange}
                        >
                          <option value="WhatsApp">WhatsApp (Fastest)</option>
                          <option value="Email">Email</option>
                          <option value="Phone Call">Phone Call</option>
                        </select>
                      </div>

                      {/* Required Service */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Required Service <span className="text-danger">*</span>
                        </label>
                        <select
                          name="requiredService"
                          className="form-select-ry"
                          value={formData.requiredService}
                          onChange={handleChange}
                        >
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selected Package */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          Selected Package
                        </label>
                        <select
                          name="selectedPackage"
                          className="form-select-ry"
                          value={formData.selectedPackage}
                          onChange={handleChange}
                        >
                          {packageOptions.map((pkg) => (
                            <option key={pkg} value={pkg}>
                              {pkg}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Estimated Budget */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold">
                          Estimated Budget
                        </label>
                        <select
                          name="budget"
                          className="form-select-ry"
                          value={formData.budget}
                          onChange={handleChange}
                        >
                          {budgetOptions.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Project Description */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold">
                          Project Description & Requirements <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="projectDescription"
                          rows="4"
                          className="form-control-ry"
                          placeholder="Briefly describe what your business does, key pages you envision, any reference websites you like, and your desired launch timeline..."
                          value={formData.projectDescription}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Privacy Notice */}
                      <div className="col-12">
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <FaShieldAlt className="text-success flex-shrink-0" />
                          <span>
                            We respect your privacy. Your information is strictly used to communicate regarding your project inquiry. Never sold or shared.
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn btn-ry-primary w-100 py-3 justify-content-center fw-bold"
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" />
                              <span>Submitting Your Requirements...</span>
                            </>
                          ) : (
                            <>
                              <FaPaperPlane size={15} />
                              <span>Submit Project Consultation Enquiry</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Contact CTAs & Next Steps */}
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4">
                {/* Direct WhatsApp CTA Card */}
                <div
                  className="ry-card p-4 rounded-4"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaWhatsapp className="text-success" size={26} />
                    <h5 className="fw-bold mb-0">Direct WhatsApp Discussion</h5>
                  </div>
                  <p className="text-muted small mb-3">
                    Prefer immediate messaging? Chat directly with Ranjan Yadav regarding your website scope or pricing inquiries.
                  </p>

                  <div className="p-2.5 rounded-2 bg-surface border mb-3 small">
                    <div className="text-muted">Official Number:</div>
                    <strong className="text-primary">{whatsappNumber}</strong>
                  </div>

                  {isRealNumber ? (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hello%20RY%20WebSphere!%20I%20would%20like%20to%20discuss%20a%20website%20project.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 text-white fw-bold"
                    >
                      <FaWhatsapp size={18} />
                      <span>Message on WhatsApp</span>
                    </a>
                  ) : (
                    <div className="badge bg-secondary w-100 py-2 text-wrap text-muted">
                      WhatsApp number will be activated once business SIM is linked.
                    </div>
                  )}
                </div>

                {/* Email Direct Card */}
                <div className="ry-card p-4 rounded-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaEnvelope className="text-primary" size={22} />
                    <h5 className="fw-bold mb-0">Business Email Contact</h5>
                  </div>
                  <p className="text-muted small mb-3">
                    Send detailed RFPs, wireframes, design briefs, or documents directly to our inbox.
                  </p>

                  <div className="p-2.5 rounded-2 bg-surface border mb-3 small">
                    <div className="text-muted">Email Inbox:</div>
                    <strong className="text-primary">{businessEmail}</strong>
                  </div>

                  <a
                    href={`mailto:${businessEmail}`}
                    className="btn btn-ry-secondary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaEnvelope size={15} />
                    <span>Send an Email</span>
                  </a>
                </div>

                {/* What to Expect Next */}
                <div className="ry-card p-4 rounded-4">
                  <h6 className="fw-bold mb-3">What Happens After You Inquire?</h6>
                  <div className="d-flex flex-column gap-3 small text-secondary">
                    <div className="d-flex align-items-start gap-2.5">
                      <span className="badge bg-primary bg-opacity-20 text-primary rounded-circle" style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        1
                      </span>
                      <div>
                        <strong>Discovery Review:</strong> We analyze your business, requirements, and reference preferences.
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2.5">
                      <span className="badge bg-primary bg-opacity-20 text-primary rounded-circle" style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        2
                      </span>
                      <div>
                        <strong>Proposal & Recommendation:</strong> You receive an itemized quote with defined delivery milestones.
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2.5">
                      <span className="badge bg-primary bg-opacity-20 text-primary rounded-circle" style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        3
                      </span>
                      <div>
                        <strong>Development Kickoff:</strong> Upon agreement, we begin the design and code sprints immediately.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
