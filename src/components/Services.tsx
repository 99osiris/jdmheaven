import React from 'react';
import { Truck, FileText, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <Truck className="w-12 h-12 text-racing-red" />,
      title: 'Door-to-Door Delivery',
      description: 'Complete shipping service from Japan to your location anywhere in Europe',
    },
    {
      icon: <FileText className="w-12 h-12 text-racing-red" />,
      title: 'Documentation Support',
      description: 'Full assistance with customs clearance and vehicle registration',
    },
    {
      icon: <Shield className="w-12 h-12 text-racing-red" />,
      title: 'Quality Guarantee',
      description: 'Thorough inspection and verification of all vehicles before purchase',
    },
    {
      icon: <Clock className="w-12 h-12 text-racing-red" />,
      title: 'Fast Processing',
      description: 'Efficient handling of your order from selection to delivery',
    },
  ];

  return (
    <section id="services" className="py-20 bg-midnight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-zen text-racing-red mb-4">Our Services</h2>
          <p className="text-lg text-gray-300">Comprehensive import solutions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-black/30 rounded-none border border-racing-red/20"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-zen text-white mb-2">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/import-process"
            className="inline-flex items-center px-8 py-4 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
          >
            Learn More About Our Process
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;