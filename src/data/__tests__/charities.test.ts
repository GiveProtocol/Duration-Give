import { SAMPLE_CHARITIES } from '../charities';

describe('SAMPLE_CHARITIES', () => {
  it('exports an array of charity objects', () => {
    expect(Array.isArray(SAMPLE_CHARITIES)).toBe(true);
    expect(SAMPLE_CHARITIES.length).toBeGreaterThan(0);
  });

  it('contains charity objects with required properties', () => {
    SAMPLE_CHARITIES.forEach((charity) => {
      expect(charity).toHaveProperty('id');
      expect(charity).toHaveProperty('name');
      expect(charity).toHaveProperty('category');
      expect(charity).toHaveProperty('description');
      expect(charity).toHaveProperty('image');
      expect(charity).toHaveProperty('country');
    });
  });

  it('has unique charity IDs', () => {
    const ids = SAMPLE_CHARITIES.map(charity => charity.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(SAMPLE_CHARITIES.length);
  });

  it('has valid charity data types', () => {
    SAMPLE_CHARITIES.forEach((charity) => {
      expect(typeof charity.id).toBe('number');
      expect(typeof charity.name).toBe('string');
      expect(typeof charity.category).toBe('string');
      expect(typeof charity.description).toBe('string');
      expect(typeof charity.image).toBe('string');
      expect(typeof charity.country).toBe('string');
    });
  });

  it('has non-empty string properties', () => {
    SAMPLE_CHARITIES.forEach((charity) => {
      expect(charity.name.length).toBeGreaterThan(0);
      expect(charity.category.length).toBeGreaterThan(0);
      expect(charity.description.length).toBeGreaterThan(0);
      expect(charity.image.length).toBeGreaterThan(0);
      expect(charity.country.length).toBeGreaterThan(0);
    });
  });

  it('has valid image URLs', () => {
    SAMPLE_CHARITIES.forEach((charity) => {
      expect(charity.image).toMatch(/^https?:\/\/.+/);
    });
  });

  it('includes diverse charity categories', () => {
    const categories = SAMPLE_CHARITIES.map(charity => charity.category);
    const uniqueCategories = new Set(categories);
    expect(uniqueCategories.size).toBeGreaterThan(1);
  });

  it('includes charities from different countries', () => {
    const countries = SAMPLE_CHARITIES.map(charity => charity.country);
    const uniqueCountries = new Set(countries);
    expect(uniqueCountries.size).toBeGreaterThan(1);
  });

  it('has specific expected charities', () => {
    const charityNames = SAMPLE_CHARITIES.map(charity => charity.name);
    expect(charityNames).toContain('Global Water Foundation');
    expect(charityNames).toContain('Education for All');
    expect(charityNames).toContain('Climate Action Now');
  });

  it('maintains consistent data structure across all charities', () => {
    if (SAMPLE_CHARITIES.length === 0) return;
    
    const firstCharityKeys = Object.keys(SAMPLE_CHARITIES[0]).sort((a, b) => a.localeCompare(b));
    SAMPLE_CHARITIES.forEach((charity) => {
      const charityKeys = Object.keys(charity).sort((a, b) => a.localeCompare(b));
      expect(charityKeys).toEqual(firstCharityKeys);
    });
  });
});