import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ErrorBoundaryWrapper } from '../components/ErrorBoundaryWrapper';

const RootLayout: React.FC = () => {
  return (
    <>
      <ScrollRestoration />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#121212',
            color: '#fff',
            borderRadius: '0',
          },
        }}
      />
      
      <div className="flex flex-col min-h-screen">
        <ErrorBoundaryWrapper name="navbar">
          <Navbar />
        </ErrorBoundaryWrapper>

        <main className="flex-grow">
          <ErrorBoundaryWrapper name="main-content">
            <Outlet />
          </ErrorBoundaryWrapper>
        </main>

        <ErrorBoundaryWrapper name="footer">
          <Footer />
        </ErrorBoundaryWrapper>
      </div>
    </>
  );
};

export default RootLayout; 