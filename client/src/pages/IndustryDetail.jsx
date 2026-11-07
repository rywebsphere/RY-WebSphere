import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaWhatsapp,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaStar,
  FaShieldAlt,
  FaDumbbell,
  FaSpa,
  FaUserMd,
  FaUtensils,
  FaGraduationCap,
  FaBuilding,
  FaTools,
  FaInfoCircle,
} from 'react-icons/fa';

const IndustryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Demo Interactive Form States
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // 1. Gym Demo Data
  const gymData = {
    name: 'PulseFit Athletic & Gym Demo',
    tagline: 'High-Impact Fitness, Strength Training & Functional Movement',
    industry: 'Gym Website Development',
    primaryCta: 'Build My Gym Website',
    facilities: [
      'Hammer Strength Free-Weight Zone',
      'Cardio Deck with Matrix Treadmills & Ergometers',
      'Dedicated CrossFit & Functional Movement Turf',
      'Steam Room, Locker Suites & Protein Shake Bar',
    ],
    memberships: [
      { name: 'Monthly Basic', price: '₹1,499', period: 'month', features: ['Gym Floor Access', 'Locker Room & Shower', 'Cardio Deck access'] },
      { name: 'Quarterly Pro', price: '₹3,999', period: '3 months', popular: true, features: ['All Basic Features', '1 Free Trainer Consultation', 'Steam & Sauna Access'] },
      { name: 'Annual Elite', price: '₹11,999', period: 'year', features: ['Unlimited All-Access', 'Quarterly Body Composition Scan', 'Free Locker Rental', 'Diet Counseling'] },
    ],
    trainers: [
      { name: 'Vikram Singh', role: 'Head Strength Coach', cert: 'CSCS Certified, 8+ Yrs Exp.' },
      { name: 'Ananya Sharma', role: 'HIIT & Mobility Coach', cert: 'ACE Certified Trainer' },
      { name: 'Rahul Mehra', role: 'CrossFit & Conditioning', cert: 'CrossFit Level 2 Coach' },
    ],
    hours: 'Monday – Saturday: 6:00 AM – 10:00 PM | Sunday: 7:00 AM – 1:00 PM',
  };

  // 2. Salon Demo Data
  const salonData = {
    name: 'LuxeGlow Studio & Beauty Bar Demo',
    tagline: 'Hair Styling, Skin Aesthetics, Nail Art & Luxury Spa Care',
    industry: 'Salon Website Development',
    primaryCta: 'Build My Salon Website',
    services: [
      { category: 'Hair', title: 'Precision Haircut & Blowdry', price: '₹799' },
      { category: 'Hair', title: 'Keratin Smoothing Therapy', price: '₹3,499' },
      { category: 'Skin', title: 'Hydra-Radiance Facial', price: '₹1,899' },
      { category: 'Skin', title: 'Organic Fruit Detox Cleanse', price: '₹1,199' },
      { category: 'Spa', title: 'Aromatherapy Full Body Massage', price: '₹2,499' },
      { category: 'Nails', title: 'Gel Extensions & Custom Nail Art', price: '₹1,299' },
    ],
    stylists: [
      { name: 'Pooja Kapoor', role: 'Master Hair Stylist & Colorist' },
      { name: 'Kavita Nair', role: 'Senior Aesthetician & Skin Specialist' },
    ],
    hours: 'Tuesday – Sunday: 10:00 AM – 8:30 PM (Closed Mondays)',
  };

  // 3. Clinic Demo Data
  const clinicData = {
    name: 'AuraCare Specialty Clinic Demo',
    doctor: 'Dr. Alok Verma, MBBS, MD (General Medicine)',
    regNo: 'Medical Council Reg. #684920 (Sample Verification Format)',
    tagline: 'Evidence-Based Healthcare, Chronic Disease Management & Preventative Screenings',
    industry: 'Doctor and Clinic Websites',
    primaryCta: 'Build My Clinic Website',
    specialties: [
      'Comprehensive Adult Health & Diabetes Care',
      'Hypertension & Cardiovascular Risk Management',
      'Routine Health Checkups & Preventative Screenings',
      'Respiratory Disorders & Seasonal Allergy Management',
    ],
    timings: 'Monday to Friday: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM | Saturday: 10:00 AM – 2:00 PM',
  };

  // 4. Restaurant Demo Data
  const restaurantData = {
    name: 'Saffron & Spice Bistro Demo',
    tagline: 'Artisanal Flavors, Contemporary Indian Cuisine & Handcrafted Mocktails',
    industry: 'Restaurant and Cafe Websites',
    primaryCta: 'Build My Restaurant Website',
    menu: [
      { name: 'Paneer Tikka Angara', desc: 'Charcoal-grilled cottage cheese with smoked spices', price: '₹349', veg: true },
      { name: 'Murgh Malai Kebab', desc: 'Tender chicken morsels marinated in cardamom & cream', price: '₹429', veg: false },
      { name: 'Dal Makhani Bukhara', desc: 'Slow-cooked black lentils simmered overnight with butter', price: '₹369', veg: true },
      { name: 'Smoked Butter Chicken', desc: 'Clay oven cooked chicken in velvety tomato makhani', price: '₹469', veg: false },
      { name: 'Wild Mushroom Risotto', desc: 'Arborio rice cooked with truffle essence and parmesan', price: '₹449', veg: true },
      { name: 'Kesar Pista Kulfi Falooda', desc: 'Traditional saffron pistachio kulfi with rose syrup', price: '₹199', veg: true },
    ],
    hours: 'Open 7 Days: 12:00 PM – 11:30 PM',
  };

  // 5. Coaching Demo Data
  const coachingData = {
    name: 'Apex Coaching Academy Demo',
    tagline: 'Empowering Aspirants for IIT-JEE, NEET & Olympiad Success',
    industry: 'Coaching Institute Websites',
    primaryCta: 'Build My Coaching Website',
    courses: [
      { title: 'JEE Advanced 2-Year Program', target: 'Classes 11 & 12', desc: 'Comprehensive Physics, Chemistry & Mathematics syllabus with weekly mock test series.' },
      { title: 'NEET Medical Target Batch', target: 'Class 12 & Droppers', desc: 'Intensive NCERT mastery, Biology diagrams, Chemistry mechanisms, and Physics drills.' },
      { title: 'Foundation Science & Math', target: 'Classes 9 & 10', desc: 'Building fundamental concepts, logical reasoning, and board exam excellence.' },
    ],
    hours: 'Office Timings: Monday – Saturday: 9:00 AM – 7:00 PM',
  };

  // 6. Real Estate Demo Data
  const realEstateData = {
    name: 'UrbanNest Premium Properties Demo',
    tagline: 'Curated Residential Flats, Luxury Villas & Commercial Spaces',
    industry: 'Real Estate Website',
    primaryCta: 'Build My Real Estate Website',
    properties: [
      { title: 'Skyline Grandeur 3BHK', type: 'Apartment', loc: 'Golf Course Extension Road', price: '₹1.45 Cr', area: '1,850 Sq. Ft.', beds: '3 Beds • 3 Baths' },
      { title: 'The Meadow Green Villa', type: 'Luxury Villa', loc: 'Sohna Sector 33', price: '₹2.85 Cr', area: '3,200 Sq. Ft.', beds: '4 Beds • 5 Baths • Private Lawn' },
      { title: 'Apex Corporate Plaza Suite', type: 'Commercial', loc: 'Cyber City Hub', price: '₹85 Lakh', area: '950 Sq. Ft.', beds: 'Grade A Office • Furnished' },
    ],
  };

  // 7. Local Business Demo Data
  const localBusinessData = {
    name: 'QuickFix Electrical & AC Services Demo',
    tagline: 'Licensed Technicians, Fast Response & Upfront Pricing for Homes & Offices',
    industry: 'Local Business Website',
    primaryCta: 'Build My Local Business Website',
    services: [
      { title: 'Air Conditioner Servicing & Gas Refill', price: 'From ₹499', desc: 'Jet pump coil wash, filter clean, pressure checks, and refrigerant top-up.' },
      { title: 'Complete House Wiring & MCB Installation', price: 'Custom Quote', desc: 'Safety electrical wiring, distribution board setup, and surge protection.' },
      { title: 'Inverter & UPS Installation', price: 'From ₹699', desc: 'Battery wiring, overload testing, and power backup circuit setup.' },
      { title: 'Emergency Short-Circuit Repair', price: 'From ₹399', desc: 'Rapid diagnostic inspection for power trips, spark faults, and burnt sockets.' },
    ],
    areas: ['Gurugram', 'South Delhi', 'Dwarka', 'Noida', 'Faridabad'],
  };

  // Render demo content based on slug
  let currentDemo = null;
  if (slug === 'gym-fitness') currentDemo = gymData;
  else if (slug === 'salon-beauty') currentDemo = salonData;
  else if (slug === 'doctor-clinic') currentDemo = clinicData;
  else if (slug === 'restaurant-cafe') currentDemo = restaurantData;
  else if (slug === 'coaching-education') currentDemo = coachingData;
  else if (slug === 'real-estate') currentDemo = realEstateData;
  else if (slug === 'local-business') currentDemo = localBusinessData;

  if (!currentDemo) {
    return (
      <div className="container py-5 text-center my-5">
        <h2 className="fw-bold mb-3">Industry Demo Not Found</h2>
        <p className="text-muted mb-4">The requested industry preview "{slug}" does not exist.</p>
        <Link to="/industries" className="btn btn-ry-primary">
          Back to Industries Directory
        </Link>
      </div>
    );
  }

  const navigateToBooking = () => {
    navigate('/contact', {
      state: {
        preselectedService: currentDemo.industry,
        preselectedCategory: currentDemo.name.replace(' Demo', ''),
      },
    });
  };

  return (
    <div className="position-relative">
      {/* Sticky Demo Top Warning / Quick CTA (Theme-Adaptive) */}
      <div
        className="sticky-top py-2.5 px-3 shadow-sm ry-demo-top-bar"
        style={{
          zIndex: 1015,
        }}
      >
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="ry-badge-demo px-2 py-0.5 rounded">SAMPLE DEMO PROJECT</span>
            <span className="small d-none d-sm-inline opacity-75">
              Interactive Prototype by <strong>RY WebSphere</strong>
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={navigateToBooking}
              className="btn btn-ry-primary btn-sm px-3 py-1.5"
              style={{ fontSize: '0.85rem' }}
            >
              <span>{currentDemo.primaryCta}</span>
              <FaArrowRight size={11} />
            </button>
            <Link to="/industries" className="btn btn-ry-secondary btn-sm px-2.5 py-1.5" style={{ fontSize: '0.85rem' }}>
              All Demos
            </Link>
          </div>
        </div>
      </div>

      {/* DEMO CONTAINER */}
      <div className="py-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Demo Hero Banner */}
          <div
            className="p-4 p-md-5 rounded-4 ry-card mb-5 text-center position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <span className="ry-badge mb-3">Live Interactive Sample</span>
            <h1 className="display-5 fw-bold mb-2">{currentDemo.name}</h1>
            <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: 700 }}>
              {currentDemo.tagline}
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                onClick={navigateToBooking}
                className="btn btn-ry-primary px-4 py-2.5"
              >
                <span>{currentDemo.primaryCta} (Starting ₹2,999)</span>
                <FaArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Feedback Alert for demo form submission */}
          {formSubmitted && (
            <div className="alert alert-success py-3 px-4 rounded-3 d-flex align-items-center gap-2 mb-4">
              <FaCheckCircle size={18} />
              <span>
                <strong>Demo Action Triggered!</strong> In a live deployed client website, this action instantly dispatches an SMS / WhatsApp alert and saves the customer lead to the database.
              </span>
            </div>
          )}

          {/* DYNAMIC CONTENT SPECIFIC TO INDUSTRY */}

          {/* 1. GYM SPECIFIC */}
          {slug === 'gym-fitness' && (
            <div className="d-flex flex-column gap-5">
              {/* Facilities */}
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Fitness Facilities & Training Zones</h3>
                <div className="row g-3">
                  {gymData.facilities.map((fac, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 rounded-3 d-flex align-items-center gap-2.5 bg-surface border">
                        <FaCheckCircle className="text-primary flex-shrink-0" />
                        <span className="fw-medium">{fac}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memberships */}
              <div>
                <h3 className="fw-bold mb-4 text-center">Membership Tiers</h3>
                <div className="row g-4">
                  {gymData.memberships.map((m, idx) => (
                    <div key={idx} className="col-lg-4">
                      <div className={`ry-card p-4 h-100 d-flex flex-column justify-content-between ${m.popular ? 'border-primary' : ''}`}>
                        <div>
                          <h5 className="fw-bold mb-1">{m.name}</h5>
                          <div className="display-6 fw-bold text-primary mb-3">
                            {m.price} <span className="small text-muted fs-6">/{m.period}</span>
                          </div>
                          <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-4">
                            {m.features.map((f, i) => (
                              <li key={i} className="d-flex align-items-center gap-2">
                                <FaCheckCircle className="text-success" size={12} />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={handleDemoSubmit}
                          className={`btn w-100 ${m.popular ? 'btn-ry-primary' : 'btn-ry-secondary'}`}
                        >
                          Book Trial Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trainers */}
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Certified Coaching Staff</h3>
                <div className="row g-4">
                  {gymData.trainers.map((t, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="p-3 rounded-3 text-center bg-surface border">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                          <FaDumbbell size={24} />
                        </div>
                        <h6 className="fw-bold mb-1">{t.name}</h6>
                        <div className="small text-primary mb-1">{t.role}</div>
                        <div className="small text-muted">{t.cert}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. SALON SPECIFIC */}
          {slug === 'salon-beauty' && (
            <div className="d-flex flex-column gap-5">
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Salon Service Catalog & Transparent Rates</h3>
                <div className="row g-3">
                  {salonData.services.map((s, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 rounded-3 d-flex justify-content-between align-items-center bg-surface border">
                        <div>
                          <span className="badge bg-secondary text-muted mb-1" style={{ fontSize: '0.65rem' }}>{s.category}</span>
                          <div className="fw-semibold">{s.title}</div>
                        </div>
                        <div className="fw-bold text-primary">{s.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment Request Form */}
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-2">Request an Appointment</h3>
                <p className="text-muted small mb-4">Fill out your preferred slot and our front desk will confirm via WhatsApp.</p>
                <form onSubmit={handleDemoSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Your Name</label>
                    <input type="text" className="form-control-ry" placeholder="e.g. Radhika Sharma" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Phone / WhatsApp</label>
                    <input type="tel" className="form-control-ry" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Select Service</label>
                    <select className="form-select-ry">
                      <option>Precision Haircut & Blowdry</option>
                      <option>Hydra-Radiance Facial</option>
                      <option>Keratin Smoothing Therapy</option>
                      <option>Spa Body Massage</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Preferred Date</label>
                    <input type="date" className="form-control-ry" required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-ry-primary py-2.5 px-4">
                      Submit Appointment Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 3. DOCTOR & CLINIC SPECIFIC */}
          {slug === 'doctor-clinic' && (
            <div className="d-flex flex-column gap-5">
              {/* Doctor Credentials Card */}
              <div className="ry-card p-4 p-md-5">
                <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 84, height: 84 }}>
                    <FaUserMd size={38} />
                  </div>
                  <div>
                    <span className="badge bg-success bg-opacity-20 text-success mb-2 px-2.5 py-1">
                      Verified Practitioner Demo
                    </span>
                    <h3 className="fw-bold mb-1">{clinicData.doctor}</h3>
                    <div className="small text-muted mb-2">{clinicData.regNo}</div>
                    <p className="text-secondary small mb-0">
                      Practicing evidence-based medicine with transparent consulting timings and strictly private clinical consultations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="ry-card p-4 p-md-5">
                <h4 className="fw-bold mb-3">Clinical Specialties & Treatment Areas</h4>
                <div className="row g-3">
                  {clinicData.specialties.map((spec, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 rounded-3 d-flex align-items-center gap-2.5 bg-surface border">
                        <FaCheckCircle className="text-info flex-shrink-0" />
                        <span className="small fw-medium">{spec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Booking Form with Privacy Disclaimer */}
              <div className="ry-card p-4 p-md-5">
                <h4 className="fw-bold mb-2">Request OPD Consultation Slot</h4>
                <div className="alert alert-warning py-2.5 px-3 rounded-3 small mb-4">
                  <FaInfoCircle className="me-2" />
                  <strong>Important Notice:</strong> This form collects preliminary visit preferences only. It is not an automated medical diagnostic service. In case of an emergency, please visit the nearest hospital emergency room.
                </div>

                <form onSubmit={handleDemoSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Patient Name</label>
                    <input type="text" className="form-control-ry" placeholder="Patient Full Name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Contact Number</label>
                    <input type="tel" className="form-control-ry" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Preferred Consultation Date</label>
                    <input type="date" className="form-control-ry" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Preferred OPD Shift</label>
                    <select className="form-select-ry">
                      <option>Morning (10:00 AM – 2:00 PM)</option>
                      <option>Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-ry-primary py-2.5 px-4">
                      Submit OPD Slot Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 4. RESTAURANT & CAFE SPECIFIC */}
          {slug === 'restaurant-cafe' && (
            <div className="d-flex flex-column gap-5">
              <div className="ry-card p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h3 className="fw-bold mb-0">Chef's Signature Menu</h3>
                  <div className="d-flex gap-2">
                    <span className="badge bg-success bg-opacity-20 text-success px-2 py-1 small">● Vegetarian</span>
                    <span className="badge bg-danger bg-opacity-20 text-danger px-2 py-1 small">● Non-Vegetarian</span>
                  </div>
                </div>

                <div className="row g-3">
                  {restaurantData.menu.map((dish, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between bg-surface border">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge ${dish.veg ? 'bg-success' : 'bg-danger'}`} style={{ width: 8, height: 8, padding: 0, borderRadius: '50%' }} />
                            <span className="fw-bold">{dish.name}</span>
                          </div>
                          <span className="fw-bold text-primary">{dish.price}</span>
                        </div>
                        <div className="text-muted small">{dish.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Booking */}
              <div className="ry-card p-4 p-md-5">
                <h4 className="fw-bold mb-2">Reserve a Dining Table</h4>
                <p className="text-muted small mb-4">Book your table ahead of time for family dinners or celebrations.</p>
                <form onSubmit={handleDemoSubmit} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small">Your Name</label>
                    <input type="text" className="form-control-ry" placeholder="Name" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Mobile Phone</label>
                    <input type="tel" className="form-control-ry" placeholder="Phone" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Number of Guests</label>
                    <select className="form-select-ry">
                      <option>2 Guests</option>
                      <option>3–4 Guests</option>
                      <option>5–8 Guests</option>
                      <option>Party (9+ Guests)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Date & Time</label>
                    <input type="datetime-local" className="form-control-ry" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Seating Preference</label>
                    <select className="form-select-ry">
                      <option>Main Dining AC Hall</option>
                      <option>Terrace Rooftop Garden</option>
                      <option>Private Family Cabana</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-ry-primary py-2.5 px-4">
                      Confirm Table Reservation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 5. COACHING & EDUCATION SPECIFIC */}
          {slug === 'coaching-education' && (
            <div className="d-flex flex-column gap-5">
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Offered Coaching Programs</h3>
                <div className="row g-4">
                  {coachingData.courses.map((c, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="p-4 rounded-3 h-100 d-flex flex-column justify-content-between bg-surface border">
                        <div>
                          <span className="badge bg-primary bg-opacity-20 text-primary mb-2">{c.target}</span>
                          <h5 className="fw-bold mb-2">{c.title}</h5>
                          <p className="text-muted small mb-3">{c.desc}</p>
                        </div>
                        <button type="button" onClick={handleDemoSubmit} className="btn btn-ry-secondary btn-sm w-100">
                          Download Syllabus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission Lead Form */}
              <div className="ry-card p-4 p-md-5">
                <h4 className="fw-bold mb-2">Admission & Scholarship Test Enquiry</h4>
                <p className="text-muted small mb-4">Register for upcoming batch counseling and scholarship assessments.</p>
                <form onSubmit={handleDemoSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Student Name</label>
                    <input type="text" className="form-control-ry" placeholder="Student Name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Parent Phone / Mobile</label>
                    <input type="tel" className="form-control-ry" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Target Examination</label>
                    <select className="form-select-ry">
                      <option>IIT-JEE (Main + Advanced)</option>
                      <option>NEET (UG Medical)</option>
                      <option>Class 9-10 Foundation Olympiad</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Current Academic Class</label>
                    <select className="form-select-ry">
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>12th Pass / Dropper</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-ry-primary py-2.5 px-4">
                      Request Counseling Callback
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 6. REAL ESTATE SPECIFIC */}
          {slug === 'real-estate' && (
            <div className="d-flex flex-column gap-5">
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Featured Property Listings</h3>
                <div className="row g-4">
                  {realEstateData.properties.map((p, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="p-4 rounded-3 h-100 d-flex flex-column justify-content-between bg-surface border">
                        <div>
                          <span className="badge bg-primary bg-opacity-20 text-primary mb-2">{p.type}</span>
                          <h5 className="fw-bold mb-1">{p.title}</h5>
                          <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                            <FaMapMarkerAlt className="text-danger" /> {p.loc}
                          </div>
                          <div className="display-6 fw-bold text-success mb-2" style={{ fontSize: '1.5rem' }}>
                            {p.price}
                          </div>
                          <div className="small text-secondary mb-3">{p.beds} • {p.area}</div>
                        </div>
                        <button type="button" onClick={handleDemoSubmit} className="btn btn-ry-primary btn-sm w-100">
                          Schedule Site Visit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. LOCAL BUSINESS SPECIFIC */}
          {slug === 'local-business' && (
            <div className="d-flex flex-column gap-5">
              <div className="ry-card p-4 p-md-5">
                <h3 className="fw-bold mb-4">Trade Services & Transparent Starting Rates</h3>
                <div className="row g-3">
                  {localBusinessData.services.map((s, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between bg-surface border">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold mb-0">{s.title}</h6>
                          <span className="badge bg-primary text-white">{s.price}</span>
                        </div>
                        <div className="text-muted small">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="ry-card p-4 p-md-5">
                <h4 className="fw-bold mb-3">Service Areas Covered</h4>
                <div className="d-flex flex-wrap gap-2">
                  {localBusinessData.areas.map((a, idx) => (
                    <span key={idx} className="badge bg-surface border px-3 py-2">
                      📍 {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FINAL CTA BANNER FOR ALL DEMOS */}
          <div
            className="p-5 rounded-4 ry-card mt-5 text-center position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
            }}
          >
            <h3 className="fw-bold mb-2">Want a High-Converting Website Like This?</h3>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 640 }}>
              RY WebSphere builds tailored {currentDemo.industry} platforms starting at ₹2,999 (Starter) or ₹5,999 (Full Business Multi-page). You get full code ownership, mobile responsiveness, and post-launch support.
            </p>
            <button
              type="button"
              onClick={navigateToBooking}
              className="btn btn-ry-primary btn-lg px-4 py-2.5"
            >
              <span>{currentDemo.primaryCta} Now</span>
              <FaArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDetail;
