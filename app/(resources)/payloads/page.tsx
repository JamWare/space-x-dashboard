'use client';

import { useMemo, useState } from 'react';
import { usePayloads } from '@/hooks/use-payloads';
import { PayloadCard } from '@/components/payloads/payload-card';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PayloadsPage() {
  const { payloads, isLoading, isError, mutate } = usePayloads();
  const [search, setSearch] = useState('');
  const [reuseFilter, setReuseFilter] = useState<'all' | 'new' | 'reused'>('all');
  const [dragonFilter, setDragonFilter] = useState<'all' | 'dragon' | 'non-dragon'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'mass'>('name');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc');

  // Filter and sort payloads
  const filteredPayloads = useMemo(() => {
    let result = [...payloads];

    // Apply search filter
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply reuse filter
    if (reuseFilter === 'new') {
      result = result.filter(p => !p.reused);
    } else if (reuseFilter === 'reused') {
      result = result.filter(p => p.reused);
    }

    // Apply Dragon filter
    if (dragonFilter === 'dragon') {
      result = result.filter(p => p.dragon !== null);
    } else if (dragonFilter === 'non-dragon') {
      result = result.filter(p => p.dragon === null);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'mass') {
        const massA = a.mass_kg ?? 0;
        const massB = b.mass_kg ?? 0;
        comparison = massB - massA;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [payloads, search, reuseFilter, dragonFilter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Payloads
        </h1>
        <LoadingSkeleton count={9} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Payloads
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
          Payloads
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore all SpaceX payloads delivered to orbit
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search payloads by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reuse:
          </span>
          <Button
            variant={reuseFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReuseFilter('all')}
          >
            All
          </Button>
          <Button
            variant={reuseFilter === 'new' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReuseFilter('new')}
          >
            New
          </Button>
          <Button
            variant={reuseFilter === 'reused' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReuseFilter('reused')}
          >
            Reused
          </Button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mission:
            </span>
            <Button
              variant={dragonFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDragonFilter('all')}
            >
              All
            </Button>
            <Button
              variant={dragonFilter === 'dragon' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDragonFilter('dragon')}
            >
              Dragon
            </Button>
            <Button
              variant={dragonFilter === 'non-dragon' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDragonFilter('non-dragon')}
            >
              Non-Dragon
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
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
              variant={sortBy === 'mass' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('mass')}
            >
              Mass
            </Button>
            <Button
              variant={sortOrder === 'asc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('asc')}
            >
              {sortBy === 'name' ? 'A-Z' : 'Low-High'}
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('desc')}
            >
              {sortBy === 'name' ? 'Z-A' : 'High-Low'}
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredPayloads.length} of {payloads.length} payloads
          </span>
          {(reuseFilter !== 'all' || dragonFilter !== 'all') && (
            <div className="flex gap-1">
              {reuseFilter !== 'all' && <Badge variant="neutral">{reuseFilter}</Badge>}
              {dragonFilter !== 'all' && <Badge variant="neutral">{dragonFilter}</Badge>}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredPayloads.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No payloads found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayloads.map((payload) => (
            <PayloadCard key={payload.id} payload={payload} />
          ))}
        </div>
      )}
    </div>
  );
}
