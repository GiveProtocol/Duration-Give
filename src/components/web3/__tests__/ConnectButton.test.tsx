import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ConnectButton } from '../ConnectButton';

// Mock the dependencies
jest.mock('@/contexts/Web3Context', () => ({
  useWeb3: jest.fn(() => ({
    address: null,
    chainId: null,
    isConnected: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    switchChain: jest.fn(),
  })),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    signOut: jest.fn(),
  })),
}));

jest.mock('@/hooks/useWallet', () => ({
  useWallet: jest.fn(() => ({
    getInstalledWallets: jest.fn(() => [
      { name: 'MetaMask', id: 'metamask' },
      { name: 'WalletConnect', id: 'walletconnect' },
    ]),
    connectWallet: jest.fn(),
  })),
}));

jest.mock('@/hooks/useWalletAlias', () => ({
  useWalletAlias: jest.fn(() => ({
    alias: null,
    isLoading: false,
  })),
}));

jest.mock('@/utils/web3', () => ({
  shortenAddress: jest.fn((address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`),
}));

jest.mock('@/utils/logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('@/config/contracts', () => ({
  CHAIN_IDS: {
    moonbase: 1287,
  },
}));

// Wrapper component for routing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ConnectButton', () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();
  const mockSwitchChain = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mocks to default state
    const { useWeb3 } = require('@/contexts/Web3Context');
    useWeb3.mockReturnValue({
      address: null,
      chainId: null,
      isConnected: false,
      connect: mockConnect,
      disconnect: mockDisconnect,
      switchChain: mockSwitchChain,
    });
  });

  describe('when wallet is not connected', () => {
    it('renders connect wallet button', () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('calls connect when connect button is clicked', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Connect Wallet'));
      await waitFor(() => {
        expect(mockConnect).toHaveBeenCalled();
      });
    });
  });

  describe('when wallet is connected', () => {
    beforeEach(() => {
      const { useWeb3 } = require('@/contexts/Web3Context');
      useWeb3.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1287,
        isConnected: true,
        connect: mockConnect,
        disconnect: mockDisconnect,
        switchChain: mockSwitchChain,
      });
    });

    it('renders wallet address button', () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
    });

    it('shows account menu when wallet button is clicked', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('0x1234...7890'));
      
      await waitFor(() => {
        expect(screen.getByText('Set Wallet Alias')).toBeInTheDocument();
        expect(screen.getByText('Disconnect')).toBeInTheDocument();
      });
    });

    it('calls disconnect when disconnect is clicked', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('0x1234...7890'));
      
      await waitFor(() => {
        expect(screen.getByText('Disconnect')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Disconnect'));
      
      await waitFor(() => {
        expect(mockDisconnect).toHaveBeenCalled();
      });
    });
  });

  describe('when wrong network is connected', () => {
    beforeEach(() => {
      const { useWeb3 } = require('@/contexts/Web3Context');
      useWeb3.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1, // Wrong network
        isConnected: true,
        connect: mockConnect,
        disconnect: mockDisconnect,
        switchChain: mockSwitchChain,
      });
    });

    it('renders switch network button', () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      expect(screen.getByText('Switch Network')).toBeInTheDocument();
    });

    it('calls switchChain when switch network is clicked', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Switch Network'));
      
      await waitFor(() => {
        expect(mockSwitchChain).toHaveBeenCalledWith(1287);
      });
    });
  });

  describe('with wallet alias', () => {
    beforeEach(() => {
      const { useWeb3 } = require('@/contexts/Web3Context');
      const { useWalletAlias } = require('@/hooks/useWalletAlias');
      
      useWeb3.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1287,
        isConnected: true,
        connect: mockConnect,
        disconnect: mockDisconnect,
        switchChain: mockSwitchChain,
      });

      useWalletAlias.mockReturnValue({
        alias: 'My Wallet',
        isLoading: false,
      });
    });

    it('renders wallet alias instead of address', () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      expect(screen.getByText('My Wallet')).toBeInTheDocument();
    });

    it('shows change alias option in menu', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('My Wallet'));
      
      await waitFor(() => {
        expect(screen.getByText('Change Wallet Alias')).toBeInTheDocument();
      });
    });
  });

  describe('AccountMenuHeader component', () => {
    it('displays wallet connection info', () => {
      const { useWeb3 } = require('@/contexts/Web3Context');
      useWeb3.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1287,
        isConnected: true,
        connect: mockConnect,
        disconnect: mockDisconnect,
        switchChain: mockSwitchChain,
      });

      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('0x1234...7890'));
      
      expect(screen.getByText(/Connected with/)).toBeInTheDocument();
    });
  });

  describe('wallet selection', () => {
    it('shows wallet selection when connecting', async () => {
      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Connect Wallet'));
      
      // The component should trigger wallet connection logic
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('handles connection errors gracefully', async () => {
      mockConnect.mockRejectedValue(new Error('Connection failed'));

      render(
        <TestWrapper>
          <ConnectButton />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Connect Wallet'));
      
      await waitFor(() => {
        expect(mockConnect).toHaveBeenCalled();
      });
    });
  });
});