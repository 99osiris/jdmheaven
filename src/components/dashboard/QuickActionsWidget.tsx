import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Heart, Bell, FileText } from 'lucide-react';

export const QuickActionsWidget: React.FC = () => {
  const actions = [
    {
      icon: <Car className="w-5 h-5 text-racing-red" />,
      title: 'Browse Inventory',
      description: 'Explore our collection',
      link: '/inventory',
    },
    {
      icon: <Heart className="w-5 h-5 text-racing-red" />,
      title: 'Wishlist',
      description: 'View saved cars',
      link: '/dashboard/wishlist',
    },
    {
      icon: <Bell className="w-5 h-5 text-racing-red" />,
      title: 'Request Car',
      description: 'Custom search',
      link: '/custom-request',
    },
    {
      icon: <FileText className="w-5 h-5 text-racing-red" />,
      title: 'Blog',
      description: 'Latest JDM news',
      link: '/blog',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.link}
          className="p-3 border border-gray-100 hover:border-racing-red hover:bg-gray-50 transition"
        >
          <div className="flex items-center mb-2">
            {action.icon}
            <h4 className="font-zen text-sm ml-2">{action.title}</h4>
          </div>
          <p className="text-xs text-gray-500">{action.description}</p>
        </Link>
      ))}
    </div>
  );
};