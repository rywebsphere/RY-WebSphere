import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaDumbbell,
  FaSpa,
  FaUserMd,
  FaUtensils,
  FaGraduationCap,
  FaBuilding,
  FaTools,
  FaCheckCircle,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';

const industryList = [
  {
    title: 'Gym & Fitness Centers',
    slug: 'gym-fitness',
    icon: FaDumbbell,
    desc: 'High-energy fitness club demo with membership cards, trainer bios, batch timetables, and trial booking.',
    features: ['Membership tier cards', 'Trainer credentials roster', 'Class timetables', 'WhatsApp trial session booking'],
    ctaText: 'View Gym Demo',
  },
  {
    title: 'Salon & Beauty Parlors',
    slug: 'salon-beauty',
    icon: FaSpa,
    desc: 'Luxury beauty parlor & spa demo featuring categorized price menus, stylist lookbooks, and appointment requests.',
    features: ['Service price catalog', 'Master stylist profiles', 'Before/after lookbook', 'Appointment request form'],
    ctaText: 'View Salon Demo',
  },
  {
    title: 'Doctors & Medical Clinics',
    slug: 'doctor-clinic',
    icon: FaUserMd,
    desc: 'Medical-grade clinic demo highlighting verified doctor credentials, OPD timings, specialties, and appointment requests.',
    features: ['Verified doctor credentials', 'OPD consultation hours', 'Specialty treatments', 'Ethical appointment request'],
    ctaText: 'View Clinic Demo',
  },
  {
    title: 'Restaurants & Gourmet Cafes',
    slug: 'restaurant-cafe',
    icon: FaUtensils,
    desc: 'Appetizing culinary demo with categorized menus, dietary indicators, table reservations, and delivery links.',
    features: ['Interactive food & drinks menu', 'Table reservation booking', 'Dietary filter tags (Veg/Non-Veg)', 'Location map & hours'],
    ctaText: 'View Restaurant Demo',
  },
  {
    title: 'Coaching & Education Academies',
    slug: 'coaching-education',
    icon: FaGraduationCap,
    desc: 'Academic institute demo with curriculum breakdowns, faculty expertise, batch calendars, and admission leads.',
    features: ['Course directory & syllabus', 'Faculty introductions', 'Batch timing calendar', 'Admission enquiry form'],
    ctaText: 'View Coaching Demo',
  },
  {
    title: 'Real Estate & Properties',
    slug: 'real-estate',
    icon: FaBuilding,
    desc: 'Property listing showcase demo with filterable listings, photo galleries, agent contacts, and visit bookings.',
    features: ['Filterable property catalog', 'Property amenity badges', 'Broker contact shortcuts', 'Site visit booking form'],
    ctaText: 'View Real Estate Demo',
  },
  {
    title: 'Local Businesses & Contractors',
    slug: 'local-business',
    icon: FaTools,
    desc: 'Purpose-built for electricians, plumbers, interior designers, repair technicians, and local consultants.',
    features: ['Emergency service call button', 'Verified service areas', 'Service quotation form', 'Customer reassurance points'],
    ctaText: 'View Local Business Demo',
  },
];

const Industries = () => {
  return (
    <div>
      <PageHeader
        badge="Niche-Specific Solutions"
        title="Industry-Specific Website Demos"
        subtitle="Explore interactive sample websites tailored for different commercial sectors. Each demo shows the layout, workflows, and enquiry funnels customized for that specific business model."
        breadcrumbs={[{ label: 'Industries' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="alert alert-info py-3 px-4 rounded-3 d-flex align-items-center gap-3 mb-5" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.25)', color: 'var(--text-primary)' }}>
            <span className="badge bg-primary px-2.5 py-1 text-white">Transparency Notice</span>
            <span className="small">
              All industry previews linked below are <strong>interactive sample demo websites</strong> created by RY WebSphere to demonstrate layout and functionality. They do not claim to represent third-party paying clients.
            </span>
          </div>

          <div className="row g-4">
            {industryList.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.slug} className="col-lg-4 col-md-6">
                  <div className="ry-card p-4 h-100 d-flex flex-column justify-content-between ry-card-interactive">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div
                          className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary"
                          style={{ border: '1px solid var(--border-color)' }}
                        >
                          <Icon size={24} />
                        </div>
                        <span className="ry-badge-demo px-2 py-0.5 rounded-2">
                          Interactive Demo
                        </span>
                      </div>

                      <h4 className="fw-bold mb-2 h5">{item.title}</h4>
                      <p className="text-muted small mb-3">{item.desc}</p>

                      <ul className="list-unstyled d-flex flex-column gap-1.5 small text-secondary mb-4">
                        {item.features.map((feat, i) => (
                          <li key={i} className="d-flex align-items-center gap-2">
                            <FaCheckCircle className="text-success" size={12} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={`/industries/${item.slug}`}
                      className="btn btn-ry-primary btn-sm w-100 justify-content-center"
                    >
                      <span>{item.ctaText}</span>
                      <FaArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industries;
