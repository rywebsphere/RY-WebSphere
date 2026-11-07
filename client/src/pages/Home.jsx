import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaWhatsapp,
  FaCheckCircle,
  FaMobileAlt,
  FaBolt,
  FaCode,
  FaShieldAlt,
  FaHeadset,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaRegLightbulb,
  FaDraftingCompass,
  FaLaptopCode,
  FaRocket,
  FaBriefcase,
  FaDumbbell,
  FaSpa,
  FaUserMd,
  FaUtensils,
  FaGraduationCap,
  FaShoppingCart,
  FaBuilding,
} from 'react-icons/fa';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useCurrency } from '../context/CurrencyContext';
import BeforeAfterSlider from '../components/common/BeforeAfterSlider';
import WebsiteAuditTool from '../components/common/WebsiteAuditTool';

const Home = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { formatPrice, currency } = useCurrency();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, pricingRes] = await Promise.all([
          api.get('/public/services'),
          api.get('/public/projects'),
          api.get('/public/pricing'),
        ]);

        if (servicesRes.data?.data) setServices(servicesRes.data.data);
        if (projectsRes.data?.data) setProjects(projectsRes.data.data.slice(0, 6));
        if (pricingRes.data?.data) setPricing(pricingRes.data.data);
      } catch (err) {
        console.warn('Using initial agency data cache:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const whatsappNumber = settings?.whatsappNumber;
  const isRealNumber = whatsappNumber && whatsappNumber !== 'YOUR_WHATSAPP_NUMBER';
  const whatsappUrl = isRealNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hello%20RY%20WebSphere!%20I%20would%20like%20to%20discuss%20a%20website%20project.`
    : '/contact';

  const trustProps = [
    {
      icon: FaMobileAlt,
      title: 'Mobile-Friendly Design',
      desc: 'Flawless layout responsiveness across smartphones, tablets, laptops, and desktop monitors.',
    },
    {
      icon: FaBolt,
      title: 'Fast & Reliable Performance',
      desc: 'Optimized web assets, clean markup, and streamlined loading speeds that keep visitors engaged.',
    },
    {
      icon: FaCheckCircle,
      title: 'Clear Customer Enquiries',
      desc: 'Structured contact forms and direct WhatsApp triggers that make reaching your business seamless.',
    },
    {
      icon: FaCode,
      title: 'Maintainable Code',
      desc: 'Modern React.js and Node.js architecture built to web standards for straightforward future scalability.',
    },
    {
      icon: FaShieldAlt,
      title: 'Transparent Pricing',
      desc: 'Honest, upfront package tiers starting at ₹2,999 with defined deliverables and no hidden fees.',
    },
    {
      icon: FaHeadset,
      title: 'Post-Launch Support',
      desc: 'Dedicated handover guidance, staging revisions, and available maintenance options after deployment.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      icon: FaRegLightbulb,
      title: 'Discover',
      desc: 'We analyze your business goals, target audience, preferred branding, and technical requirements.',
    },
    {
      step: '02',
      icon: FaDraftingCompass,
      title: 'Design',
      desc: 'We plan a clean visual hierarchy, wireframes, and intuitive user experiences focused on visitor conversion.',
    },
    {
      step: '03',
      icon: FaLaptopCode,
      title: 'Develop',
      desc: 'We build your website using React, Bootstrap 5, and Node.js, testing across browsers and screen sizes.',
    },
    {
      step: '04',
      icon: FaRocket,
      title: 'Launch',
      desc: 'We deploy the approved website to your domain and hosting, providing agreed support and handover guidance.',
    },
  ];

  const industries = [
    { name: 'Fitness & Gyms', icon: FaDumbbell, path: '/industries/gym-fitness', badge: 'Interactive Demo Available' },
    { name: 'Healthcare & Clinics', icon: FaUserMd, path: '/industries/doctor-clinic', badge: 'Interactive Demo Available' },
    { name: 'Salons & Beauty', icon: FaSpa, path: '/industries/salon-beauty', badge: 'Interactive Demo Available' },
    { name: 'Restaurants & Cafes', icon: FaUtensils, path: '/industries/restaurant-cafe', badge: 'Interactive Demo Available' },
    { name: 'Education & Coaching', icon: FaGraduationCap, path: '/industries/coaching-education', badge: 'Interactive Demo Available' },
    { name: 'Real Estate & Properties', icon: FaBuilding, path: '/industries/real-estate', badge: 'Interactive Demo Available' },
    { name: 'Local Business Services', icon: FaBriefcase, path: '/industries/local-business', badge: 'Interactive Demo Available' },
    { name: 'Retail & E-commerce', icon: FaShoppingCart, path: '/services/ecommerce-websites', badge: 'Service Details' },
    { name: 'Startups & Tech Firms', icon: FaRocket, path: '/services/custom-web-applications', badge: 'Service Details' },
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="ry-hero-bg py-5 py-lg-6 position-relative border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            {/* Left Column: Headlines & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-lg-7"
            >
              <div className="mb-3">
                <span className="ry-badge">
                  <span className="text-primary fw-bold">RY WebSphere</span>
                  <span className="text-muted">• Founded by Ranjan Yadav</span>
                </span>
              </div>

              <h1 className="display-4 fw-extrabold mb-3 lh-sm" style={{ fontWeight: 800 }}>
                Your Business Deserves a{' '}
                <span className="ry-gradient-text">Powerful Online Presence.</span>
              </h1>

              <p className="lead text-secondary mb-4" style={{ fontSize: '1.2rem', maxWidth: 620 }}>
                RY WebSphere builds modern, responsive websites for businesses, professionals, and startups. We combine clean design, useful functionality, and reliable development to help your business establish a strong online presence.
              </p>

              {/* Tagline callout */}
              <div className="p-3 rounded-3 mb-4 ry-card" style={{ maxWidth: 580 }}>
                <p className="small mb-0 text-muted fst-italic">
                  <strong className="text-primary">Official Tagline:</strong> "{settings.tagline || 'Your Vision. Our Web. Unlimited Possibilities.'}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/contact" className="btn btn-ry-primary btn-lg px-4 py-3">
                  <span>Get a Free Consultation</span>
                  <FaArrowRight size={14} />
                </Link>

                <Link to="/portfolio" className="btn btn-ry-secondary btn-lg px-4 py-3">
                  <span>Explore Our Work</span>
                </Link>
              </div>

              {/* Feature Highlights Pills */}
              <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-2 text-muted small">
                <span className="d-flex align-items-center gap-1.5">
                  <FaCheckCircle className="text-success" /> Mobile Responsive
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <FaCheckCircle className="text-success" /> Transparent Pricing
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <FaCheckCircle className="text-success" /> Direct WhatsApp Lead CTAs
                </span>
              </div>
            </motion.div>

            {/* Right Column: Visual Composition Mockups */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="col-lg-5"
            >
              <div className="position-relative">
                {/* Desktop Website Frame Mockup */}
                <div
                  className="ry-card p-2 rounded-4 shadow-lg overflow-hidden position-relative"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {/* Browser Bar */}
                  <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="d-flex gap-1.5">
                      <span className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#ef4444' }} />
                      <span className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#f59e0b' }} />
                      <span className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#10b981' }} />
                    </div>
                    <div
                      className="px-3 py-1 rounded-2 text-muted small mx-auto d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '0.72rem',
                        width: '70%',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <span>https://rywebsphere.com</span>
                      <span className="text-success">● SSL Secure</span>
                    </div>
                  </div>

                  {/* Mockup Screen Content */}
                  <div className="p-3" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="fw-bold small text-primary">RY WebSphere Agency</div>
                      <span className="badge bg-primary bg-opacity-20 text-primary" style={{ fontSize: '0.65rem' }}>
                        Live Client Ready
                      </span>
                    </div>

                    <div className="p-3 rounded-3 mb-2" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                      <div className="h6 fw-bold mb-1 text-white">Modern Business Platforms</div>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                        Custom React.js Interfaces • Fast Node.js APIs • Clean Design
                      </div>
                    </div>

                    <div className="row g-2 pt-1">
                      <div className="col-6">
                        <div className="p-2 rounded-2 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                          <div className="fw-bold text-success" style={{ fontSize: '0.85rem' }}>99.9% Uptime</div>
                          <div className="text-muted" style={{ fontSize: '0.65rem' }}>Reliable Stack</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded-2 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                          <div className="fw-bold text-info" style={{ fontSize: '0.85rem' }}>Sub-Second</div>
                          <div className="text-muted" style={{ fontSize: '0.65rem' }}>Load Speed Target</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Mobile Preview Device Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="position-absolute ry-card p-3 rounded-4 shadow-lg"
                  style={{
                    bottom: '-25px',
                    left: '-25px',
                    width: '210px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    zIndex: 2,
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaMobileAlt className="text-primary" />
                    <span className="fw-bold small">Mobile First</span>
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    100% responsive on Apple iOS & Android screens.
                  </div>
                </motion.div>

                {/* Floating Price Pill */}
                <div
                  className="position-absolute ry-card px-3 py-2 rounded-pill shadow"
                  style={{
                    top: '-15px',
                    right: '-15px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    zIndex: 2,
                    fontSize: '0.82rem',
                  }}
                >
                  <span className="text-muted">Packages from </span>
                  <strong className="text-success">{formatPrice(2999, 49)}</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST AND VALUE PROPOSITION */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="ry-badge mb-2">Why Choose RY WebSphere</span>
            <h2 className="ry-section-title">Engineering Websites That Build Trust & Revenue</h2>
            <p className="ry-section-subtitle">
              We focus on clean craftsmanship, transparent pricing, and practical business utility.
            </p>
          </div>

          <div className="row g-4">
            {trustProps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="ry-card p-4 h-100 ry-card-interactive">
                    <div
                      className="d-inline-flex align-items-center justify-content-center p-3 rounded-3 mb-3 text-primary"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">{item.title}</h5>
                    <p className="text-muted small mb-0">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SERVICES OVERVIEW */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-3">
            <div>
              <span className="ry-badge mb-2">Agency Services</span>
              <h2 className="ry-section-title mb-1">Tailored Web Development Solutions</h2>
              <p className="text-muted mb-0">From single-page launchpads to complete custom full-stack web applications.</p>
            </div>
            <Link to="/services" className="btn btn-ry-outline btn-sm">
              <span>View All 15 Services</span>
              <FaArrowRight size={12} />
            </Link>
          </div>

          {/* Services Grid (Showing first 6 on homepage) */}
          <div className="row g-4">
            {(services.length > 0 ? services.slice(0, 6) : []).map((service) => (
              <div key={service.slug} className="col-lg-4 col-md-6">
                <div className="ry-card p-4 h-100 d-flex flex-column justify-content-between ry-card-interactive">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                        Service #{service.order}
                      </span>
                    </div>

                    <h5 className="fw-bold mb-2">{service.title}</h5>
                    <p className="text-muted small mb-3">{service.shortDescription}</p>

                    <ul className="list-unstyled d-flex flex-column gap-1.5 small text-secondary mb-4">
                      {service.features?.slice(0, 3).map((feat, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <FaCheckCircle className="text-primary mt-1 flex-shrink-0" size={12} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="d-flex align-items-center gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="btn btn-ry-secondary btn-sm flex-grow-1"
                      style={{ fontSize: '0.85rem' }}
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate('/contact', { state: { preselectedService: service.title } })}
                      className="btn btn-ry-primary btn-sm flex-grow-1"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3B. BEFORE VS AFTER TRANSFORMATION SLIDER */}
      <section className="ry-section py-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* 4. HOW WE WORK (4-STEP PROCESS) */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="ry-badge mb-2">Our Process</span>
            <h2 className="ry-section-title">How We Build Your Website</h2>
            <p className="ry-section-subtitle">
              A transparent, structured four-step journey from initial brief to verified launch. Timelines depend on scope and client feedback.
            </p>
          </div>

          <div className="row g-4">
            {workflowSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="col-lg-3 col-md-6">
                  <div className="ry-card p-4 h-100 position-relative ry-card-interactive">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="display-6 fw-bold text-primary opacity-50" style={{ fontFamily: 'var(--font-mono)' }}>
                        {step.step}
                      </span>
                      <div className="p-2.5 rounded-3 bg-primary bg-opacity-10 text-primary">
                        <StepIcon size={20} />
                      </div>
                    </div>
                    <h5 className="fw-bold mb-2">{step.title}</h5>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES WE SERVE */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="ry-badge mb-2">Specialized Niches</span>
            <h2 className="ry-section-title">Industries We Build For</h2>
            <p className="ry-section-subtitle">
              Purpose-built digital experiences configured with the exact features your industry needs to win customers.
            </p>
          </div>

          <div className="row g-4">
            {industries.map((ind, i) => {
              const IndIcon = ind.icon;
              return (
                <div key={i} className="col-lg-4 col-md-6">
                  <Link to={ind.path} className="text-decoration-none text-reset">
                    <div className="ry-card p-4 h-100 d-flex align-items-center justify-content-between ry-card-interactive">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                          <IndIcon size={22} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{ind.name}</h6>
                          <span className="badge bg-secondary bg-opacity-20 text-muted" style={{ fontSize: '0.7rem' }}>
                            {ind.badge}
                          </span>
                        </div>
                      </div>
                      <FaArrowRight size={14} className="text-primary" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PORTFOLIO PREVIEW */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-3">
            <div>
              <span className="ry-badge mb-2">Demonstrated Craft</span>
              <h2 className="ry-section-title mb-1">Featured Project Showcases</h2>
              <p className="text-muted mb-0">
                Explore real, interactive prototypes and web applications crafted by RY WebSphere.
              </p>
            </div>
            <Link to="/portfolio" className="btn btn-ry-outline btn-sm">
              <span>View All Projects</span>
              <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="row g-4">
            {projects.map((proj) => (
              <div key={proj.slug} className="col-lg-4 col-md-6">
                <div className="ry-card overflow-hidden h-100 d-flex flex-column justify-content-between ry-card-interactive">
                  <div>
                    {/* Thumbnail Image Container */}
                    <div className="position-relative overflow-hidden" style={{ height: 210 }}>
                      <img
                        src={proj.thumbnail || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'}
                        alt={proj.title}
                        className="w-100 h-100 object-fit-cover"
                        loading="lazy"
                      />
                      <div className="position-absolute top-0 start-0 m-2.5">
                        <span className="ry-badge-demo px-2.5 py-1 rounded-2 shadow-sm">
                          Demo Project
                        </span>
                      </div>
                      <div className="position-absolute top-0 end-0 m-2.5">
                        <span className="badge bg-dark bg-opacity-75 text-light px-2 py-1" style={{ fontSize: '0.72rem' }}>
                          {proj.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h5 className="fw-bold mb-2">{proj.title}</h5>
                      <p className="text-muted small mb-3" style={{ lineClamp: 2 }}>
                        {proj.description}
                      </p>

                      <div className="d-flex flex-wrap gap-1.5 mb-3">
                        {proj.technologies?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="badge bg-surface text-secondary border" style={{ fontSize: '0.7rem' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 d-flex align-items-center gap-2">
                    {proj.demoUrl && (
                      <Link
                        to={proj.demoUrl}
                        className="btn btn-ry-primary btn-sm flex-grow-1"
                        style={{ fontSize: '0.85rem' }}
                      >
                        Live Demo
                      </Link>
                    )}
                    <Link
                      to={`/portfolio/${proj.slug}`}
                      className="btn btn-ry-secondary btn-sm flex-grow-1"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Project Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6B. FREE WEBSITE HEALTH & SPEED AUDIT TOOL */}
      <section className="ry-section py-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <WebsiteAuditTool />
        </div>
      </section>

      {/* 7. PRICING PREVIEW */}
      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="ry-badge mb-2">Transparent Investment</span>
            <h2 className="ry-section-title">Clear, Predictable Web Packages</h2>
            <p className="ry-section-subtitle">
              Professional website development starting at ₹2,999. Final pricing depends on project scope, custom requirements, and third-party services.
            </p>
          </div>

          <div className="row g-4 align-items-stretch justify-content-center">
            {pricing.map((pkg) => (
              <div key={pkg.slug} className="col-lg-4 col-md-6">
                <div
                  className={`ry-card p-4 h-100 d-flex flex-column justify-content-between position-relative ${
                    pkg.isPopular ? 'border-primary' : ''
                  }`}
                  style={{
                    backgroundColor: pkg.isPopular ? 'var(--bg-surface)' : 'var(--bg-card)',
                    boxShadow: pkg.isPopular ? '0 12px 36px -8px rgba(59, 130, 246, 0.3)' : 'var(--glow-card)',
                  }}
                >
                  {pkg.isPopular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill shadow-sm fw-bold" style={{ fontSize: '0.75rem' }}>
                        ★ MOST POPULAR CHOICE
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="fw-bold mb-1 mt-2">{pkg.name}</h4>
                    <p className="text-muted small mb-3">{pkg.description}</p>

                    <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="d-flex align-items-baseline gap-1">
                        <span className="display-5 fw-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                          {formatPrice(pkg.price, pkg.priceUSD)}
                        </span>
                        <span className="text-muted small">/{pkg.period || 'starting'}</span>
                      </div>
                      <div className="small text-muted mt-1">
                        Estimated Delivery: <strong className="text-secondary">{pkg.deliveryEstimate}</strong>
                      </div>
                    </div>

                    <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-4">
                      {pkg.features?.map((f, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={13} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="p-2.5 rounded-2 bg-secondary bg-opacity-10 text-muted small mb-3 text-center" style={{ fontSize: '0.75rem' }}>
                      {pkg.revisionLimit}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate('/contact', {
                          state: {
                            preselectedPackage: pkg.name,
                            preselectedBudget: `${formatPrice(pkg.price, pkg.priceUSD)} (${currency})`,
                          },
                        })
                      }
                      className={`btn w-100 py-2.5 fw-semibold ${
                        pkg.isPopular ? 'btn-ry-primary' : 'btn-ry-secondary'
                      }`}
                    >
                      Choose Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/pricing" className="btn btn-ry-outline px-4">
              <span>View Full Feature Comparison & Add-Ons</span>
              <FaArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION (Directly above Footer - 100% Theme Adaptive) */}
      <section className="ry-cta-section py-5 text-center position-relative overflow-hidden">
        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
          <span className="ry-badge mb-3">Take the Next Step</span>
          <h2 className="display-5 fw-bold mb-3 ry-cta-title">Let's Build Something Great for Your Business.</h2>
          <p className="lead ry-cta-desc mb-4 mx-auto" style={{ maxWidth: 680 }}>
            Tell us about your business and the website you need. We'll discuss your requirements and suggest a suitable solution.
          </p>

          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
            <Link to="/contact" className="btn btn-ry-primary btn-lg px-4 py-3">
              <span>Start Your Project</span>
              <FaArrowRight size={14} />
            </Link>

            {isRealNumber ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success btn-lg px-4 py-3 d-inline-flex align-items-center gap-2 text-white"
              >
                <FaWhatsapp size={20} />
                <span>Contact Us on WhatsApp</span>
              </a>
            ) : (
              <Link
                to="/contact"
                className="btn btn-ry-secondary btn-lg px-4 py-3 d-inline-flex align-items-center gap-2"
              >
                <FaWhatsapp size={18} className="text-success" />
                <span>Contact Consultation Form</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
