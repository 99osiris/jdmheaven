import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VinDecoderQuick } from '../components/VinDecoderQuick';
import VinDecoderPage from '../pages/VinDecoderPage';
import { vinApi } from '../lib/api/vin';

// Mock the VIN API
vi.mock('../lib/api/vin', () => ({
  vinApi: {
    decode: vi.fn(),
    saveSearch: vi.fn(),
  },
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      search: '?vin=JF1GD70B0WL517582',
    }),
  };
});

const mockVinResult = {
  make: 'Nissan',
  model: 'Skyline',
  year: 1999,
  engine: 'RB26DETT',
  transmission: '6-Speed Manual',
  bodyType: 'Coupe',
  driveType: 'AWD',
  manufacturer: 'Nissan Motor Company',
  plantCountry: 'Japan',
  series: 'GT-R',
};

describe('VinDecoderQuick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the quick lookup form', () => {
    render(
      <BrowserRouter>
        <VinDecoderQuick />
      </BrowserRouter>
    );

    expect(screen.getByText('VIN Decoder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter 17-digit vin/i)).toBeInTheDocument();
  });

  it('validates VIN length', async () => {
    render(
      <BrowserRouter>
        <VinDecoderQuick />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter 17-digit vin/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Decode VIN'));

    await waitFor(() => {
      expect(screen.getByText('VIN must be 17 characters long')).toBeInTheDocument();
    });
  });

  it('converts VIN to uppercase', () => {
    render(
      <BrowserRouter>
        <VinDecoderQuick />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter 17-digit vin/i);
    fireEvent.change(input, { target: { value: 'jf1gd70b0wl517582' } });

    expect(input).toHaveValue('JF1GD70B0WL517582');
  });
});

describe('VinDecoderPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (vinApi.decode as any).mockResolvedValue(mockVinResult);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('decodes VIN from URL parameter', async () => {
    render(
      <BrowserRouter>
        <VinDecoderPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(vinApi.decode).toHaveBeenCalledWith('JF1GD70B0WL517582');
    });
  });

  it('displays decoded vehicle information', async () => {
    render(
      <BrowserRouter>
        <VinDecoderPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nissan')).toBeInTheDocument();
      expect(screen.getByText('Skyline')).toBeInTheDocument();
      expect(screen.getByText('RB26DETT')).toBeInTheDocument();
    });
  });

  it('handles decoding errors', async () => {
    (vinApi.decode as any).mockRejectedValue(new Error('Failed to decode VIN'));

    render(
      <BrowserRouter>
        <VinDecoderPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to decode vin/i)).toBeInTheDocument();
    });
  });

  it('saves search history', async () => {
    render(
      <BrowserRouter>
        <VinDecoderPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(vinApi.saveSearch).toHaveBeenCalledWith('JF1GD70B0WL517582', mockVinResult);
    });
  });

  it('allows new VIN lookup', async () => {
    render(
      <BrowserRouter>
        <VinDecoderPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter 17-digit vin/i);
    fireEvent.change(input, { target: { value: 'WBAAA1305H8251545' } });
    fireEvent.click(screen.getByText('Decode VIN'));

    await waitFor(() => {
      expect(vinApi.decode).toHaveBeenCalledWith('WBAAA1305H8251545');
    });
  });
});