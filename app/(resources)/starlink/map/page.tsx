'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStarlink } from '@/hooks/use-starlink';
import { useFilteredStarlinks } from '@/hooks/use-filtered-starlinks';
import { StarlinkMapView } from '@/components/starlink/map/starlink-map-view';
import { MapFilterControls } from '@/components/starlink/map/map-filter-controls';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';

export default function StarlinkMapPage() {
  const { starlinks, isLoading, isError, mutate } = useStarlink();

  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'active' | 'deorbited',
    altitudeRange: [0, 1000] as [number, number],
    search: '',
  });

  const { filtered, total, withCoordinates } = useFilteredStarlinks(
    starlinks,
    filters
  );

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Starlink Satellite Map
        </h1>
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Starlink Satellite Map
        </h1>
        <ErrorMessage error={isError} onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Starlink Satellite Map
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Real-time visualization of Starlink satellites around the globe
          </p>
        </div>
        <Link href="/starlink">
          <Button variant="outline" size="sm">
            List View
          </Button>
        </Link>
      </div>

      {/* Layout: Filters on left, Map on right */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Filters */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <MapFilterControls
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filtered.length}
            totalCount={total}
            withCoordinatesCount={withCoordinates}
          />
        </div>

        {/* Map */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                No satellites found matching your filters.
              </p>
            </div>
          ) : (
            <StarlinkMapView satellites={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
