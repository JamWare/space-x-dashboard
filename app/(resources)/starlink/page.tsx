'use client';

import { useMemo, useState } from 'react';
import { useStarlink } from '@/hooks/use-starlink';
import { StarlinkCard } from '@/components/starlink/starlink-card';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StarlinkPage() {
  const { starlinks, isLoading, isError, mutate } = useStarlink();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deorbited'>('all');
  const [sortBy, setSortBy] = useState<'launch-date' | 'altitude' | 'name'>('launch-date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter and sort Starlink satellites
  const filteredStarlinks = useMemo(() => {
    let result = [...starlinks];

    // Apply search filter (by object name or NORAD ID)
    if (search) {
      result = result.filter(s =>
        s.spaceTrack.OBJECT_NAME.toLowerCase().includes(search.toLowerCase()) ||
        s.spaceTrack.NORAD_CAT_ID.toString().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter(s => s.spaceTrack.DECAYED === 0);
    } else if (statusFilter === 'deorbited') {
      result = result.filter(s => s.spaceTrack.DECAYED === 1);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'launch-date') {
        const dateA = new Date(a.spaceTrack.LAUNCH_DATE).getTime();
        const dateB = new Date(b.spaceTrack.LAUNCH_DATE).getTime();
        comparison = dateB - dateA;
      } else if (sortBy === 'altitude') {
        comparison = b.height_km - a.height_km;
      } else if (sortBy === 'name') {
        comparison = a.spaceTrack.OBJECT_NAME.localeCompare(b.spaceTrack.OBJECT_NAME);
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [starlinks, search, statusFilter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Starlink Satellites
        </h1>
        <LoadingSkeleton count={9} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Starlink Satellites
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
          Starlink Satellites
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track SpaceX&apos;s constellation of internet satellites in real-time
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by name or NORAD ID..."
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
            variant={statusFilter === 'deorbited' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('deorbited')}
          >
            Deorbited
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </span>
            <Button
              variant={sortBy === 'launch-date' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('launch-date')}
            >
              Launch Date
            </Button>
            <Button
              variant={sortBy === 'altitude' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('altitude')}
            >
              Altitude
            </Button>
            <Button
              variant={sortBy === 'name' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name
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
            Showing {filteredStarlinks.length} of {starlinks.length} satellites
          </span>
          {statusFilter !== 'all' && (
            <Badge variant="neutral">{statusFilter}</Badge>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredStarlinks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No satellites found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStarlinks.map((starlink) => (
            <StarlinkCard key={starlink.id} starlink={starlink} />
          ))}
        </div>
      )}
    </div>
  );
}
