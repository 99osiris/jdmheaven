import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../components/Toast';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newRequestNotifications: boolean;
    newMessageNotifications: boolean;
  };
}

const SystemSettings = () => {
  const { user, refreshUser } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'JDM HEAVEN',
    contactEmail: 'sales@jdmheaven.club',
    phoneNumber: '+33 7 84 94 80 24',
    address: '129 Boulevard de Grenelle, Paris, France 75015',
    businessHours: {
      weekdays: '09:00 - 18:00',
      saturday: '10:00 - 16:00',
      sunday: 'Closed',
    },
    socialMedia: {
      facebook: 'https://facebook.com/jdmheaven',
      instagram: 'https://instagram.com/jdmheaven',
      youtube: 'https://youtube.com/jdmheaven',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      newRequestNotifications: true,
      newMessageNotifications: true,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing settings from database
    const loadSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .eq('id', 'global')
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            throw error;
          }
          // If not found, we'll use the default settings
        } else if (data && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (path: string[], value: string | boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // Store settings in system_settings table
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          id: 'global',
          settings: settings,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setSuccess('Settings updated successfully');
      toast.success('System settings updated');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!user?.user_metadata?.role === 'admin') {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">Unauthorized. Admin access required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20">
        <div className="bg-midnight text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-racing-red mr-4" />
              <div>
                <h1 className="text-4xl font-zen mb-2">System Settings</h1>
                <p className="text-xl text-gray-300">Configure website settings and preferences</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-gray-200 rounded-none"></div>
            <div className="h-40 bg-gray-200 rounded-none"></div>
            <div className="h-40 bg-gray-200 rounded-none"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-racing-red mr-4" />
            <div>
              <h1 className="text-4xl font-zen mb-2">System Settings</h1>
              <p className="text-xl text-gray-300">Configure website settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Settings */}
          <div className="bg-white shadow-lg rounded-none p-6">
            <h2 className="text-xl font-zen text-gray-900 mb-6">Basic Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange(['siteName'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange(['contactEmail'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => handleChange(['phoneNumber'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange(['address'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white shadow-lg rounded-none p-6">
            <h2 className="text-xl font-zen text-gray-900 mb-6">Business Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weekdays
                </label>
                <input
                  type="text"
                  value={settings.businessHours.weekdays}
                  onChange={(e) => handleChange(['businessHours', 'weekdays'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Saturday
                </label>
                <input
                  type="text"
                  value={settings.businessHours.saturday}
                  onChange={(e) => handleChange(['businessHours', 'saturday'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sunday
                </label>
                <input
                  type="text"
                  value={settings.businessHours.sunday}
                  onChange={(e) => handleChange(['businessHours', 'sunday'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white shadow-lg rounded-none p-6">
            <h2 className="text-xl font-zen text-gray-900 mb-6">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleChange(['socialMedia', 'facebook'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleChange(['socialMedia', 'instagram'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={settings.socialMedia.youtube}
                  onChange={(e) => handleChange(['socialMedia', 'youtube'], e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white shadow-lg rounded-none p-6">
            <h2 className="text-xl font-zen text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleChange(['notifications', 'emailNotifications'], e.target.checked)}
                  className="h-4 w-4 text-racing-red border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleChange(['notifications', 'smsNotifications'], e.target.checked)}
                  className="h-4 w-4 text-racing-red border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable SMS notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.newRequestNotifications}
                  onChange={(e) => handleChange(['notifications', 'newRequestNotifications'], e.target.checked)}
                  className="h-4 w-4 text-racing-red border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Notify on new custom requests
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.newMessageNotifications}
                  onChange={(e) => handleChange(['notifications', 'newMessageNotifications'], e.target.checked)}
                  className="h-4 w-4 text-racing-red border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Notify on new contact messages
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-racing-red text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;