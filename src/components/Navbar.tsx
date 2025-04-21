import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, X, Phone, Car, Settings, Users, FileText, MessageSquare, ShoppingBag, ChevronDown, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const carMakes = [
  { name: 'Nissan', models: ['Skyline GT-R', 'Silvia', '180SX', '240Z', 'Fairlady Z'] },
  { name: 'Toyota', models: ['Supra', 'AE86', 'Chaser', 'Mark II', 'Celica'] },
  { name: 'Honda', models: ['NSX', 'Integra Type R', 'Civic Type R', 'S2000', 'Prelude'] },
  { name: 'Mazda', models: ['RX-7', 'RX-8', 'MX-5', 'Cosmo', 'RX-3'] },
  { name: 'Mitsubishi', models: ['Lancer Evolution', 'GTO', '3000GT', 'Eclipse', 'Galant VR-4'] },
  { name: 'Subaru', models: ['Impreza WRX STI', 'Legacy', 'BRZ', 'SVX', 'Alcyone'] }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout>();
  const adminCloseTimeout = useRef<NodeJS.Timeout>();
  const { user } = useAuth();

  const isAdmin = user?.user_metadata?.role === 'admin';

  const adminLinks = [
    { to: '/admin', icon: <Settings size={16} />, text: 'Dashboard' },
    { to: '/admin/inventory', icon: <Car size={16} />, text: 'Inventory' },
    { to: '/admin/blog', icon: <FileText size={16} />, text: 'Blog' },
    { to: '/admin/users', icon: <Users size={16} />, text: 'Users' },
    { to: '/admin/requests', icon: <ShoppingBag size={16} />, text: 'Requests' },
    { to: '/admin/messages', icon: <MessageSquare size={16} />, text: 'Messages' },
  ];

  const handleInventoryMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setIsInventoryOpen(true);
  };

  const handleInventoryMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      if (!activeSubmenu) {
        setIsInventoryOpen(false);
      }
    }, 100);
  };

  const handleSubmenuMouseEnter = (make: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setActiveSubmenu(make);
  };

  const handleSubmenuMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsInventoryOpen(false);
      setActiveSubmenu(null);
    }, 100);
  };

  const handleAdminMouseEnter = () => {
    if (adminCloseTimeout.current) {
      clearTimeout(adminCloseTimeout.current);
    }
    setIsAdminMenuOpen(true);
  };

  const handleAdminMouseLeave = () => {
    adminCloseTimeout.current = setTimeout(() => {
      setIsAdminMenuOpen(false);
    }, 100);
  };

  return (
    <nav className="bg-midnight shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.ibb.co/xqGpwr81/Chat-GPT-Image-4-avr-2025-15-16-24.png"
                alt="JDM HEAVEN"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-racing-red transition font-zen text-sm">Home</Link>
            
            {/* Inventory Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={handleInventoryMouseEnter}
              onMouseLeave={handleInventoryMouseLeave}
            >
              <button 
                className="flex items-center text-white group-hover:text-racing-red transition font-zen text-sm"
              >
                Inventory
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  isInventoryOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isInventoryOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-midnight shadow-lg py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="grid grid-cols-1 gap-1">
                    {carMakes.map((make) => (
                      <div 
                        key={make.name} 
                        className="relative group/submenu"
                        onMouseEnter={() => handleSubmenuMouseEnter(make.name)}
                        onMouseLeave={handleSubmenuMouseLeave}
                      >
                        <Link
                          to={`/inventory?search=${encodeURIComponent(make.name)}`}
                          className="block px-4 py-2 text-white hover:text-racing-red hover:bg-gray-800 transition font-zen text-sm"
                        >
                          {make.name}
                        </Link>
                        {activeSubmenu === make.name && (
                          <div 
                            className="absolute left-full top-0 w-48 bg-midnight shadow-lg py-2"
                            style={{ marginLeft: '1px' }}
                          >
                            {make.models.map((model) => (
                              <Link
                                key={model}
                                to={`/inventory?search=${encodeURIComponent(`${make.name} ${model}`)}`}
                                className="block px-4 py-2 text-white hover:text-racing-red hover:bg-gray-800 transition text-sm"
                              >
                                {model}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-700">
                      <Link
                        to="/inventory"
                        className="text-racing-red hover:text-red-700 transition font-zen text-sm"
                      >
                        View All Cars
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/import-process" className="text-white hover:text-racing-red transition font-zen text-sm">Import Process</Link>
            <Link to="/gallery" className="text-white hover:text-racing-red transition font-zen text-sm">Gallery</Link>
            <Link to="/about" className="text-white hover:text-racing-red transition font-zen text-sm">About</Link>
            <Link to="/blog" className="text-white hover:text-racing-red transition font-zen text-sm">Blog</Link>
            <Link to="/contact" className="text-white hover:text-racing-red transition font-zen text-sm">Contact</Link>
            {user ? (
              <>
                <Link to="/custom-request" className="flex items-center text-racing-red hover:text-white transition font-zen text-sm">
                  <Car size={16} className="mr-2" />
                  Request Car
                </Link>
                <div 
                  className="relative"
                  onMouseEnter={handleAdminMouseEnter}
                  onMouseLeave={handleAdminMouseLeave}
                >
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-racing-red transition font-zen text-sm flex items-center"
                  >
                    Dashboard
                    {isAdmin && (
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isAdminMenuOpen ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                  {isAdmin && isAdminMenuOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-48 bg-midnight shadow-lg py-2 z-50"
                    >
                      {adminLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          {link.icon}
                          <span className="ml-2">{link.text}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth" className="text-racing-red hover:text-white transition font-zen text-sm">Sign In</Link>
            )}
            <a href="tel:+33784948024" className="flex items-center text-racing-red hover:text-white transition font-zen text-sm">
              <Phone size={16} className="mr-2" />
              +33 7 84 94 80 24
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-racing-red"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-midnight">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Home</Link>
              <Link to="/inventory" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Inventory</Link>
              {carMakes.map((make) => (
                <Link
                  key={make.name}
                  to={`/inventory?search=${encodeURIComponent(make.name)}`}
                  className="block px-6 py-1 text-gray-300 hover:text-racing-red font-zen text-sm"
                >
                  {make.name}
                </Link>
              ))}
              <Link to="/import-process" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Import Process</Link>
              <Link to="/gallery" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">
                <Image size={16} className="inline mr-2" />
                Gallery
              </Link>
              <Link to="/about" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">About</Link>
              <Link to="/blog" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Blog</Link>
              <Link to="/contact" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Contact</Link>
              {user ? (
                <>
                  <Link to="/custom-request" className="block px-3 py-2 text-racing-red hover:text-white font-zen text-sm">Request Car</Link>
                  <Link to="/dashboard" className="block px-3 py-2 text-white hover:text-racing-red font-zen text-sm">Dashboard</Link>
                  {isAdmin && adminLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white"
                    >
                      {link.icon}
                      <span className="ml-2">{link.text}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link to="/auth" className="block px-3 py-2 text-racing-red hover:text-white font-zen text-sm">Sign In</Link>
              )}
              <a href="tel:+33784948024" className="flex items-center px-3 py-2 text-racing-red hover:text-white font-zen text-sm">
                <Phone size={16} className="mr-2" />
                +33 7 84 94 80 24
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;