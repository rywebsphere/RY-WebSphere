import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaSearch,
  FaSearchLocation,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhoneAlt,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaBookmark,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaCalendarAlt,
  FaHistory,
  FaUser,
  FaUsers,
  FaTrash,
  FaFilter,
  FaTimes,
  FaInfoCircle,
  FaRedo,
  FaPaperPlane,
  FaClock,
  FaDumbbell,
  FaSpa,
  FaBuilding,
  FaUserMd,
  FaUtensils,
  FaPlane,
  FaGraduationCap,
  FaBriefcase,
  FaEdit,
  FaChartLine,
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BUSINESS_CATEGORIES = [
  { label: 'Gyms and fitness centres', icon: FaDumbbell, key: 'gyms' },
  { label: 'Salons and beauty parlours', icon: FaSpa, key: 'salons' },
  { label: 'Real estate agents and property dealers', icon: FaBuilding, key: 'realestate' },
  { label: 'Doctors and clinics', icon: FaUserMd, key: 'doctors' },
  { label: 'Dental clinics and hospitals', icon: FaUserMd, key: 'dental' },
  { label: 'Restaurants and cafes', icon: FaUtensils, key: 'restaurants' },
  { label: 'Coffee shops', icon: FaUtensils, key: 'coffee' },
  { label: 'Travel agencies', icon: FaPlane, key: 'travel' },
  { label: 'Coaching institutes', icon: FaGraduationCap, key: 'coaching' },
  { label: 'Hotels, spas, and other local businesses', icon: FaBriefcase, key: 'hotels' },
];

const LOCATIONS = [
  'Greater Noida',
  'Noida',
  'Delhi',
  'Ghaziabad',
  'Gurugram',
];

const LEAD_STATUSES = [
  'All',
  'New',
  'Contacted',
  'Interested',
  'Follow-up',
  'Proposal Sent',
  'Converted',
  'Not Interested',
  'Do Not Contact',
];

const statusBadgeMap = {
  New: 'badge bg-danger text-white',
  Contacted: 'badge bg-info text-white',
  Interested: 'badge bg-primary text-white',
  'Follow-up': 'badge bg-warning text-dark fw-bold',
  'Proposal Sent': 'badge bg-violet text-white',
  Converted: 'badge bg-success text-white',
  'Not Interested': 'badge bg-secondary text-white',
  'Do Not Contact': 'badge bg-dark text-white',
};

