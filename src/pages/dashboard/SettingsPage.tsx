import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SEO } from '../../components/SEO';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/Toast';
import { 
  User, 
  Palette, 
  Globe, 
  Eye, 
  Link as LinkIcon, 
  CreditCard, 
  HelpCircle,
  Shield,
  Settings
} from 'lucide-react';

// Import settings components
import { ThemeSettings } from '../../components/dashboard/ThemeSettings';
import { LanguageSettings } from '../../components/dashboard/LanguageSettings';
import { AccessibilitySettings } from '../../components/dashboard/AccessibilitySettings';
import { IntegrationsSettings } from '../../components/dashboard/IntegrationsSettings';
import { BillingSettings } from '../../components/dashboard/BillingSettings';
import { HelpSupportSettings } from '../../components/dashboard/HelpSupportSettings';
import { DataPrivacySettings } from '../../components/dashboard/DataPrivacySettings';
import { RegionalSettings } from '../../components/dashboard/RegionalSettings';
import { WidgetManager } from '../../components/dashboard/WidgetManager';

const settingsSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  preferred_brands: z.string().optional(),
  marketing_email: z.boolean().default(false),
  marketing_sms: z.boolean().default(false),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;

        // Convert array to string for form
        const formData = {
          ...data,
          preferred_brands: Array.isArray(data.preferred_brands) 
            ? data.preferred_brands.join(', ')
            : data.preferred_brands
        };

        reset(formData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setSaving(true);
      
      // Convert preferred_brands string to array if provided
      const formattedData = {
        ...data,
        preferred_brands: data.preferred_brands 
          ? data.preferred_brands.split(',').map(brand => brand.trim())
          : null
      };

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update(formattedData)
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          // Include other fields that should be in auth metadata
        }
      });

      if (userError) throw userError;

      // Refresh user data to update UI
      await refreshUser();
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 w-1/2"></div>
        <div className="h-10 bg-gray-200 w-3/4"></div>
        <div className="h-10 bg-gray-200 w-1/3"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white shadow-sm p-6">
        <h2 className="text-xl font-zen mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register('full_name')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-racing-red">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone_number')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm p-6">
        <h2 className="text-xl font-zen mb-6">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              {...register('street_address')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              {...register('postal_code')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              {...register('country')}
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm p-6">
        <h2 className="text-xl font-zen mb-6">Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              Preferred Car Brands
            </label>
            <input
              type="text"
              {...register('preferred_brands')}
              placeholder="e.g., Nissan, Toyota, Honda"
              className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('marketing_email')}
                className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
              />
              <span className="ml-2 text-gray-700">
                I want to receive email updates about new cars and offers
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('marketing_sms')}
                className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
              />
              <span className="ml-2 text-gray-700">
                I want to receive SMS notifications about cars I'm interested in
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || saving}
          className="bg-racing-red text-white px-8 py-3 font-zen hover:bg-red-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

const SettingsPage = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || '';

  const settingsLinks = [
    { path: '', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { path: 'language', label: 'Language', icon: <Globe className="w-5 h-5" /> },
    { path: 'accessibility', label: 'Accessibility', icon: <Eye className="w-5 h-5" /> },
    { path: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-5 h-5" /> },
    { path: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
    { path: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
    { path: 'privacy', label: 'Data & Privacy', icon: <Shield className="w-5 h-5" /> },
    { path: 'regional', label: 'Regional', icon: <Globe className="w-5 h-5" /> },
    { path: 'widgets', label: 'Dashboard Widgets', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      <SEO 
        title="Account Settings"
        description="Manage your account settings and preferences"
      />
      
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-zen">Account Settings</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Settings Navigation */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white shadow-sm">
                <nav className="flex flex-col">
                  {settingsLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={`/dashboard/settings/${link.path}`}
                      className={`flex items-center px-4 py-3 border-l-4 ${
                        (currentPath === link.path) || (currentPath === 'settings' && link.path === '')
                          ? 'border-racing-red bg-gray-50 text-racing-red'
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<ProfileSettings />} />
                <Route path="/appearance" element={<ThemeSettings />} />
                <Route path="/language" element={<LanguageSettings />} />
                <Route path="/accessibility" element={<AccessibilitySettings />} />
                <Route path="/integrations" element={<IntegrationsSettings />} />
                <Route path="/billing" element={<BillingSettings />} />
                <Route path="/help" element={<HelpSupportSettings />} />
                <Route path="/privacy" element={<DataPrivacySettings />} />
                <Route path="/regional" element={<RegionalSettings />} />
                <Route path="/widgets" element={<WidgetManager />} />
              </Routes>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SettingsPage;