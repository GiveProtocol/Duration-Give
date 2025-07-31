import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApplicationAcceptance } from '../ApplicationAcceptance';

// Mock the dependencies
jest.mock('@/hooks/useVolunteerVerification', () => ({
  useVolunteerVerification: jest.fn(() => ({
    acceptApplication: jest.fn(),
    loading: false,
    error: null,
  })),
}));

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key: string, fallback?: string) => fallback || key),
  })),
}));

jest.mock('@/utils/logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock UI components
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, variant, className }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean;
    variant?: string;
    className?: string;
  }) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('ApplicationAcceptance', () => {
  const mockAcceptApplication = jest.fn();
  const mockOnAccepted = jest.fn();
  const mockT = jest.fn((key: string, fallback?: string) => fallback || key);

  const defaultProps = {
    applicationId: 'app-123',
    applicantName: 'John Doe',
    opportunityTitle: 'Beach Cleanup Volunteer',
    onAccepted: mockOnAccepted,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
    const { useTranslation } = require('@/hooks/useTranslation');
    
    useVolunteerVerification.mockReturnValue({
      acceptApplication: mockAcceptApplication,
      loading: false,
      error: null,
    });

    useTranslation.mockReturnValue({
      t: mockT,
    });

    mockAcceptApplication.mockResolvedValue('0x1234567890abcdef');
  });

  describe('initial state', () => {
    it('renders the application card with applicant information', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/Beach Cleanup Volunteer/)).toBeInTheDocument();
    });

    it('shows accept and reject buttons', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(screen.getByText('volunteer.accept')).toBeInTheDocument();
      expect(screen.getByText('volunteer.reject')).toBeInTheDocument();
    });

    it('does not show acceptance hash initially', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(screen.queryByText('volunteer.acceptanceHash')).not.toBeInTheDocument();
    });
  });

  describe('acceptance flow', () => {
    it('calls acceptApplication when accept button is clicked', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(mockAcceptApplication).toHaveBeenCalledWith('app-123');
      });
    });

    it('shows loading state during acceptance', () => {
      const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
      useVolunteerVerification.mockReturnValue({
        acceptApplication: mockAcceptApplication,
        loading: true,
        error: null,
      });

      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(screen.getByText('volunteer.processing')).toBeInTheDocument();
    });

    it('disables button during loading', () => {
      const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
      useVolunteerVerification.mockReturnValue({
        acceptApplication: mockAcceptApplication,
        loading: true,
        error: null,
      });

      render(<ApplicationAcceptance {...defaultProps} />);
      
      const acceptButton = screen.getByText('volunteer.processing');
      expect(acceptButton).toBeDisabled();
    });

    it('calls onAccepted callback when acceptance succeeds', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(mockOnAccepted).toHaveBeenCalledWith('0x1234567890abcdef');
      });
    });

    it('shows success state after acceptance', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(screen.getByText('volunteer.applicationAccepted')).toBeInTheDocument();
        expect(screen.getByText('volunteer.applicationRecorded')).toBeInTheDocument();
      });
    });

    it('displays acceptance hash in success state', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(screen.getByText('volunteer.acceptanceHash')).toBeInTheDocument();
        expect(screen.getByText('0x1234567890abcdef')).toBeInTheDocument();
      });
    });

    it('includes blockchain explorer link for hash', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://moonbase.moonscan.io/tx/0x1234567890abcdef');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('error handling', () => {
    it('displays error message when provided', () => {
      const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
      useVolunteerVerification.mockReturnValue({
        acceptApplication: mockAcceptApplication,
        loading: false,
        error: 'Connection failed',
      });

      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });

    it('handles acceptance failure gracefully', async () => {
      mockAcceptApplication.mockRejectedValue(new Error('Transaction failed'));
      
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(mockAcceptApplication).toHaveBeenCalled();
      });

      // Should not crash and should log error
      const { Logger } = require('@/utils/logger');
      expect(Logger.error).toHaveBeenCalledWith('Acceptance failed:', expect.any(Error));
    });

    it('handles null hash response', async () => {
      mockAcceptApplication.mockResolvedValue(null);
      
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(mockAcceptApplication).toHaveBeenCalled();
      });

      // Should not show success state
      expect(screen.queryByText('volunteer.applicationAccepted')).not.toBeInTheDocument();
    });
  });

  describe('optional props', () => {
    it('works without onAccepted callback', async () => {
      const propsWithoutCallback = {
        applicationId: 'app-123',
        applicantName: 'John Doe',
        opportunityTitle: 'Beach Cleanup Volunteer',
      };

      render(<ApplicationAcceptance {...propsWithoutCallback} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        expect(mockAcceptApplication).toHaveBeenCalled();
      });

      // Should not throw error
      expect(screen.getByText('volunteer.applicationAccepted')).toBeInTheDocument();
    });
  });

  describe('UI styling and classes', () => {
    it('applies correct styling to initial state', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      const container = screen.getByText('John Doe').closest('div');
      expect(container?.parentElement).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-lg', 'p-4');
    });

    it('applies success styling after acceptance', async () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      fireEvent.click(screen.getByText('volunteer.accept'));
      
      await waitFor(() => {
        const successContainer = screen.getByText('volunteer.applicationAccepted').closest('div');
        expect(successContainer).toHaveClass('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4');
      });
    });

    it('applies error styling when error present', () => {
      const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
      useVolunteerVerification.mockReturnValue({
        acceptApplication: mockAcceptApplication,
        loading: false,
        error: 'Error message',
      });

      render(<ApplicationAcceptance {...defaultProps} />);
      
      const errorElement = screen.getByText('Error message');
      expect(errorElement.closest('div')).toHaveClass('p-3', 'bg-red-50', 'text-red-700', 'text-sm', 'rounded-md');
    });
  });

  describe('translation integration', () => {
    it('uses translation hook for all text', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(mockT).toHaveBeenCalledWith('volunteer.appliedFor');
      expect(mockT).toHaveBeenCalledWith('volunteer.accept');
      expect(mockT).toHaveBeenCalledWith('volunteer.reject');
    });

    it('uses translation for dynamic loading text', () => {
      const { useVolunteerVerification } = require('@/hooks/useVolunteerVerification');
      useVolunteerVerification.mockReturnValue({
        acceptApplication: mockAcceptApplication,
        loading: true,
        error: null,
      });

      render(<ApplicationAcceptance {...defaultProps} />);
      
      expect(mockT).toHaveBeenCalledWith('volunteer.processing', 'Processing...');
    });
  });

  describe('button interactions', () => {
    it('reject button is clickable but has no handler', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      const rejectButton = screen.getByText('volunteer.reject');
      expect(rejectButton).toBeInTheDocument();
      
      // Should not throw error when clicked
      fireEvent.click(rejectButton);
    });

    it('accept button has proper styling classes', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      const acceptButton = screen.getByText('volunteer.accept');
      expect(acceptButton).toHaveClass('flex', 'items-center');
    });

    it('reject button has secondary variant', () => {
      render(<ApplicationAcceptance {...defaultProps} />);
      
      const rejectButton = screen.getByText('volunteer.reject');
      expect(rejectButton).toHaveAttribute('data-variant', 'secondary');
    });
  });
});