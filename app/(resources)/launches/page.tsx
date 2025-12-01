'use client';

import { useMemo, useState } from 'react';
import { useLaunches } from '@/hooks/use-launches';
import { LaunchCard } from '@/components/launches/launch-card';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LaunchesPage() {
  const { launches, isLoading, isError, mutate } = useLaunches();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'success' | 'failure'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter and sort launches
  const filteredLaunches = useMemo(() => {
    let result = [...launches];

    // Apply search filter
    if (search) {
      result = result.filter(launch =>
        launch.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'upcoming') {
      result = result.filter(launch => launch.upcoming);
    } else if (filter === 'past') {
      result = result.filter(launch => !launch.upcoming);
    } else if (filter === 'success') {
      result = result.filter(launch => launch.success === true);
    } else if (filter === 'failure') {
      result = result.filter(launch => launch.success === false);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date_utc).getTime();
      const dateB = new Date(b.date_utc).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [launches, search, filter, sortOrder]);

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Launches
        </h1>
        <LoadingSkeleton count={9} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Launches
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
          Launches
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse all SpaceX launches, past and upcoming
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search launches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter:
          </span>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
          <Button
            variant={filter === 'success' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('success')}
          >
            Success
          </Button>
          <Button
            variant={filter === 'failure' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('failure')}
          >
            Failure
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort:
            </span>
            <Button
              variant={sortOrder === 'desc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('desc')}
            >
              Newest First
            </Button>
            <Button
              variant={sortOrder === 'asc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('asc')}
            >
              Oldest First
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredLaunches.length} of {launches.length} launches
          </span>
          {filter !== 'all' && (
            <Badge variant="neutral">{filter}</Badge>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredLaunches.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No launches found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLaunches.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}
    </div>
  );
}
