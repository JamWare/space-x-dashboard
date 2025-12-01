'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterOptions } from '@/hooks/use-filtered-starlinks';

interface MapFilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resultCount: number;
  totalCount: number;
  withCoordinatesCount: number;
}

export function MapFilterControls({
  filters,
  onFiltersChange,
  resultCount,
  totalCount,
  withCoordinatesCount,
}: MapFilterControlsProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or NORAD ID..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      {/* Status Filter */}
      <div>
        <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </span>
        <div className="flex gap-2">
          <Button
            variant={filters.status === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', 'all')}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', 'active')}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'deorbited' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', 'deorbited')}
          >
            Deorbited
          </Button>
        </div>
      </div>

      {/* Altitude Range */}
      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Altitude Range</span>
          <span className="font-mono text-xs">
            {filters.altitudeRange[0]} - {filters.altitudeRange[1]} km
          </span>
        </label>
        <div className="space-y-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-500">
              Min: {filters.altitudeRange[0]} km
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.altitudeRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                // Ensure min doesn't exceed max
                if (newMin <= filters.altitudeRange[1]) {
                  updateFilter('altitudeRange', [newMin, filters.altitudeRange[1]]);
                }
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-500">
              Max: {filters.altitudeRange[1]} km
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.altitudeRange[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                // Ensure max doesn't go below min
                if (newMax >= filters.altitudeRange[0]) {
                  updateFilter('altitudeRange', [filters.altitudeRange[0], newMax]);
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 border-t border-gray-200 pt-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        <span>
          Showing {resultCount} of {withCoordinatesCount} satellites
        </span>
        {filters.status !== 'all' && (
          <Badge variant="neutral">{filters.status}</Badge>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500">
        {withCoordinatesCount} of {totalCount} satellites have location data
      </div>
    </div>
  );
}
