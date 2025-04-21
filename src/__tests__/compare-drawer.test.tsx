import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CompareDrawer } from '../components/CompareDrawer';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('CompareDrawer', () => {
  const mockCars = [
    {
      id: '1',
      make: 'Nissan',
      model: 'Skyline',
      year: 1999,
      images: [{ url: 'test1.jpg' }],
      reference_number: 'TEST-001',
      price: 50000,
      engine_type: 'RB26DETT',
    },
    {
      id: '2',
      make: 'Toyota',
      model: 'Supra',
      year: 1998,
      images: [{ url: 'test2.jpg' }],
      reference_number: 'TEST-002',
      price: 45000,
      engine_type: '2JZ-GTE',
    },
  ];

  const mockProps = {
    cars: mockCars,
    onRemove: vi.fn(),
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with cars', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Compare Cars (2/3)')).toBeInTheDocument();
    expect(screen.getByText('Nissan Skyline')).toBeInTheDocument();
    expect(screen.getByText('Toyota Supra')).toBeInTheDocument();
  });

  it('shows empty slots for remaining cars', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Add a car')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} />
      </BrowserRouter>
    );

    const removeButtons = screen.getAllByRole('button', { name: /x/i });
    fireEvent.click(removeButtons[0]);

    expect(mockProps.onRemove).toHaveBeenCalledWith(mockCars[0]);
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} />
      </BrowserRouter>
    );

    const closeButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('enables compare button when at least 2 cars are selected', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} />
      </BrowserRouter>
    );

    const compareButton = screen.getByText('Compare Now');
    expect(compareButton).not.toBeDisabled();

    fireEvent.click(compareButton);
    expect(mockProps.onSave).toHaveBeenCalled();
  });

  it('disables compare button with less than 2 cars', () => {
    render(
      <BrowserRouter>
        <CompareDrawer {...mockProps} cars={[mockCars[0]]} />
      </BrowserRouter>
    );

    const compareButton = screen.getByText('Compare Now');
    expect(compareButton).toBeDisabled();
  });
});