import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import { JDMLegendsCarousel } from '../components/JDMLegendsCarousel';
import FeaturedCars from '../components/FeaturedCars';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ContactSection from '../components/ContactSection';
import { TrustBadges } from '../components/TrustBadges';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>JDM Heaven - Premium Japanese Car Imports</title>
        <meta name="description" content="Your gateway to authentic Japanese performance cars in Europe. Premium imports, expert service, passion delivered." />
      </Helmet>
      <main>
        <Hero />
        <JDMLegendsCarousel />
        <TrustBadges />
        <FeaturedCars />
        <Services />
        <AboutUs />
        <ContactSection />
      </main>
    </>
  );
};

export default HomePage;