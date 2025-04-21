import React, { useEffect, useState } from 'react';
import { Clock, Heart, Car, Bell } from 'lucide-react';

interface Activity {
  id: string;
  type: 'wishlist' | 'comparison' | 'request' | 'alert';
  title: string;
  description: string;
  timestamp: string;
}

export const ActivityWidget: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'wishlist',
        title: 'Added to Wishlist',
        description: '2002 Nissan Skyline GT-R R34',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'comparison',
        title: 'Created Comparison',
        description: 'Skyline vs Supra',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'request',
        title: 'Custom Request Updated',
        description: 'Status changed to "in progress"',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setActivities(mockActivities);
    setLoading(false);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'wishlist':
        return <Heart className="w-4 h-4 text-racing-red" />;
      case 'comparison':
        return <Car className="w-4 h-4 text-blue-500" />;
      case 'request':
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case 'alert':
        return <Bell className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <h4 className="text-sm font-medium">{activity.title}</h4>
            <p className="text-xs text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatTimestamp(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};