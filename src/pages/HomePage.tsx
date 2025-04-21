import React from 'react';
import Hero from '../components/Hero';
import { JDMLegendsCarousel } from '../components/JDMLegendsCarousel';
import FeaturedCars from '../components/FeaturedCars';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <JDMLegendsCarousel />
      <FeaturedCars />
      <Services />
      <AboutUs />
      <ContactSection />
    </main>
  );
};

export default HomePage;