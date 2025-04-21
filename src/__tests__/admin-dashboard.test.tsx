import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        count: vi.fn().mockResolvedValue({ count: 5 }),
        head: vi.fn(),
      })),
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

describe('AdminDashboard', () => {
  const mockUser = {
    id: 'test-admin-id',
    email: 'admin@test.com',
    user_metadata: {
      role: 'admin',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('redirects non-admin users', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
  });

  it('loads dashboard statistics', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('handles navigation to different sections', async () => {
    const navigate = vi.fn();
    vi.mock('react-router-dom', async () => ({
      ...await vi.importActual('react-router-dom'),
      useNavigate: () => navigate,
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    const inventoryButton = screen.getByText(/inventory management/i);
    fireEvent.click(inventoryButton);

    expect(navigate).toHaveBeenCalledWith('/admin/inventory');
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockRejectedValue(new Error('API Error')),
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard statistics/i)).toBeInTheDocument();
    });
  });
});