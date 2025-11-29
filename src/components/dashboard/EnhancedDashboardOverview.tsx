import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../contexts/AccountContext';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { Card } from '../ui/Card';
import { 
  Heart, 
  Car, 
  ShoppingCart, 
  TrendingUp, 
  Search,
  Bell,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SkeletonCard } from '../ui/Skeleton';

export const EnhancedDashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistCount, cartCount } = useAccount();
  const [loading, setLoading] = React.useState(false);

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Wishlist Items',
      value: wishlistCount || 0,
      change: 12,
      changeLabel: 'from last month',
      icon: Heart,
      trend: 'up' as const,
      glow: true,
    },
    {
      title: 'Active Inquiries',
      value: cartCount || 0,
      change: 5,
      changeLabel: 'pending',
      icon: ShoppingCart,
      trend: 'up' as const,
    },
    {
      title: 'Saved Comparisons',
      value: 3,
      change: 1,
      changeLabel: 'new',
      icon: Car,
      trend: 'up' as const,
    },
    {
      title: 'Price Alerts',
      value: 2,
      change: 0,
      changeLabel: 'active',
      icon: Bell,
      trend: 'neutral' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Browse Inventory',
      description: 'Explore our JDM collection',
      icon: Search,
      onClick: () => navigate('/inventory'),
      variant: 'primary' as const,
      glow: true,
    },
    {
      title: 'View Wishlist',
      description: 'Your saved favorites',
      icon: Heart,
      onClick: () => navigate('/dashboard/wishlist'),
      variant: 'secondary' as const,
    },
    {
      title: 'Compare Cars',
      description: 'Side-by-side comparison',
      icon: Car,
      onClick: () => navigate('/dashboard/comparisons'),
      variant: 'secondary' as const,
    },
    {
      title: 'Manage Alerts',
      description: 'Price & stock notifications',
      icon: Bell,
      onClick: () => navigate('/dashboard/alerts'),
      variant: 'secondary' as const,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-zen font-bold mb-2">Welcome Back</h1>
        <p className="text-text-secondary">
          Here's what's happening with your JDM HEAVEN account
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              custom={index}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-zen font-bold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              variants={itemVariants}
              custom={index}
            >
              <QuickActionCard {...action} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-zen font-bold">Recent Activity</h2>
            <button
              onClick={() => navigate('/dashboard/alerts')}
              className="flex items-center gap-2 text-racing-red hover:text-racing-red-light transition-fast text-sm font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {/* Mock activity items */}
            {[
              { type: 'wishlist', message: 'Added Nissan Skyline GT-R to wishlist', time: '2 hours ago' },
              { type: 'inquiry', message: 'Submitted inquiry for Toyota Supra', time: '1 day ago' },
              { type: 'alert', message: 'Price alert: Honda NSX price updated', time: '2 days ago' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-midnight-lighter rounded-none hover:bg-charcoal transition-fast"
              >
                <div className="w-10 h-10 rounded-none bg-racing-red-alpha flex items-center justify-center flex-shrink-0">
                  {activity.type === 'wishlist' && <Heart className="w-5 h-5 text-racing-red" />}
                  {activity.type === 'inquiry' && <ShoppingCart className="w-5 h-5 text-racing-red" />}
                  {activity.type === 'alert' && <Bell className="w-5 h-5 text-racing-red" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium">{activity.message}</p>
                  <p className="text-sm text-text-tertiary mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

