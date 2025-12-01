import { z } from 'zod';

/**
 * Zod schema for Dragon capsule data (optional, only for Dragon missions)
 */
const PayloadDragonSchema = z.object({
  capsule: z.string().nullable(),
  mass_returned_kg: z.number().nullable(),
  mass_returned_lbs: z.number().nullable(),
  flight_time_sec: z.number().nullable(),
  manifest: z.string().nullable(),
  water_landing: z.boolean().nullable(),
  land_landing: z.boolean().nullable(),
});

/**
 * Zod schema for a single Payload
 */
export const PayloadSchema = z.object({
  // Identity
  id: z.string(),
  name: z.string(),
  type: z.string(),                       // e.g., "Satellite"

  // Launch relationship
  launch: z.string(),                     // Launch ID reference
  reused: z.boolean(),

  // Organizations
  customers: z.array(z.string()),
  nationalities: z.array(z.string()),
  manufacturers: z.array(z.string()),

  // Physical properties
  mass_kg: z.number().nullable(),
  mass_lbs: z.number().nullable(),

  // Tracking
  norad_ids: z.array(z.number()).nullable(),

  // Orbital parameters
  orbit: z.string().nullable(),           // e.g., "SSO", "LEO"
  reference_system: z.string().nullable(), // e.g., "geocentric"
  regime: z.string().nullable(),          // e.g., "low-earth"
  longitude: z.number().nullable(),
  semi_major_axis_km: z.number().nullable(),
  eccentricity: z.number().nullable(),
  periapsis_km: z.number().nullable(),
  apoapsis_km: z.number().nullable(),
  inclination_deg: z.number().nullable(),
  period_min: z.number().nullable(),
  lifespan_years: z.number().nullable(),
  epoch: z.string().nullable(),
  mean_motion: z.number().nullable(),
  raan: z.number().nullable(),
  arg_of_pericenter: z.number().nullable(),
  mean_anomaly: z.number().nullable(),

  // Dragon-specific (nullable object)
  dragon: PayloadDragonSchema.nullable(),
});

/**
 * Zod schema for an array of Payloads
 */
export const PayloadsArraySchema = z.array(PayloadSchema);

/**
 * TypeScript types inferred from the Zod schemas
 */
export type Payload = z.infer<typeof PayloadSchema>;
export type PayloadDragon = z.infer<typeof PayloadDragonSchema>;
