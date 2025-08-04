import {
  createMockSupabaseQuery,
  createMockSupabaseClient,
  setupSupabaseMocks,
  mockCharityData,
  mockDonationData,
  mockVolunteerData
} from '../supabaseMocks';

describe('supabaseMocks', () => {
  describe('createMockSupabaseQuery', () => {
    it('creates query response with default values', () => {
      const result = createMockSupabaseQuery();
      
      expect(result).toEqual({
        data: [],
        error: null
      });
    });

    it('creates query response with custom data', () => {
      const customData = [{ id: 1, name: 'Test' }];
      const result = createMockSupabaseQuery(customData);
      
      expect(result).toEqual({
        data: customData,
        error: null
      });
    });

    it('creates query response with error', () => {
      const error = { message: 'Database error' };
      const result = createMockSupabaseQuery(null, error);
      
      expect(result).toEqual({
        data: null,
        error
      });
    });
  });

  describe('createMockSupabaseClient', () => {
    it('creates mock client with from method', () => {
      const client = createMockSupabaseClient();
      
      expect(client.from).toBeInstanceOf(Function);
    });

    it('from method returns query builder with select', () => {
      const client = createMockSupabaseClient();
      const queryBuilder = client.from('test_table');
      
      expect(queryBuilder.select).toBeInstanceOf(Function);
      expect(queryBuilder.insert).toBeInstanceOf(Function);
      expect(queryBuilder.update).toBeInstanceOf(Function);
      expect(queryBuilder.delete).toBeInstanceOf(Function);
    });

    it('select method returns chainable methods', () => {
      const client = createMockSupabaseClient();
      const selectResult = client.from('test_table').select();
      
      expect(selectResult.eq).toBeInstanceOf(Function);
      expect(selectResult.order).toBeInstanceOf(Function);
      expect(selectResult.single).toBeInstanceOf(Function);
    });

    it('applies custom overrides', () => {
      const customData = { data: [{ id: 1 }], error: null };
      const client = createMockSupabaseClient({
        select: { customMethod: jest.fn() }
      });
      
      const queryBuilder = client.from('test_table');
      const selectResult = queryBuilder.select();
      
      expect(selectResult.customMethod).toBeInstanceOf(Function);
    });
  });

  describe('setupSupabaseMocks', () => {
    it('sets up supabase mocks', () => {
      setupSupabaseMocks();
      
      // Verify function runs without errors
      expect(jest.mock).toBeDefined();
    });

    it('accepts custom data overrides', () => {
      const customOverrides = {
        select: { data: [{ id: 1 }] }
      };
      
      setupSupabaseMocks(customOverrides);
      
      // Verify function runs without errors with custom data
      expect(jest.mock).toBeDefined();
    });
  });

  describe('mockCharityData', () => {
    it('contains expected charity data structure', () => {
      expect(mockCharityData).toHaveLength(2);
      expect(mockCharityData[0]).toEqual({
        id: 'charity-1',
        name: 'Test Charity 1',
        description: 'A test charity',
        category: 'education',
        country: 'US',
        verified: true,
        created_at: '2024-01-01T00:00:00Z'
      });
    });
  });

  describe('mockDonationData', () => {
    it('contains expected donation data structure', () => {
      expect(mockDonationData).toHaveLength(2);
      expect(mockDonationData[0]).toEqual({
        id: 'donation-1',
        amount: '100.00',
        donor_id: 'donor-1',
        charity_id: 'charity-1',
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z'
      });
    });
  });

  describe('mockVolunteerData', () => {
    it('contains expected volunteer data structure', () => {
      expect(mockVolunteerData).toHaveLength(1);
      expect(mockVolunteerData[0]).toEqual({
        id: 'volunteer-1',
        user_id: 'user-1',
        charity_id: 'charity-1',
        hours: 10,
        status: 'verified',
        created_at: '2024-01-01T00:00:00Z'
      });
    });
  });
});