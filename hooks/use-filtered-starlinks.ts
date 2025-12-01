'use client';

import { useMemo } from 'react';
import { Starlink } from '@/lib/schemas/starlink.schema';

export interface FilterOptions {
  status: 'all' | 'active' | 'deorbited';
  altitudeRange: [number, number];
  search: string;
}

/**
 * Hook to filter Starlink satellites based on various criteria
 * - Filters satellites with valid coordinates
 * - Applies status filter (all/active/deorbited)
 * - Applies altitude range filter
 * - Applies search filter (by name or NORAD ID)
 */
export function useFilteredStarlinks(
  starlinks: Starlink[],
  filters: FilterOptions
) {
  return useMemo(() => {
    // 1. Filter satellites with valid coordinates
    let filtered = starlinks.filter(
      (s) =>
        s.latitude !== null &&
        s.longitude !== null &&
        s.height_km !== null
    );

    // 2. Apply status filter
    if (filters.status === 'active') {
      filtered = filtered.filter((s) => s.spaceTrack.DECAYED === 0);
    } else if (filters.status === 'deorbited') {
      filtered = filtered.filter((s) => s.spaceTrack.DECAYED === 1);
    }

    // 3. Apply altitude filter
    filtered = filtered.filter(
      (s) =>
        s.height_km! >= filters.altitudeRange[0] &&
        s.height_km! <= filters.altitudeRange[1]
    );

    // 4. Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.spaceTrack.OBJECT_NAME.toLowerCase().includes(searchLower) ||
          s.spaceTrack.NORAD_CAT_ID.toString().includes(filters.search)
      );
    }

    // Calculate statistics
    const withCoordinates = starlinks.filter(
      (s) => s.latitude !== null && s.longitude !== null
    ).length;

    return {
      filtered,
      total: starlinks.length,
      withCoordinates,
    };
  }, [starlinks, filters]);
}
