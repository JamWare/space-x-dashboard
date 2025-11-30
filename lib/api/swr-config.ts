import { SWRConfiguration } from 'swr';

/**
 * Refresh intervals for different SpaceX API endpoints
 * Based on SpaceX API caching recommendations
 */
export const SWR_REFRESH_INTERVALS = {
  launches: 20000,        // 20 seconds - frequently updated
  starlink: 3600000,      // 1 hour - updated hourly
  capsules: 300000,       // 5 minutes
  cores: 300000,          // 5 minutes
  crew: 300000,           // 5 minutes
  landpads: 300000,       // 5 minutes
  launchpads: 300000,     // 5 minutes
  payloads: 300000,       // 5 minutes
  ships: 300000,          // 5 minutes
  dragons: 86400000,      // 24 hours - rarely changes
  rockets: 86400000,      // 24 hours - rarely changes
  company: 86400000,      // 24 hours - rarely changes
  roadster: 86400000,     // 24 hours - rarely changes
  history: 300000,        // 5 minutes
} as const;

/**
 * Default SWR configuration for the entire application
 */
export const defaultSWRConfig: SWRConfiguration = {
  revalidateOnFocus: true,      // Revalidate when window regains focus
  revalidateOnReconnect: true,  // Revalidate when network reconnects
  shouldRetryOnError: true,     // Retry on error
  errorRetryCount: 3,           // Maximum retry attempts
  errorRetryInterval: 5000,     // Wait 5 seconds between retries
  dedupingInterval: 2000,       // Dedupe requests within 2 seconds
};
