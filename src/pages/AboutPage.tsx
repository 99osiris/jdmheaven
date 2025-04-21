import React from 'react';
import { Users, Trophy, PenTool as Tool } from 'lucide-react';
import BackButton from '../components/BackButton';

const AboutPage = () => {
  const team = [
    {
      name: "Akira Tanaka",
      role: "Founder & Lead Vehicle Specialist",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80",
      bio: "15+ years experience in JDM imports and vehicle assessment"
    },
    {
      name: "Sophie Laurent",
      role: "Import Operations Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      bio: "Expert in European vehicle compliance and customs"
    },
    {
      name: "Marcus Berg",
      role: "Head of Technical Services",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      bio: "Specialist in performance tuning and mechanical modifications"
    }
  ];

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">About JDM HEAVEN</h1>
          <p className="text-xl text-gray-300">Fueled by Passion. Driven by Precision.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-zen text-midnight mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded by JDM enthusiasts, we've built our reputation on bringing authentic Japanese 
              performance cars to European roads. Our journey began with a simple passion for iconic 
              Japanese machines and has evolved into a premium import service.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <span className="block text-4xl font-zen text-racing-red">1500+</span>
                <span className="text-gray-600">Cars Imported</span>
              </div>
              <div>
                <span className="block text-4xl font-zen text-racing-red">15+</span>
                <span className="text-gray-600">Years Experience</span>
              </div>
              <div>
                <span className="block text-4xl font-zen text-racing-red">98%</span>
                <span className="text-gray-600">Client Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="relative h-96">
            <img
              src="https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80"
              alt="Our showroom"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-zen text-midnight mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-zen text-midnight mb-2">{member.name}</h3>
                <p className="text-racing-red font-zen mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-24">
          <h2 className="text-3xl font-zen text-midnight mb-6">Visit Our Showroom</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience our collection of premium JDM vehicles in person. Our Paris showroom features a rotating selection of our finest imports, with expert staff available to answer all your questions.
          </p>
          <div className="bg-gray-100 p-6 inline-block">
            <p className="font-zen text-midnight">JDM HEAVEN</p>
            <p className="text-gray-600">129 Boulevard de Grenelle</p>
            <p className="text-gray-600">Paris, France 75015</p>
            <p className="text-gray-600 mt-2">Email: sales@jdmheaven.club</p>
            <p className="text-gray-600">Phone: +33 7 84 94 80 24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;