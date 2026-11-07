import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import Service from '../models/Service.js';
import PricingPackage from '../models/PricingPackage.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ry_websphere';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB at: ${mongoUri}`);

    // 1. Seed or update Administrator
    const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'yadavranjan1626@gmail.com').toLowerCase();
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'RYWebSphere@2026!';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'Ranjan Yadav';

    // Remove legacy generic admin if present
    await Admin.deleteMany({ email: 'admin@rywebsphere.com' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'superadmin',
        title: 'Founder & Lead Developer',
        isActive: true,
        status: 'approved',
      });
      console.log(`[Seed] Admin created: ${adminEmail}`);
    } else {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.role = 'superadmin';
      existingAdmin.name = adminName;
      existingAdmin.title = 'Founder & Lead Developer';
      existingAdmin.isActive = true;
      existingAdmin.status = 'approved';
      await existingAdmin.save();
      console.log(`[Seed] Admin updated with active credentials: ${adminEmail}`);
    }

    // Seed Demo Employee Account for staff testing
    const employeeEmail = 'employee@rywebsphere.com';
    const employeePassword = 'Employee@2026!';
    const existingEmp = await Admin.findOne({ email: employeeEmail });
    const empHash = await bcrypt.hash(employeePassword, salt);
    if (!existingEmp) {
      await Admin.create({
        name: 'Rahul Sharma (Staff)',
        email: employeeEmail,
        passwordHash: empHash,
        role: 'employee',
        title: 'Client Inquiries & Support Specialist',
        phone: '+91 98765 00000',
        isActive: true,
        status: 'approved',
      });
      console.log(`[Seed] Demo Employee created: ${employeeEmail}`);
    } else {
      existingEmp.passwordHash = empHash;
      existingEmp.role = 'employee';
      existingEmp.isActive = true;
      existingEmp.status = 'approved';
      await existingEmp.save();
      console.log(`[Seed] Demo Employee updated: ${employeeEmail}`);
    }

    // 2. Seed Settings
    await Setting.deleteMany({});
    await Setting.create({
      brandName: 'RY WebSphere',
      ownerName: 'Ranjan Yadav',
      tagline: 'Your Vision. Our Web. Unlimited Possibilities.',
      announcementText: 'Professional Website Packages Starting at ₹2,999',
      announcementEnabled: true,
      businessEmail: process.env.BUSINESS_EMAIL || 'rywebsphere@gmail.com',
      whatsappNumber: process.env.WHATSAPP_NUMBER || 'YOUR_WHATSAPP_NUMBER',
      portfolioUrl: process.env.PORTFOLIO_URL || 'YOUR_PORTFOLIO_URL',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        instagram: '',
      },
      serviceAreas: [
        'India (All States & Cities)',
        'International Remote Clients (US, UK, UAE, Canada, Australia & Worldwide)',
      ],
    });
    console.log('[Seed] Settings initialized.');

    // 3. Seed 15 Services
    await Service.deleteMany({});
    const services = [
      {
        title: 'Business Website Development',
        slug: 'business-website-development',
        order: 1,
        icon: 'FaBriefcase',
        shortDescription: 'Modern, high-converting digital storefronts tailored to established businesses, firms, and local enterprises.',
        fullDescription: 'We build fast, secure, mobile-first business websites designed to showcase your offerings, build immediate trust, and convert inbound visitors into high-intent enquiries and phone calls.',
        features: [
          'Custom brand design aligned with your industry',
          'Responsive layout across mobile, tablet, and desktop',
          'Direct WhatsApp and click-to-call enquiry buttons',
          'Search Engine Optimization (SEO) structural foundations',
          'Fast loading performance with Google PageSpeed optimization',
        ],
        deliverables: [
          'Complete multi-page business website',
          'Working enquiry form connected to email/database',
          'Interactive location map integration',
          'Domain & hosting deployment setup',
        ],
      },
      {
        title: 'Gym Website Development',
        slug: 'gym-website-development',
        order: 2,
        icon: 'FaDumbbell',
        shortDescription: 'Energetic, high-impact fitness websites with membership tiers, trainer showcases, and trial booking forms.',
        fullDescription: 'Designed specifically for fitness centers, martial arts dojos, and personal trainers. Inspire prospects to visit your gym with visual tour galleries, transparent pricing tiers, and easy trial booking.',
        features: [
          'High-energy visuals with facility galleries',
          'Transparent membership package cards with instant inquiry',
          'Trainer profiles highlighting certifications and specialties',
          'Batch schedules and class timing charts',
          'Instant WhatsApp trial pass inquiry',
        ],
        deliverables: [
          'Complete responsive gym website',
          'Membership selection & inquiry workflow',
          'Workout & class timetable module',
          'Google Maps directions embed',
        ],
      },
      {
        title: 'Salon Website Development',
        slug: 'salon-website-development',
        order: 3,
        icon: 'FaSpa',
        shortDescription: 'Elegant, luxury-styled web presence for hair salons, luxury spas, nail studios, and beauty professionals.',
        fullDescription: 'Captivate potential clients with an aesthetically pleasing website showcasing services, clear price menus, stylist portfolios, and friction-free appointment consultation forms.',
        features: [
          'Clean, luxury aesthetic with warm pastel/dark accents',
          'Categorized service menus with transparent pricing',
          'Stylist portfolios & before/after transformations',
          'Mobile appointment enquiry form with WhatsApp link',
          'Customer hygiene & salon policy sections',
        ],
        deliverables: [
          'Custom salon website with service catalog',
          'Appointment request form with instant notifications',
          'Instagram feed or lookbook gallery',
          'Complete contact & opening hours block',
        ],
      },
      {
        title: 'Doctor and Clinic Websites',
        slug: 'doctor-clinic-websites',
        order: 4,
        icon: 'FaUserMd',
        shortDescription: 'Trustworthy, clean medical websites for independent doctors, dentists, diagnostic labs, and healthcare clinics.',
        fullDescription: 'Healthcare websites built with the utmost emphasis on professionalism, verifiable credentials, clinic visiting hours, specialty treatments, and structured appointment enquiry forms.',
        features: [
          'Doctor qualifications, education, and verified credentials',
          'Specialty treatments & conditions handled breakdown',
          'Clinic consulting hours and OPD schedule',
          'Secure appointment request form (non-diagnostic)',
          'Clear patient notices and privacy protection',
        ],
        deliverables: [
          'Medical-grade clean web design',
          'Appointment request workflow with confirmation alert',
          'Clinic location & parking guidelines',
          'FAQ section for patient preparation',
        ],
      },
      {
        title: 'Restaurant and Cafe Websites',
        slug: 'restaurant-cafe-websites',
        order: 5,
        icon: 'FaUtensils',
        shortDescription: 'Appetizing, interactive websites for restaurants, cafes, cloud kitchens, and bakeries with dynamic menus.',
        fullDescription: 'Drive hungry customers to your tables with mouth-watering food galleries, digital categorized menus, table reservation requests, and direct WhatsApp / delivery aggregator links.',
        features: [
          'Interactive categorized food & beverage menu',
          'Table reservation & event booking enquiry form',
          'Food photography gallery with dietary icons (Veg/Non-Veg)',
          'Direct order buttons (WhatsApp, Zomato, Swiggy links)',
          'Operating hours & weekend timing notices',
        ],
        deliverables: [
          'Engaging cafe/restaurant website',
          'Mobile-friendly digital food menu',
          'Table reservation enquiry system',
          'Integrated map and route directions',
        ],
      },
      {
        title: 'Coaching Institute Websites',
        slug: 'coaching-institute-websites',
        order: 6,
        icon: 'FaGraduationCap',
        shortDescription: 'Educational websites for test-prep academies, tutors, language schools, and training institutes.',
        fullDescription: 'Present your curriculum, faculty credentials, batch timings, and admission criteria with authority. Built to capture high-intent student leads and parent inquiries.',
        features: [
          'Comprehensive course directory with syllabus overviews',
          'Batch schedules, fee structure, and duration details',
          'Faculty introductions with subject expertise',
          'Student admission & scholarship inquiry forms',
          'Verified campus details and contact hotline',
        ],
        deliverables: [
          'Educational portal with course pages',
          'Admission lead capture forms',
          'Downloadable syllabus/brochure trigger',
          'Student FAQ section',
        ],
      },
      {
        title: 'E-commerce Websites',
        slug: 'ecommerce-websites',
        order: 7,
        icon: 'FaShoppingCart',
        shortDescription: 'Fast, secure online stores with product catalogs, shopping cart, WhatsApp checkout, or payment gateways.',
        fullDescription: 'Sell physical products, merchandise, or digital goods with a streamlined shopping experience built for quick loading and frictionless mobile purchasing.',
        features: [
          'Modern product grid with search & category filters',
          'Detailed product pages with image galleries and variants',
          'Cart management and checkout workflows',
          'Direct WhatsApp order confirmation option',
          'Payment gateway integration ready (Razorpay/Stripe)',
        ],
        deliverables: [
          'Full-featured e-commerce catalog',
          'Shopping cart & order notification system',
          'Inventory management guidance',
          'SSL security & checkout setup',
        ],
      },
      {
        title: 'Portfolio Websites',
        slug: 'portfolio-websites',
        order: 8,
        icon: 'FaLaptopCode',
        shortDescription: 'Stunning personal portfolios for designers, consultants, architects, photographers, and executives.',
        fullDescription: 'Position yourself as an industry authority with an unforgettable personal website showcasing your case studies, achievements, press features, and direct booking links.',
        features: [
          'Curated case study showcases with deep-dive stories',
          'Interactive skill matrix and technology badges',
          'Downloadable CV/Resume integration',
          'Direct calendar booking or consultation form',
          'Smooth micro-interactions and refined typography',
        ],
        deliverables: [
          'Bespoke personal portfolio website',
          'Interactive project showcase gallery',
          'Contact & collaboration inquiry form',
          'Social & professional link hub',
        ],
      },
      {
        title: 'Landing Page Development',
        slug: 'landing-page-development',
        order: 9,
        icon: 'FaRocket',
        shortDescription: 'Laser-focused, single-page sales funnels engineered for maximum conversion on Google & Meta ad campaigns.',
        fullDescription: 'Stop wasting advertising budget on generic pages. We craft high-speed landing pages with compelling visual hierarchy, persuasive benefit framing, and zero navigation leaks.',
        features: [
          'Clear Above-the-Fold value proposition and primary CTA',
          'Benefit-driven copy layout and objection counters',
          'Lightning-fast load speed (sub-second render target)',
          'Lead capture form with instant validation',
          'Meta Pixel and Google Analytics tag integration ready',
        ],
        deliverables: [
          'One high-converting landing page',
          'Thank You page with tracking triggers',
          'A/B test ready structure',
          'Optimized mobile view',
        ],
      },
      {
        title: 'Website Redesign',
        slug: 'website-redesign',
        order: 10,
        icon: 'FaSyncAlt',
        shortDescription: 'Modernize outdated websites with contemporary design systems, mobile responsiveness, and faster code.',
        fullDescription: 'Transform an aging, slow, or poorly converting website into a sleek, modern asset without losing existing search engine rankings or valuable domain authority.',
        features: [
          'Comprehensive audit of current website shortcomings',
          'Modern UI revamp with contemporary brand aesthetic',
          'Mobile responsiveness and touch navigation overhaul',
          'SEO-preserving 301 redirect map and clean URL structure',
          'Speed optimization and clean code rewrite',
        ],
        deliverables: [
          'Newly designed responsive website',
          'Preserved content and image migration',
          'Speed audit report comparison',
          'Post-launch DNS switchover',
        ],
      },
      {
        title: 'Website Bug Fixes',
        slug: 'website-bug-fixes',
        order: 11,
        icon: 'FaBug',
        shortDescription: 'Rapid troubleshooting and resolution for broken layouts, CSS glitches, form errors, and script crashes.',
        fullDescription: 'Fast, reliable technical intervention when your website is malfunctioning, broken on mobile devices, experiencing script errors, or failing to submit enquiries.',
        features: [
          'Diagnostic inspection and root-cause analysis',
          'CSS alignment and mobile layout repairs',
          'Contact form and email notification debugging',
          'Cross-browser compatibility testing',
          'Clean, documented fixes without breaking existing code',
        ],
        deliverables: [
          'Root-cause resolution and testing confirmation',
          'Code patch delivery or direct deployment',
          'Prevention advisory note',
        ],
      },
      {
        title: 'Website Maintenance',
        slug: 'website-maintenance',
        order: 12,
        icon: 'FaShieldAlt',
        shortDescription: 'Ongoing peace-of-mind website care including security updates, backups, content edits, and monitoring.',
        fullDescription: 'Keep your website secure, fresh, and functioning properly without hiring a full-time in-house developer. Regular checks, dependency updates, and minor content updates.',
        features: [
          'Regular security and dependency patches',
          'Routine off-site database and file backups',
          'Uptime and broken-link monitoring',
          'Content, text, and pricing updates on demand',
          'Priority developer response for urgent technical issues',
        ],
        deliverables: [
          'Monthly maintenance reporting',
          'Allocated support hours for ongoing updates',
          'Emergency disaster recovery rollback capability',
        ],
      },
      {
        title: 'Custom Web Applications',
        slug: 'custom-web-applications',
        order: 13,
        icon: 'FaCogs',
        shortDescription: 'Bespoke MERN-stack software, internal business dashboards, client portals, and workflow automation.',
        fullDescription: 'When off-the-shelf templates cannot satisfy your unique business workflow, we architect custom full-stack web applications with React, Node.js, Express, and MongoDB.',
        features: [
          'Role-based access control (RBAC) and authentication',
          'Interactive dashboards with filtering and reporting',
          'Normalized MongoDB database schemas',
          'RESTful API architecture with validation',
          'Scalable component-driven frontend architecture',
        ],
        deliverables: [
          'Production-ready custom web application',
          'Database schemas and API documentation',
          'Admin control panel',
          'Cloud deployment setup',
        ],
      },
      {
        title: 'Frontend Development',
        slug: 'frontend-development',
        order: 14,
        icon: 'FaCode',
        shortDescription: 'Pixel-perfect, accessible React.js interfaces converted from Figma, Adobe XD, or wireframe designs.',
        fullDescription: 'High-fidelity frontend engineering translating your designs into clean, modular, and responsive React code with Bootstrap 5, Framer Motion, and semantic HTML.',
        features: [
          'Pixel-accurate translation from Figma/design files',
          'Component-driven architecture for high reusability',
          'Smooth, purposeful animations with Framer Motion',
          'Mobile, tablet, and widescreen viewport responsiveness',
          'Accessible markup meeting WCAG standards',
        ],
        deliverables: [
          'Clean React component codebase',
          'Optimized assets and modular CSS',
          'Story/component documentation',
        ],
      },
      {
        title: 'Backend API Development',
        slug: 'backend-api-development',
        order: 15,
        icon: 'FaServer',
        shortDescription: 'Robust, secure Node.js & Express REST APIs with database modeling, JWT auth, and third-party integrations.',
        fullDescription: 'Reliable backend services designed for performance, security, and scalability. Clean route structures, Mongoose ORM models, validation, rate limiting, and secure authorization.',
        features: [
          'RESTful endpoint architecture with standardized JSON responses',
          'Secure JWT authentication and password hashing with bcrypt',
          'Robust input sanitization and rate limiting security',
          'MongoDB aggregation pipelines and indexing',
          'Third-party API webhook and payment integrations',
        ],
        deliverables: [
          'Complete Express.js server codebase',
          'API documentation / Postman collection',
          'Automated database seeding scripts',
        ],
      },
    ];

    await Service.insertMany(services);
    console.log(`[Seed] Seeded ${services.length} services.`);

    // 4. Seed Pricing Packages
    await PricingPackage.deleteMany({});
    const pricingPackages = [
      {
        name: 'Starter Website',
        slug: 'starter-website',
        price: 2999,
        priceUSD: 49,
        currency: '₹',
        period: 'starting price (single page)',
        description: 'Ideal for local businesses, freelancers, and professionals looking for an affordable, high-quality digital business card.',
        features: [
          'Single-page modern business website',
          'Mobile-responsive layout (looks great on all phones)',
          'Business introduction & about section',
          'Categorized services or offerings list',
          'Direct WhatsApp chat & call button',
          'Contact details & Google Maps location embed',
          'Up to 2 revision rounds before final launch',
          'Full domain purchase & Google Cloud setup assistance (billed at actuals)',
        ],
        revisionLimit: '2 revision rounds included',
        deliveryEstimate: '3 to 5 business days',
        isPopular: false,
        isPublished: true,
        order: 1,
      },
      {
        name: 'Business Website',
        slug: 'business-website',
        price: 5999,
        priceUSD: 89,
        currency: '₹',
        period: 'starting price (up to 5 pages)',
        description: 'Our most popular package for growing businesses, clinics, gyms, salons, and firms needing a complete multi-page presence.',
        features: [
          'Multi-section business website (up to 5 agreed pages)',
          'Home, About, Services, Gallery/Portfolio, Contact',
          'Interactive service listings with pricing tables',
          'Dedicated photo gallery or work showcase',
          'Working enquiry form connected to email/database',
          'WhatsApp integration for instant visitor chat',
          'Interactive Google Maps directions embed',
          'Basic on-page SEO meta tags & sitemap setup',
          'Up to 3 revision rounds during development',
          'Direct domain registration & Google Cloud setup (billed at actuals) + 14 days support',
        ],
        revisionLimit: '3 revision rounds included',
        deliveryEstimate: '7 to 10 business days',
        isPopular: true,
        isPublished: true,
        order: 2,
      },
      {
        name: 'Premium Website',
        slug: 'premium-website',
        price: 9999,
        priceUSD: 149,
        currency: '₹',
        period: 'starting price (custom scope)',
        description: 'Engineered for brands and companies that require advanced styling, custom layouts, extensive catalogs, or web app features.',
        features: [
          'Custom tailored web design with bespoke branding',
          'Multi-page architecture with advanced layout modules',
          'Extensive service, menu, or product catalog presentation',
          'Interactive demo preview features & filterable showcases',
          'Third-party integrations (CRM, WhatsApp API, payment links)',
          'Lead generation funnel with spam protection',
          'High-speed optimization & Google Core Web Vitals focus',
          'Up to 4 revision rounds during staging',
          'Complete domain & Google Cloud production deployment (billed at actuals) + 30 days support',
        ],
        revisionLimit: '4 revision rounds included',
        deliveryEstimate: '12 to 18 business days',
        isPopular: false,
        isPublished: true,
        order: 3,
      },
    ];

    await PricingPackage.insertMany(pricingPackages);
    console.log(`[Seed] Seeded ${pricingPackages.length} pricing packages.`);

    // 5. Seed Portfolio Projects (Clearly marked as Demo Projects per Section 6 rules)
    await Project.deleteMany({});
    const projects = [
      {
        title: 'PulseFit Athletic & Gym Demo',
        slug: 'pulsefit-athletic-gym-demo',
        category: 'Gym',
        description: 'A high-octane fitness club website demo featuring membership tier cards, coach credentials, photo galleries, and trial workout booking.',
        problemObjective: 'Provide fitness centers with an energetic, modern web template that clearly displays membership tiers, trainer specializations, and converts casual visitors into trial bookings.',
        highlights: [
          'Dynamic membership tier comparison with instant WhatsApp inquiry',
          'Trainer roster cards with fitness certifications and specialties',
          'Facility gallery showcasing equipment, cardio, and yoga zones',
          'Opening hours and embedded location directions',
        ],
        features: [
          'Class timetable and program schedule',
          'One-click WhatsApp trial session booking',
          'Interactive facility photo tour',
          'Membership FAQ accordion',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Framer Motion', 'React Icons'],
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/gym-fitness',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'LuxeGlow Studio & Beauty Bar Demo',
        slug: 'luxeglow-studio-beauty-bar-demo',
        category: 'Salon',
        description: 'An elegant, pastel-toned salon and luxury spa website demo with categorized treatments, stylist lookbooks, and appointment enquiry forms.',
        problemObjective: 'Showcase how high-end beauty parlors, hair stylists, and spas can present their price menus transparently while streamlining appointment requests.',
        highlights: [
          'Categorized beauty menu with transparent starting prices',
          'Master stylist profiles highlighting years in hairdressing and aesthetic awards',
          'Before/after lookbook and bridal transformations',
          'Appointment enquiry modal with preferred time and stylist selection',
        ],
        features: [
          'Hair, skin, spa, and bridal service listings',
          'Direct WhatsApp booking shortcut',
          'Hygiene and premium product safety disclosure',
          'Interactive salon operating hours',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Custom CSS', 'Framer Motion'],
        thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/salon-beauty',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'AuraCare Specialty Clinic Demo',
        slug: 'auracare-specialty-clinic-demo',
        category: 'Healthcare',
        description: 'A medical-grade, clean healthcare clinic demo highlighting verified doctor credentials, consulting timings, and appointment request workflows.',
        problemObjective: 'Enable independent practitioners and multi-specialty clinics to build patient trust with transparent qualifications, visiting hours, and non-invasive appointment requests.',
        highlights: [
          'Doctor credential cards highlighting medical degrees and council registrations',
          'Specialty clinical care breakdown (Cardiology, Dermatology, Orthopedics)',
          'OPD schedule and clinic timings clearly visible on all devices',
          'Ethical appointment request form (strictly distinct from diagnostic consultations)',
        ],
        features: [
          'Patient advisory notice and confidentiality commitment',
          'Clinic address with ambulance / emergency notice',
          'Interactive doctor consultation hours schedule',
          'Simple WhatsApp enquiry integration',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Node.js', 'Express.js'],
        thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/doctor-clinic',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'Saffron & Spice Bistro Demo',
        slug: 'saffron-spice-bistro-demo',
        category: 'Restaurant',
        description: 'An appetizing restaurant & gourmet cafe demo featuring interactive digital menus, dietary badges, table enquiry forms, and delivery links.',
        problemObjective: 'Help culinary businesses showcase their chef specials, dietary options, and drive direct table reservations without paying high third-party commissions.',
        highlights: [
          'Interactive categorized menu (Appetizers, Mains, Mocktails, Desserts)',
          'Table reservation enquiry form with guest count and seating preferences',
          'Vibrant culinary photography with chef specials callout',
          'Direct delivery links to major food ordering portals and WhatsApp',
        ],
        features: [
          'Veg and Non-Veg dietary badges on all items',
          'Daily opening hours and special weekend brunch notice',
          'Google Maps route embed for dine-in guests',
          'Direct phone ordering call buttons',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Framer Motion'],
        thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/restaurant-cafe',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'Apex Coaching Academy Demo',
        slug: 'apex-coaching-academy-demo',
        category: 'Education',
        description: 'A structured educational coaching institute demo with course overviews, faculty introductions, batch schedules, and admission inquiries.',
        problemObjective: 'Give test-prep coaching centers, language schools, and tutors a credible platform to outline syllabi, batch timings, and collect verified student inquiries.',
        highlights: [
          'Structured course catalog with course duration and target exams',
          'Faculty bios showcasing teaching experience and subject expertise',
          'Upcoming batch calendar and enrollment deadlines',
          'Transparent admission inquiry form with downloadable brochure trigger',
        ],
        features: [
          'Course comparison matrix',
          'Frequently Asked Questions by parents and aspirants',
          'Interactive campus location and helpline numbers',
          'Direct WhatsApp guidance button',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Custom CSS'],
        thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/coaching-education',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'UrbanNest Premium Properties Demo',
        slug: 'urbannest-premium-properties-demo',
        category: 'Business',
        description: 'A modern real estate agency demo with property listings, amenity tags, search filters, agent contacts, and schedule visit requests.',
        problemObjective: 'Demonstrate how real estate firms and independent brokers can showcase residential and commercial listings with rich imagery and lead capture.',
        highlights: [
          'Filterable property cards (Apartments, Villas, Commercial, Penthouses)',
          'Detailed listing specifications (Sq. Ft., Bedrooms, Furnishing, Location)',
          'Schedule a Site Visit inquiry form with preferred date',
          'Direct broker WhatsApp contact button for instant video walkthroughs',
        ],
        features: [
          'High-resolution property gallery preview',
          'Locality advantages and nearby transit indicators',
          'Real estate agent credential profiles',
          'EMI and mortgage estimation guide note',
        ],
        technologies: ['React.js', 'Bootstrap 5', 'Framer Motion'],
        thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/industries/real-estate',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
      {
        title: 'TaskFlow Pro Project Management Demo',
        slug: 'taskflow-pro-project-management-demo',
        category: 'Web Applications',
        description: 'A full-stack React & Node.js application demo showcasing Kanban project boards, activity logs, team collaboration, and metrics.',
        problemObjective: 'Highlight full-stack engineering expertise in building interactive, data-driven web applications with state management and authentication.',
        highlights: [
          'Drag-and-drop styled Kanban task boards',
          'Team member assignment and task status tracking',
          'Interactive metrics preview and velocity cards',
          'Responsive design adapting across desktop and tablets',
        ],
        features: [
          'Real-time task state transitions',
          'Priority labeling and deadline badges',
          'User profile activity timeline',
          'Clean REST API architecture',
        ],
        technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap 5'],
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        ],
        demoUrl: '/portfolio/taskflow-pro-project-management-demo',
        githubUrl: 'https://github.com',
        isDemo: true,
        isPublished: true,
      },
    ];

    await Project.insertMany(projects);
    console.log(`[Seed] Seeded ${projects.length} demo projects.`);

    // 6. Testimonials: Strictly no fake testimonials per Section 10
    await Testimonial.deleteMany({});
    console.log('[Seed] Testimonials reset to clean state (No fake testimonials generated, genuine reviews can be added via Admin Dashboard).');

    console.log('--------------------------------------------------');
    console.log('RY WebSphere database seeding completed successfully!');
    console.log(`Administrator Login: ${adminEmail}`);
    console.log(`Administrator Password: ${adminPassword}`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error occurred: ${error.message}`);
    process.exit(1);
  }
};

seedData();
