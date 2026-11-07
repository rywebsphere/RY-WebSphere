import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaArrowRight,
  FaCode,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaMobileAlt,
  FaRocket,
  FaRegLightbulb,
} from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';

const About = () => {
  const technicalSkills = [
    { name: 'React.js', category: 'Frontend', desc: 'Component architecture, Hooks, Context API, state management' },
    { name: 'JavaScript (ES6+)', category: 'Core', desc: 'Asynchronous flows, DOM manipulation, functional patterns' },
    { name: 'Bootstrap 5', category: 'CSS System', desc: 'Mobile-first grid system, responsive utilities, customized styling' },
    { name: 'Node.js & Express.js', category: 'Backend', desc: 'RESTful API routing, middleware, controllers, error handling' },
    { name: 'MongoDB & Mongoose', category: 'Database', desc: 'Document modeling, validation schemas, indexing pipelines' },
    { name: 'Framer Motion', category: 'Animation', desc: 'Subtle micro-interactions, layout transitions, accessible motion' },
    { name: 'JWT & Security', category: 'Auth & Safety', desc: 'Role-based access tokens, bcrypt hashing, rate limit protection' },
    { name: 'Git & Deployment', category: 'DevOps', desc: 'Version control, Vercel frontend, Render & Atlas cloud hosting' },
  ];

  const standards = [
    {
      title: 'Mobile-First by Default',
      desc: 'Over 65% of local traffic browses on mobile phones. Every layout is architected from handheld screens upwards.',
    },
    {
      title: 'Clean, Semantic Code',
      desc: 'No bloated code generators or unmaintainable builders. Pure React components and clean CSS variables you can expand anytime.',
    },
    {
      title: 'Real Business Utility',
      desc: 'Websites must do more than look pretty; they must drive calls, form inquiries, and WhatsApp discussions with prospective clients.',
    },
    {
      title: 'Honest Communication',
      desc: 'No fake claims, no fabricated reviews, and no artificial metrics. We give straightforward advice on what your business actually needs.',
    },
  ];

  return (
    <div>
      <PageHeader
        badge="About RY WebSphere"
        title="Engineering Modern Digital Solutions"
        subtitle="Learn about the brand philosophy, technical background, and quality standards behind RY WebSphere and developer Ranjan Yadav."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <section className="ry-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Main Story / Ranjan Yadav's Introduction */}
          <div className="row g-5 align-items-center mb-5">
            <div className="col-lg-6">
              <span className="ry-badge mb-3">Founder & Full-Stack Developer</span>
              <h2 className="display-6 fw-bold mb-4">
                "Your Vision. Our Web. <br />
                <span className="ry-gradient-text">Unlimited Possibilities."</span>
              </h2>

              <div className="p-4 rounded-4 ry-card mb-4" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-blue)' }}>
                <p className="lead text-secondary mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  "I'm Ranjan Yadav, the developer behind RY WebSphere. I focus on building modern, responsive websites and web applications for businesses, professionals, and startups.
                </p>
                <p className="text-secondary mb-3" style={{ lineHeight: '1.7' }}>
                  My goal is to help businesses establish their online presence through clean design, useful functionality, and maintainable web solutions.
                </p>
                <p className="text-secondary mb-3" style={{ lineHeight: '1.7' }}>
                  I work with React.js, JavaScript, Bootstrap, Node.js, Express.js, and MongoDB to create solutions based on each client's requirements.
                </p>
                <p className="text-secondary mb-0 fw-medium" style={{ lineHeight: '1.7' }}>
                  At RY WebSphere, I believe a good website should look professional, work smoothly across devices, and make it easy for customers to connect with a business."
                </p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <Link to="/contact" className="btn btn-ry-primary px-4 py-2.5">
                  <span>Start a Conversation</span>
                  <FaArrowRight size={13} />
                </Link>
                <Link to="/portfolio" className="btn btn-ry-secondary px-4 py-2.5">
                  <span>Explore Projects</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="ry-card p-4 p-md-5 rounded-4 position-relative"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-center flex-shrink-0"
                    style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaLaptopCode size={30} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">Ranjan Yadav</h4>
                    <span className="small text-muted">Full-Stack Web Architect & Agency Director</span>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">The RY WebSphere Philosophy</h5>
                <p className="text-secondary small mb-3">
                  Too many local businesses end up with abandoned templates, broken mobile layouts, or overpriced agencies that fail to deliver reliable post-launch support.
                </p>
                <p className="text-secondary small mb-4">
                  RY WebSphere was established to provide a refreshingly direct, transparent alternative: production-grade MERN stack code, clean Bootstrap design systems, predictable package pricing, and genuine dedication to every client's online success.
                </p>

                <div className="p-3 rounded-3 bg-surface border small">
                  <div className="fw-bold text-primary mb-1">Authenticity & Integrity</div>
                  <div className="text-muted">
                    We do not use fabricated statistics, fake review badges, or inflated claims. Our work and our code speak for themselves.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div className="ry-card p-4 p-md-5 mb-5">
            <div className="text-center mb-5">
              <span className="ry-badge mb-2">Technical Proficiency</span>
              <h3 className="fw-bold">Technology Stack & Engineering Tools</h3>
              <p className="text-muted small mx-auto" style={{ maxWidth: 600 }}>
                We choose dependable, battle-tested technologies that ensure your website stays fast, secure, and easy to maintain.
              </p>
            </div>

            <div className="row g-4">
              {technicalSkills.map((skill, idx) => (
                <div key={idx} className="col-lg-3 col-md-6">
                  <div
                    className="p-3.5 rounded-3 h-100 d-flex flex-column justify-content-between bg-surface border"
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fw-bold mb-0">{skill.name}</h6>
                        <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.68rem' }}>
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-muted small mb-0">{skill.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Standards */}
          <div className="mb-5">
            <div className="text-center mb-5">
              <span className="ry-badge mb-2">Our Commitments</span>
              <h3 className="fw-bold">Development & Delivery Standards</h3>
              <p className="text-muted small mx-auto" style={{ maxWidth: 600 }}>
                Every website built by RY WebSphere adheres to our non-negotiable quality principles.
              </p>
            </div>

            <div className="row g-4">
              {standards.map((std, i) => (
                <div key={i} className="col-md-6">
                  <div className="ry-card p-4 h-100 ry-card-interactive">
                    <div className="d-flex align-items-start gap-3">
                      <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h5 className="fw-bold mb-2">{std.title}</h5>
                        <p className="text-muted small mb-0">{std.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div
            className="p-5 rounded-4 ry-card text-center position-relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 className="fw-bold mb-2">Let's Discuss Your Web Strategy</h3>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 600 }}>
              Whether you need your first website, a modern redesign, or a tailored web application, we are ready to assist.
            </p>
            <Link to="/contact" className="btn btn-ry-primary px-4 py-2.5">
              <span>Book a Free Project Consultation</span>
              <FaArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
