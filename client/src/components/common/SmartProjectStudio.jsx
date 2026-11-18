import React, { useState, useRef } from 'react';
import {
  FaDumbbell,
  FaCut,
  FaUtensils,
  FaBuilding,
  FaShoppingCart,
  FaHospital,
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaCheck,
  FaCloudUploadAlt,
  FaTimes,
  FaWhatsapp,
  FaArrowRight,
  FaArrowLeft,
  FaMagic,
  FaLayerGroup,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaBolt,
} from 'react-icons/fa';
import api from '../../services/api';

// Intelligent Niche Profiles with Curated Industry Recommendations
const NICHE_PROFILES = [
  {
    id: 'gym',
    name: 'Gym & Fitness Center',
    icon: FaDumbbell,
    badgeColor: 'warning',
    tagline: 'High-energy, conversion-optimized fitness portals',
    defaultPages: ['Home', 'Membership Plans', 'Class Timetable', 'Trainer Profiles', 'Facilities Gallery', 'Contact & Location'],
    features: [
      { id: 'wa_booking', title: 'Instant WhatsApp Day Pass Booking', tag: '🔥 High Conversion', default: true },
      { id: 'membership_portal', title: 'Online Membership Signup & Payment', tag: '⭐ Essential', default: true },
      { id: 'gmaps_reviews', title: 'Google Maps & Live 5-Star Reviews Sync', tag: '⚡ Boost Local Trust', default: true },
      { id: 'bmi_calc', title: 'Interactive BMI & Calorie Calculator Tool', tag: '💡 Lead Magnet', default: true },
      { id: 'trainer_schedule', title: 'Trainer Slot & Personal Training Scheduler', tag: '✨ Modern', default: false },
    ],
  },
  {
    id: 'salon',
    name: 'Salon, Spa & Beauty',
    icon: FaCut,
    badgeColor: 'info',
    tagline: 'Aesthetic, luxury booking websites for beauty brands',
    defaultPages: ['Home', 'Rate Card / Services Menu', 'Stylist Team', 'Before & After Gallery', 'Client Reviews', 'Book Appointment'],
    features: [
      { id: 'online_booking', title: 'Smart Slot-Based Appointment Booking', tag: '⭐ Essential', default: true },
      { id: 'whatsapp_reminders', title: 'Direct WhatsApp Appointment Confirmation', tag: '🔥 High Conversion', default: true },
      { id: 'stylist_picker', title: 'Choose Preferred Stylist / Aesthetician', tag: '✨ Luxury Touch', default: true },
      { id: 'insta_gallery', title: 'Instagram Portfolio Feed Integration', tag: '📸 Social Proof', default: true },
      { id: 'package_offers', title: 'Bridal & Seasonal Combo Offers Showcase', tag: '⚡ Popular', default: false },
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant, Cafe & Lounge',
    icon: FaUtensils,
    badgeColor: 'danger',
    tagline: 'Mouth-watering digital menus & table reservations',
    defaultPages: ['Home', 'Digital Food & Drinks Menu', 'Table Reservation', 'Chef Specials & Story', 'Ambience Gallery', 'Contact & Directions'],
    features: [
      { id: 'table_res', title: 'Online Table Reservation with Time & Guests', tag: '⭐ Essential', default: true },
      { id: 'qr_menu', title: 'Mobile-Optimized QR Code Digital Menu', tag: '📱 Contactless', default: true },
      { id: 'wa_orders', title: 'Direct WhatsApp Takeaway Ordering', tag: '🔥 Instant Sales', default: true },
      { id: 'chef_special', title: 'Daily Specials & Happy Hours Banner', tag: '⚡ Popular', default: true },
      { id: 'zomato_swiggy', title: 'Zomato / Swiggy Direct Order Deep-Links', tag: '🚀 Traffic Driver', default: false },
    ],
  },
  {
    id: 'realestate',
    name: 'Real Estate & Builders',
    icon: FaBuilding,
    badgeColor: 'success',
    tagline: 'High-ticket property showcases with lead capture',
    defaultPages: ['Home', 'Featured Properties', 'Project Floor Plans', 'Amenities & Location Map', 'Builder Portfolio', 'Schedule Site Visit'],
    features: [
      { id: 'site_visit', title: 'Instant "Book Free Site Visit" WhatsApp Funnel', tag: '🔥 #1 Lead Generator', default: true },
      { id: 'brochure_download', title: 'Brochure PDF Download with Phone Lock', tag: '💡 Qualified Leads', default: true },
      { id: 'emi_calc', title: 'Interactive Home Loan EMI Calculator', tag: '⚡ High Engagement', default: true },
      { id: 'virtual_tour', title: '360° Virtual Walkthrough Video Showcase', tag: '✨ High Tech', default: false },
      { id: 'rera_badge', title: 'Verified RERA & Legal Approvals Badge', tag: '🛡️ Trust Factor', default: true },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & D2C Store',
    icon: FaShoppingCart,
    badgeColor: 'primary',
    tagline: 'Blazing fast online stores with frictionless checkout',
    defaultPages: ['Home', 'Shop Catalog', 'Product Detail', 'Shopping Cart', 'Frictionless Checkout', 'Order Tracking'],
    features: [
      { id: 'upi_gateway', title: 'UPI, GooglePay, PhonePe & Razorpay Payments', tag: '⭐ Essential', default: true },
      { id: 'wa_order_alert', title: 'Automated WhatsApp Order Updates to Customers', tag: '🔥 Delight Factor', default: true },
      { id: 'coupon_engine', title: 'Promo Codes & Automated Discount Coupons', tag: '⚡ Boost Sales', default: true },
      { id: 'product_reviews', title: 'Verified Customer Photo Reviews & Ratings', tag: '⭐ Social Proof', default: true },
      { id: 'inventory_sync', title: 'Real-time Stock & Low Inventory Badges', tag: '🚀 Urgency Trigger', default: false },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare, Clinic & Doctor',
    icon: FaHospital,
    badgeColor: 'info',
    tagline: 'Professional medical websites built on trust & care',
    defaultPages: ['Home', 'Specialties & Treatments', 'Doctor Profile & Qualifications', 'Patient Reviews', 'Clinic Gallery', 'Book Consultation'],
    features: [
      { id: 'consult_booking', title: 'Direct Clinic Appointment Booking', tag: '⭐ Essential', default: true },
      { id: 'wa_emergency', title: 'Emergency WhatsApp & Phone Direct Call Floating Action', tag: '🔥 Critical', default: true },
      { id: 'treatment_faqs', title: 'Treatment Cost Guides & Comprehensive FAQs', tag: '💡 Patient Education', default: true },
      { id: 'dr_credentials', title: 'Doctor Registrations, Certifications & Accreditations', tag: '🛡️ 100% Trust', default: true },
    ],
  },
  {
    id: 'education',
    name: 'Coaching & Education Institute',
    icon: FaGraduationCap,
    badgeColor: 'warning',
    tagline: 'High-converting student enrollment & course portals',
    defaultPages: ['Home', 'Courses & Fee Structure', 'Results & Hall of Fame', 'Faculty Team', 'Student Testimonials', 'Admission Enquiry'],
    features: [
      { id: 'syllabus_download', title: 'Download Course Syllabus (Lead Capture)', tag: '🔥 #1 Enrollment Funnel', default: true },
      { id: 'wa_counselor', title: 'WhatsApp Academic Counselor Direct Chat', tag: '⚡ Instant Inquiry', default: true },
      { id: 'batch_schedule', title: 'Upcoming Batch Dates & Seats Left Countdown', tag: '⏳ Urgency Trigger', default: true },
      { id: 'topper_interviews', title: 'Video Testimonials & Rankers Gallery', tag: '⭐ Social Proof', default: true },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate, Agency & IT Services',
    icon: FaBriefcase,
    badgeColor: 'secondary',
    tagline: 'Modern, authoritative B2B websites that command premium pricing',
    defaultPages: ['Home', 'Services Breakdown', 'Case Studies & Client ROI', 'About Company & Leadership', 'Pricing', 'Schedule Discovery Call'],
    features: [
      { id: 'multi_step_quote', title: 'Interactive Project Scope & Cost Calculator', tag: '💡 High Value', default: true },
      { id: 'case_studies', title: 'Metrics-Driven Case Studies with Before/After ROI', tag: '⭐ B2B Proof', default: true },
      { id: 'client_tracker', title: 'Client Project Live Tracker Integration', tag: '✨ Agency Edge', default: true },
      { id: 'nda_clause', title: 'Enterprise SLA & Bank-Grade Security Guarantees', tag: '🛡️ Trust', default: false },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Web App / Startup / SaaS',
    icon: FaRocket,
    badgeColor: 'primary',
    tagline: 'Tailor-made cloud software, AI tools & web platforms',
    defaultPages: ['Landing Page', 'Interactive Features Demo', 'Pricing Matrix', 'Tech Architecture', 'Documentation / FAQs', 'Signup / Demo Request'],
    features: [
      { id: 'auth_dashboard', title: 'Complete User Authentication & Customer Dashboard', tag: '⭐ Essential', default: true },
      { id: 'api_database', title: 'Custom RESTful API & MongoDB Cloud Scalability', tag: '⚡ Architecture', default: true },
      { id: 'subscription_billing', title: 'Recurring Subscription Billing / Stripe / Razorpay', tag: '💰 Monetization', default: true },
      { id: 'edge_deployment', title: 'Cloud Edge Deployment with 99.9% Uptime Guarantee', tag: '🚀 High Scale', default: true },
    ],
  },
];

const SmartProjectStudio = ({ className = '', id = 'project-studio' }) => {
  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState(NICHE_PROFILES[0]);
  const [selectedPages, setSelectedPages] = useState(NICHE_PROFILES[0].defaultPages);
  const [selectedFeatures, setSelectedFeatures] = useState(
    NICHE_PROFILES[0].features.filter((f) => f.default).map((f) => f.title)
  );
  const [customFeatureNote, setCustomFeatureNote] = useState('');

  // Screenshot Upload State
  const [uploadedScreenshots, setUploadedScreenshots] = useState([]);
  const [referenceLink, setReferenceLink] = useState('');
  const [compressingImage, setCompressingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Client Details Form State
  const [clientDetails, setClientDetails] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    budget: '₹15,000 - ₹35,000 (Standard Growth)',
    timeline: 'Within 1 - 2 Weeks',
    additionalNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Niche change handler
  const handleSelectNiche = (niche) => {
    setSelectedNiche(niche);
    setSelectedPages(niche.defaultPages);
    setSelectedFeatures(niche.features.filter((f) => f.default).map((f) => f.title));
  };

  // Toggle Page selection
  const togglePage = (page) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  // Toggle Feature selection
  const toggleFeature = (featureTitle) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureTitle) ? prev.filter((f) => f !== featureTitle) : [...prev, featureTitle]
    );
  };

  // Client-side image resize / compress to clean compact Base64
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Please upload an image file (PNG, JPG, WebP).'));
      }
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to process image.'));
        img.src = readerEvent.target.result;
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (uploadedScreenshots.length + files.length > 5) {
      alert('You can upload up to 5 reference screenshots.');
      return;
    }

    try {
      setCompressingImage(true);
      const newImages = [];
      for (const file of files) {
        const compressed = await processImageFile(file);
        newImages.push(compressed);
      }
      setUploadedScreenshots((prev) => [...prev, ...newImages]);
    } catch (err) {
      alert(err.message || 'Error processing uploaded image.');
    } finally {
      setCompressingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeUploadedScreenshot = (index) => {
    setUploadedScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientDetails.fullName || !clientDetails.phone || !clientDetails.email) {
      setErrorMessage('Please fill in your Name, Phone Number, and Email.');
      return;
    }

    try {
      setSubmitting(true);

      const combinedDescription = [
        `[Smart Studio Brief: ${selectedNiche.name}]`,
        `Pages Requested (${selectedPages.length}): ${selectedPages.join(', ')}`,
        `Features Selected (${selectedFeatures.length}): ${selectedFeatures.join(' | ')}`,
        customFeatureNote ? `Custom Feature Wishlist: ${customFeatureNote}` : '',
        referenceLink ? `Design Reference Link: ${referenceLink}` : '',
        uploadedScreenshots.length ? `Reference Screenshots Uploaded: ${uploadedScreenshots.length} images` : '',
        clientDetails.additionalNotes ? `Client Notes: ${clientDetails.additionalNotes}` : '',
        `Estimated Timeline: ${clientDetails.timeline}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const payload = {
        fullName: clientDetails.fullName,
        businessName: clientDetails.businessName || `${clientDetails.fullName}'s Business`,
        businessCategory: selectedNiche.name,
        nicheCategory: selectedNiche.name,
        email: clientDetails.email,
        phone: clientDetails.phone,
        requiredService: `Website Development (${selectedNiche.name})`,
        budget: clientDetails.budget,
        selectedPages,
        selectedFeatures: customFeatureNote
          ? [...selectedFeatures, `Custom: ${customFeatureNote}`]
          : selectedFeatures,
        referenceImages: uploadedScreenshots,
        referenceLink,
        projectDescription: combinedDescription,
        preferredContactMethod: 'WhatsApp',
      };

      const res = await api.post('/public/enquiries', payload);

      if (res.data?.success) {
        setSubmittedData({
          trackingCode: res.data.trackingCode || 'RY-WEBSPHERE',
          niche: selectedNiche.name,
          pagesCount: selectedPages.length,
          featuresCount: selectedFeatures.length,
          phone: clientDetails.phone,
          fullName: clientDetails.fullName,
        });
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit your brief. Please verify your details or connect via WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp Pre-filled Text Generator
  const generateWhatsAppUrl = () => {
    if (!submittedData) return 'https://wa.me/917800462309';
    const text = `Hello Ranjan! I just configured my *${submittedData.niche}* website project on RY WebSphere.
• *My Name:* ${submittedData.fullName}
• *Tracking Code:* ${submittedData.trackingCode}
• *Pages Configured:* ${submittedData.pagesCount} pages
• *Features Selected:* ${submittedData.featuresCount} key features
${uploadedScreenshots.length ? `• *Screenshots Attached:* Yes (${uploadedScreenshots.length} design ideas uploaded)` : ''}

Can we discuss timeline, final quotation, and launch roadmap?`;

    return `https://wa.me/917800462309?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id={id} className={`py-5 position-relative ${className}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Ambient background glows */}
      <div
        className="position-absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container position-relative z-2">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <FaMagic className="text-primary" />
            <span className="small fw-bold text-primary text-uppercase tracking-wider">
              Smart Project Studio • 60-Second Estimator
            </span>
          </div>

          <h2 className="display-6 fw-extrabold text-white mb-3">
            Design Your Dream Website <br />
            <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              With Intelligent Industry Suggestions
            </span>
          </h2>

          <p className="lead text-secondary mx-auto" style={{ maxWidth: '680px', fontSize: '1.05rem' }}>
            Tell us your business niche, pick recommended high-converting features, upload screenshots or template ideas you love, and get an immediate blueprint tailored to your brand.
          </p>
        </div>

        {/* Studio Container Box */}
        <div
          className="rounded-4 p-4 p-md-5 shadow-2xl mx-auto"
          style={{
            maxWidth: 1040,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          }}
        >
          {/* SUCCESS SCREEN */}
          {submittedData ? (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                style={{ width: 88, height: 88, background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981' }}
              >
                <FaCheckCircle size={44} className="text-success" />
              </div>

              <span className="badge bg-success bg-opacity-25 text-success px-3 py-1.5 rounded-pill small mb-2 d-inline-block">
                Project Blueprint Created Successfully!
              </span>

              <h3 className="fw-bold text-white mb-2">Thank you, {submittedData.fullName}!</h3>
              <p className="text-secondary mx-auto mb-4" style={{ maxWidth: 560 }}>
                Your custom <strong>{submittedData.niche}</strong> project brief has been recorded. Our lead engineering team led by <strong>Ranjan Yadav</strong> is reviewing your design references and feature selections.
              </p>

              {/* Tracking Code Box */}
              <div
                className="d-inline-block p-3 px-4 rounded-3 border mb-4 text-center"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
              >
                <div className="small text-muted text-uppercase fw-bold">Official Project Tracking Code</div>
                <div className="fs-3 fw-extrabold text-primary font-monospace">{submittedData.trackingCode}</div>
                <div className="small text-secondary mt-1">Check project live milestones anytime at <code>/track</code></div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success d-inline-flex align-items-center gap-2 px-4 py-2.5 fw-bold rounded-pill shadow-lg"
                >
                  <FaWhatsapp size={20} />
                  <span>Send Blueprint on WhatsApp to Ranjan</span>
                </a>

                <button
                  onClick={() => {
                    setSubmittedData(null);
                    setStep(1);
                    setUploadedScreenshots([]);
                  }}
                  className="btn btn-outline-secondary px-4 py-2.5 rounded-pill"
                >
                  Configure Another Project
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Stepper Progress Bar */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                {[
                  { num: 1, label: 'Choose Niche' },
                  { num: 2, label: 'Smart Suggestions' },
                  { num: 3, label: 'Upload Designs' },
                  { num: 4, label: 'Confirm & Get Quote' },
                ].map((s) => (
                  <div
                    key={s.num}
                    onClick={() => step > s.num && setStep(s.num)}
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: step > s.num ? 'pointer' : 'default', opacity: step >= s.num ? 1 : 0.4 }}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-center rounded-circle fw-bold small ${
                        step === s.num ? 'bg-primary text-white shadow' : step > s.num ? 'bg-success text-white' : 'bg-surface text-muted'
                      }`}
                      style={{ width: 32, height: 32 }}
                    >
                      {step > s.num ? <FaCheck size={12} /> : s.num}
                    </div>
                    <span className="d-none d-md-inline small fw-semibold text-light">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: NICHE SELECTION */}
              {step === 1 && (
                <div>
                  <div className="mb-4 text-center text-md-start">
                    <h4 className="fw-bold text-white mb-1">Step 1: What is your business industry?</h4>
                    <p className="text-secondary small">
                      Select your niche so our engine can generate high-converting features and page suggestions tailored to your market.
                    </p>
                  </div>

                  <div className="row g-3 mb-4">
                    {NICHE_PROFILES.map((niche) => {
                      const IconComponent = niche.icon;
                      const isSelected = selectedNiche.id === niche.id;
                      return (
                        <div key={niche.id} className="col-12 col-sm-6 col-lg-4">
                          <div
                            onClick={() => handleSelectNiche(niche)}
                            className="p-3 rounded-3 h-100 transition-all text-start"
                            style={{
                              backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface)',
                              border: isSelected ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.25)' : 'none',
                              transform: isSelected ? 'translateY(-2px)' : 'none',
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <div
                                className="p-2 rounded-3 d-inline-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
                                  color: '#fff',
                                }}
                              >
                                <IconComponent size={20} />
                              </div>
                              {isSelected && <FaCheckCircle className="text-primary fs-5" />}
                            </div>
                            <div className="fw-bold text-white mb-1">{niche.name}</div>
                            <div className="text-muted small" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                              {niche.tagline}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-pill fw-bold"
                    >
                      <span>Proceed to Smart Suggestions</span>
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SMART SUGGESTIONS (PAGES & FEATURES) */}
              {step === 2 && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <div>
                      <h4 className="fw-bold text-white mb-1">
                        Step 2: Recommended Architecture for <span className="text-primary">{selectedNiche.name}</span>
                      </h4>
                      <p className="text-secondary small mb-0">
                        We have pre-selected the highest converting pages & features for your industry. Uncheck or add anything you want.
                      </p>
                    </div>
                    <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-1.5 rounded-pill small">
                      {selectedNiche.name} Optimized
                    </span>
                  </div>

                  {/* Recommended Pages Grid */}
                  <div className="mb-4 p-3.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2 mb-2.5">
                      <FaLayerGroup className="text-info" />
                      <h6 className="fw-bold text-white mb-0">Recommended Website Pages ({selectedPages.length} selected)</h6>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedNiche.defaultPages.map((page) => {
                        const checked = selectedPages.includes(page);
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => togglePage(page)}
                            className="btn btn-sm d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1.5 transition-all"
                            style={{
                              backgroundColor: checked ? '#3b82f6' : 'rgba(255, 255, 255, 0.06)',
                              color: '#ffffff',
                              border: checked ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                            }}
                          >
                            {checked ? <FaCheck size={11} /> : <span style={{ width: 11 }} />}
                            <span className="small">{page}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended High-Impact Features */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                      <FaBolt className="text-warning" />
                      <span>Recommended Industry Features & Integrations</span>
                    </h6>

                    <div className="row g-2.5">
                      {selectedNiche.features.map((feat) => {
                        const checked = selectedFeatures.includes(feat.title);
                        return (
                          <div key={feat.id} className="col-12 col-md-6">
                            <div
                              onClick={() => toggleFeature(feat.title)}
                              className="p-3 rounded-3 d-flex align-items-center justify-content-between h-100 transition-all"
                              style={{
                                backgroundColor: checked ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface)',
                                border: checked ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                                cursor: 'pointer',
                              }}
                            >
                              <div className="d-flex align-items-center gap-2.5 me-2">
                                <div
                                  className={`rounded-circle d-flex align-items-center justify-content-center ${
                                    checked ? 'bg-primary text-white' : 'border border-secondary'
                                  }`}
                                  style={{ width: 20, height: 20, flexShrink: 0 }}
                                >
                                  {checked && <FaCheck size={10} />}
                                </div>
                                <span className="small fw-semibold text-white">{feat.title}</span>
                              </div>
                              <span className="badge bg-dark border border-secondary border-opacity-50 small" style={{ fontSize: '0.7rem' }}>
                                {feat.tag}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Extra Features Input */}
                  <div className="mb-4">
                    <label className="form-label small text-secondary fw-semibold">
                      Any other specific feature or requirement you have in mind? (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control-ry"
                      placeholder="e.g. Multi-language support, custom CRM connection, dark/light mode toggle, AI chatbot..."
                      value={customFeatureNote}
                      onChange={(e) => setCustomFeatureNote(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                    >
                      <FaArrowLeft size={13} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-pill fw-bold"
                    >
                      <span>Upload Reference Designs</span>
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DESIGN SCREENSHOT & TEMPLATE UPLOAD */}
              {step === 3 && (
                <div>
                  <div className="mb-4">
                    <h4 className="fw-bold text-white mb-1">Step 3: Have a design or template in mind?</h4>
                    <p className="text-secondary small">
                      Upload screenshots of websites, UI templates, or sketches you like. This helps our designers match your exact visual vision from Day 1.
                    </p>
                  </div>

                  {/* Drag and Drop Upload Zone */}
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="p-5 rounded-4 text-center mb-4 transition-all"
                    style={{
                      border: '2px dashed var(--accent-blue)',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="d-none"
                    />

                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow"
                      style={{ width: 64, height: 64, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                    >
                      <FaCloudUploadAlt size={32} />
                    </div>

                    <h6 className="fw-bold text-white mb-1">
                      {compressingImage ? 'Processing Screenshot...' : 'Click to Upload Reference Screenshots or Designs'}
                    </h6>
                    <p className="small text-muted mb-0">
                      Supports PNG, JPG, WebP (Up to 5 images • Auto-optimized)
                    </p>
                  </div>

                  {/* Uploaded Thumbnails Preview */}
                  {uploadedScreenshots.length > 0 && (
                    <div className="mb-4">
                      <div className="small fw-bold text-white mb-2">
                        Attached Design References ({uploadedScreenshots.length} of 5):
                      </div>
                      <div className="d-flex flex-wrap gap-3">
                        {uploadedScreenshots.map((img, idx) => (
                          <div
                            key={idx}
                            className="position-relative rounded-3 overflow-hidden border border-secondary shadow-sm"
                            style={{ width: 120, height: 120 }}
                          >
                            <img src={img} alt={`Ref ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadedScreenshot(idx);
                              }}
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-1 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 22, height: 22, fontSize: '0.65rem' }}
                              title="Remove image"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reference URL input */}
                  <div className="mb-4">
                    <label className="form-label small text-secondary fw-semibold">
                      Or paste a website/competitor link you want to replicate or take inspiration from:
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border text-muted">
                        <FaExternalLinkAlt size={14} />
                      </span>
                      <input
                        type="url"
                        className="form-control-ry"
                        placeholder="https://example.com or ThemeForest / Behance link..."
                        value={referenceLink}
                        onChange={(e) => setReferenceLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                    >
                      <FaArrowLeft size={13} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-pill fw-bold"
                    >
                      <span>Final Details & Estimate</span>
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CLIENT DETAILS & CONFIRMATION */}
              {step === 4 && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <h4 className="fw-bold text-white mb-1">Step 4: Where should we send your quote?</h4>
                    <p className="text-secondary small">
                      Review your configuration summary and enter your contact details. You will immediately receive a project tracking code.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div
                    className="p-3.5 rounded-3 border mb-4"
                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.25)' }}
                  >
                    <div className="row g-2 align-items-center text-light small">
                      <div className="col-sm-4">
                        <span className="text-muted">Niche:</span> <strong>{selectedNiche.name}</strong>
                      </div>
                      <div className="col-sm-4">
                        <span className="text-muted">Pages:</span> <strong>{selectedPages.length} Pages</strong>
                      </div>
                      <div className="col-sm-4">
                        <span className="text-muted">Features:</span> <strong>{selectedFeatures.length} Features</strong>
                      </div>
                      {uploadedScreenshots.length > 0 && (
                        <div className="col-12 mt-2">
                          <span className="text-muted">Uploaded Design References:</span>{' '}
                          <span className="badge bg-info text-dark">{uploadedScreenshots.length} screenshots attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {errorMessage}
                    </div>
                  )}

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control-ry"
                        placeholder="e.g. Rohit Sharma"
                        value={clientDetails.fullName}
                        onChange={(e) => setClientDetails({ ...clientDetails, fullName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">WhatsApp Number (For Instant Consultation) *</label>
                      <input
                        type="tel"
                        required
                        className="form-control-ry"
                        placeholder="e.g. +91 98765 43210"
                        value={clientDetails.phone}
                        onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="form-control-ry"
                        placeholder="e.g. rohit@business.com"
                        value={clientDetails.email}
                        onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">Business / Brand Name</label>
                      <input
                        type="text"
                        className="form-control-ry"
                        placeholder="e.g. IronPulse Fitness Club"
                        value={clientDetails.businessName}
                        onChange={(e) => setClientDetails({ ...clientDetails, businessName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">Estimated Budget Range</label>
                      <select
                        className="form-select-ry"
                        value={clientDetails.budget}
                        onChange={(e) => setClientDetails({ ...clientDetails, budget: e.target.value })}
                      >
                        <option value="₹7,999 - ₹15,000 (Starter Kickoff)">₹7,999 - ₹15,000 (Starter Kickoff)</option>
                        <option value="₹15,000 - ₹35,000 (Standard Growth)">₹15,000 - ₹35,000 (Standard Growth)</option>
                        <option value="₹35,000 - ₹75,000 (Advanced Custom App)">₹35,000 - ₹75,000 (Advanced Custom App)</option>
                        <option value="Flexible / Based on Technical Scope">Flexible / Based on Technical Scope</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light">Target Launch Timeline</label>
                      <select
                        className="form-select-ry"
                        value={clientDetails.timeline}
                        onChange={(e) => setClientDetails({ ...clientDetails, timeline: e.target.value })}
                      >
                        <option value="Urgent (Within 5 - 7 Days)">Urgent (Within 5 - 7 Days)</option>
                        <option value="Within 1 - 2 Weeks">Within 1 - 2 Weeks</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="Flexible / Planning Phase">Flexible / Planning Phase</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-light">Any additional message for Ranjan?</label>
                      <textarea
                        rows="2"
                        className="form-control-ry"
                        placeholder="Tell us any specific goals, target audience, or requirements..."
                        value={clientDetails.additionalNotes}
                        onChange={(e) => setClientDetails({ ...clientDetails, additionalNotes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                    >
                      <FaArrowLeft size={13} />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary d-inline-flex align-items-center gap-2 px-5 py-3 rounded-pill fw-bold shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          <span>Generating Blueprint...</span>
                        </>
                      ) : (
                        <>
                          <FaRocket />
                          <span>Generate Project Blueprint & Quote</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmartProjectStudio;