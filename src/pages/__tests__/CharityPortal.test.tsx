import React from 'react'; // eslint-disable-line no-unused-vars
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CharityPortal } from '../CharityPortal';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { createMockAuth, createMockProfile, createMockTranslation, setupCommonMocks } from '@/test-utils/mockSetup';
import { MockUIComponentProps, MockDonationExportModalProps } from '@/test-utils/types';
import { MemoryRouter } from 'react-router-dom';

// Mock all dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/hooks/useProfile');
jest.mock('@/hooks/useTranslation');
jest.mock('@/utils/logger');
jest.mock('@/utils/date');

// Setup common mocks
setupCommonMocks();

// Mock UI components
jest.mock('@/components/ui/LoadingSpinner', () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>Loading...</div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, className, ...props }: MockUIComponentProps) => (
    <button 
      onClick={onClick}
      data-variant={variant} 
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className, ...props }: MockUIComponentProps) => (
    <div className={className} {...props}>{children}</div>
  ),
}));

jest.mock('@/components/CurrencyDisplay', () => ({
  CurrencyDisplay: ({ amount }: { amount: number }) => (
    <span data-testid="currency-display">${amount}</span>
  ),
}));

jest.mock('@/components/contribution/DonationExportModal', () => ({
  DonationExportModal: ({ donations, onClose }: MockDonationExportModalProps) => (
    <div data-testid="donation-export-modal">
      <button onClick={onClose}>Close</button>
      <div>Exporting {donations.length} donations</div>
    </div>
  ),
}));

// Mock supabase client - the actual mock object is defined in jest.mock below

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          in: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}));

// Get the mocked supabase after jest.mock
const { supabase: mockSupabase } = jest.requireMock('@/lib/supabase');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

const renderCharityPortal = (props = {}) => {
  return render(
    <MemoryRouter>
      <CharityPortal {...props} />
    </MemoryRouter>
  );
};

