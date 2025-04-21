import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { DashboardWidgets } from '../components/dashboard/DashboardWidgets';
import { SEO } from '../components/SEO';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { WidgetProvider } from '../contexts/WidgetContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { UserDataProvider } from '../contexts/UserDataContext';

// Import dashboard pages
import WishlistPage from './dashboard/WishlistPage';
import ComparisonsPage from './dashboard/ComparisonsPage';
import AlertsPage from './dashboard/AlertsPage';
import SettingsPage from './dashboard/SettingsPage';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <WidgetProvider>
          <AccessibilityProvider>
            <UserDataProvider>
              <SEO 
                title="Dashboard"
                description="Manage your JDM HEAVEN account, wishlist, and car alerts"
              />
              
              <Routes>
                <Route path="/" element={
                  <DashboardLayout>
                    <DashboardWidgets />
                  </DashboardLayout>
                } />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/comparisons" element={<ComparisonsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/settings/*" element={<SettingsPage />} />
              </Routes>
            </UserDataProvider>
          </AccessibilityProvider>
        </WidgetProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default DashboardPage;