import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaQuestionCircle,
  FaTag,
  FaCloud,
  FaGlobe,
  FaCalculator,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProjectCostCalculator from '../components/common/ProjectCostCalculator';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const Pricing = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get('/public/pricing');
        if (res.data?.success) {
          setPackages(res.data.data);
        }
      } catch (err) {
        console.warn('Error fetching pricing:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleChoosePackage = (pkg) => {
    navigate('/contact', {
      state: {
        preselectedPackage: pkg.name,
        preselectedBudget: `${formatPrice(pkg.price, pkg.priceUSD)} (${currency})`,
      },
    });
  };

  return (
    <div>
      <PageHeader
        badge="Transparent Investment"
        title="Predictable Pricing & Service Packages"
        subtitle="Clear, upfront pricing with defined deliverables. No surprise costs or inflated agency overhead. Choose a package tailored to your current stage."
        breadcrumbs={[{ label: 'Pricing' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Important Scope Notice Banner */}
          <div
            className="alert py-3 px-4 rounded-3 d-flex align-items-center gap-3 mb-4"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              borderColor: 'rgba(59, 130, 246, 0.25)',
              color: 'var(--text-primary)',
            }}
          >
            <FaCloud className="text-primary flex-shrink-0" size={24} />
            <div className="small">
              <strong>Domain & Google Cloud Fulfillment Guarantee:</strong> You do NOT need to buy domains or manage cloud consoles yourself. RY WebSphere purchases your domain and provisions high-speed Google Cloud hosting directly on your behalf. Domain registry and Google Cloud server charges are billed transparently at actual costs on your setup invoice.
            </div>
          </div>

          {/* Currency Switcher Bar */}
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 mb-5 p-3 rounded-3 bg-surface border">
            <div className="d-flex align-items-center gap-2">
              <FaGlobe className="text-primary" size={18} />
              <span className="small fw-bold" style={{ color: 'var(--text-primary)' }}>
                Select Billing Currency:
              </span>
            </div>

            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`btn px-3 fw-bold ${
                  currency === 'INR' ? 'btn-primary text-white' : 'btn-outline-secondary'
                }`}
              >
                ₹ INR (Domestic India)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`btn px-3 fw-bold ${
                  currency === 'USD' ? 'btn-primary text-white' : 'btn-outline-secondary'
                }`}
              >
                $ USD (International Remote)
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          {loading ? (
            <LoadingSpinner text="Loading current pricing tiers..." />
          ) : (
            <div className="row g-4 align-items-stretch justify-content-center mb-5">
              {packages.map((pkg) => (
                <div key={pkg.slug} className="col-lg-4 col-md-6">
                  <div
                    className={`ry-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between position-relative ${
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
                          ★ MOST POPULAR PACKAGE
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="fw-bold mb-1 mt-2">{pkg.name}</h3>
                      <p className="text-muted small mb-3">{pkg.description}</p>

                      <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="d-flex align-items-baseline gap-1">
                          <span className="display-4 fw-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                            {formatPrice(pkg.price, pkg.priceUSD)}
                          </span>
                          <span className="text-muted small">/{pkg.period}</span>
                        </div>
                        <div className="small text-muted mt-2 d-flex align-items-center gap-1.5">
                          <FaClock className="text-primary" size={13} />
                          <span>Delivery: <strong className="text-secondary">{pkg.deliveryEstimate}</strong></span>
                        </div>
                      </div>

                      {/* Package Features List */}
                      <div className="mb-4">
                        <div className="small fw-bold text-muted mb-3 text-uppercase" style={{ letterSpacing: '0.05em' }}>
                          Included Deliverables
                        </div>
                        <ul className="list-unstyled d-flex flex-column gap-2.5 small text-secondary">
                          {pkg.features?.map((f, i) => (
                            <li key={i} className="d-flex align-items-start gap-2">
                              <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div
                        className="p-2.5 rounded-2 bg-secondary bg-opacity-10 text-muted small mb-3 text-center"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <strong>Revisions:</strong> {pkg.revisionLimit}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleChoosePackage(pkg)}
                        className={`btn w-100 py-3 fw-bold ${
                          pkg.isPopular ? 'btn-ry-primary' : 'btn-ry-secondary'
                        }`}
                      >
                        <span>Choose Package</span>
                        <FaArrowRight size={13} className="ms-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Cost & Scope Calculator Section */}
          <div className="mb-5">
            <ProjectCostCalculator />
          </div>

          {/* Feature Comparison Matrix Table */}
          <div className="ry-card p-4 p-md-5 mb-5 overflow-auto">
            <h3 className="fw-bold mb-4">Detailed Feature Comparison</h3>
            <table className="table ry-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Feature / Capability</th>
                  <th className="text-center" style={{ width: '20%' }}>
                    Starter ({formatPrice(2999, 49)})
                  </th>
                  <th className="text-center" style={{ width: '20%' }}>
                    Business ({formatPrice(5999, 89)})
                  </th>
                  <th className="text-center" style={{ width: '20%' }}>
                    Premium ({formatPrice(9999, 149)})
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-medium">Page Structure</td>
                  <td className="text-center text-secondary">Single-page layout</td>
                  <td className="text-center text-secondary">Up to 5 agreed pages</td>
                  <td className="text-center text-primary fw-semibold">Custom multi-page</td>
                </tr>
                <tr>
                  <td className="fw-medium">Mobile-Responsive Design</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                </tr>
                <tr>
                  <td className="fw-medium">WhatsApp Direct Lead Chat</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                </tr>
                <tr>
                  <td className="fw-medium">Contact & Enquiry Form</td>
                  <td className="text-center text-muted">Basic Click-to-Action</td>
                  <td className="text-center text-success"><FaCheckCircle /> Working Form</td>
                  <td className="text-center text-success"><FaCheckCircle /> Advanced Lead Funnel</td>
                </tr>
                <tr>
                  <td className="fw-medium">Domain & Google Cloud Deployment</td>
                  <td className="text-center text-success"><FaCheckCircle /> Handled by RY WebSphere (billed at actuals)</td>
                  <td className="text-center text-success"><FaCheckCircle /> Handled by RY WebSphere (billed at actuals)</td>
                  <td className="text-center text-success"><FaCheckCircle /> Handled by RY WebSphere (billed at actuals)</td>
                </tr>
                <tr>
                  <td className="fw-medium">Interactive Google Maps Embed</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                  <td className="text-center text-success"><FaCheckCircle /> Included</td>
                </tr>
                <tr>
                  <td className="fw-medium">Photo Gallery / Showcase</td>
                  <td className="text-center text-muted">Section overview</td>
                  <td className="text-center text-success"><FaCheckCircle /> Dedicated Gallery</td>
                  <td className="text-center text-success"><FaCheckCircle /> Filterable Portfolio</td>
                </tr>
                <tr>
                  <td className="fw-medium">Search Engine Optimization (SEO)</td>
                  <td className="text-center text-secondary">Meta tags foundation</td>
                  <td className="text-center text-secondary">On-page SEO & Sitemap</td>
                  <td className="text-center text-primary fw-semibold">Advanced SEO & Structured Data</td>
                </tr>
                <tr>
                  <td className="fw-medium">Included Revisions</td>
                  <td className="text-center text-secondary">Up to 2 rounds</td>
                  <td className="text-center text-secondary">Up to 3 rounds</td>
                  <td className="text-center text-primary fw-semibold">Up to 4 rounds</td>
                </tr>
                <tr>
                  <td className="fw-medium">Post-Launch Support Window</td>
                  <td className="text-center text-secondary">7 Days check-in</td>
                  <td className="text-center text-secondary">14 Days support</td>
                  <td className="text-center text-primary fw-semibold">30 Days support</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing FAQs */}
          <div className="ry-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FaQuestionCircle className="text-primary" size={24} />
              <h3 className="fw-bold mb-0">Pricing & Commercial Policies</h3>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100 bg-surface border">
                  <h6 className="fw-bold mb-2">How are domain and Google Cloud hosting handled?</h6>
                  <p className="text-muted small mb-0">
                    We manage the entire purchasing and server configuration process on your behalf. RY WebSphere registers your custom domain (.com, .in, etc.) and provisions fast Google Cloud hosting. The exact registrar and cloud fees are billed transparently at actual costs on your setup invoice, saving you time and technical hassle.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100 bg-surface border">
                  <h6 className="fw-bold mb-2">How do milestone payments work?</h6>
                  <p className="text-muted small mb-0">
                    Typically, projects are executed on a structured 50% kickoff advance and 50% upon final staging approval before DNS cutover. Custom software projects may use milestone-based sprints.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100 bg-surface border">
                  <h6 className="fw-bold mb-2">Do you offer unlimited revisions?</h6>
                  <p className="text-muted small mb-0">
                    No agency can sustainably offer infinite revisions without risking quality. We provide clearly defined revision rounds (2 to 4 depending on package) which is more than sufficient to achieve your exact vision.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3 h-100 bg-surface border">
                  <h6 className="fw-bold mb-2">Is payment gateway integration included?</h6>
                  <p className="text-muted small mb-0">
                    Standard packages include enquiry forms and direct WhatsApp triggers. Automated payment gateways (Razorpay, Stripe) or live transactional booking engines are available in the Premium tier or as a scoped add-on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
