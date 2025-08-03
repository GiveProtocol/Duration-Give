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

// Setup common mocks to reduce duplication
setupCommonMocks();

// Mock the specific dependencies
jest.mock('@/hooks/useWalletAlias');
jest.mock('@/contexts/Web3Context');
jest.mock('@/utils/web3', () => ({
  shortenAddress: mockShortenAddress,
}));

// Override Input component for test specificity
jest.mock('@/components/ui/Input', () => ({
  Input: (props: any) => <input {...props} data-testid="alias-input" />,
}));

describe('WalletAliasSettings', () => {
  const mockSetWalletAlias = jest.fn();
  const mockDeleteWalletAlias = jest.fn();

  const defaultMocks = {
    walletAlias: createMockWalletAlias({
      setWalletAlias: mockSetWalletAlias,
      deleteWalletAlias: mockDeleteWalletAlias,
    }),
    web3: createMockWeb3({
      address: testAddresses.mainWallet,
      isConnected: true,
    })
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useWalletAlias as jest.Mock).mockReturnValue(defaultMocks.walletAlias);
    (useWeb3 as jest.Mock).mockReturnValue(defaultMocks.web3);
    mockSetWalletAlias.mockResolvedValue(true);
    mockDeleteWalletAlias.mockResolvedValue(true);
  });

  const testCases = {
    rendering: [
      { name: 'renders the wallet alias settings component', expectation: () => expect(screen.getByText('Wallet Alias')).toBeInTheDocument() },
      { name: 'shows current wallet address when connected', expectation: () => expect(screen.getByText('0x1234...7890')).toBeInTheDocument() },
      { name: 'renders the card container', expectation: () => expect(screen.getByTestId('card')).toBeInTheDocument() }
    ],
    noAlias: [
      { name: 'shows set alias form by default', expectation: () => {
        expect(screen.getByTestId('alias-input')).toBeInTheDocument();
        expect(screen.getByText('Set Alias')).toBeInTheDocument();
      }},
      { name: 'allows user to enter alias', action: () => fireEvent.change(screen.getByTestId('alias-input'), { target: { value: 'MyWallet' } }), expectation: () => expect(screen.getByTestId('alias-input')).toHaveValue('MyWallet') }
    ],
    validation: [
      { name: 'empty alias', value: '', error: 'Alias cannot be empty' },
      { name: 'alias too short', value: 'ab', error: 'Alias must be between 3 and 20 characters' },
      { name: 'alias too long', value: 'a'.repeat(21), error: 'Alias must be between 3 and 20 characters' },
      { name: 'invalid characters', value: 'invalid@alias!', error: 'Alias can only contain letters, numbers, underscores, and hyphens' }
    ]
  };

  describe('Component Rendering', () => {
    testCases.rendering.forEach(({ name, expectation }) => {
      it(name, () => {
        render(<WalletAliasSettings />);
        expectation();
      });
    });
  });

  describe('No Alias Set', () => {
    testCases.noAlias.forEach(({ name, action, expectation }) => {
      it(name, () => {
        render(<WalletAliasSettings />);
        if (action) action();
        expectation();
      });
    });

    it('submits alias when form is submitted', async () => {
      render(<WalletAliasSettings />);
      
      fireEvent.change(screen.getByTestId('alias-input'), { target: { value: 'MyWallet' } });
      fireEvent.click(screen.getByText('Set Alias'));
      
      await waitFor(() => {
        expect(mockSetWalletAlias).toHaveBeenCalledWith('MyWallet');
      });
    });
  });

  describe('Existing Alias', () => {
    const existingAliasMock = createMockWalletAlias({
      alias: 'ExistingAlias',
      aliases: { [testAddresses.mainWallet]: 'ExistingAlias' },
      setWalletAlias: mockSetWalletAlias,
      deleteWalletAlias: mockDeleteWalletAlias,
    });

    beforeEach(() => {
      (useWalletAlias as jest.Mock).mockReturnValue(existingAliasMock);
    });

    const existingAliasTests = [
      { name: 'displays the existing alias', expectation: () => expect(screen.getByText('ExistingAlias')).toBeInTheDocument() },
      { name: 'shows edit and delete buttons', expectation: () => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      }}
    ];

    existingAliasTests.forEach(({ name, expectation }) => {
      it(name, () => {
        render(<WalletAliasSettings />);
        expectation();
      });
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

    describe('Edit Mode', () => {
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

  describe('Validation', () => {
    testCases.validation.forEach(({ name, value, error }) => {
      it(`shows error for ${name}`, async () => {
        render(<WalletAliasSettings />);
        
        const input = screen.getByTestId('alias-input');
        const submitButton = screen.getByText('Set Alias');
        
        if (value) fireEvent.change(input, { target: { value } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText(error)).toBeInTheDocument();
        });
      });
    });

    it('accepts valid alias', async () => {
      render(<WalletAliasSettings />);
      
      fireEvent.change(screen.getByTestId('alias-input'), { target: { value: 'valid_alias-123' } });
      fireEvent.click(screen.getByText('Set Alias'));
      
      await waitFor(() => {
        expect(mockSetWalletAlias).toHaveBeenCalledWith('valid_alias-123');
      });
    });
  });

  describe('State Handling', () => {
    it('shows loading state when setting alias', () => {
      (useWalletAlias as jest.Mock).mockReturnValue({
        ...defaultMocks.walletAlias,
        loading: true,
      });

      render(<WalletAliasSettings />);
      expect(screen.getByText('Wallet Alias')).toBeInTheDocument();
    });

    it('handles disconnected wallet state', () => {
      (useWeb3 as jest.Mock).mockReturnValue(createMockWeb3({
        address: null,
        isConnected: false,
      }));

      render(<WalletAliasSettings />);
      expect(screen.getByText('Wallet Alias')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    const errorTests = [
      { 
        name: 'setWalletAlias failure',
        setup: () => mockSetWalletAlias.mockResolvedValue(false),
        action: () => {
          fireEvent.change(screen.getByTestId('alias-input'), { target: { value: 'TestAlias' } });
          fireEvent.click(screen.getByText('Set Alias'));
        },
        expectation: async () => {
          await waitFor(() => {
            expect(mockSetWalletAlias).toHaveBeenCalledWith('TestAlias');
          });
        }
      },
      {
        name: 'deleteWalletAlias failure',
        setup: () => {
          (useWalletAlias as jest.Mock).mockReturnValue({
            alias: 'ExistingAlias',
            aliases: { [testAddresses.mainWallet]: 'ExistingAlias' },
            loading: false,
            error: null,
            setWalletAlias: mockSetWalletAlias,
            deleteWalletAlias: mockDeleteWalletAlias,
          });
          mockDeleteWalletAlias.mockResolvedValue(false);
        },
        action: () => fireEvent.click(screen.getByText('Delete')),
        expectation: async () => {
          await waitFor(() => {
            expect(mockDeleteWalletAlias).toHaveBeenCalled();
          });
        }
      }
    ];

    errorTests.forEach(({ name, setup, action, expectation }) => {
      it(`handles ${name} gracefully`, async () => {
        setup();
        render(<WalletAliasSettings />);
        action();
        await expectation();
      });
    });
  });
});