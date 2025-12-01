'use client';

import useSWR from 'swr';
import { fetcherWithSchema } from '@/lib/api/fetcher';
import { PayloadsArraySchema, PayloadSchema, type Payload } from '@/lib/schemas/payloads.schema';
import { SWR_REFRESH_INTERVALS } from '@/lib/api/swr-config';

const BASE_URL = 'https://api.spacexdata.com/v4';

/**
 * Hook to fetch all payloads
 */
export function usePayloads() {
  const { data, error, isLoading, mutate } = useSWR<Payload[]>(
    `${BASE_URL}/payloads`,
    fetcherWithSchema(PayloadsArraySchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.payloads,
      revalidateOnFocus: true,
    }
  );

  return {
    payloads: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single payload by ID
 */
export function usePayloadById(id: string | null) {
  const { data, error, isLoading } = useSWR<Payload>(
    id ? `${BASE_URL}/payloads/${id}` : null,
    fetcherWithSchema(PayloadSchema),
    {
      refreshInterval: SWR_REFRESH_INTERVALS.payloads,
    }
  );

  return {
    payload: data,
    isLoading,
    isError: error,
  };
}
