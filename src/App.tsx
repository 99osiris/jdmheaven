import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toast } from './components/Toast';
import { ErrorFallback } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ImportProcessPage from './pages/ImportProcessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import WishlistPage from './pages/dashboard/WishlistPage';
import ComparisonsPage from './pages/dashboard/ComparisonsPage';
import AlertsPage from './pages/dashboard/AlertsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ComparisonPage from './pages/ComparisonPage';
import CustomRequestPage from './pages/CustomRequestPage';
import VinDecoderPage from './pages/VinDecoderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryManager from './pages/admin/InventoryManager';
import BlogManager from './pages/admin/BlogManager';
import UserManager from './pages/admin/UserManager';
import RequestManager from './pages/admin/RequestManager';
import MessageManager from './pages/admin/MessageManager';
import SystemSettings from './pages/admin/SystemSettings';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="min-h-screen bg-white">
              <Toast />
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/import-process" element={<ImportProcessPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/wishlist" element={<WishlistPage />} />
                <Route path="/dashboard/comparisons" element={<ComparisonsPage />} />
                <Route path="/dashboard/alerts" element={<AlertsPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                
                <Route path="/comparison/:id" element={<ComparisonPage />} />
                <Route path="/custom-request" element={<CustomRequestPage />} />
                <Route path="/vin-decoder" element={<VinDecoderPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/inventory" element={<AdminRoute><InventoryManager /></AdminRoute>} />
                <Route path="/admin/blog" element={<AdminRoute><BlogManager /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManager /></AdminRoute>} />
                <Route path="/admin/requests" element={<AdminRoute><RequestManager /></AdminRoute>} />
                <Route path="/admin/messages" element={<AdminRoute><MessageManager /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
              </Routes>
              <Footer />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;