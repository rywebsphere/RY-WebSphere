import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { useSettings } from '../context/SettingsContext';

const Terms = () => {
  const { settings } = useSettings();
  const brandName = settings.brandName || 'RY WebSphere';
  const ownerName = settings.ownerName || 'Ranjan Yadav';

  return (
    <div>
      <PageHeader
        badge="Legal & Commercial Terms"
        title="Terms and Conditions"
        subtitle={`Standard commercial terms and project engagement policies for ${brandName}.`}
        breadcrumbs={[{ label: 'Terms and Conditions' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="ry-card p-4 p-md-5">
            <h4 className="fw-bold mb-3">1. Scope of Work and Quotes</h4>
            <p className="text-secondary small mb-4">
              All website development services provided by {brandName} are governed by an agreed written project proposal specifying exact deliverables, page counts, technical features, and delivery timelines. Any features requested outside the initial agreed scope will be evaluated and quoted separately as an add-on.
            </p>

            <h4 className="fw-bold mb-3">2. Revision Limits & Staging Approvals</h4>
            <p className="text-secondary small mb-4">
              To ensure projects progress efficiently, each package includes a defined number of revision rounds (typically 2 to 4 rounds) during the staging review phase. Revisions refer to reasonable modifications of typography, layout alignment, colors, and content within the agreed structure. Major architectural shifts after sign-off will require a scoped change order.
            </p>

            <h4 className="fw-bold mb-3">3. Code & Asset Ownership</h4>
            <p className="text-secondary small mb-4">
              Upon final settlement and launch, full ownership and rights to the bespoke website codebase, frontend templates, and content belong entirely to the client. {brandName} retains the right to display the completed work as part of our agency portfolio unless a Non-Disclosure Agreement (NDA) specifies otherwise.
            </p>

            <h4 className="fw-bold mb-3">4. Client Responsibilities</h4>
            <p className="text-secondary small mb-4">
              Clients are responsible for providing high-resolution logos, brand images, specific copy text, and required credentials for domain and hosting setups. Delays in client feedback or asset delivery will correspondingly adjust project delivery dates.
            </p>

            <h4 className="fw-bold mb-3">5. Sample Demo Projects Disclaimer</h4>
            <p className="text-secondary small mb-4">
              All interactive industry demos showcased on this website (such as Gym, Salon, Clinic, Restaurant, and Coaching demos) are sample prototypes built by {brandName} to illustrate design and UX capabilities. They do not constitute endorsements or commercial contracts with third parties.
            </p>

            <h4 className="fw-bold mb-3">6. Governing Law & Contact</h4>
            <p className="text-secondary small mb-0">
              For any contractual or commercial inquiries, please contact {ownerName} directly at {settings.businessEmail || 'rywebsphere@gmail.com'}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
