import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  global.fetch = jest.fn(); 
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login Component', () => {
  test('renders email and password inputs', () => {
    render(<BrowserRouter>
        <Login />
      </BrowserRouter>
);
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<BrowserRouter>
        <Login />
      </BrowserRouter>
);
    const emailInput = screen.getByPlaceholderText('john@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    expect(emailInput.value).toBe('test@mail.com');
  });

  test('shows popup on successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login successful' }),
    });

    render(<BrowserRouter>
        <Login />
      </BrowserRouter>
);
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const button = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  test('shows error popup on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(<BrowserRouter>
        <Login />
      </BrowserRouter>
);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
