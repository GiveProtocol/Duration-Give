import React, { useCallback } from "react";
import { Clock } from "lucide-react";

interface TimeRangeFilterProps {
  value: string;
  onChange: (_value: string) => void;
}

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  value,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={handleChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        aria-label="Filter by time range"
      >
        <option value="all">All Time</option>
        <option value="year">This Year</option>
        <option value="month">This Month</option>
        <option value="week">This Week</option>
      </select>
    </div>
  );
};
