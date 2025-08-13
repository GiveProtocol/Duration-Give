import React, { useCallback } from 'react';
import { Globe } from 'lucide-react';

interface RegionFilterProps {
  value: string;
  onChange: (_value: string) => void;
}

export const RegionFilter: React.FC<RegionFilterProps> = ({ value, onChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={handleChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        aria-label="Filter by region"
      >
        <option value="all">All Regions</option>
        <option value="na">North America</option>
        <option value="eu">Europe</option>
        <option value="asia">Asia</option>
        <option value="africa">Africa</option>
        <option value="sa">South America</option>
        <option value="oceania">Oceania</option>
      </select>
    </div>
  );
};