describe('CharityPortal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue(
      createMockAuth({
        user: { id: 'user-123' },
        userType: 'charity',
      })
    );

    mockUseProfile.mockReturnValue(
      createMockProfile({
        profile: { id: 'charity-123', name: 'Test Charity' },
        loading: false,
      })
    );

    mockUseTranslation.mockReturnValue(
      createMockTranslation({
        t: jest.fn((key: string, fallback?: string) => fallback || key),
      })
    );
  });

  describe('loading state', () => {
    it('renders loading spinner when profile is loading', () => {
      mockUseProfile.mockReturnValue(
        createMockProfile({ loading: true })
      );
      
      renderCharityPortal();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('displays error message when data fetch fails', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.reject(new Error('Network error'))),
        })),
      });

      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText(/failed to load charity data/i)).toBeInTheDocument();
      });
    });

    it('shows retry button when error occurs', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.reject(new Error('Network error'))),
        })),
      });

      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('retries data fetch when retry button is clicked', async () => {
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.reject(new Error('Network error'));
            }
            return Promise.resolve({ data: [], error: null });
          }),
        })),
      }));

      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Retry'));

      await waitFor(() => {
        expect(screen.getByText('charity.dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('access control', () => {
    it('redirects to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({ user: null })
      );

      renderCharityPortal();
      
      // Should redirect to login (Navigate component gets rendered)
      expect(screen.queryByText('charity.dashboard')).not.toBeInTheDocument();
    });

    it('redirects to donor portal when user is not charity type', () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({
          user: { id: 'user-123' },
          userType: 'donor',
        })
      );

      renderCharityPortal();
      
      // Should redirect to donor portal (Navigate component gets rendered)
      expect(screen.queryByText('charity.dashboard')).not.toBeInTheDocument();
    });
  });

  describe('successful data loading', () => {
    beforeEach(() => {
      // Mock successful data responses
      mockSupabase.from.mockImplementation((table: string) => {
        switch (table) {
          case 'donations':
            return {
              select: jest.fn(() => ({
                eq: jest.fn((_field: string, _value: string) => {
                  if (_field === 'charity_id' && _value === 'charity-123') {
                    return Promise.resolve({
                      data: [
                        { amount: '100' },
                        { amount: '200' },
                      ],
                      error: null,
                    });
                  }
                  return {
                    order: jest.fn(() => Promise.resolve({
                      data: [
                        {
                          id: 'donation-1',
                          amount: '100',
                          created_at: '2024-01-01T10:00:00Z',
                          donor: { id: 'donor-1' },
                        },
                      ],
                      error: null,
                    })),
                  };
                }),
              })),
            };
          case 'volunteer_hours':
            return {
              select: jest.fn(() => ({
                eq: jest.fn((_field: string, _value: string) => ({
                  eq: jest.fn((field2: string, value2: string) => {
                    if (field2 === 'status' && value2 === 'approved') {
                      return Promise.resolve({
                        data: [{ hours: '5' }, { hours: '3' }],
                        error: null,
                      });
                    }
                    return {
                      order: jest.fn(() => Promise.resolve({
                        data: [
                          {
                            id: 'hour-1',
                            volunteer_id: 'vol-1',
                            hours: '4',
                            date_performed: '2024-01-15',
                            description: 'Test work',
                            volunteer: { id: 'vol-1' },
                          },
                        ],
                        error: null,
                      })),
                    };
                  }),
                })),
              })),
            };
          case 'skill_endorsements':
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({
                  data: [{ id: 'endorsement-1' }],
                  error: null,
                })),
              })),
            };
          case 'volunteer_opportunities':
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({
                  data: [{ id: 'opp-1' }],
                  error: null,
                })),
              })),
            };
          case 'volunteer_applications':
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  in: jest.fn(() => ({
                    order: jest.fn(() => Promise.resolve({
                      data: [
                        {
                          id: 'app-1',
                          full_name: 'John Doe',
                          opportunity: { id: 'opp-1', title: 'Beach Cleanup' },
                        },
                      ],
                      error: null,
                    })),
                  })),
                })),
              })),
            };
          default:
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            };
        }
      });
    });

    it('renders charity dashboard with statistics', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.dashboard')).toBeInTheDocument();
        expect(screen.getByText('dashboard.totalDonations')).toBeInTheDocument();
        expect(screen.getByText('charity.activeVolunteers')).toBeInTheDocument();
        expect(screen.getByText('dashboard.volunteerHours')).toBeInTheDocument();
        expect(screen.getByText('dashboard.skillsEndorsed')).toBeInTheDocument();
      });
    });

    it('renders all navigation tabs', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.transactions')).toBeInTheDocument();
        expect(screen.getByText('charity.volunteers')).toBeInTheDocument();
        expect(screen.getByText('charity.applications')).toBeInTheDocument();
        expect(screen.getByText('volunteer.opportunities')).toBeInTheDocument();
      });
    });

    it('displays calculated statistics correctly', async () => {
      renderCharityPortal();

      await waitFor(() => {
        // Should show calculated totals (100 + 200 = 300 for donations, 5 + 3 = 8 for hours)
        expect(screen.getByText('$300')).toBeInTheDocument(); // Total donations
        expect(screen.getByText('8')).toBeInTheDocument(); // Total volunteer hours
        expect(screen.getByText('1')).toBeInTheDocument(); // Endorsements count
        expect(screen.getByText('1')).toBeInTheDocument(); // Unique volunteers count
      });
    });
  });

  describe('tab navigation', () => {
    it('switches to volunteers tab when clicked', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.volunteers')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('charity.volunteers'));
      
      await waitFor(() => {
        expect(screen.getByText('volunteer.pendingHours')).toBeInTheDocument();
      });
    });

    it('switches to applications tab when clicked', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.applications')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('charity.applications'));
      
      await waitFor(() => {
        expect(screen.getByText('volunteer.pendingApplications')).toBeInTheDocument();
      });
    });

    it('switches to opportunities tab when clicked', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('volunteer.opportunities')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('volunteer.opportunities'));
      
      await waitFor(() => {
        expect(screen.getByText('volunteer.createNew')).toBeInTheDocument();
      });
    });

    it('maintains transactions tab as default active tab', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.transactions')).toBeInTheDocument();
        expect(screen.getByText('contributions.export')).toBeInTheDocument();
      });
    });
  });

  describe('export functionality', () => {
    it('shows export modal when export button is clicked', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.export')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('contributions.export'));
      
      // Export modal should be rendered
      await waitFor(() => {
        expect(screen.getByTestId('donation-export-modal')).toBeInTheDocument();
      });
    });

    it('closes export modal when close button is clicked', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.export')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('contributions.export'));
      
      await waitFor(() => {
        expect(screen.getByTestId('donation-export-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Close'));
      
      await waitFor(() => {
        expect(screen.queryByTestId('donation-export-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('sorting functionality', () => {
    it('handles transaction sorting by date', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.date')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('contributions.date'));
      
      // Should not throw error and sort icon should appear
      expect(screen.getByText('contributions.date')).toBeInTheDocument();
    });

    it('handles transaction sorting by type', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.type')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('contributions.type'));
      
      // Should not throw error
      expect(screen.getByText('contributions.type')).toBeInTheDocument();
    });

    it('handles transaction sorting by organization', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('donor.volunteer')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('donor.volunteer'));
      
      // Should not throw error
      expect(screen.getByText('donor.volunteer')).toBeInTheDocument();
    });

    it('handles transaction sorting by status', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.status')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('contributions.status'));
      
      // Should not throw error
      expect(screen.getByText('contributions.status')).toBeInTheDocument();
    });
  });

  describe('edge cases and empty states', () => {
    it('handles empty data gracefully', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      }));

      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('charity.dashboard')).toBeInTheDocument();
      });
      
      // Should render empty states
      fireEvent.click(screen.getByText('charity.volunteers'));
      await waitFor(() => {
        expect(screen.getByText('volunteer.noPendingHours')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('charity.applications'));
      await waitFor(() => {
        expect(screen.getByText('volunteer.noPendingApplications')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('volunteer.opportunities'));
      await waitFor(() => {
        expect(screen.getByText('volunteer.noOpportunitiesYet')).toBeInTheDocument();
      });
    });

    it('handles null and undefined values in data', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'donations') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({
                data: [
                  { amount: null },
                  { amount: undefined },
                  { amount: '100' },
                ],
                error: null,
              })),
            })),
          };
        }
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });

      renderCharityPortal();

      await waitFor(() => {
        // Should only count the valid amount (100)
        expect(screen.getByText('$100')).toBeInTheDocument();
      });
    });

    it('handles mixed data types in amounts', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'donations') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({
                data: [
                  { amount: 50 }, // number
                  { amount: '75' }, // string
                  { amount: '' }, // empty string
                ],
                error: null,
              })),
            })),
          };
        }
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });

      renderCharityPortal();

      await waitFor(() => {
        // Should sum 50 + 75 + 0 = 125
        expect(screen.getByText('$125')).toBeInTheDocument();
      });
    });
  });

  describe('transaction display', () => {
    beforeEach(() => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'donations') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn((_field: string, _value: string) => {
                if (_field === 'charity_id') {
                  return Promise.resolve({
                    data: [{ amount: '100' }],
                    error: null,
                  });
                }
                return {
                  order: jest.fn(() => Promise.resolve({
                    data: [
                      {
                        id: 'donation-1',
                        amount: '100',
                        created_at: '2024-01-01T10:00:00Z',
                        donor: { id: 'donor-1' },
                      },
                    ],
                    error: null,
                  })),
                };
              }),
            })),
          };
        }
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });
    });

    it('displays transaction table when data is available', async () => {
      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('contributions.date')).toBeInTheDocument();
        expect(screen.getByText('contributions.type')).toBeInTheDocument();
        expect(screen.getByText('contributions.details')).toBeInTheDocument();
        expect(screen.getByText('contributions.verification')).toBeInTheDocument();
      });
    });

    it('displays no transactions message when empty', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [],
              error: null,
            })),
          })),
        })),
      }));

      renderCharityPortal();

      await waitFor(() => {
        expect(screen.getByText('No transactions found.')).toBeInTheDocument();
      });
    });
  });
});