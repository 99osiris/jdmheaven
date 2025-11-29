import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper';
import { LoadingState } from './components/LoadingState';
import { useAuth } from './contexts/AuthContext';
import { SupabaseTest } from './components/SupabaseTest';

// Layout
const RootLayout = React.lazy(() => import('./layouts/RootLayout'));

// Public Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const InventoryPage = React.lazy(() => import('./pages/InventoryPage'));
const ImportProcessPage = React.lazy(() => import('./pages/ImportProcessPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const VinDecoderPage = React.lazy(() => import('./pages/VinDecoderPage'));
const CustomRequestPage = React.lazy(() => import('./pages/CustomRequestPage'));

// Dashboard Pages
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const WishlistPage = React.lazy(() => import('./pages/dashboard/WishlistPage'));
const ComparisonsPage = React.lazy(() => import('./pages/dashboard/ComparisonsPage'));
const AlertsPage = React.lazy(() => import('./pages/dashboard/AlertsPage'));
const SettingsPage = React.lazy(() => import('./pages/dashboard/SettingsPage'));
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const InventoryManager = React.lazy(() => import('./pages/admin/InventoryManager'));
const BlogManager = React.lazy(() => import('./pages/admin/BlogManager'));
const UserManager = React.lazy(() => import('./pages/admin/UserManager'));
const RequestManager = React.lazy(() => import('./pages/admin/RequestManager'));
const MessageManager = React.lazy(() => import('./pages/admin/MessageManager'));
const SystemSettings = React.lazy(() => import('./pages/admin/SystemSettings'));

// Auth Guard Component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState fullScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Admin Guard Component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState fullScreen message="Checking authorization..." />;
  }

  if (!user || user.user_metadata.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Wrap component with Suspense and ErrorBoundary
const withSuspense = (Component: React.ComponentType, name: string): React.ComponentType => {
  const WrappedComponent = () => (
    <ErrorBoundaryWrapper name={name}>
      <Suspense fallback={<LoadingState fullScreen message={`Loading ${name}...`} />}>
        <Component />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
  WrappedComponent.displayName = `withSuspense(${name})`;
  return WrappedComponent;
};

// Helper to create route element
const createRouteElement = (Component: React.ComponentType, name: string) => {
  const Wrapped = withSuspense(Component, name);
  return <Wrapped />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: createRouteElement(RootLayout, 'layout'),
    children: [
      { index: true, element: createRouteElement(HomePage, 'home') },
      { path: 'inventory', element: createRouteElement(InventoryPage, 'inventory') },
      { path: 'import-process', element: createRouteElement(ImportProcessPage, 'import-process') },
      { path: 'about', element: createRouteElement(AboutPage, 'about') },
      { path: 'contact', element: createRouteElement(ContactPage, 'contact') },
      { path: 'blog', element: createRouteElement(BlogPage, 'blog') },
      { path: 'blog/:slug', element: createRouteElement(BlogPostPage, 'blog-post') },
      { path: 'privacy-policy', element: createRouteElement(PrivacyPolicyPage, 'privacy') },
      { path: 'terms-of-service', element: createRouteElement(TermsOfServicePage, 'terms') },
      { path: 'auth', element: createRouteElement(AuthPage, 'auth') },
      { path: 'vin-decoder', element: createRouteElement(VinDecoderPage, 'vin-decoder') },
      { 
        path: 'custom-request', 
        element: <AuthGuard>{createRouteElement(CustomRequestPage, 'custom-request')}</AuthGuard> 
      },
      { 
        path: 'dashboard',
        element: <AuthGuard>{createRouteElement(DashboardPage, 'dashboard')}</AuthGuard>
      },
      { 
        path: 'dashboard/wishlist',
        element: <AuthGuard>{createRouteElement(WishlistPage, 'wishlist')}</AuthGuard>
      },
      { 
        path: 'dashboard/comparisons',
        element: <AuthGuard>{createRouteElement(ComparisonsPage, 'comparisons')}</AuthGuard>
      },
      { 
        path: 'dashboard/alerts',
        element: <AuthGuard>{createRouteElement(AlertsPage, 'alerts')}</AuthGuard>
      },
      { 
        path: 'dashboard/settings',
        element: <AuthGuard>{createRouteElement(SettingsPage, 'settings')}</AuthGuard>
      },
      { 
        path: 'comparison/:id',
        element: <AuthGuard>{createRouteElement(ComparisonPage, 'comparison')}</AuthGuard>
      },
      
      // Admin Routes
      { 
        path: 'admin',
        element: <AdminGuard>{createRouteElement(AdminDashboard, 'admin-dashboard')}</AdminGuard>
      },
      { 
        path: 'admin/supabase-test',
        element: <AdminGuard><SupabaseTest /></AdminGuard>
      },
      { 
        path: 'admin/inventory',
        element: <AdminGuard>{createRouteElement(InventoryManager, 'inventory-manager')}</AdminGuard>
      },
      { 
        path: 'admin/blog',
        element: <AdminGuard>{createRouteElement(BlogManager, 'blog-manager')}</AdminGuard>
      },
      { 
        path: 'admin/users',
        element: <AdminGuard>{createRouteElement(UserManager, 'user-manager')}</AdminGuard>
      },
      { 
        path: 'admin/requests',
        element: <AdminGuard>{createRouteElement(RequestManager, 'request-manager')}</AdminGuard>
      },
      { 
        path: 'admin/messages',
        element: <AdminGuard>{createRouteElement(MessageManager, 'message-manager')}</AdminGuard>
      },
      { 
        path: 'admin/settings',
        element: <AdminGuard>{createRouteElement(SystemSettings, 'system-settings')}</AdminGuard>
      }
    ]
  }
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
}; 