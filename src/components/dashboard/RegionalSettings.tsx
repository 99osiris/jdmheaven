import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Globe, Clock } from 'lucide-react';

export const RegionalSettings: React.FC = () => {
  const [timezone, setTimezone] = useLocalStorage<string>('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch this from an API
    // For now, we'll use a subset of common timezones
    const commonTimezones = [
      'Europe/Amsterdam',
      'Europe/Berlin',
      'Europe/London',
      'Europe/Paris',
      'Europe/Rome',
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Asia/Tokyo',
      'Asia/Hong_Kong',
      'Australia/Sydney',
      'Pacific/Auckland',
    ];
    
    // Add the user's current timezone if it's not in the list
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!commonTimezones.includes(currentTimezone)) {
      commonTimezones.push(currentTimezone);
    }
    
    setTimezones(commonTimezones.sort());
    setLoading(false);
  }, []);

  const formatTimezone = (tz: string) => {
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZoneName: 'short',
        timeZone: tz,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);
      const timeZonePart = parts.find(part => part.type === 'timeZoneName');
      return `${tz.replace('_', ' ')} (${timeZonePart?.value || ''})`;
    } catch (error) {
      return tz;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 mb-4"></div>
        <div className="h-4 bg-gray-200 w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">Regional Settings</h3>
      
      <div className="space-y-8">
        {/* Timezone */}
        <div>
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-racing-red mr-2" />
            <h4 className="font-zen">Time Zone</h4>
          </div>
          
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {formatTimezone(tz)}
              </option>
            ))}
          </select>
          
          <p className="text-sm text-gray-500 mt-2">
            Current time: {new Date().toLocaleTimeString([], { timeZone: timezone })}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">
            Your time zone setting affects how dates and times are displayed throughout the application.
          </p>
        </div>
      </div>
    </div>
  );
};