import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Layouts & Guard
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminQuickAccessModal from './components/common/AdminQuickAccessModal';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Industries from './pages/Industries';
import IndustryDetail from './pages/IndustryDetail';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ProjectTracker from './pages/ProjectTracker';
import ProjectStudioPage from './pages/ProjectStudioPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminPricing from './pages/admin/AdminPricing';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTeam from './pages/admin/AdminTeam';
import AdminLeadFinder from './pages/admin/AdminLeadFinder';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <CurrencyProvider>
            <Router>
              <AdminQuickAccessModal />
              <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:slug" element={<ServiceDetail />} />
                  <Route path="industries" element={<Industries />} />
                  <Route path="industries/:slug" element={<IndustryDetail />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="portfolio/:slug" element={<ProjectDetail />} />
                  <Route path="pricing" element={<Pricing />} />
                  <Route path="studio" element={<ProjectStudioPage />} />
                  <Route path="plan" element={<ProjectStudioPage />} />
                  <Route path="track" element={<ProjectTracker />} />
                  <Route path="track/:code" element={<ProjectTracker />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

              {/* Admin Portal Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="lead-finder" element={<AdminLeadFinder />} />
                <Route path="leads" element={<AdminLeadFinder />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="pricing" element={<AdminPricing />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Router>
        </CurrencyProvider>
      </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
