import { z } from 'zod';

/**
 * Basic fetcher function for SWR
 * @param url - The URL to fetch
 * @returns The parsed JSON response
 */
export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await response.json().catch(() => ({}));
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Fetcher with Zod schema validation
 * Provides runtime type safety for API responses
 * @param schema - Zod schema to validate against
 * @returns A fetcher function that validates the response
 */
export function fetcherWithSchema<T>(schema: z.ZodSchema<T>) {
  return async (url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`API error: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();

    try {
      return schema.parse(data);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      throw new Error('Invalid data received from API');
    }
  };
}
