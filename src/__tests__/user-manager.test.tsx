import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import UserManager from '../pages/admin/UserManager';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            email: 'user@test.com',
            full_name: 'Test User',
            role: 'user',
            created_at: '2024-01-01',
          },
        ],
        error: null,
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('UserManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loads and displays users', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UserManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });
  });

  it('filters users by search query', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UserManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('handles role changes', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UserManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const roleSelect = screen.getByRole('combobox');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
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
          <UserManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();
    });
  });
});