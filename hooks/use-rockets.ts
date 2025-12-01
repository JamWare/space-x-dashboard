'use client';

import useSWR from 'swr';
import { fetcherWithSchema } from '@/lib/api/fetcher';
import { RocketsArraySchema, RocketSchema, type Rocket } from '@/lib/schemas/rockets.schema';
import { SWR_REFRESH_INTERVALS } from '@/lib/api/swr-config';

const BASE_URL = 'https://api.spacexdata.com/v4';

/**
 * Hook to fetch all rockets
 */
export function useRockets() {
  const { data, error, isLoading, mutate } = useSWR<Rocket[]>(
    `${BASE_URL}/rockets`,
    fetcherWithSchema(RocketsArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.rockets,
      revalidateOnFocus: true,
    }
  );

  return {
    rockets: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single rocket by ID
 */
export function useRocketById(id: string | null) {
  const { data, error, isLoading } = useSWR<Rocket>(
    id ? `${BASE_URL}/rockets/${id}` : null,
    fetcherWithSchema(RocketSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.rockets,
    }
  );

  return {
    rocket: data,
    isLoading,
    isError: error,
  };
}
