import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import MessageManager from '../pages/admin/MessageManager';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Test User',
            email: 'user@test.com',
            subject: 'Test Subject',
            message: 'Test Message',
            status: 'new',
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

describe('MessageManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loads and displays messages', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MessageManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
  });

  it('filters messages by search query', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MessageManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.queryByText('Test Subject')).not.toBeInTheDocument();
    });
  });

  it('filters messages by status', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MessageManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    await waitFor(() => {
      expect(screen.queryByText('Test Subject')).not.toBeInTheDocument();
    });
  });

  it('handles status changes', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MessageManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('contact_submissions');
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
          <MessageManager />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load contact submissions/i)).toBeInTheDocument();
    });
  });
});