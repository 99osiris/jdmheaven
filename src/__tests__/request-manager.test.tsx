import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import RequestManager from '../pages/admin/RequestManager';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            make: 'Nissan',
            model: 'Skyline',
            status: 'pending',
            created_at: '2024-01-01',
            user: {
              email: 'user@test.com',
              full_name: 'Test User',
            },
          },
        ],
        error: null,
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('RequestManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loads and displays requests', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RequestManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('filters requests by search query', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RequestManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by make/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });

    await waitFor(() => {
      expect(screen.queryByText('Nissan Skyline')).not.toBeInTheDocument();
    });
  });

  it('filters requests by status', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RequestManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'approved' } });

    await waitFor(() => {
      expect(screen.queryByText('Nissan Skyline')).not.toBeInTheDocument();
    });
  });

  it('handles status changes', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RequestManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'approved' } });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('custom_requests');
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockRejectedValue(new Error('API Error')),
      order: vi.fn().mockReturnThis(),
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <RequestManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load custom requests/i)).toBeInTheDocument();
    });
  });
});