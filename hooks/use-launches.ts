'use client';

import useSWR from 'swr';
import { fetcherWithSchema } from '@/lib/api/fetcher';
import { LaunchesArraySchema, LaunchSchema, type Launch } from '@/lib/schemas/launches.schema';
import { SWR_REFRESH_INTERVALS } from '@/lib/api/swr-config';

const BASE_URL = 'https://api.spacexdata.com/v5';

/**
 * Hook to fetch all launches
 */
export function useLaunches() {
  const { data, error, isLoading, mutate } = useSWR<Launch[]>(
    `${BASE_URL}/launches`,
    fetcherWithSchema(LaunchesArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
      revalidateOnFocus: true,
    }
  );

  return {
    launches: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single launch by ID
 */
export function useLaunchById(id: string | null) {
  const { data, error, isLoading } = useSWR<Launch>(
    id ? `${BASE_URL}/launches/${id}` : null,
    fetcherWithSchema(LaunchSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
    }
  );

  return {
    launch: data,
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch upcoming launches
 */
export function useUpcomingLaunches() {
  const { data, error, isLoading } = useSWR<Launch[]>(
    `${BASE_URL}/launches/upcoming`,
    fetcherWithSchema(LaunchesArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
    }
  );

  return {
    launches: data ?? [],
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch past launches
 */
export function usePastLaunches() {
  const { data, error, isLoading } = useSWR<Launch[]>(
    `${BASE_URL}/launches/past`,
    fetcherWithSchema(LaunchesArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
    }
  );

  return {
    launches: data ?? [],
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch the latest launch
 */
export function useLatestLaunch() {
  const { data, error, isLoading } = useSWR<Launch>(
    `${BASE_URL}/launches/latest`,
    fetcherWithSchema(LaunchSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
    }
  );

  return {
    launch: data,
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch the next launch
 */
export function useNextLaunch() {
  const { data, error, isLoading } = useSWR<Launch>(
    `${BASE_URL}/launches/next`,
    fetcherWithSchema(LaunchSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.launches,
    }
  );

  return {
    launch: data,
    isLoading,
    isError: error,
  };
}
