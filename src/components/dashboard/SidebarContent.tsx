import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Home,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarContentProps {
  onLinkClick?: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ onLinkClick }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isStaff = user?.user_metadata?.role === 'staff';

  const userMenuItems = [
    { icon: Home, label: 'Overview', href: '/dashboard', badge: null },
    { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist', badge: null },
    { icon: Car, label: 'Comparisons', href: '/dashboard/comparisons', badge: null },
    { icon: Bell, label: 'Alerts', href: '/dashboard/alerts', badge: null },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', badge: null },
  ];

  const staffMenuItems = [
    { icon: Car, label: 'Inventory', href: '/admin/inventory', badge: null },
    { icon: ShoppingBag, label: 'Requests', href: '/admin/requests', badge: null },
    { icon: MessageSquare, label: 'Messages', href: '/admin/messages', badge: null },
  ];

  const adminMenuItems = [
    { icon: BarChart, label: 'Dashboard', href: '/admin', badge: null },
    { icon: Users, label: 'Users', href: '/admin/users', badge: null },
    { icon: FileText, label: 'Blog', href: '/admin/blog', badge: null },
    { icon: Settings, label: 'Settings', href: '/admin/settings', badge: null },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      {/* User Profile Section */}
      <div className="p-6 border-b border-charcoal">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-none bg-gradient-racing flex items-center justify-center text-2xl font-zen font-bold">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.full_name}
                className="w-16 h-16 rounded-none object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-zen text-lg truncate">
              {user?.user_metadata?.full_name || 'User'}
            </h2>
            <p className="text-sm text-text-secondary truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* User Menu */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-4 mb-2">
            Account
          </h3>
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-fast group ${
                  active
                    ? 'bg-racing-red text-white shadow-glow'
                    : 'text-text-secondary hover:bg-midnight-lighter hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-racing-red text-white rounded-none">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </div>

        {/* Staff Menu */}
        {(isStaff || isAdmin) && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-4 mb-2">
              Staff
            </h3>
            {staffMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-none transition-fast ${
                    active
                      ? 'bg-racing-red text-white shadow-glow'
                      : 'text-text-secondary hover:bg-midnight-lighter hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </div>
        )}

        {/* Admin Menu */}
        {isAdmin && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-4 mb-2">
              Admin
            </h3>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-none transition-fast ${
                    active
                      ? 'bg-racing-red text-white shadow-glow'
                      : 'text-text-secondary hover:bg-midnight-lighter hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-charcoal space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-text-secondary hover:bg-midnight-lighter hover:text-text-primary transition-fast"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="flex-1 text-left font-medium">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-text-secondary hover:bg-error/20 hover:text-error transition-fast"
        >
          <LogOut className="w-5 h-5" />
          <span className="flex-1 text-left font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );
};

