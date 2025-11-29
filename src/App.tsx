import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';
import { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper';
import { Router } from './router';
import { AnalyticsWrapper } from './components/AnalyticsWrapper';

function App() {
  return (
    <ErrorBoundaryWrapper name="app">
      <HelmetProvider>
        <AuthProvider>
          <AccountProvider>
            <Router />
          </AccountProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;