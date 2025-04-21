import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Heart, 
  Car, 
  Bell, 
  Settings, 
  LogOut,
  BarChart,
  Users,
  FileText,
  MessageSquare,
  ShoppingBag,
  Sun,
  Moon,
  Globe
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isStaff = user?.user_metadata?.role === 'staff';

  const userMenuItems = [
    { icon: <Heart className="w-5 h-5" />, label: t('wishlist'), href: '/dashboard/wishlist' },
    { icon: <Car className="w-5 h-5" />, label: t('comparisons'), href: '/dashboard/comparisons' },
    { icon: <Bell className="w-5 h-5" />, label: t('alerts'), href: '/dashboard/alerts' },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), href: '/dashboard/settings' },
  ];

  const staffMenuItems = [
    { icon: <Car className="w-5 h-5" />, label: 'Inventory', href: '/admin/inventory' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Requests', href: '/admin/requests' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', href: '/admin/messages' },
  ];

  const adminMenuItems = [
    { icon: <BarChart className="w-5 h-5" />, label: 'Dashboard', href: '/admin' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', href: '/admin/users' },
    { icon: <FileText className="w-5 h-5" />, label: 'Blog', href: '/admin/blog' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className={`min-h-screen pt-20 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-8">
            <div className={`shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <span className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="font-zen text-xl">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
              </div>

              <nav className="space-y-1">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-4 py-2 ${
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-racing-red`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} hover:text-racing-red`
                    } transition rounded-sm`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}

                {(isStaff || isAdmin) && (
                  <>
                    <div className={`border-t border-gray-200 my-4 pt-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                      <h3 className={`px-4 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                        Staff
                      </h3>
                      {staffMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`flex items-center px-4 py-2 ${
                            location.pathname === item.href
                              ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-racing-red`
                              : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} hover:text-racing-red`
                          } transition rounded-sm`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {isAdmin && (
                  <>
                    <div className={`border-t border-gray-200 my-4 pt-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                      <h3 className={`px-4 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                        Admin
                      </h3>
                      {adminMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`flex items-center px-4 py-2 ${
                            location.pathname === item.href
                              ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-racing-red`
                              : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} hover:text-racing-red`
                          } transition rounded-sm`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={() => signOut()}
                  className={`flex items-center px-4 py-2 w-full ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } hover:text-racing-red transition rounded-sm`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">{t('logout')}</span>
                </button>
              </nav>
            </div>
            
            {/* Quick Settings */}
            <div className={`shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                <div className="flex space-x-2">
                  {['en', 'nl', 'de', 'fr'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as any)}
                      className={`w-8 h-8 flex items-center justify-center ${
                        language === lang 
                          ? 'bg-racing-red text-white' 
                          : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                      }`}
                      aria-label={`Switch to ${lang} language`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};