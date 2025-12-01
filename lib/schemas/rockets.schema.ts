import { z } from 'zod';

/**
 * Zod schema for measurement values with metric and imperial units
 */
const MeasurementSchema = z.object({
  meters: z.number().nullable(),
  feet: z.number().nullable(),
});

/**
 * Zod schema for mass values
 */
const MassSchema = z.object({
  kg: z.number(),
  lb: z.number(),
});

/**
 * Zod schema for thrust values
 */
const ThrustSchema = z.object({
  kN: z.number(),
  lbf: z.number(),
});

/**
 * Zod schema for ISP (specific impulse) values
 */
const IspSchema = z.object({
  sea_level: z.number(),
  vacuum: z.number(),
});

/**
 * Zod schema for first stage specifications
 */
const FirstStageSchema = z.object({
  thrust_sea_level: ThrustSchema,
  thrust_vacuum: ThrustSchema,
  reusable: z.boolean(),
  engines: z.number(),
  fuel_amount_tons: z.number(),
  burn_time_sec: z.number().nullable(),
});

/**
 * Zod schema for composite fairing dimensions
 */
const CompositeFairingSchema = z.object({
  height: MeasurementSchema,
  diameter: MeasurementSchema,
});

/**
 * Zod schema for second stage payloads configuration
 */
const PayloadsConfigSchema = z.object({
  composite_fairing: CompositeFairingSchema,
  option_1: z.string(),
});

/**
 * Zod schema for second stage specifications
 */
const SecondStageSchema = z.object({
  thrust: ThrustSchema,
  payloads: PayloadsConfigSchema,
  reusable: z.boolean(),
  engines: z.number(),
  fuel_amount_tons: z.number(),
  burn_time_sec: z.number().nullable(),
});

/**
 * Zod schema for engine specifications
 */
const EnginesSchema = z.object({
  isp: IspSchema,
  thrust_sea_level: ThrustSchema,
  thrust_vacuum: ThrustSchema,
  number: z.number(),
  type: z.string(),
  version: z.string(),
  layout: z.string().nullable(),
  engine_loss_max: z.number().nullable(),
  propellant_1: z.string(),
  propellant_2: z.string(),
  thrust_to_weight: z.number(),
});

/**
 * Zod schema for landing legs configuration
 */
const LandingLegsSchema = z.object({
  number: z.number(),
  material: z.string().nullable(),
});

/**
 * Zod schema for payload weight capacity
 */
const PayloadWeightSchema = z.object({
  id: z.string(),
  name: z.string(),
  kg: z.number(),
  lb: z.number(),
});

/**
 * Zod schema for a single Rocket
 */
export const RocketSchema = z.object({
  // Physical specifications
  height: MeasurementSchema,
  diameter: MeasurementSchema,
  mass: MassSchema,

  // Stage configurations
  first_stage: FirstStageSchema,
  second_stage: SecondStageSchema,
  engines: EnginesSchema,
  landing_legs: LandingLegsSchema,

  // Payload capacities
  payload_weights: z.array(PayloadWeightSchema),

  // Media
  flickr_images: z.array(z.string()),

  // Metadata
  name: z.string(),
  type: z.string(),
  active: z.boolean(),
  stages: z.number(),
  boosters: z.number(),
  cost_per_launch: z.number(),
  success_rate_pct: z.number(),
  first_flight: z.string(),
  country: z.string(),
  company: z.string(),
  wikipedia: z.string(),
  description: z.string(),
  id: z.string(),
});

/**
 * Zod schema for an array of Rockets
 */
export const RocketsArraySchema = z.array(RocketSchema);

/**
 * TypeScript types inferred from the Zod schemas
 */
export type Rocket = z.infer<typeof RocketSchema>;
export type RocketFirstStage = z.infer<typeof FirstStageSchema>;
export type RocketSecondStage = z.infer<typeof SecondStageSchema>;
export type RocketEngines = z.infer<typeof EnginesSchema>;
export type RocketPayloadWeight = z.infer<typeof PayloadWeightSchema>;
