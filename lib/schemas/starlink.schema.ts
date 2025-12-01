import { z } from 'zod';

/**
 * Zod schema for SpaceTrack orbital mechanics data
 * Contains comprehensive orbital elements and tracking information from Space-Track.org
 */
const StarlinkSpaceTrackSchema = z.object({
  // Meta fields
  CCSDS_OMM_VERS: z.string(),
  COMMENT: z.string(),
  CREATION_DATE: z.string(),
  ORIGINATOR: z.string(),

  // Object identification
  OBJECT_NAME: z.string(),        // e.g., "STARLINK-1506"
  OBJECT_ID: z.string(),          // International designation
  OBJECT_TYPE: z.string(),

  // Reference frame
  CENTER_NAME: z.string(),
  REF_FRAME: z.string(),
  TIME_SYSTEM: z.string(),
  MEAN_ELEMENT_THEORY: z.string(),

  // Temporal data
  EPOCH: z.string(),              // Observation timestamp

  // Orbital elements
  MEAN_MOTION: z.number(),        // Orbits per day
  ECCENTRICITY: z.number(),       // 0-1 scale
  INCLINATION: z.number(),        // Degrees
  RA_OF_ASC_NODE: z.number(),     // Right ascension of ascending node
  ARG_OF_PERICENTER: z.number(),  // Argument of perigee
  MEAN_ANOMALY: z.number(),       // Mean anomaly position

  // Ephemeris data
  EPHEMERIS_TYPE: z.number(),
  CLASSIFICATION_TYPE: z.string(),
  NORAD_CAT_ID: z.number(),
  ELEMENT_SET_NO: z.number(),
  REV_AT_EPOCH: z.number(),

  // Drag and motion
  BSTAR: z.number(),              // Atmospheric drag coefficient
  MEAN_MOTION_DOT: z.number(),    // Mean motion first derivative
  MEAN_MOTION_DDOT: z.number(),   // Mean motion second derivative

  // Computed orbital parameters
  SEMIMAJOR_AXIS: z.number(),     // km
  PERIOD: z.number(),             // minutes
  APOAPSIS: z.number(),           // km
  PERIAPSIS: z.number(),          // km

  // Launch and location data
  COUNTRY_CODE: z.string(),
  LAUNCH_DATE: z.string(),        // YYYY-MM-DD format
  SITE: z.string(),               // Launch facility code

  // Status
  DECAYED: z.number(),            // 0 = active, 1 = deorbited
  DECAY_DATE: z.string().nullable(),

  // Additional tracking fields
  RCS_SIZE: z.string().nullable(),
  FILE: z.number(),
  GP_ID: z.number(),

  // TLE (Two-Line Element set) data
  TLE_LINE0: z.string(),
  TLE_LINE1: z.string(),
  TLE_LINE2: z.string(),
});

/**
 * Zod schema for a single Starlink satellite
 */
export const StarlinkSchema = z.object({
  version: z.string(),             // e.g., "v1.0"
  launch: z.string(),              // Launch ID reference
  longitude: z.number(),           // -180 to 180
  latitude: z.number(),            // -90 to 90
  height_km: z.number(),           // Altitude above Earth
  velocity_kms: z.number(),        // km/s
  id: z.string(),                  // Unique identifier
  spaceTrack: StarlinkSpaceTrackSchema,
});

/**
 * Zod schema for an array of Starlink satellites
 */
export const StarlinksArraySchema = z.array(StarlinkSchema);

/**
 * TypeScript types inferred from the Zod schemas
 */
export type Starlink = z.infer<typeof StarlinkSchema>;
export type StarlinkSpaceTrack = z.infer<typeof StarlinkSpaceTrackSchema>;
