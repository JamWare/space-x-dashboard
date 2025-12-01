'use client';

import { useState, useEffect } from 'react';
import { subYears, format } from 'date-fns';
import type { Rocket } from '@/lib/schemas/rockets.schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalyticsFiltersProps {
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onRocketFilterChange: (rocketIds: string[]) => void;
  rockets: Rocket[];
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
}

export function AnalyticsFilters({
  onDateRangeChange,
  onRocketFilterChange,
  rockets,
  defaultStartDate = null,
  defaultEndDate = null,
}: AnalyticsFiltersProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedRockets, setSelectedRockets] = useState<Set<string>>(new Set());

  // Initialize dates if provided
  useEffect(() => {
    if (defaultStartDate) {
      setStartDate(format(defaultStartDate, 'yyyy-MM-dd'));
    }
    if (defaultEndDate) {
      setEndDate(format(defaultEndDate, 'yyyy-MM-dd'));
    }
  }, [defaultStartDate, defaultEndDate]);

  // Handle date range preset buttons
  const setPresetRange = (years: number | null) => {
    if (years === null) {
      // All time
      setStartDate('');
      setEndDate('');
      onDateRangeChange(null, null);
    } else {
      const end = new Date();
      const start = subYears(end, years);
      setStartDate(format(start, 'yyyy-MM-dd'));
      setEndDate(format(end, 'yyyy-MM-dd'));
      onDateRangeChange(start, end);
    }
  };

  // Handle start date change
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onDateRangeChange(
      value ? new Date(value) : null,
      endDate ? new Date(endDate) : null
    );
  };

  // Handle end date change
  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onDateRangeChange(
      startDate ? new Date(startDate) : null,
      value ? new Date(value) : null
    );
  };

  // Handle rocket selection toggle
  const toggleRocket = (rocketId: string) => {
    const newSelected = new Set(selectedRockets);
    if (newSelected.has(rocketId)) {
      newSelected.delete(rocketId);
    } else {
      newSelected.add(rocketId);
    }
    setSelectedRockets(newSelected);
    onRocketFilterChange(Array.from(newSelected));
  };

  // Handle select/deselect all rockets
  const toggleAllRockets = () => {
    if (selectedRockets.size === rockets.length) {
      setSelectedRockets(new Set());
      onRocketFilterChange([]);
    } else {
      const allIds = new Set(rockets.map(r => r.id));
      setSelectedRockets(allIds);
      onRocketFilterChange(Array.from(allIds));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedRockets(new Set());
    onDateRangeChange(null, null);
    onRocketFilterChange([]);
  };

  const hasActiveFilters = startDate || endDate || selectedRockets.size > 0;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      {/* Date Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Date Range
          </h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!startDate && !endDate ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPresetRange(null)}
          >
            All Time
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(1)}
          >
            Last Year
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(2)}
          >
            Last 2 Years
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresetRange(5)}
          >
            Last 5 Years
          </Button>
        </div>

        {/* Custom date inputs */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-date"
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Rocket Type Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Rocket Type
          </h3>
          {selectedRockets.size > 0 && (
            <Badge variant="neutral">
              {selectedRockets.size} selected
            </Badge>
          )}
        </div>

        {/* Select all toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllRockets}
          className="w-full"
        >
          {selectedRockets.size === rockets.length ? 'Deselect All' : 'Select All'}
        </Button>

        {/* Rocket checkboxes */}
        <div className="grid gap-2 sm:grid-cols-2">
          {rockets.map((rocket) => (
            <label
              key={rocket.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedRockets.has(rocket.id)}
                onChange={() => toggleRocket(rocket.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {rocket.name}
                </span>
                {rocket.active && (
                  <Badge variant="success" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
