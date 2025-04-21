import React from 'react';
import { Clock, User, Car, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'user' | 'car' | 'message';
  action: string;
  details: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ActivityLogProps {
  activities: Activity[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'car':
        return <Car className="w-5 h-5 text-racing-red" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-none p-6">
      <h3 className="text-xl font-zen text-gray-900 mb-6 flex items-center">
        <Clock className="w-6 h-6 text-racing-red mr-2" />
        Recent Activity
      </h3>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>
              <p className="text-sm text-gray-500">
                {activity.details}
              </p>
              {activity.user && (
                <p className="text-xs text-gray-400 mt-1">
                  by {activity.user.name} ({activity.user.email})
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-sm text-gray-400">
              {new Date(activity.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};