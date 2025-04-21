import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CarCard } from '../components/CarCard';
import { api } from '../lib/api';

// Mock API calls
vi.mock('../lib/api', () => ({
  api: {
    wishlist: {
      add: vi.fn(),
      remove: vi.fn(),
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

describe('CarCard', () => {
  const mockCar = {
    id: '1',
    reference_number: 'TEST-001',
    make: 'Nissan',
    model: 'Skyline',
    year: 1999,
    price: 50000,
    mileage: 80000,
    engine_type: 'RB26DETT',
    horsepower: 280,
    transmission: '6-Speed Manual',
    location: 'Rotterdam',
    status: 'available',
    images: [{ url: 'test.jpg', is_primary: true }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders car information correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CarCard car={mockCar} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    expect(screen.getByText('1999 • 80,000 km')).toBeInTheDocument();
    expect(screen.getByText('€50,000')).toBeInTheDocument();
    expect(screen.getByText('RB26DETT')).toBeInTheDocument();
    expect(screen.getByText('280 HP')).toBeInTheDocument();
  });

  it('handles wishlist interactions', async () => {
    (api.wishlist.add as any).mockResolvedValue({});

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarCard car={mockCar} />
        </AuthProvider>
      </BrowserRouter>
    );

    const wishlistButton = screen.getByRole('button', { name: /heart/i });
    fireEvent.click(wishlistButton);

    await waitFor(() => {
      expect(api.wishlist.add).toHaveBeenCalledWith(mockCar.id);
    });
  });

  it('handles compare functionality', () => {
    const mockOnAddToCompare = vi.fn();

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarCard car={mockCar} onAddToCompare={mockOnAddToCompare} />
        </AuthProvider>
      </BrowserRouter>
    );

    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);

    expect(mockOnAddToCompare).toHaveBeenCalledWith(mockCar);
  });

  it('shows "In Compare" when car is in comparison', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CarCard car={mockCar} isInCompare={true} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('In Compare')).toBeInTheDocument();
  });

  it('handles share functionality', async () => {
    const mockShare = vi.fn();
    const mockClipboard = {
      writeText: vi.fn(),
    };

    // Mock navigator.share and clipboard
    Object.defineProperty(window.navigator, 'share', {
      value: mockShare,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      value: mockClipboard,
      configurable: true,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <CarCard car={mockCar} />
        </AuthProvider>
      </BrowserRouter>
    );

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    if (navigator.share) {
      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled();
      });
    } else {
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalled();
      });
    }
  });
});