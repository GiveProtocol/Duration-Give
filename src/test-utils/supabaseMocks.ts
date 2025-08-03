/**
 * Shared Supabase mock utilities to reduce duplication across test files
 */

export const createMockSupabaseQuery = (data: any[] = [], error: any = null) => ({
  data,
  error
});

export const createMockSupabaseClient = (overrides: any = {}) => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
        single: jest.fn(() => Promise.resolve(createMockSupabaseQuery(null, null))),
        order: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
        in: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
        })),
        ...overrides.selectEq
      })),
      order: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
      single: jest.fn(() => Promise.resolve(createMockSupabaseQuery(null, null))),
      ...overrides.select
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
      single: jest.fn(() => Promise.resolve(createMockSupabaseQuery(null, null))),
      ...overrides.insert
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
        ...overrides.updateEq
      })),
      ...overrides.update
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve(createMockSupabaseQuery([], null))),
      ...overrides.deleteEq
    })),
    ...overrides.from
  })),
  ...overrides.client
});

export const setupSupabaseMocks = (customData?: any) => {
  jest.mock('@/lib/supabase', () => ({
    supabase: createMockSupabaseClient(customData)
  }));
};

export const mockCharityData = [
  {
    id: 'charity-1',
    name: 'Test Charity 1',
    description: 'A test charity',
    category: 'education',
    country: 'US',
    verified: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'charity-2', 
    name: 'Test Charity 2',
    description: 'Another test charity',
    category: 'healthcare',
    country: 'CA',
    verified: false,
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockDonationData = [
  {
    id: 'donation-1',
    amount: '100.00',
    donor_id: 'donor-1',
    charity_id: 'charity-1',
    status: 'completed',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'donation-2',
    amount: '250.00', 
    donor_id: 'donor-2',
    charity_id: 'charity-2',
    status: 'pending',
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockVolunteerData = [
  {
    id: 'volunteer-1',
    user_id: 'user-1',
    charity_id: 'charity-1',
    hours: 10,
    status: 'verified',
    created_at: '2024-01-01T00:00:00Z'
  }
];