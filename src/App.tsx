import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper';
import { Router } from './router';

function App() {
  return (
    <ErrorBoundaryWrapper name="app">
      <HelmetProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;