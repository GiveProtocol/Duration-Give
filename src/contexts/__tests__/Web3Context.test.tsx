import React from 'react'; // eslint-disable-line no-unused-vars
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { Web3Provider, useWeb3 } from '../Web3Context';
import { Logger } from '@/utils/logger';

// Mock dependencies to avoid module issues
jest.mock('@/utils/logger');
jest.mock('@/config/contracts', () => ({
  CHAIN_IDS: {
    MOONBASE_ALPHA: 1287,
    MOONBEAM: 1284
  }
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn().mockImplementation(() => ({
        getSigner: jest.fn().mockReturnValue({
          getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890')
        }),
        getNetwork: jest.fn().mockResolvedValue({ chainId: 1287 })
      }))
    },
    utils: {
      getAddress: jest.fn().mockImplementation((address) => address)
    }
  }
}));

const mockLogger = Logger as jest.Mocked<typeof Logger>;

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true
};

// Test component to access Web3 context
const TestComponent: React.FC = () => {
  const web3 = useWeb3();
  
  return (
    <div>
      <div data-testid="address">{web3.address || 'no-address'}</div>
      <div data-testid="connected">{web3.isConnected ? 'connected' : 'disconnected'}</div>
      <div data-testid="chain-id">{web3.chainId || 'no-chain'}</div>
      <div data-testid="loading">{web3.loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{web3.error || 'no-error'}</div>
      <button data-testid="connect-btn" onClick={web3.connect}>
        Connect
      </button>
      <button data-testid="disconnect-btn" onClick={web3.disconnect}>
        Disconnect
      </button>
      <button data-testid="switch-chain-btn" onClick={() => web3.switchChain(1284)}>
        Switch Chain
      </button>
    </div>
  );
};

const renderWithWeb3Provider = () => {
  return render(
    <Web3Provider>
      <TestComponent />
    </Web3Provider>
  );
};

describe('Web3Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up window.ethereum mock
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true
    });

    // Reset mock implementations
    mockEthereum.request.mockResolvedValue(['0x1234567890123456789012345678901234567890']);
    mockEthereum.on.mockImplementation(() => {});
    mockEthereum.removeListener.mockImplementation(() => {});

    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (window as any).ethereum;
  });

  describe('Initial State', () => {
    it('renders with initial disconnected state', () => {
      renderWithWeb3Provider();
      
      expect(screen.getByTestId('address')).toHaveTextContent('no-address');
      expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
      expect(screen.getByTestId('chain-id')).toHaveTextContent('no-chain');
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    it('sets up event listeners on mount', () => {
      renderWithWeb3Provider();
      
      expect(mockEthereum.on).toHaveBeenCalledWith('accountsChanged', expect.any(Function));
      expect(mockEthereum.on).toHaveBeenCalledWith('chainChanged', expect.any(Function));
    });

    it('checks for existing connection on mount', () => {
      renderWithWeb3Provider();
      
      expect(mockEthereum.request).toHaveBeenCalledWith({ method: 'eth_accounts' });
    });
  });

  describe('Wallet Connection', () => {
    it('handles successful wallet connection', async () => {
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) // eth_accounts
        .mockResolvedValueOnce('0x507') // eth_chainId
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']); // eth_requestAccounts

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent('0x1234567890123456789012345678901234567890');
        expect(screen.getByTestId('connected')).toHaveTextContent('connected');
      });

      expect(mockEthereum.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    });

    it('handles wallet connection rejection', async () => {
      const error = { code: 4001, message: 'User rejected the request' };
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User rejected the request');
        expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
      });
    });

    it('handles unauthorized wallet error', async () => {
      const error = { code: 4100, message: 'Unauthorized' };
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Please connect to MetaMask');
      });
    });

    it('handles unsupported method error', async () => {
      const error = { code: 4200, message: 'Unsupported method' };
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('This feature is not supported by your wallet');
      });
    });

    it('handles generic connection errors', async () => {
      const error = new Error('Network error');
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to connect wallet');
        expect(mockLogger.error).toHaveBeenCalledWith('Wallet connection error', error);
      });
    });

    it('handles missing ethereum provider', async () => {
      delete (window as any).ethereum;

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Please install MetaMask');
      });
    });
  });

  describe('Wallet Disconnection', () => {
    it('handles wallet disconnection', async () => {
      // First connect
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
        .mockResolvedValueOnce('0x507');

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('connected')).toHaveTextContent('connected');
      });

      // Then disconnect
      await act(async () => {
        fireEvent.click(screen.getByTestId('disconnect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent('no-address');
        expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
        expect(screen.getByTestId('chain-id')).toHaveTextContent('no-chain');
      });
    });
  });

  describe('Chain Switching', () => {
    it('handles successful chain switch', async () => {
      mockEthereum.request.mockResolvedValue('0x504'); // New chain ID

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-chain-btn'));
      });

      await waitFor(() => {
        expect(mockEthereum.request).toHaveBeenCalledWith({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x504' }]
        });
      });
    });

    it('handles chain switch rejection', async () => {
      const error = { code: 4001, message: 'User rejected chain switch' };
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-chain-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User rejected chain switch');
      });
    });

    it('handles unrecognized chain error', async () => {
      const error = { code: 4902, message: 'Unrecognized chain ID' };
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-chain-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('This network is not supported');
      });
    });

    it('handles generic chain switch errors', async () => {
      const error = new Error('Chain switch failed');
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-chain-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to switch network');
        expect(mockLogger.error).toHaveBeenCalledWith('Chain switch error', error);
      });
    });
  });

  describe('Event Handlers', () => {
    it('handles account changes', async () => {
      let accountsChangedCallback: Function = () => {};
      
      mockEthereum.on.mockImplementation((event, callback) => {
        if (event === 'accountsChanged') {
          accountsChangedCallback = callback;
        }
      });

      renderWithWeb3Provider();

      // Simulate account change
      await act(async () => {
        accountsChangedCallback(['0x9876543210987654321098765432109876543210']);
      });

      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent('0x9876543210987654321098765432109876543210');
      });
    });

    it('handles disconnection via account change', async () => {
      let accountsChangedCallback: Function = () => {};
      
      mockEthereum.on.mockImplementation((event, callback) => {
        if (event === 'accountsChanged') {
          accountsChangedCallback = callback;
        }
      });

      renderWithWeb3Provider();

      // Simulate disconnection (empty accounts array)
      await act(async () => {
        accountsChangedCallback([]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent('no-address');
        expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
      });
    });

    it('handles chain changes', async () => {
      let chainChangedCallback: Function = () => {};
      
      mockEthereum.on.mockImplementation((event, callback) => {
        if (event === 'chainChanged') {
          chainChangedCallback = callback;
        }
      });

      renderWithWeb3Provider();

      // Simulate chain change
      await act(async () => {
        chainChangedCallback('0x504');
      });

      await waitFor(() => {
        expect(screen.getByTestId('chain-id')).toHaveTextContent('1284');
      });
    });

    it('handles invalid chain changes', async () => {
      let chainChangedCallback: Function = () => {};
      
      mockEthereum.on.mockImplementation((event, callback) => {
        if (event === 'chainChanged') {
          chainChangedCallback = callback;
        }
      });

      renderWithWeb3Provider();

      // Simulate invalid chain change
      await act(async () => {
        chainChangedCallback('invalid');
      });

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith('Invalid chain ID received', 'invalid');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles provider initialization errors', async () => {
      const error = new Error('Provider initialization failed');
      mockEthereum.request.mockRejectedValue(error);

      renderWithWeb3Provider();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to check wallet connection', error);
      });
    });

    it('clears errors on successful operations', async () => {
      // First, cause an error
      const error = { code: 4001, message: 'User rejected' };
      mockEthereum.request.mockRejectedValueOnce(error);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User rejected');
      });

      // Then succeed
      mockEthereum.request.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']);

      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      });
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when useWeb3 is used outside provider', () => {
      const TestWithoutProvider = () => {
        try {
          useWeb3();
          return <div>Should not render</div>;
        } catch (error) {
          return <div data-testid="context-error">Context error</div>;
        }
      };

      expect(() => render(<TestWithoutProvider />)).toThrow('useWeb3 must be used within a Web3Provider');
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const { unmount } = renderWithWeb3Provider();
      
      unmount();
      
      expect(mockEthereum.removeListener).toHaveBeenCalledWith('accountsChanged', expect.any(Function));
      expect(mockEthereum.removeListener).toHaveBeenCalledWith('chainChanged', expect.any(Function));
    });
  });

  describe('Edge Cases', () => {
    it('handles null ethereum provider gracefully', () => {
      Object.defineProperty(window, 'ethereum', {
        value: null,
        writable: true
      });

      renderWithWeb3Provider();
      
      expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
    });

    it('handles provider without required methods', () => {
      Object.defineProperty(window, 'ethereum', {
        value: { isMetaMask: true },
        writable: true
      });

      renderWithWeb3Provider();
      
      expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
    });

    it('handles malformed account addresses', async () => {
      mockEthereum.request.mockResolvedValue(['invalid-address']);

      renderWithWeb3Provider();
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('connect-btn'));
      });

      // Should handle gracefully without crashing
      expect(screen.getByTestId('connected')).toBeInTheDocument();
    });
  });
});