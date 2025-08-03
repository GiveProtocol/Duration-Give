import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharityLogin } from '../CharityLogin';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loading: false,
    error: null
  })
}));

describe('CharityLogin', () => {
  it('renders login form', () => {
    render(<CharityLogin />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login on form submission', () => {
    const mockLogin = jest.fn();
    jest.mocked(jest.requireMock('@/hooks/useAuth').useAuth).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null
    });

    render(<CharityLogin />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@charity.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(mockLogin).toHaveBeenCalledWith('test@charity.com', 'password123', 'charity');
  });
});