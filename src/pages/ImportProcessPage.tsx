import React from 'react';
import { Search, Truck, FileCheck, Home } from 'lucide-react';
import BackButton from '../components/BackButton';
import ShippingCalculator from '../components/ShippingCalculator';

const ImportProcessPage = () => {
  const steps = [
    {
      icon: <Search className="w-16 h-16 text-racing-red" />,
      title: "Choose Your Car",
      description: "Browse our exclusive inventory or request a custom search. Access Japanese car auctions, dealership stock, and private listings.",
      details: [
        "Access to exclusive Japanese auctions",
        "Detailed vehicle history reports",
        "Professional inspection service",
        "Custom car search available"
      ]
    },
    {
      icon: <FileCheck className="w-16 h-16 text-racing-red" />,
      title: "Import & Compliance",
      description: "We handle all paperwork, duties, taxes, and legalities. Including EU road compliance, emissions adjustments, and necessary certifications.",
      details: [
        "Complete customs handling",
        "EU compliance certification",
        "Emissions testing & adjustment",
        "Registration assistance"
      ]
    },
    {
      icon: <Home className="w-16 h-16 text-racing-red" />,
      title: "Delivery to Your Door",
      description: "Your JDM legend arrives fully road-legal and ready to drive. Optional tuning services available for street or track setup.",
      details: [
        "Door-to-door delivery",
        "Final inspection & detailing",
        "Optional performance tuning",
        "Complete documentation handover"
      ]
    }
  ];

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">From Japan's Streets to Your Garage</h1>
          <p className="text-xl text-gray-300">A seamless import process handled by experts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-24">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/3 text-center">
                    {step.icon}
                    <h2 className="text-2xl font-zen text-midnight mt-6 mb-4">{step.title}</h2>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="md:w-2/3 bg-gray-50 p-8">
                    <ul className="space-y-4">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-racing-red mr-4"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ShippingCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProcessPage;