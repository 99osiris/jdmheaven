import React from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from './SEO';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toast } from './Toast';
import { OfflineIndicator } from './OfflineIndicator';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: any;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'JDM HEAVEN - Premium Japanese Car Imports',
  description = 'Premium Japanese performance car imports in Europe. Specializing in Skylines, Supras, RX-7s, and other JDM legends.',
  image = '/logo.png',
  type = 'website',
  schema,
}) => {
  return (
    <>
      <SEO
        title={title}
        description={description}
        image={image}
        type={type}
        schema={schema}
      />
      <Toast />
      <OfflineIndicator />
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};