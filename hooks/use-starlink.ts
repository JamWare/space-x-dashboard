'use client';

import useSWR from 'swr';
import { fetcherWithSchema } from '@/lib/api/fetcher';
import { StarlinksArraySchema, StarlinkSchema, type Starlink } from '@/lib/schemas/starlink.schema';
import { SWR_REFRESH_INTERVALS } from '@/lib/api/swr-config';

const BASE_URL = 'https://api.spacexdata.com/v4';

/**
 * Hook to fetch all Starlink satellites
 */
export function useStarlink() {
  const { data, error, isLoading, mutate } = useSWR<Starlink[]>(
    `${BASE_URL}/starlink`,
    fetcherWithSchema(StarlinksArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.starlink,
      revalidateOnFocus: true,
    }
  );

  return {
    starlinks: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single Starlink satellite by ID
 */
export function useStarlinkById(id: string | null) {
  const { data, error, isLoading } = useSWR<Starlink>(
    id ? `${BASE_URL}/starlink/${id}` : null,
    fetcherWithSchema(StarlinkSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.starlink,
    }
  );

  return {
    starlink: data,
    isLoading,
    isError: error,
  };
}
