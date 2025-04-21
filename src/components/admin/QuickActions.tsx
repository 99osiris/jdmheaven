import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, FileText, Users, ShoppingBag, MessageSquare, Settings } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Car className="w-8 h-8 text-racing-red" />,
      title: 'Inventory Management',
      description: 'Add, edit, and manage vehicle listings',
      path: '/admin/inventory',
    },
    {
      icon: <FileText className="w-8 h-8 text-racing-red" />,
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      path: '/admin/blog',
    },
    {
      icon: <Users className="w-8 h-8 text-racing-red" />,
      title: 'User Management',
      description: 'Manage user accounts and roles',
      path: '/admin/users',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-racing-red" />,
      title: 'Custom Requests',
      description: 'View and manage custom car requests',
      path: '/admin/requests',
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-racing-red" />,
      title: 'Contact Messages',
      description: 'View and respond to contact form submissions',
      path: '/admin/messages',
    },
    {
      icon: <Settings className="w-8 h-8 text-racing-red" />,
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      path: '/admin/settings',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {actions.map((action) => (
        <button
          key={action.path}
          onClick={() => navigate(action.path)}
          className="bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 text-left border border-gray-100 hover:border-racing-red"
        >
          <div className="mb-4">
            {action.icon}
          </div>
          <h2 className="text-xl font-zen text-midnight mb-2">
            {action.title}
          </h2>
          <p className="text-gray-600">{action.description}</p>
        </button>
      ))}
    </div>
  );
};