import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Car, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from './Toast';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Full name is required'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  street_address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  preferred_brands: z.string().optional(),
  marketing_email: z.boolean().default(false),
  marketing_sms: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

type AuthMode = 'signin' | 'signup' | 'reset';

export const EnhancedAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      marketing_email: false,
      marketing_sms: false,
      terms: false,
    },
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      remember: false,
    },
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role;
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const onSignUp = async (data: SignUpForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone_number: data.phone_number,
            street_address: data.street_address,
            city: data.city,
            postal_code: data.postal_code,
            country: data.country,
            preferred_brands: data.preferred_brands || '',
            marketing_email: data.marketing_email,
            marketing_sms: data.marketing_sms,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        throw signUpError;
      }

      if (authData.user) {
        // Profile should be created automatically by the database trigger
        // But let's also ensure it exists by trying to create/update it
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: data.email,
              full_name: data.full_name,
              phone_number: data.phone_number,
              street_address: data.street_address,
              city: data.city,
              postal_code: data.postal_code,
              country: data.country,
              preferred_brands: data.preferred_brands 
                ? data.preferred_brands.split(',').map(b => b.trim()).filter(Boolean)
                : null,
              marketing_email: data.marketing_email,
              marketing_sms: data.marketing_sms,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.warn('Profile creation warning (may already exist):', profileError);
            // Don't throw - profile might already exist from trigger
          }
        } catch (profileErr) {
          console.warn('Profile upsert warning:', profileErr);
          // Continue anyway - trigger should have created it
        }

        setSuccess('Account created! Please check your email to verify your account.');
        toast.success('Account created! Check your email to verify.');
        
        // If email confirmation is disabled, navigate immediately
        if (authData.session) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Error during sign up:', err);
      let errorMessage = 'An error occurred during sign up';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Handle specific Supabase errors
      if (err?.code === 'user_already_registered') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (err?.code === 'invalid_email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err?.message?.includes('Password')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (session?.user) {
        const role = session.user.user_metadata?.role || 'user';
        toast.success('Welcome back!');
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      setError('Invalid email or password');
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setSuccess('Password reset email sent! Please check your inbox.');
      toast.success('Password reset email sent!');
      setMode('signin');
    } catch (err) {
      console.error('Error resetting password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-gray-900 to-midnight pt-20 pb-12">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-none shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-zen text-racing-red mb-2">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'signin' && 'Sign in to access your account'}
              {mode === 'signup' && 'Join JDM HEAVEN and start your journey'}
              {mode === 'reset' && 'Enter your email to reset your password'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-none flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-none flex items-start space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
            </motion.div>
          )}

          {/* Forms */}
          {mode === 'signin' && (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
              <div>
                <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...signInForm.register('email')}
                    className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-racing-red focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...signInForm.register('password')}
                    className="w-full pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-racing-red focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...signInForm.register('remember')}
                    className="rounded-none border-gray-300 dark:border-gray-600 text-racing-red focus:ring-racing-red"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-racing-red hover:text-red-700 font-zen"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              {/* Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      {...signUpForm.register('email')}
                      className="w-full pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      {...signUpForm.register('full_name')}
                      className="w-full pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  {signUpForm.formState.errors.full_name && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...signUpForm.register('password')}
                      className="w-full pl-9 pr-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...signUpForm.register('confirmPassword')}
                      className="w-full pl-9 pr-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      {...signUpForm.register('phone_number')}
                      className="w-full pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  {signUpForm.formState.errors.phone_number && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.phone_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Brands
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      {...signUpForm.register('preferred_brands')}
                      placeholder="Nissan, Toyota, Honda..."
                      className="w-full pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...signUpForm.register('street_address')}
                    className="w-full pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                {signUpForm.formState.errors.street_address && (
                  <p className="mt-1 text-xs text-racing-red">
                    {signUpForm.formState.errors.street_address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    {...signUpForm.register('city')}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                  />
                  {signUpForm.formState.errors.city && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...signUpForm.register('postal_code')}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                  />
                  {signUpForm.formState.errors.postal_code && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.postal_code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    {...signUpForm.register('country')}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-gray-900 dark:text-white text-sm"
                  />
                  {signUpForm.formState.errors.country && (
                    <p className="mt-1 text-xs text-racing-red">
                      {signUpForm.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...signUpForm.register('marketing_email')}
                    className="rounded-none border-gray-300 dark:border-gray-600 text-racing-red focus:ring-racing-red"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I want to receive email updates about new cars and offers
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...signUpForm.register('marketing_sms')}
                    className="rounded-none border-gray-300 dark:border-gray-600 text-racing-red focus:ring-racing-red"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I want to receive SMS notifications about cars I'm interested in
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...signUpForm.register('terms')}
                    className="rounded-none border-gray-300 dark:border-gray-600 text-racing-red focus:ring-racing-red"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-racing-red hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-racing-red hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {signUpForm.formState.errors.terms && (
                  <p className="text-xs text-racing-red ml-6">
                    {signUpForm.formState.errors.terms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-6">
              <div>
                <label className="block text-sm font-zen text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...resetPasswordForm.register('email')}
                    className="w-full pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-racing-red focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                {resetPasswordForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-racing-red">
                    {resetPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            {mode === 'signin' && (
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-racing-red hover:text-red-700 transition font-zen"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-racing-red hover:text-red-700 transition font-zen"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-racing-red hover:text-red-700 transition font-zen"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

