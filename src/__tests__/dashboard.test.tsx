import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import DashboardPage from '../pages/DashboardPage';
import { api } from '../lib/api';

// Mock API calls
vi.mock('../lib/api', () => ({
  api: {
    wishlist: {
      getAll: vi.fn(),
      remove: vi.fn(),
    },
    comparisons: {
      getAll: vi.fn(),
      delete: vi.fn(),
    },
    customRequests: {
      getAll: vi.fn(),
    },
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

describe('DashboardPage', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (api.wishlist.getAll as any).mockResolvedValue([]);
    (api.comparisons.getAll as any).mockResolvedValue([]);
    (api.customRequests.getAll as any).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to auth page when not logged in', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(window.location.pathname).toBe('/auth');
  });

  it('displays user information when logged in', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });
  });

  it('loads and displays wishlist items', async () => {
    const mockWishlist = [
      {
        id: '1',
        car: {
          make: 'Nissan',
          model: 'Skyline',
          reference_number: 'TEST-001',
        },
      },
    ];

    (api.wishlist.getAll as any).mockResolvedValue(mockWishlist);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });
  });

  it('loads and displays comparisons', async () => {
    const mockComparisons = [
      {
        id: '1',
        name: 'Test Comparison',
        cars: ['car-1', 'car-2'],
      },
    ];

    (api.comparisons.getAll as any).mockResolvedValue(mockComparisons);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Comparison')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (api.wishlist.getAll as any).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument();
    });
  });
});