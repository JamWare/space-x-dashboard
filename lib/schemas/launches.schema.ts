import { z } from 'zod';

/**
 * Zod schema for a Launch core object
 */
const LaunchCoreSchema = z.object({
  core: z.string().nullable(),
  flight: z.number().nullable(),
  gridfins: z.boolean().nullable(),
  legs: z.boolean().nullable(),
  reused: z.boolean().nullable(),
  landing_attempt: z.boolean().nullable(),
  landing_success: z.boolean().nullable(),
  landing_type: z.string().nullable(),
  landpad: z.string().nullable(),
});

/**
 * Zod schema for Fairings
 */
const FairingsSchema = z.object({
  reused: z.boolean().nullable(),
  recovery_attempt: z.boolean().nullable(),
  recovered: z.boolean().nullable(),
  ships: z.array(z.string()),
}).nullable();

/**
 * Zod schema for Links
 */
const LinksSchema = z.object({
  patch: z.object({
    small: z.string().nullable(),
    large: z.string().nullable(),
  }).nullable(),
  reddit: z.object({
    campaign: z.string().nullable(),
    launch: z.string().nullable(),
    media: z.string().nullable(),
    recovery: z.string().nullable(),
  }).nullable(),
  flickr: z.object({
    small: z.array(z.string()),
    original: z.array(z.string()),
  }).nullable(),
  presskit: z.string().nullable(),
  webcast: z.string().nullable(),
  youtube_id: z.string().nullable(),
  article: z.string().nullable(),
  wikipedia: z.string().nullable(),
});

/**
 * Zod schema for Failures
 */
const FailureSchema = z.object({
  time: z.number(),
  altitude: z.number().nullable(),
  reason: z.string(),
});

/**
 * Zod schema for a single Launch
 */
export const LaunchSchema = z.object({
  fairings: FairingsSchema,
  links: LinksSchema,
  static_fire_date_utc: z.string().nullable(),
  static_fire_date_unix: z.number().nullable(),
  net: z.boolean().nullable(),
  window: z.number().nullable(),
  rocket: z.string(),
  success: z.boolean().nullable(),
  failures: z.array(FailureSchema),
  details: z.string().nullable(),
  crew: z.array(z.string()),
  ships: z.array(z.string()),
  capsules: z.array(z.string()),
  payloads: z.array(z.string()),
  launchpad: z.string(),
  flight_number: z.number(),
  name: z.string(),
  date_utc: z.string(),
  date_unix: z.number(),
  date_local: z.string(),
  date_precision: z.enum(['half', 'quarter', 'year', 'month', 'day', 'hour']),
  upcoming: z.boolean(),
  cores: z.array(LaunchCoreSchema),
  auto_update: z.boolean(),
  tbd: z.boolean(),
  launch_library_id: z.string().nullable(),
  id: z.string(),
});

/**
 * Zod schema for an array of Launches
 */
export const LaunchesArraySchema = z.array(LaunchSchema);

/**
 * TypeScript type inferred from the Zod schema
 */
export type Launch = z.infer<typeof LaunchSchema>;
export type LaunchCore = z.infer<typeof LaunchCoreSchema>;
export type LaunchLinks = z.infer<typeof LinksSchema>;
export type LaunchFailure = z.infer<typeof FailureSchema>;
