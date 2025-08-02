import React from 'react'; // eslint-disable-line no-unused-vars
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WalletAliasSettings } from '../WalletAliasSettings';
import { useWalletAlias } from '@/hooks/useWalletAlias';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  createMockWalletAlias, 
  createMockWeb3,
  testAddresses,
  mockShortenAddress,
  setupCommonMocks
} from '@/test-utils/mockSetup';
import { MockInputProps } from '@/test-utils/types';

// Setup common mocks to reduce duplication
setupCommonMocks();

// Mock the specific dependencies
jest.mock('@/hooks/useWalletAlias');
jest.mock('@/contexts/Web3Context');
jest.mock('@/utils/web3', () => ({
  shortenAddress: mockShortenAddress,
}));

// Mock UI components using shared types (overrides setupCommonMocks for specificity)
jest.mock('@/components/ui/Input', () => ({
  Input: (props: MockInputProps) => <input {...props} data-testid="alias-input" />,
}));

describe('WalletAliasSettings', () => {
  const mockSetWalletAlias = jest.fn();
  const mockDeleteWalletAlias = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // useWalletAlias and useWeb3 are already imported and mocked
    
    (useWalletAlias as jest.Mock).mockReturnValue(createMockWalletAlias({
      setWalletAlias: mockSetWalletAlias,
      deleteWalletAlias: mockDeleteWalletAlias,
    }));

    (useWeb3 as jest.Mock).mockReturnValue(createMockWeb3({
      address: testAddresses.mainWallet,
      isConnected: true,
    }));

    mockSetWalletAlias.mockResolvedValue(true);
    mockDeleteWalletAlias.mockResolvedValue(true);
  });

  describe('component rendering', () => {
    it('renders the wallet alias settings component', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByText('Wallet Alias')).toBeInTheDocument();
    });

    it('shows current wallet address when connected', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
    });

    it('renders the card container', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('when no alias is set', () => {
    it('shows set alias form by default', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByTestId('alias-input')).toBeInTheDocument();
      expect(screen.getByText('Set Alias')).toBeInTheDocument();
    });

    it('allows user to enter alias', () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      fireEvent.change(input, { target: { value: 'MyWallet' } });
      
      expect(input).toHaveValue('MyWallet');
    });

    it('submits alias when form is submitted', async () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'MyWallet' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSetWalletAlias).toHaveBeenCalledWith('MyWallet');
      });
    });
  });

  describe('when alias exists', () => {
    beforeEach(() => {
      (useWalletAlias as jest.Mock).mockReturnValue(createMockWalletAlias({
        alias: 'ExistingAlias',
        aliases: { [testAddresses.mainWallet]: 'ExistingAlias' },
        setWalletAlias: mockSetWalletAlias,
        deleteWalletAlias: mockDeleteWalletAlias,
      }));
    });

    it('displays the existing alias', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByText('ExistingAlias')).toBeInTheDocument();
    });

    it('shows edit and delete buttons', () => {
      render(<WalletAliasSettings />);
      
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('enters edit mode when edit button is clicked', () => {
      render(<WalletAliasSettings />);
      
      fireEvent.click(screen.getByText('Edit'));
      
      expect(screen.getByTestId('alias-input')).toBeInTheDocument();
      expect(screen.getByTestId('alias-input')).toHaveValue('ExistingAlias');
    });

    it('calls delete function when delete is clicked', async () => {
      render(<WalletAliasSettings />);
      
      fireEvent.click(screen.getByText('Delete'));
      
      await waitFor(() => {
        expect(mockDeleteWalletAlias).toHaveBeenCalled();
      });
    });
  });

  describe('validation', () => {
    it('shows error for empty alias', async () => {
      render(<WalletAliasSettings />);
      
      const submitButton = screen.getByText('Set Alias');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alias cannot be empty')).toBeInTheDocument();
      });
    });

    it('shows error for alias too short', async () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alias must be between 3 and 20 characters')).toBeInTheDocument();
      });
    });

    it('shows error for alias too long', async () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'a'.repeat(21) } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alias must be between 3 and 20 characters')).toBeInTheDocument();
      });
    });

    it('shows error for invalid characters', async () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'invalid@alias!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Alias can only contain letters, numbers, underscores, and hyphens')).toBeInTheDocument();
      });
    });

    it('accepts valid alias', async () => {
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'valid_alias-123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSetWalletAlias).toHaveBeenCalledWith('valid_alias-123');
      });
    });
  });

  describe('loading states', () => {
    it('shows loading state when setting alias', () => {
      // useWalletAlias is already imported and mocked
      useWalletAlias.mockReturnValue({
        alias: null,
        aliases: {},
        loading: true,
        error: null,
        setWalletAlias: mockSetWalletAlias,
        deleteWalletAlias: mockDeleteWalletAlias,
      });

      render(<WalletAliasSettings />);
      
      // Component should handle loading state
      expect(screen.getByText('Wallet Alias')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('handles setWalletAlias failure gracefully', async () => {
      mockSetWalletAlias.mockResolvedValue(false);
      
      render(<WalletAliasSettings />);
      
      const input = screen.getByTestId('alias-input');
      const submitButton = screen.getByText('Set Alias');
      
      fireEvent.change(input, { target: { value: 'TestAlias' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSetWalletAlias).toHaveBeenCalledWith('TestAlias');
      });
    });

    it('handles deleteWalletAlias failure gracefully', async () => {
      // useWalletAlias is already imported and mocked
      useWalletAlias.mockReturnValue({
        alias: 'ExistingAlias',
        aliases: { '0x1234567890123456789012345678901234567890': 'ExistingAlias' },
        loading: false,
        error: null,
        setWalletAlias: mockSetWalletAlias,
        deleteWalletAlias: mockDeleteWalletAlias,
      });

      mockDeleteWalletAlias.mockResolvedValue(false);
      
      render(<WalletAliasSettings />);
      
      fireEvent.click(screen.getByText('Delete'));
      
      await waitFor(() => {
        expect(mockDeleteWalletAlias).toHaveBeenCalled();
      });
    });
  });

  describe('wallet not connected', () => {
    it('handles disconnected wallet state', () => {
      (useWeb3 as jest.Mock).mockReturnValue(createMockWeb3({
        address: null,
        isConnected: false,
      }));

      render(<WalletAliasSettings />);
      
      // Component should handle disconnected state
      expect(screen.getByText('Wallet Alias')).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      (useWalletAlias as jest.Mock).mockReturnValue(createMockWalletAlias({
        alias: 'ExistingAlias',
        aliases: { [testAddresses.mainWallet]: 'ExistingAlias' },
        setWalletAlias: mockSetWalletAlias,
        deleteWalletAlias: mockDeleteWalletAlias,
      }));
    });

    it('shows save and cancel buttons in edit mode', () => {
      render(<WalletAliasSettings />);
      
      fireEvent.click(screen.getByText('Edit'));
      
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('cancels edit mode when cancel is clicked', () => {
      render(<WalletAliasSettings />);
      
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.click(screen.getByText('Cancel'));
      
      expect(screen.getByText('ExistingAlias')).toBeInTheDocument();
      expect(screen.queryByTestId('alias-input')).not.toBeInTheDocument();
    });
  });
});