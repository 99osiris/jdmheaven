import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  street_address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  preferred_brands: z.string().optional(),
  marketing_email: z.boolean().default(false),
  marketing_sms: z.boolean().default(false),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
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

    try {
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
            preferred_brands: data.preferred_brands,
            marketing_email: data.marketing_email,
            marketing_sms: data.marketing_sms,
            role: 'user'
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error during sign up:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInForm) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (session?.user) {
        const role = session.user.user_metadata?.role || 'user';
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pt-20">
      <div className="max-w-md mx-auto px-4 py-16">
        <h2 className="text-3xl font-zen text-racing-red mb-8 text-center">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <div className="bg-midnight p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-6">
              {error}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...signUpForm.register('email')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signUpForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...signUpForm.register('password')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-9 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {signUpForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...signUpForm.register('full_name')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signUpForm.formState.errors.full_name && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...signUpForm.register('phone_number')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signUpForm.formState.errors.phone_number && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.phone_number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  {...signUpForm.register('street_address')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signUpForm.formState.errors.street_address && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.street_address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-zen text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    {...signUpForm.register('city')}
                    className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                  />
                  {signUpForm.formState.errors.city && (
                    <p className="mt-1 text-sm text-racing-red">
                      {signUpForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-zen text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...signUpForm.register('postal_code')}
                    className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                  />
                  {signUpForm.formState.errors.postal_code && (
                    <p className="mt-1 text-sm text-racing-red">
                      {signUpForm.formState.errors.postal_code.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  {...signUpForm.register('country')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signUpForm.formState.errors.country && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signUpForm.formState.errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Preferred Brands/Cars
                </label>
                <input
                  type="text"
                  {...signUpForm.register('preferred_brands')}
                  placeholder="e.g., Nissan, Toyota, Honda (comma separated)"
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...signUpForm.register('marketing_email')}
                    className="rounded-none border-gray-700 bg-black/30"
                  />
                  <span className="text-gray-300">
                    I want to receive email updates about new cars and offers
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...signUpForm.register('marketing_sms')}
                    className="rounded-none border-gray-700 bg-black/30"
                  />
                  <span className="text-gray-300">
                    I want to receive SMS notifications about cars I'm interested in
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
              <div>
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...signInForm.register('email')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
                />
                {signInForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-zen text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...signInForm.register('password')}
                  className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-9 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {signInForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-racing-red">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gray-300 hover:text-racing-red transition"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;