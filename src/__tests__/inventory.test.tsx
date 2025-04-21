import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import InventoryPage from '../pages/InventoryPage';
import { api } from '../lib/api';

// Mock API calls
vi.mock('../lib/api', () => ({
  api: {
    cars: {
      getAll: vi.fn(),
    },
    comparisons: {
      create: vi.fn(),
    },
  },
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      search: '',
    }),
  };
});

describe('InventoryPage', () => {
  const mockCars = [
    {
      id: '1',
      make: 'Nissan',
      model: 'Skyline',
      year: 1999,
      price: 50000,
      status: 'available',
      reference_number: 'TEST-001',
      images: [{ url: 'test.jpg', is_primary: true }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.cars.getAll as any).mockResolvedValue(mockCars);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('loads and displays cars', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <InventoryPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });
  });

  it('filters cars by search query', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <InventoryPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });

    await waitFor(() => {
      expect(screen.queryByText('Nissan Skyline')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (api.cars.getAll as any).mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <InventoryPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('adds cars to comparison', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <InventoryPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    });

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    expect(screen.getByText('Compare Cars (1/3)')).toBeInTheDocument();
  });
});