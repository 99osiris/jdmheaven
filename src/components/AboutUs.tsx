import React from 'react';
import { Users, Wrench, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const features = [
    {
      icon: <Users className="w-12 h-12 text-racing-red" />,
      title: 'Direct Sourcing',
      description: 'Japanese auctions, dealer networks, and private sellers',
    },
    {
      icon: <Shield className="w-12 h-12 text-racing-red" />,
      title: 'Hassle-Free Imports',
      description: 'Shipping, customs, and EU compliance—all handled for you',
    },
    {
      icon: <Wrench className="w-12 h-12 text-racing-red" />,
      title: 'Tuned to Perfection',
      description: 'Track-ready or street-legal before delivery',
    },
  ];

  return (
    <section id="about" className="py-20 bg-midnight text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-zen text-racing-red mb-6">Fueled by Passion. Driven by Precision.</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We're not just another import business—we're JDM fanatics. Whether it's the thrill of the touge, 
            the precision of time attack, or the raw power of drift machines, we understand what makes these cars legendary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-zen mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/about" className="inline-flex items-center px-8 py-4 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen">
              Meet the Team
            </Link>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-midnight rounded-none hover:bg-gray-100 transition font-zen">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;