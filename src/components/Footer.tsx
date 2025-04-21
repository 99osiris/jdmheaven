import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-midnight text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <img 
                src="https://i.ibb.co/xqGpwr81/Chat-GPT-Image-4-avr-2025-15-16-24.png" 
                alt="JDM HEAVEN" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400">
              Your gateway to authentic Japanese performance cars in Europe. 
              Premium imports, expert service, passion delivered.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-racing-red transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-racing-red transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-racing-red transition">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-zen">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/inventory" className="text-gray-400 hover:text-racing-red transition">
                  Available Cars
                </Link>
              </li>
              <li>
                <Link to="/import-process" className="text-gray-400 hover:text-racing-red transition">
                  Import Process
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-racing-red transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-racing-red transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-racing-red transition">
                  JDM Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-racing-red transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-zen">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-racing-red" />
                <span className="text-gray-400">
                  129 Boulevard de Grenelle<br />
                  Paris, France 75015
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-racing-red" />
                <span className="text-gray-400">+33 7 84 94 80 24</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-racing-red" />
                <span className="text-gray-400">sales@jdmheaven.club</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-6">
            <h4 className="text-lg font-zen">Business Hours</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-racing-red flex-shrink-0 mt-1" />
                <div className="text-gray-400">
                  <p className="font-zen text-white">Weekdays</p>
                  <p>09:00 - 18:00</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-racing-red flex-shrink-0 mt-1" />
                <div className="text-gray-400">
                  <p className="font-zen text-white">Saturday</p>
                  <p>10:00 - 16:00</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-racing-red flex-shrink-0 mt-1" />
                <div className="text-gray-400">
                  <p className="font-zen text-white">Sunday</p>
                  <p>Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} JDM HEAVEN. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-racing-red text-sm transition">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-racing-red text-sm transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;