// WhatsApp template generator tailored for each business category & website status
const generateWhatsAppTemplate = (business) => {
  const name = business.businessName || 'Business Owner';
  const loc = business.location || 'Delhi NCR';
  const cat = (business.category || '').toLowerCase();
  const hasWeb = business.hasWebsite && business.website;
  const webUrl = business.website || '';

  // 1. Gyms
  if (cat.includes('gym') || cat.includes('fitness')) {
    if (hasWeb) {
      return `Hello ${name} Team! 👋

I came across your fitness website (${webUrl}) in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere (a web development agency based in Delhi NCR). We specialize in redesigning gym websites for high mobile speed, sub-second load times, and direct WhatsApp trial lead funnels.

Would you like a complimentary website speed and mobile conversion audit for ${name}? We offer modern revamp packages starting from ₹2,999.

Best regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! 👋

I came across ${name} while researching top fitness centres in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere (web development agency in Delhi NCR). I noticed you don't have a direct website listed on Google Maps. We build energetic, modern gym websites with online membership tier packages, trainer showcases, and direct WhatsApp trial workout booking (packages starting at ₹2,999).

A dedicated website helps you convert local Google searchers into daily gym members. Would you be open to seeing a quick demo mockup for ${name}?

Best regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 2. Salons
  if (cat.includes('salon') || cat.includes('beauty') || cat.includes('parlour') || cat.includes('spa')) {
    if (hasWeb) {
      return `Hello ${name} Team! ✨

I visited your website (${webUrl}) for ${name} in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We help premium beauty salons upgrade their web presence with contemporary luxury UI, ultra-fast mobile booking, and Instagram-integrated lookbooks (revamps starting at ₹2,999).

Can I share a few quick suggestions to help you get more direct client appointments through your website?

Warm regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! ✨

I saw ${name} on Google Maps while looking at luxury salons in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We create elegant, luxury salon websites featuring aesthetic service menus, stylist lookbooks, and 1-click WhatsApp appointment booking (starting at just ₹2,999).

A professional website makes your salon stand out on Google search. Would you like to review a quick concept design for ${name}?

Warm regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 3. Real Estate
  if (cat.includes('real estate') || cat.includes('property') || cat.includes('realtor') || cat.includes('dealer')) {
    if (hasWeb) {
      return `Hello ${name} Team! 🏢

I checked out your property website (${webUrl}) for ${name} in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We redesign real estate portals to load 3x faster on mobile, capture high-intent buyer leads, and highlight premium project showcases (packages from ₹2,999).

Can we discuss how a modern layout could help you get more verified property buyer inquiries?

Best regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! 🏢

I came across ${name} while searching property consultants in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We develop high-impact real estate websites with verified property listings, project galleries, location maps, and direct WhatsApp buyer inquiries (packages starting at ₹2,999).

A branded website builds instant buyer trust for your property deals. Would you be interested in a quick 2-minute demo preview?

Best regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 4. Doctors & Clinics
  if (cat.includes('doctor') || cat.includes('clinic') || cat.includes('dental') || cat.includes('hospital')) {
    if (hasWeb) {
      return `Respected Doctor / Clinic Manager at ${name}, 🩺

I reviewed your clinic website (${webUrl}) in ${loc}.

I am Ranjan Yadav from RY WebSphere. We help healthcare practices modernize their websites for mobile patients—ensuring sub-second load speed, clear OPD timings, and frictionless appointment booking (revamp starting from ₹2,999).

Would you like a complimentary speed and mobile responsiveness audit of your clinic website?

Respectful regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Respected Doctor / Clinic Manager at ${name}, 🩺

I came across your healthcare clinic in ${loc}.

I am Ranjan Yadav, director at RY WebSphere. We build clean, trustworthy clinic websites displaying doctor qualifications, clinic consulting hours, treatments offered, and patient appointment requests (starting at ₹2,999).

Having an official website gives local patients immediate confidence before visiting. May I share a sample healthcare demo with your team?

Respectful regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 5. Restaurants & Cafes
  if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('coffee') || cat.includes('food')) {
    if (hasWeb) {
      return `Hello ${name} Team! 🍽️

I visited your food & cafe website (${webUrl}) for ${name} in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We revamp restaurant websites to feature high-resolution mobile food menus, instant WhatsApp table bookings, and Google Maps direction embeds (packages from ₹2,999).

Can I send you a 2-minute redesign concept tailored for ${name}?

Warm regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! 🍽️

I noticed ${name} while exploring popular food spots in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We engineer mouth-watering restaurant & cafe websites with digital visual menus, location directions, table reservation forms, and direct WhatsApp order inquiries (starting at ₹2,999).

A custom website lets you showcase your signature dishes without paying heavy aggregator commissions. Would you like to see a quick cafe demo?

Warm regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 6. Travel
  if (cat.includes('travel') || cat.includes('tour') || cat.includes('holiday')) {
    if (hasWeb) {
      return `Hello ${name} Team! ✈️

I reviewed your travel portal (${webUrl}) for ${name} in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We help tour operators modernize outdated travel sites into high-converting booking funnels with clean itinerary layouts and mobile booking (revamps starting at ₹2,999).

Would you be open to a quick chat on improving lead conversions from your website?

Best regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! ✈️

I came across your travel agency in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We build dynamic travel websites with holiday package itineraries, customized quote inquiry forms, and instant WhatsApp booking (packages starting at ₹2,999).

A dedicated travel website builds trust with domestic and international travelers. Could I share a quick sample travel portal with you?

Best regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 7. Coaching
  if (cat.includes('coaching') || cat.includes('institute') || cat.includes('academy') || cat.includes('education')) {
    if (hasWeb) {
      return `Hello ${name} Team! 🎓

I reviewed your institute's website (${webUrl}) in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We redesign education and coaching websites for mobile speed, clear course brochures, and higher admission inquiry rates (packages starting at ₹2,999).

Can I share a brief audit on how to improve your website's student lead conversions?

Best regards,
Ranjan Yadav | RY WebSphere`;
    }
    return `Hello ${name} Team! 🎓

I noticed your coaching institute in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We develop modern institute websites with course catalogs, student result showcases, fee inquiry forms, and direct WhatsApp counseling links (starting at ₹2,999).

A professional website attracts serious students and parents searching online. Would you like a quick demo preview?

Best regards,
Ranjan Yadav | RY WebSphere`;
  }

  // 8. General Local Business
  if (hasWeb) {
    return `Hello ${name} Team! 💼

I visited your website (${webUrl}) for ${name} in ${loc}.

I'm Ranjan Yadav from RY WebSphere. We help established businesses revamp and modernize their web presence for 3x faster loading speed, mobile usability, and higher sales conversions (packages from ₹2,999).

Would you like a complimentary performance audit of your current site?

Best regards,
Ranjan Yadav | RY WebSphere`;
  }
  return `Hello ${name} Team! 💼

I came across your business listing in ${loc}.

I'm Ranjan Yadav, founder of RY WebSphere. We craft fast, mobile-friendly websites that help local businesses attract more inbound phone calls and WhatsApp inquiries (packages starting at ₹2,999).

Would you be open to a quick discussion or seeing a demo of what we can build for ${name}?

Best regards,
Ranjan Yadav | RY WebSphere`;
};

const AdminLeadFinder = () => {
  const { admin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state: if route is /admin/leads or query has ?tab=crm -> default to 'crm', otherwise 'finder'
  const isLeadsRoute = location.pathname.includes('/leads') && !location.pathname.includes('/lead-finder');
  const initialTab = (isLeadsRoute || searchParams.get('tab') === 'crm') ? 'crm' : 'finder';
  const [activeTab, setActiveTab] = useState(initialTab);

  const isOwnerOrAdmin = admin?.role === 'superadmin' || admin?.role === 'admin';

  // --- Lead Finder Search State ---
  const [searchEngine, setSearchEngine] = useState('osm'); // 'osm' (100% Free OpenStreetMap) or 'google' (Google Places API)
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0].label);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [websiteFilter, setWebsiteFilter] = useState('all'); // 'all', 'no_website', 'with_website'
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [apiInfo, setApiInfo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // --- CRM Leads State ---
  const [crmLeads, setCrmLeads] = useState([]);
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmStats, setCrmStats] = useState(null);
  const [crmStatusFilter, setCrmStatusFilter] = useState('All');
  const [crmCategoryFilter, setCrmCategoryFilter] = useState('All');
  const [crmLocationFilter, setCrmLocationFilter] = useState('All');
  const [crmFollowUpDue, setCrmFollowUpDue] = useState(false);
  const [crmSearchText, setCrmSearchText] = useState('');

  // Team members for assignment dropdown
  const [teamMembers, setTeamMembers] = useState([]);

  // --- Modals State ---
  // WhatsApp Outreach Modal
  const [outreachModalBiz, setOutreachModalBiz] = useState(null);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [outreachPhone, setOutreachPhone] = useState('');
  const [logContactOnSend, setLogContactOnSend] = useState(true);

  // Lead Details & Management Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingLead, setUpdatingLead] = useState(false);

  // New Contact Attempt form in Details Modal
  const [newAttemptType, setNewAttemptType] = useState('Call');
  const [newAttemptOutcome, setNewAttemptOutcome] = useState('Connected');
  const [newAttemptNotes, setNewAttemptNotes] = useState('');
  const [savingAttempt, setSavingAttempt] = useState(false);

  // Sync tab with URL location and query params
  useEffect(() => {
    const isLeads = location.pathname.includes('/leads') && !location.pathname.includes('/lead-finder');
    const tabParam = searchParams.get('tab');
    if (isLeads || tabParam === 'crm') {
      setActiveTab('crm');
    } else {
      setActiveTab('finder');
    }
  }, [location.pathname, searchParams]);

  // Load team members and initial CRM stats
  useEffect(() => {
    fetchCrmStats();
    if (isOwnerOrAdmin) {
      fetchTeamMembers();
    }
  }, []);

  // Fetch CRM leads when tab is CRM or filters change
  useEffect(() => {
    if (activeTab === 'crm') {
      fetchCrmLeads();
    }
  }, [activeTab, crmStatusFilter, crmCategoryFilter, crmLocationFilter, crmFollowUpDue]);

  const fetchTeamMembers = async () => {
    try {
      const res = await api.get('/admin/team');
      if (res.data?.success) {
        setTeamMembers(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load team members:', err.message);
    }
  };

  const fetchCrmStats = async () => {
    try {
      const res = await api.get('/admin/leads/stats');
      if (res.data?.success) {
        setCrmStats(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load CRM stats:', err.message);
    }
  };

  const fetchCrmLeads = async () => {
    try {
      setCrmLoading(true);
      const params = new URLSearchParams();
      if (crmStatusFilter !== 'All') params.append('status', crmStatusFilter);
      if (crmCategoryFilter !== 'All') params.append('category', crmCategoryFilter);
      if (crmLocationFilter !== 'All') params.append('location', crmLocationFilter);
      if (crmFollowUpDue) params.append('followUpDue', 'true');
      if (crmSearchText.trim()) params.append('search', crmSearchText.trim());

      const res = await api.get(`/admin/leads?${params.toString()}`);
      if (res.data?.success) {
        setCrmLeads(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching CRM leads:', err.message);
    } finally {
      setCrmLoading(false);
    }
  };

  // --- Handle Search Businesses ---
  const handleSearchBusinesses = async (e) => {
    if (e) e.preventDefault();

    const categoryToUse = customCategory.trim() || selectedCategory;
    const locationToUse = customLocation.trim() || selectedLocation;

    setSearching(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        category: categoryToUse,
        location: locationToUse,
        websiteStatus: websiteFilter,
        engine: searchEngine,
      });

      const res = await api.get(`/admin/leads/search?${params.toString()}`);
      if (res.data?.success) {
        setSearchResults(res.data.data);
        setApiInfo({
          apiKeyConfigured: res.data.apiKeyConfigured,
          isDemoMode: res.data.isDemoMode,
          engineUsed: res.data.engineUsed,
          message: res.data.message,
        });
      }
    } catch (err) {
      alert(`Search error: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };

  // --- Save Business as Lead in CRM ---
  const handleSaveBusiness = async (biz) => {
    try {
      const payload = {
        businessName: biz.businessName,
        category: biz.category,
        location: biz.location,
        address: biz.address,
        phone: biz.phone,
        internationalPhone: biz.internationalPhone,
        website: biz.website,
        hasWebsite: biz.hasWebsite,
        rating: biz.rating,
        userRatingsTotal: biz.userRatingsTotal,
        googleMapsUrl: biz.googleMapsUrl,
        placeId: biz.placeId,
        status: 'New',
        internalNotes: 'Discovered and saved via Smart Lead Finder.',
      };

      const res = await api.post('/admin/leads', payload);
      if (res.data?.success) {
        // Update local search results
        setSearchResults((prev) =>
          prev.map((item) =>
            item.placeId === biz.placeId
              ? { ...item, isSaved: true, savedLeadId: res.data.data._id, savedStatus: 'New' }
              : item
          )
        );
        fetchCrmStats();
        alert(`✓ "${biz.businessName}" saved to your Outreach CRM!`);
      }
    } catch (err) {
      alert(`Could not save lead: ${err.message}`);
    }
  };

  // --- Open WhatsApp Outreach Modal ---
  const openWhatsAppModal = (biz) => {
    setOutreachModalBiz(biz);
    setOutreachPhone(biz.phone || '');
    const template = generateWhatsAppTemplate(biz);
    setOutreachMessage(template);
  };

  // --- Trigger WhatsApp Opening ---
  const handleSendWhatsApp = async () => {
    if (!outreachPhone.trim()) {
      alert('Please enter a valid phone number for this business.');
      return;
    }

    const cleanPhone = outreachPhone.replace(/[^\d]/g, '');
    const encoded = encodeURIComponent(outreachMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // If logging contact attempt is enabled
    if (logContactOnSend && outreachModalBiz) {
      let leadId = outreachModalBiz.savedLeadId;

      // If business isn't saved yet, auto-save to CRM first
      if (!leadId) {
        try {
          const saveRes = await api.post('/admin/leads', {
            businessName: outreachModalBiz.businessName,
            category: outreachModalBiz.category,
            location: outreachModalBiz.location,
            address: outreachModalBiz.address,
            phone: outreachPhone || outreachModalBiz.phone,
            internationalPhone: outreachModalBiz.internationalPhone,
            website: outreachModalBiz.website,
            hasWebsite: outreachModalBiz.hasWebsite,
            rating: outreachModalBiz.rating,
            userRatingsTotal: outreachModalBiz.userRatingsTotal,
            googleMapsUrl: outreachModalBiz.googleMapsUrl,
            placeId: outreachModalBiz.placeId,
            status: 'Contacted',
            internalNotes: 'Auto-saved upon initiating WhatsApp outreach.',
          });

          if (saveRes.data?.success) {
            leadId = saveRes.data.data._id;
            // Update search results badge
            setSearchResults((prev) =>
              prev.map((item) =>
                item.placeId === outreachModalBiz.placeId
                  ? { ...item, isSaved: true, savedLeadId: leadId, savedStatus: 'Contacted' }
                  : item
              )
            );
          }
        } catch (saveErr) {
          console.warn('Auto-save during WhatsApp outreach:', saveErr.message);
        }
      }

      // Record contact attempt
      if (leadId) {
        try {
          await api.post(`/admin/leads/${leadId}/contact-attempt`, {
            type: 'WhatsApp',
            notes: `Outreach sent to ${outreachPhone}. Template: ${outreachModalBiz.hasWebsite ? 'Website Redesign' : 'New Website'}`,
            outcome: 'Connected',
            autoUpdateStatus: true,
          });
          fetchCrmStats();
        } catch (err) {
          console.warn('Auto contact attempt log:', err.message);
        }
      }
    }

    setOutreachModalBiz(null);
  };

  // --- Quick Status Update from CRM Table ---
  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      const res = await api.put(`/admin/leads/${leadId}`, { status: newStatus });
      if (res.data?.success) {
        setCrmLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
        );
        fetchCrmStats();
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // --- Quick Assignee Change ---
  const handleQuickAssignChange = async (leadId, assigneeId) => {
    try {
      const res = await api.put(`/admin/leads/${leadId}`, { assignedTo: assigneeId });
      if (res.data?.success) {
        setCrmLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, ...res.data.data } : l))
        );
      }
    } catch (err) {
      alert(`Error assigning lead: ${err.message}`);
    }
  };

  // --- Record New Contact Attempt in Modal ---
  const handleRecordAttempt = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      setSavingAttempt(true);
      const res = await api.post(`/admin/leads/${selectedLead._id}/contact-attempt`, {
        type: newAttemptType,
        outcome: newAttemptOutcome,
        notes: newAttemptNotes,
        autoUpdateStatus: true,
      });

      if (res.data?.success) {
        setSelectedLead(res.data.data);
        setCrmLeads((prev) =>
          prev.map((l) => (l._id === selectedLead._id ? res.data.data : l))
        );
        setNewAttemptNotes('');
        fetchCrmStats();
        alert('Contact attempt logged successfully!');
      }
    } catch (err) {
      alert(`Error recording attempt: ${err.message}`);
    } finally {
      setSavingAttempt(false);
    }
  };

  // --- Save Changes to Selected Lead (Notes, Follow-up, etc.) ---
  const handleSaveLeadDetails = async () => {
    if (!selectedLead) return;

    try {
      setUpdatingLead(true);
      const res = await api.put(`/admin/leads/${selectedLead._id}`, {
        status: selectedLead.status,
        internalNotes: selectedLead.internalNotes,
        followUpDate: selectedLead.followUpDate,
        followUpNotes: selectedLead.followUpNotes,
        quotationDetails: selectedLead.quotationDetails,
      });

      if (res.data?.success) {
        setCrmLeads((prev) =>
          prev.map((l) => (l._id === selectedLead._id ? res.data.data : l))
        );
        fetchCrmStats();
        alert('Lead details updated successfully!');
      }
    } catch (err) {
      alert(`Error updating lead: ${err.message}`);
    } finally {
      setUpdatingLead(false);
    }
  };

  // --- Delete Lead ---
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to remove this lead from CRM?')) return;

    try {
      const res = await api.delete(`/admin/leads/${leadId}`);
      if (res.data?.success) {
        setCrmLeads((prev) => prev.filter((l) => l._id !== leadId));
        if (selectedLead?._id === leadId) setSelectedLead(null);
        fetchCrmStats();
      }
    } catch (err) {
      alert(`Error deleting lead: ${err.message}`);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'crm') {
      navigate('/admin/leads');
    } else {
      navigate('/admin/lead-finder');
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '0.78rem' }}>
              <FaSearch className="me-1" /> Smart Lead Finder & Client Outreach CRM
            </span>
            {apiInfo?.isDemoMode && (
              <span className="badge bg-warning text-dark px-2.5 py-1 rounded-pill small fw-bold">
                Test / Demo Mode Active
              </span>
            )}
          </div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {activeTab === 'crm'
              ? 'Saved Outreach CRM Pipeline'
              : 'Local Business Prospecting & Smart Lead Finder'}
          </h2>
          <p className="text-muted small mb-0">
            {activeTab === 'crm'
              ? 'Manage your outreach pipeline, track client statuses (Interested, Follow-up, Converted), schedule calls, and assign leads.'
              : 'Search real businesses by category & location via OpenStreetMap / Google Places, inspect website availability, and initiate cold outreach.'}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="btn-group shadow-sm" role="group">
          <button
            type="button"
            onClick={() => switchTab('finder')}
            className={`btn px-3.5 py-2 fw-bold d-flex align-items-center gap-2 ${
              activeTab === 'finder' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
          >
            <FaSearch size={13} />
            <span>Smart Lead Finder</span>
          </button>
          <button
            type="button"
            onClick={() => switchTab('crm')}
            className={`btn px-3.5 py-2 fw-bold d-flex align-items-center gap-2 ${
              activeTab === 'crm' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
          >
            <FaBookmark size={13} />
            <span>Saved Outreach CRM</span>
            {crmStats?.totalLeads > 0 && (
              <span className="badge bg-light text-dark rounded-pill ms-1">
                {crmStats.totalLeads}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick CRM Metrics Bar */}
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">TOTAL SAVED LEADS</div>
            <div className="fs-4 fw-extrabold text-primary">{crmStats?.totalLeads || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">NO WEBSITE (PRIME)</div>
            <div className="fs-4 fw-extrabold text-danger">{crmStats?.noWebsiteLeads || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">CONTACTED</div>
            <div className="fs-4 fw-extrabold text-info">{crmStats?.contactedLeads || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">INTERESTED</div>
            <div className="fs-4 fw-extrabold text-warning">{crmStats?.interestedLeads || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">FOLLOW-UPS DUE</div>
            <div className={`fs-4 fw-extrabold ${crmStats?.followUpsDue > 0 ? 'text-danger animate-pulse' : 'text-secondary'}`}>
              {crmStats?.followUpsDue || 0}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 col-xl-2">
          <div className="p-3 rounded-3 bg-surface border text-center h-100">
            <div className="text-muted small fw-bold mb-1">CONVERTED CLIENTS</div>
            <div className="fs-4 fw-extrabold text-success">{crmStats?.convertedLeads || 0}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SMART LEAD FINDER (GOOGLE PLACES PROSPECTING) */}
      {/* ========================================================================= */}
      {activeTab === 'finder' && (
        <div>
          {/* Search Card */}
          <div className="ry-card p-4 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Search Engine Mode Selector */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  Search Engine:
                </span>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setSearchEngine('osm')}
                    className={`btn fw-bold px-3 py-1.5 ${
                      searchEngine === 'osm'
                        ? 'btn-success text-white shadow-sm'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    🗺️ OpenStreetMap (100% Free - No Key)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchEngine('google')}
                    className={`btn fw-bold px-3 py-1.5 ${
                      searchEngine === 'google'
                        ? 'btn-primary text-white shadow-sm'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    📍 Google Places API
                  </button>
                </div>
              </div>

              {searchEngine === 'osm' ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 px-3 py-1.5 rounded-pill small fw-bold">
                    ✨ 100% Free Mode Active (OSM Nominatim - No Account, No Card, No API Key)
                  </span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 px-3 py-1.5 rounded-pill small fw-bold">
                    🔑 Google Cloud Places API (Official Text Search v1)
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSearchBusinesses}>
              <div className="row g-3">
                {/* Category Picker */}
                <div className="col-lg-4 col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.04em' }}>
                    1. Target Business Category
                  </label>
                  <select
                    className="form-select-ry"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      if (e.target.value !== 'Other Custom Category') setCustomCategory('');
                    }}
                  >
                    {BUSINESS_CATEGORIES.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                    <option value="Other Custom Category">+ Other Custom Category</option>
                  </select>

                  {selectedCategory === 'Other Custom Category' && (
                    <input
                      type="text"
                      className="form-control-ry mt-2"
                      placeholder="e.g. Bakeries, Pet Clinics, Boutiques..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Location Picker */}
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.04em' }}>
                    2. Location / City
                  </label>
                  <select
                    className="form-select-ry"
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      if (e.target.value !== 'Custom Location') setCustomLocation('');
                    }}
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="Custom Location">+ Other Custom City / Area</option>
                  </select>

                  {selectedLocation === 'Custom Location' && (
                    <input
                      type="text"
                      className="form-control-ry mt-2"
                      placeholder="e.g. Sector 18 Noida, Indirapuram..."
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Website Availability Filter */}
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.04em' }}>
                    3. Website Status Filter
                  </label>
                  <select
                    className="form-select-ry"
                    value={websiteFilter}
                    onChange={(e) => setWebsiteFilter(e.target.value)}
                  >
                    <option value="all">All Businesses</option>
                    <option value="no_website">⚠️ No Website Listed (Prime Prospects)</option>
                    <option value="with_website">🌐 Website Listed (Redesign Revamp)</option>
                  </select>
                </div>

                {/* Submit Search Button */}
                <div className="col-lg-2 col-md-6 d-flex align-items-end">
                  <button
                    type="submit"
                    disabled={searching}
                    className="btn btn-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  >
                    {searching ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch size={14} />
                        <span>Find Leads</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* API Status Notice */}
            <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted small" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <FaInfoCircle className={searchEngine === 'osm' ? 'text-success' : 'text-primary'} />
                <span>
                  {searchEngine === 'osm'
                    ? 'Using OpenStreetMap Nominatim live search. 100% free and open, no API key needed.'
                    : 'Using Google Places API Text Search. Returns rich Google Maps place details & ratings.'}
                </span>
                {apiInfo?.engineUsed && (
                  <span className="badge bg-dark border text-light px-2 py-0.5 ms-1">
                    Active: {apiInfo.engineUsed}
                  </span>
                )}
              </div>
              <div>
                <span className="badge bg-surface border text-secondary px-2.5 py-1">
                  Query Target: <strong>{(customCategory || selectedCategory)} in {(customLocation || selectedLocation)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {searching ? (
            <LoadingSpinner text={`Querying ${searchEngine === 'osm' ? 'OpenStreetMap Nominatim' : 'Google Places API'} for live businesses...`} />
          ) : searchResults.length > 0 ? (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                  Discovered Businesses ({searchResults.length})
                </h5>
                <span className="small text-muted">
                  Showing businesses for <strong>{(customCategory || selectedCategory)} in {(customLocation || selectedLocation)}</strong>
                </span>
              </div>

              <div className="row g-3">
                {searchResults.map((biz, idx) => (
                  <div key={biz.placeId || idx} className="col-lg-6">
                    <div
                      className={`ry-card p-4 h-100 d-flex flex-column justify-content-between rounded-4 transition-all ${
                        biz.isSaved ? 'border-success' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        boxShadow: 'var(--glow-card)',
                      }}
                    >
                      <div>
                        {/* Top Bar: Category, Source & Ratings */}
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                          <div className="d-flex flex-wrap align-items-center gap-1.5">
                            <span className="badge bg-primary bg-opacity-15 text-primary px-2.5 py-1 rounded-pill small fw-bold">
                              {biz.category}
                            </span>
                            {biz.source && (
                              <span className="badge bg-surface border text-muted px-2 py-0.5 rounded-pill" style={{ fontSize: '0.68rem' }}>
                                {biz.source.includes('OpenStreetMap') ? '🗺️ OSM' : '📍 Google'}
                              </span>
                            )}
                          </div>

                          <div className="d-flex align-items-center gap-1.5 small text-warning fw-bold">
                            {biz.rating ? (
                              <>
                                <FaStar size={13} />
                                <span>{biz.rating}</span>
                                <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                                  ({biz.userRatingsTotal})
                                </span>
                              </>
                            ) : (
                              <span className="text-muted fw-normal small">Listing</span>
                            )}
                          </div>
                        </div>

                        {/* Business Title */}
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                          {biz.businessName}
                        </h4>

                        {/* Address */}
                        <div className="d-flex align-items-start gap-1.5 text-muted small mb-3">
                          <FaMapMarkerAlt className="text-danger flex-shrink-0 mt-1" size={13} />
                          <span style={{ lineHeight: 1.4 }}>{biz.address}</span>
                        </div>

                        {/* Website Availability Status */}
                        <div className="mb-3">
                          {biz.hasWebsite ? (
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2.5 py-1 rounded-pill small fw-bold">
                                🌐 Website Listed
                              </span>
                              <a
                                href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="small text-primary text-decoration-none d-flex align-items-center gap-1"
                              >
                                <span>{biz.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                                <FaExternalLinkAlt size={10} />
                              </a>
                              <span className="badge bg-secondary bg-opacity-15 text-secondary px-2 py-0.5 rounded-pill small" style={{ fontSize: '0.7rem' }}>
                                Redesign Opportunity
                              </span>
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 px-2.5 py-1 rounded-pill small fw-bold">
                                ⚠️ No Website Listed
                              </span>
                              <span className="badge bg-primary bg-opacity-20 text-primary px-2 py-0.5 rounded-pill small fw-bold" style={{ fontSize: '0.72rem' }}>
                                🎯 Prime Client Prospect
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div className="p-2.5 rounded-3 bg-surface border mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <FaPhoneAlt className={biz.phone ? 'text-success' : 'text-muted'} size={13} />
                            <span className="fw-bold small" style={{ color: biz.phone ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                              {biz.phone || 'Phone not in map tags'}
                            </span>
                          </div>
                          {biz.phone ? (
                            <a
                              href={`tel:${biz.phone.replace(/[^\d+]/g, '')}`}
                              className="btn btn-sm btn-outline-success px-2.5 py-0.5 fw-bold"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Call Now
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                biz.businessName + ' ' + (biz.address || biz.location)
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-warning px-2.5 py-0.5 fw-bold d-flex align-items-center gap-1"
                              style={{ fontSize: '0.72rem' }}
                              title="Search this business on Google to grab phone number"
                            >
                              <FaSearch size={10} />
                              <span>Find Phone on Google</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div className="d-flex align-items-center gap-1.5">
                            {/* Direct Call Button */}
                            {biz.phone ? (
                              <a
                                href={`tel:${biz.phone.replace(/[^\d+]/g, '')}`}
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
                                title="Open Device Phone Dialer"
                              >
                                <FaPhoneAlt size={12} className="text-success" />
                                <span>Call</span>
                              </a>
                            ) : (
                              <a
                                href={`tel:`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  openWhatsAppModal(biz);
                                }}
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
                                title="Add phone number to outreach"
                              >
                                <FaPhoneAlt size={12} className="text-muted" />
                                <span>Call</span>
                              </a>
                            )}

                            {/* Direct WhatsApp Pitch Button */}
                            <button
                              type="button"
                              onClick={() => openWhatsAppModal(biz)}
                              className="btn btn-success btn-sm d-flex align-items-center gap-1.5 fw-bold shadow-sm"
                              title="Personalized WhatsApp Outreach"
                            >
                              <FaWhatsapp size={14} />
                              <span>WhatsApp</span>
                            </button>

                            {/* Google Maps link */}
                            <a
                              href={biz.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-secondary btn-sm p-2"
                              title="Open on Google Maps"
                            >
                              <FaMapMarkerAlt size={13} className="text-danger" />
                            </a>

                            {/* OSM link if available */}
                            {biz.osmUrl && (
                              <a
                                href={biz.osmUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-secondary btn-sm p-2"
                                title="Open on OpenStreetMap"
                              >
                                <FaGlobe size={13} className="text-info" />
                              </a>
                            )}
                          </div>

                          {/* Save Lead to CRM Button */}
                          <div>
                            {biz.isSaved ? (
                              <button
                                type="button"
                                onClick={() => switchTab('crm')}
                                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1.5 fw-bold"
                              >
                                <FaCheckCircle size={13} />
                                <span>In CRM ({biz.savedStatus})</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSaveBusiness(biz)}
                                className="btn btn-ry-primary btn-sm d-flex align-items-center gap-1.5 fw-semibold"
                              >
                                <FaBookmark size={12} />
                                <span>Save Lead</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="ry-card p-5 text-center rounded-4">
              <FaSearch size={32} className="text-muted mb-3" />
              <h5 className="fw-bold">No businesses found for this query and location.</h5>
              <p className="text-muted small">
                Try searching with a broader category or nearby location like Noida, Greater Noida, or Delhi.
              </p>
            </div>
          ) : (
            <div className="ry-card p-5 text-center rounded-4 border-dashed">
              <FaSearchLocation size={42} className="text-primary mb-3 opacity-75" />
              <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Search High-Value Local Clients Across Delhi NCR
              </h4>
              <p className="text-muted small max-w-600 mx-auto mb-4">
                Select a business category (Gyms, Salons, Real Estate, Doctors, Clinics, Restaurants) and location above. The Smart Lead Finder queries Google Places to bring you verified names, phone numbers, ratings, and website availability for direct outreach.
              </p>
              <button
                type="button"
                onClick={() => handleSearchBusinesses()}
                className="btn btn-ry-primary px-4 py-2.5 fw-bold"
              >
                Search Gyms in Greater Noida (Quick Start)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAVED OUTREACH CRM & FOLLOW-UPS */}
      {/* ========================================================================= */}
      {activeTab === 'crm' && (
        <div>
          {/* CRM Filters & Search Bar */}
          <div className="ry-card p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="row g-3 align-items-center justify-content-between">
              {/* Search text */}
              <div className="col-lg-3 col-md-6">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control-ry pe-5 py-2"
                    placeholder="Search name, phone, city..."
                    value={crmSearchText}
                    onChange={(e) => setCrmSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchCrmLeads()}
                  />
                  <FaSearch
                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted cursor-pointer"
                    onClick={fetchCrmLeads}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select-ry py-2"
                  value={crmStatusFilter}
                  onChange={(e) => setCrmStatusFilter(e.target.value)}
                >
                  {LEAD_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      Status: {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select-ry py-2"
                  value={crmCategoryFilter}
                  onChange={(e) => setCrmCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {BUSINESS_CATEGORIES.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Follow-up Due Toggle Button */}
              <div className="col-lg-3 col-md-6 d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCrmFollowUpDue(!crmFollowUpDue)}
                  className={`btn btn-sm w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 ${
                    crmFollowUpDue ? 'btn-danger text-white' : 'btn-outline-secondary'
                  }`}
                >
                  <FaClock size={13} />
                  <span>Due Follow-ups ({crmStats?.followUpsDue || 0})</span>
                </button>
              </div>
            </div>
          </div>

          {/* CRM Leads Table */}
          {crmLoading ? (
            <LoadingSpinner text="Retrieving Outreach CRM records..." />
          ) : crmLeads.length === 0 ? (
            <div className="ry-card p-5 text-center rounded-4">
              <h5>No leads found matching your criteria.</h5>
              <p className="text-muted small">
                Switch to the "Smart Lead Finder" tab to search Google Places and save new business prospects.
              </p>
              <button
                type="button"
                onClick={() => switchTab('finder')}
                className="btn btn-ry-primary btn-sm mt-2"
              >
                Go to Smart Lead Finder
              </button>
            </div>
          ) : (
            <div className="ry-card p-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="table-responsive">
                <table className="table ry-table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Business Name & City</th>
                      <th>Category & Website</th>
                      <th>Phone Number</th>
                      <th>Status Pipeline</th>
                      <th>Assigned To</th>
                      <th>Next Follow-up</th>
                      <th>Outreach History</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmLeads.map((lead) => (
                      <tr key={lead._id}>
                        {/* Business */}
                        <td>
                          <div className="fw-bold text-white">{lead.businessName}</div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <FaMapMarkerAlt size={10} className="text-danger" />
                            <span>{lead.location}</span>
                          </div>
                        </td>

                        {/* Category & Web */}
                        <td>
                          <div className="small text-light fw-medium">{lead.category}</div>
                          {lead.hasWebsite ? (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 text-decoration-none small mt-0.5"
                            >
                              🌐 Has Website
                            </a>
                          ) : (
                            <span className="badge bg-warning bg-opacity-20 text-warning small mt-0.5">
                              ⚠️ No Website
                            </span>
                          )}
                        </td>

                        {/* Phone */}
                        <td>
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                              className="text-light fw-semibold text-decoration-none small d-flex align-items-center gap-1"
                            >
                              <FaPhoneAlt size={11} className="text-success" />
                              <span>{lead.phone}</span>
                            </a>
                          ) : (
                            <span className="text-muted small">No Phone</span>
                          )}
                        </td>

                        {/* Status Pipeline Dropdown */}
                        <td>
                          <select
                            className="form-select-ry py-1 px-2"
                            style={{ fontSize: '0.78rem', width: 'auto' }}
                            value={lead.status}
                            onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                          >
                            {LEAD_STATUSES.filter((s) => s !== 'All').map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Assignee */}
                        <td>
                          {isOwnerOrAdmin ? (
                            <select
                              className="form-select-ry py-1 px-2"
                              style={{ fontSize: '0.78rem', width: 'auto' }}
                              value={lead.assignedTo?._id || lead.assignedTo || 'unassigned'}
                              onChange={(e) => handleQuickAssignChange(lead._id, e.target.value)}
                            >
                              <option value="unassigned">Unassigned</option>
                              {teamMembers.map((m) => (
                                <option key={m._id} value={m._id}>
                                  {m.name} ({m.role === 'employee' ? 'Staff' : 'Admin'})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="small text-muted">
                              {lead.assignedToName || 'Unassigned'}
                            </span>
                          )}
                        </td>

                        {/* Follow-up Date */}
                        <td>
                          {lead.followUpDate ? (
                            (() => {
                              const fDate = new Date(lead.followUpDate);
                              const isOverdue = fDate < new Date();
                              return (
                                <div className="small">
                                  <span
                                    className={`badge ${
                                      isOverdue ? 'bg-danger' : 'bg-primary'
                                    } text-white`}
                                    style={{ fontSize: '0.7rem' }}
                                  >
                                    <FaCalendarAlt className="me-1" />
                                    {fDate.toLocaleDateString()}
                                  </span>
                                </div>
                              );
                            })()
                          ) : (
                            <span className="text-muted small">None</span>
                          )}
                        </td>

                        {/* Outreach History Count */}
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="btn btn-sm btn-outline-secondary py-0.5 px-2 small d-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <FaHistory size={11} />
                            <span>{lead.contactAttempts?.length || 0} attempts</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex align-items-center gap-1.5">
                            {/* Call */}
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                                className="btn btn-outline-secondary btn-sm p-1.5"
                                title="Call on Phone"
                              >
                                <FaPhoneAlt size={12} className="text-success" />
                              </a>
                            )}

                            {/* WhatsApp Modal */}
                            {lead.phone && (
                              <button
                                type="button"
                                onClick={() => openWhatsAppModal({ ...lead, savedLeadId: lead._id })}
                                className="btn btn-outline-success btn-sm p-1.5"
                                title="Send Personalized WhatsApp Pitch"
                              >
                                <FaWhatsapp size={14} />
                              </button>
                            )}

                            {/* View / Manage Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              className="btn btn-outline-primary btn-sm p-1.5"
                              title="Manage Lead Details, History & Notes"
                            >
                              <FaEdit size={13} />
                            </button>

                            {/* Delete (Admin only) */}
                            {isOwnerOrAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead._id)}
                                className="btn btn-outline-danger btn-sm p-1.5"
                                title="Delete Lead"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PERSONALIZED WHATSAPP OUTREACH MODAL */}
      {/* ========================================================================= */}
      {outreachModalBiz && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }}
          onClick={() => setOutreachModalBiz(null)}
        >
          <div
            className="ry-card p-4 p-md-5 rounded-4 shadow-lg w-100 overflow-auto"
            style={{
              maxWidth: 720,
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="badge bg-success px-2.5 py-1 rounded-pill small fw-bold mb-1">
                  <FaWhatsapp className="me-1" /> Personalized WhatsApp Pitch
                </span>
                <h4 className="fw-bold mb-0 text-white">{outreachModalBiz.businessName}</h4>
                <div className="small text-muted">
                  {outreachModalBiz.category} • {outreachModalBiz.location}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setOutreachModalBiz(null)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Phone Number Input Check */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">WhatsApp Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-surface border text-muted">
                  <FaPhoneAlt size={13} />
                </span>
                <input
                  type="text"
                  className="form-control-ry"
                  value={outreachPhone}
                  onChange={(e) => setOutreachPhone(e.target.value)}
                  placeholder="e.g. +91 98112 34567"
                />
              </div>
              <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                Ensure country code (+91 for India) is included before opening WhatsApp.
              </div>
            </div>

            {/* Value Proposition Strategy Indicator */}
            <div className="p-3 rounded-3 bg-surface border mb-3">
              <div className="small fw-bold text-white mb-1">
                Strategy: {outreachModalBiz.hasWebsite ? 'Website Redesign & Speed Revamp' : 'Brand New Website Development'}
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
                {outreachModalBiz.hasWebsite
                  ? 'This business already has a website listed. The pitch proposes modernizing UI, mobile responsiveness, and speed optimization.'
                  : 'No website was found on Google Maps. The pitch proposes launching their first dedicated web asset starting at ₹2,999.'}
              </p>
            </div>

            {/* Editable Pitch Text Area */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <label className="form-label small fw-bold text-muted mb-0">
                  Message Text (Fully Editable Before Sending)
                </label>
                <button
                  type="button"
                  onClick={() => setOutreachMessage(generateWhatsAppTemplate(outreachModalBiz))}
                  className="btn btn-link btn-sm p-0 text-decoration-none small text-primary"
                >
                  Reset Template
                </button>
              </div>
              <textarea
                rows="9"
                className="form-control-ry"
                style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
              />
              <div className="d-flex justify-content-end text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                {outreachMessage.length} characters
              </div>
            </div>

            {/* Checkbox: Auto-log or Auto-save in CRM */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="logContactCheckbox"
                checked={logContactOnSend}
                onChange={(e) => setLogContactOnSend(e.target.checked)}
              />
              <label className="form-check-label small text-secondary" htmlFor="logContactCheckbox">
                {outreachModalBiz.savedLeadId
                  ? 'Automatically log this WhatsApp pitch in the CRM Contact History & set status to Contacted.'
                  : 'Automatically save this business to Outreach CRM & record this WhatsApp pitch.'}
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={() => setOutreachModalBiz(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="btn btn-success fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
              >
                <FaWhatsapp size={18} />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LEAD DETAILS, CONTACT HISTORY & FOLLOW-UP MANAGER */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="ry-card p-4 p-md-5 rounded-4 shadow-lg w-100 overflow-auto"
            style={{
              maxWidth: 860,
              maxHeight: '94vh',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-start justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className={statusBadgeMap[selectedLead.status] || 'badge bg-secondary'} style={{ fontSize: '0.78rem' }}>
                    {selectedLead.status}
                  </span>
                  <span className="badge bg-primary bg-opacity-15 text-primary small">
                    {selectedLead.category}
                  </span>
                </div>
                <h3 className="fw-bold mb-1 text-white">{selectedLead.businessName}</h3>
                <div className="small text-muted d-flex align-items-center gap-2">
                  <span>📍 {selectedLead.address || selectedLead.location}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedLead(null)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Quick Contact & Links Strip */}
            <div className="p-3 rounded-3 bg-surface border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex flex-wrap align-items-center gap-3 small">
                {selectedLead.phone && (
                  <div className="d-flex align-items-center gap-1.5">
                    <FaPhoneAlt className="text-success" size={13} />
                    <a href={`tel:${selectedLead.phone}`} className="text-light text-decoration-none fw-bold">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}

                {selectedLead.website ? (
                  <div className="d-flex align-items-center gap-1.5">
                    <FaGlobe className="text-primary" size={13} />
                    <a
                      href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-decoration-none"
                    >
                      {selectedLead.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                ) : (
                  <span className="text-warning small">⚠️ No Website Listed</span>
                )}

                {selectedLead.googleMapsUrl && (
                  <a
                    href={selectedLead.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="small text-muted text-decoration-none d-flex align-items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                {selectedLead.phone && (
                  <button
                    type="button"
                    onClick={() => openWhatsAppModal({ ...selectedLead, savedLeadId: selectedLead._id })}
                    className="btn btn-success btn-sm d-flex align-items-center gap-1.5 fw-bold"
                  >
                    <FaWhatsapp size={14} />
                    <span>WhatsApp Pitch</span>
                  </button>
                )}
              </div>
            </div>

            {/* Two-Column Layout */}
            <div className="row g-4 mb-4">
              {/* Left Column: Status, Follow-up & Notes */}
              <div className="col-lg-6">
                <div className="p-3.5 rounded-3 border bg-surface h-100">
                  <h6 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                    <FaCalendarAlt /> Pipeline & Follow-Up Scheduling
                  </h6>

                  {/* Status Dropdown */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Lead Status</label>
                    <select
                      className="form-select-ry"
                      value={selectedLead.status}
                      onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    >
                      {LEAD_STATUSES.filter((s) => s !== 'All').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assignee (if Owner/Admin) */}
                  {isOwnerOrAdmin && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Assign to Employee</label>
                      <select
                        className="form-select-ry"
                        value={selectedLead.assignedTo?._id || selectedLead.assignedTo || 'unassigned'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const found = teamMembers.find((m) => m._id === val);
                          setSelectedLead({
                            ...selectedLead,
                            assignedTo: val === 'unassigned' ? null : val,
                            assignedToName: found ? found.name : 'Unassigned',
                          });
                        }}
                      >
                        <option value="unassigned">Unassigned</option>
                        {teamMembers.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name} ({m.role === 'employee' ? 'Staff' : 'Admin'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Follow-up Date */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Next Follow-Up Date</label>
                    <input
                      type="date"
                      className="form-control-ry"
                      value={
                        selectedLead.followUpDate
                          ? new Date(selectedLead.followUpDate).toISOString().slice(0, 10)
                          : ''
                      }
                      onChange={(e) =>
                        setSelectedLead({ ...selectedLead, followUpDate: e.target.value ? new Date(e.target.value) : null })
                      }
                    />
                  </div>

                  {/* Follow-up Notes */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Follow-Up Reminder Notes</label>
                    <input
                      type="text"
                      className="form-control-ry"
                      placeholder="e.g. Call back at 3 PM to speak with director"
                      value={selectedLead.followUpNotes || ''}
                      onChange={(e) =>
                        setSelectedLead({ ...selectedLead, followUpNotes: e.target.value })
                      }
                    />
                  </div>

                  {/* Internal Notes */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Internal Private Notes</label>
                    <textarea
                      rows="3"
                      className="form-control-ry"
                      placeholder="Add discussion notes, business owner background, budget constraints..."
                      value={selectedLead.internalNotes || ''}
                      onChange={(e) =>
                        setSelectedLead({ ...selectedLead, internalNotes: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="button"
                    disabled={updatingLead}
                    onClick={handleSaveLeadDetails}
                    className="btn btn-primary btn-sm fw-bold px-3"
                  >
                    {updatingLead ? 'Saving...' : 'Save Lead Details'}
                  </button>
                </div>
              </div>

              {/* Right Column: Record Contact Attempt & History Log */}
              <div className="col-lg-6">
                <div className="p-3.5 rounded-3 border bg-surface h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                      <FaHistory /> Record Contact Attempt
                    </h6>

                    <form onSubmit={handleRecordAttempt} className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label small fw-bold">Method</label>
                          <select
                            className="form-select-ry"
                            value={newAttemptType}
                            onChange={(e) => setNewAttemptType(e.target.value)}
                          >
                            <option value="Call">Call</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-bold">Outcome</label>
                          <select
                            className="form-select-ry"
                            value={newAttemptOutcome}
                            onChange={(e) => setNewAttemptOutcome(e.target.value)}
                          >
                            <option value="Connected">Connected</option>
                            <option value="No Answer">No Answer</option>
                            <option value="Interested">Interested</option>
                            <option value="Follow-up Requested">Follow-up Requested</option>
                            <option value="Proposal Requested">Proposal Requested</option>
                            <option value="Declined">Declined</option>
                            <option value="Wrong Number">Wrong Number</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-2">
                        <input
                          type="text"
                          required
                          className="form-control-ry"
                          placeholder="What did you discuss? (e.g. Spoke to manager, interested in ₹5,999 package)"
                          value={newAttemptNotes}
                          onChange={(e) => setNewAttemptNotes(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingAttempt}
                        className="btn btn-outline-primary btn-sm fw-bold w-100 py-1.5"
                      >
                        {savingAttempt ? 'Logging...' : '+ Log Contact Attempt'}
                      </button>
                    </form>

                    {/* Timeline History Log */}
                    <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                      Contact Audit Trail ({selectedLead.contactAttempts?.length || 0})
                    </div>

                    <div className="overflow-auto pe-1" style={{ maxHeight: '220px' }}>
                      {selectedLead.contactAttempts?.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {selectedLead.contactAttempts.map((att, i) => (
                            <div key={i} className="p-2.5 rounded-2 bg-card border small">
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <span className="fw-bold text-light">
                                  {att.type} •{' '}
                                  <span className="badge bg-primary bg-opacity-20 text-primary">
                                    {att.outcome}
                                  </span>
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                  {new Date(att.date).toLocaleString()}
                                </span>
                              </div>
                              <p className="mb-0 text-secondary" style={{ fontSize: '0.82rem' }}>
                                {att.notes}
                              </p>
                              {att.performedByName && (
                                <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                  Logged by: {att.performedByName}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted small text-center py-3">
                          No contact attempts recorded yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-top mt-3" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="small text-muted">
                      Created: {new Date(selectedLead.createdAt).toLocaleDateString()} by {selectedLead.createdByName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
              {isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLead._id)}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1.5"
                >
                  <FaTrash size={12} />
                  <span>Delete Lead</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-ry-primary btn-sm px-4 ms-auto"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeadFinder;
