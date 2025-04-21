import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import { supabase } from '../lib/supabase';

// Mock supabase auth methods
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders sign in form by default', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  it('switches between sign in and sign up forms', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Initially shows sign in
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    // Click to switch to sign up
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    // Shows sign up form
    await waitFor(() => {
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });

    // Click to switch back to sign in
    fireEvent.click(screen.getByText(/already have an account\? sign in/i));

    // Shows sign in form again
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  it('handles successful sign in', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ 
      data: { session: { user: { id: 'test-id' } } },
      error: null 
    });
    supabase.auth.signInWithPassword = mockSignIn;

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles successful sign up', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-id' } },
      error: null,
    });
    supabase.auth.signUp = mockSignUp;

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
    });

    // Switch to sign up form
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/street address/i), {
      target: { value: '123 Test St' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Test City' },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Test Country' },
    });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
    });
  });

  it('displays error messages for invalid input', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
    });

    // Switch to sign up form
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    await waitFor(() => {
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    // Submit without filling any fields
    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });
  });

  it('handles sign in errors', async () => {
    const mockError = new Error('Invalid credentials');
    supabase.auth.signInWithPassword = vi.fn().mockRejectedValue(mockError);

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});