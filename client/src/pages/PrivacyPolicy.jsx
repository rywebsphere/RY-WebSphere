import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { useSettings } from '../context/SettingsContext';

const PrivacyPolicy = () => {
  const { settings } = useSettings();
  const brandName = settings.brandName || 'RY WebSphere';
  const ownerName = settings.ownerName || 'Ranjan Yadav';

  return (
    <div>
      <PageHeader
        badge="Legal & Transparency"
        title="Privacy Policy"
        subtitle={`Information handling and privacy commitments for ${brandName}, directed by ${ownerName}.`}
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="ry-card p-4 p-md-5">
            <h4 className="fw-bold mb-3">1. Information We Collect</h4>
            <p className="text-secondary small mb-4">
              When you submit a project enquiry or consultation request on {brandName}, we collect the personal and business details you explicitly provide: your full name, business name, category, email address, phone number, and project requirements. We collect this data solely to respond to your inquiry and deliver web development services.
            </p>

            <h4 className="fw-bold mb-3">2. How We Use Your Information</h4>
            <p className="text-secondary small mb-4">
              Your information is used exclusively to:
              <br />• Communicate with you regarding project specifications and quotes.
              <br />• Deliver the agreed web design and engineering services.
              <br />• Provide ongoing technical support and maintenance as agreed.
              <br />• Maintain internal project administrative records.
            </p>

            <h4 className="fw-bold mb-3">3. We Do Not Sell or Rent Your Data</h4>
            <p className="text-secondary small mb-4">
              {brandName} will never sell, rent, lease, or trade your contact details or project information to any third-party marketing companies, advertisers, or data brokers.
            </p>

            <h4 className="fw-bold mb-3">4. Security of Information</h4>
            <p className="text-secondary small mb-4">
              We employ industry-standard security protocols, including server-side input sanitization, rate limiting, and encrypted transmissions (HTTPS/SSL), to protect all submitted data from unauthorized access or exposure.
            </p>

            <h4 className="fw-bold mb-3">5. Third-Party Services</h4>
            <p className="text-secondary small mb-4">
              If your website project requires third-party hosting, domain registrars, or payment gateway accounts, those services maintain their independent privacy policies. We guide you to create and maintain accounts directly in your own name to ensure complete data custody.
            </p>

            <h4 className="fw-bold mb-3">6. Contacting Us About Privacy</h4>
            <p className="text-secondary small mb-0">
              If you have any questions about this Privacy Policy or wish to request the deletion of your enquiry data, please contact {ownerName} directly at {settings.businessEmail || 'rywebsphere@gmail.com'}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
