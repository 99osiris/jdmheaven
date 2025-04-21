import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'default',
}) => {
  const colors = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[type]}`}>
      {status}
    </span>
  );
};