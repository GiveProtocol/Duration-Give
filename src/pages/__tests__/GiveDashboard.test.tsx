import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GiveDashboard } from '../GiveDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { useTranslation } from '@/hooks/useTranslation';
import { createMockAuth, createMockWeb3, createMockTranslation, setupCommonMocks } from '@/test-utils/mockSetup';

// Mock all dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/Web3Context');
jest.mock('@/hooks/useTranslation');

// Setup common mocks to reduce duplication
setupCommonMocks();

// Component-specific mocks
jest.mock('@/components/contribution/DonationExportModal', () => ({
  DonationExportModal: ({ donations, onClose }: { donations: Array<{ id: string; [key: string]: unknown }>; onClose: () => void }) => (
    <div data-testid="export-modal">
      <span>Export Modal - {donations.length} donations</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock('@/components/settings/WalletAliasSettings', () => ({
  WalletAliasSettings: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="wallet-settings">
      <span>Wallet Settings</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock('@/components/donor/ScheduledDonations', () => ({
  ScheduledDonations: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="scheduled-donations">
      <span>Scheduled Donations</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('GiveDashboard', () => {
  const mockUser = { id: '1', email: 'test@example.com' };

  beforeEach(() => {
    mockUseAuth.mockReturnValue(createMockAuth({
      user: mockUser,
      userType: 'donor',
    }));

    mockUseWeb3.mockReturnValue(createMockWeb3({
      address: '0x123',
      isConnected: true,
    }));

    mockUseTranslation.mockReturnValue(createMockTranslation());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = {
    authentication: [
      {
        name: 'redirects to login when user is not authenticated',
        authMock: createMockAuth({ user: null, userType: null }),
        expectation: () => expect(screen.queryByText('dashboard.title')).not.toBeInTheDocument()
      },
      {
        name: 'renders dashboard when user is authenticated',
        authMock: createMockAuth({ user: mockUser, userType: 'donor' }),
        expectation: () => expect(screen.getByText('dashboard.title')).toBeInTheDocument()
      },
      {
        name: 'shows loading state when auth is loading',
        authMock: createMockAuth({ user: null, userType: null, loading: true }),
        expectation: () => expect(screen.getByText('common.loading')).toBeInTheDocument()
      }
    ],
    walletConnection: [
      {
        name: 'shows connect wallet button when not connected',
        web3Mock: createMockWeb3({ address: null, isConnected: false }),
        expectation: () => expect(screen.getByText('web3.connectWallet')).toBeInTheDocument()
      },
      {
        name: 'shows wallet address when connected',
        web3Mock: createMockWeb3({ address: '0x123', isConnected: true }),
        expectation: () => expect(screen.getByText(/0x123/)).toBeInTheDocument()
      }
    ],
    filterSort: [
      { element: 'year filter dropdown', selector: 'dashboard.filters.allYears' },
      { element: 'type filter dropdown', selector: 'dashboard.filters.allTypes' }
    ],
    modals: [
      { name: 'export', button: 'dashboard.exportData', testId: 'export-modal' },
      { name: 'wallet settings', button: 'dashboard.walletSettings', testId: 'wallet-settings' },
      { name: 'scheduled donations', button: 'dashboard.scheduledDonations', testId: 'scheduled-donations' }
    ],
    statistics: [
      'dashboard.stats.totalDonations',
      'dashboard.stats.volunteerHours', 
      'dashboard.stats.impactScore'
    ],
    tableHeaders: [
      'dashboard.table.date',
      'dashboard.table.type',
      'dashboard.table.amount',
      'dashboard.table.organization',
      'dashboard.table.status'
    ]
  };

  describe('Authentication and Access Control', () => {
    testCases.authentication.forEach(({ name, authMock, expectation }) => {
      it(name, () => {
        mockUseAuth.mockReturnValue(authMock);
        renderWithRouter(<GiveDashboard />);
        expectation();
      });
    });
  });

  describe('Wallet Connection', () => {
    testCases.walletConnection.forEach(({ name, web3Mock, expectation }) => {
      it(name, () => {
        mockUseWeb3.mockReturnValue(web3Mock);
        renderWithRouter(<GiveDashboard />);
        expectation();
      });
    });

    it('handles wallet connection', () => {
      const mockConnect = jest.fn();
      mockUseWeb3.mockReturnValue(createMockWeb3({
        address: null,
        isConnected: false,
        connect: mockConnect,
      }));

      renderWithRouter(<GiveDashboard />);
      fireEvent.click(screen.getByText('web3.connectWallet'));
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  describe('Filter and Sort Functionality', () => {
    testCases.filterSort.forEach(({ element, selector }) => {
      it(`renders ${element}`, () => {
        renderWithRouter(<GiveDashboard />);
        expect(screen.getByDisplayValue(selector)).toBeInTheDocument();
      });
    });

    it('handles filter changes', () => {
      renderWithRouter(<GiveDashboard />);
      
      const yearSelect = screen.getByDisplayValue('dashboard.filters.allYears');
      fireEvent.change(yearSelect, { target: { value: '2024' } });
      expect(yearSelect).toHaveValue('2024');

      const typeSelect = screen.getByDisplayValue('dashboard.filters.allTypes');
      fireEvent.change(typeSelect, { target: { value: 'one-time' } });
      expect(typeSelect).toHaveValue('one-time');
    });

    it('handles sort configuration changes', () => {
      renderWithRouter(<GiveDashboard />);
      const dateHeader = screen.getByText('dashboard.table.date');
      fireEvent.click(dateHeader);
      expect(dateHeader).toBeInTheDocument();
    });
  });

  describe('Modal Functionality', () => {
    testCases.modals.forEach(({ name, button, testId }) => {
      it(`opens and closes ${name} modal`, async () => {
        renderWithRouter(<GiveDashboard />);
        
        // Open modal
        fireEvent.click(screen.getByText(button));
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        
        // Close modal
        fireEvent.click(screen.getByText('Close'));
        await waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Statistics Display', () => {
    testCases.statistics.forEach((stat) => {
      it(`displays ${stat.split('.').pop()} statistic`, () => {
        renderWithRouter(<GiveDashboard />);
        expect(screen.getByText(stat)).toBeInTheDocument();
      });
    });
  });

  describe('Data Display', () => {
    it('displays transaction data in table format', () => {
      renderWithRouter(<GiveDashboard />);
      
      testCases.tableHeaders.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });

    it('handles empty transaction state', () => {
      renderWithRouter(<GiveDashboard />);
      expect(screen.getByText('dashboard.table.date')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    const errorTests = [
      { name: 'auth context errors', mock: mockUseAuth },
      { name: 'web3 context errors', mock: mockUseWeb3 }
    ];

    errorTests.forEach(({ name, mock }) => {
      it(`handles ${name} gracefully`, () => {
        mock.mockImplementation(() => {
          throw new Error(`${name} error`);
        });

        expect(() => renderWithRouter(<GiveDashboard />)).not.toThrow();
      });
    });
  });

  describe('User Type Specific Features', () => {
    const userTypes = [
      { type: 'donor', feature: 'dashboard.scheduledDonations' },
      { type: 'charity', feature: 'dashboard.title' }
    ];

    userTypes.forEach(({ type, feature }) => {
      it(`shows ${type}-specific features for ${type} users`, () => {
        mockUseAuth.mockReturnValue(createMockAuth({
          user: mockUser,
          userType: type,
        }));

        renderWithRouter(<GiveDashboard />);
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and Routing', () => {
    it('handles location state for wallet settings', () => {
      const mockLocation = {
        state: { showWalletSettings: true },
        pathname: '/dashboard',
        search: '',
        hash: '',
        key: 'test',
      };

      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: () => mockLocation,
      }));

      renderWithRouter(<GiveDashboard />);
      expect(screen.getByTestId('wallet-settings')).toBeInTheDocument();
    });
  });
});