'use client';

import { useMemo, useState } from 'react';
import { useRockets } from '@/hooks/use-rockets';
import { RocketCard } from '@/components/rockets/rocket-card';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RocketsPage() {
  const { rockets, isLoading, isError, mutate } = useRockets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'first-flight' | 'cost'>('name');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc');

  // Filter and sort rockets
  const filteredRockets = useMemo(() => {
    let result = [...rockets];

    // Apply search filter (by name or country)
    if (search) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter(r => r.active);
    } else if (statusFilter === 'inactive') {
      result = result.filter(r => !r.active);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'first-flight') {
        const dateA = new Date(a.first_flight).getTime();
        const dateB = new Date(b.first_flight).getTime();
        comparison = dateB - dateA;
      } else if (sortBy === 'cost') {
        comparison = b.cost_per_launch - a.cost_per_launch;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [rockets, search, statusFilter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Rockets
        </h1>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Rockets
        </h1>
        <ErrorMessage error={isError} onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Rockets
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore SpaceX&apos;s fleet of launch vehicles with detailed specifications
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        {/* Filter and sort buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status:
          </span>
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </span>
            <Button
              variant={sortBy === 'name' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'first-flight' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('first-flight')}
            >
              First Flight
            </Button>
            <Button
              variant={sortBy === 'cost' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('cost')}
            >
              Cost
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={sortOrder === 'desc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('desc')}
            >
              {sortBy === 'name' ? 'Z-A' : 'High-Low'}
            </Button>
            <Button
              variant={sortOrder === 'asc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('asc')}
            >
              {sortBy === 'name' ? 'A-Z' : 'Low-High'}
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredRockets.length} of {rockets.length} rockets
          </span>
          {statusFilter !== 'all' && (
            <Badge variant="neutral">{statusFilter}</Badge>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredRockets.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No rockets found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRockets.map((rocket) => (
            <RocketCard key={rocket.id} rocket={rocket} />
          ))}
        </div>
      )}
    </div>
  );
}
