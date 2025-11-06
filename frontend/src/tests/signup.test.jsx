import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/signup';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Signup Component', () => {
  test('renders all inputs', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByPlaceholderText('Ali Khan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ali@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('updates input fields correctly', () => {
    renderWithRouter(<Signup />);
    const nameInput = screen.getByPlaceholderText('Ali Khan');
    fireEvent.change(nameInput, { target: { value: 'Bilal' } });
    expect(nameInput.value).toBe('Bilal');
  });

  test('shows success popup on successful signup', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Signup successful' }),
    });

    renderWithRouter(<Signup />);
    const button = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/signup successful/i)).toBeInTheDocument();
    });
  });

  test('shows error popup on failed signup', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already exists' }),
    });

    renderWithRouter(<Signup />);
    const button = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
