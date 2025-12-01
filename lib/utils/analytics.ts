import { startOfMonth, startOfQuarter, startOfYear, format } from 'date-fns';
import type { Launch } from '@/lib/schemas/launches.schema';
import type { Payload } from '@/lib/schemas/payloads.schema';
import type { Rocket } from '@/lib/schemas/rockets.schema';

/**
 * Success rate statistics
 */
export interface SuccessStats {
  successful: number;
  failed: number;
  unknown: number;
  successRate: number;
  total: number;
}

/**
 * Calculate launch success statistics
 * Filters out upcoming launches and categorizes by success status
 */
export function calculateSuccessRate(launches: Launch[]): SuccessStats {
  // Filter to only past launches
  const pastLaunches = launches.filter(l => !l.upcoming);

  const successful = pastLaunches.filter(l => l.success === true).length;
  const failed = pastLaunches.filter(l => l.success === false).length;
  const unknown = pastLaunches.filter(l => l.success === null).length;

  // Calculate success rate (exclude unknown from calculation)
  const knownLaunches = successful + failed;
  const successRate = knownLaunches > 0
    ? Math.round((successful / knownLaunches) * 100 * 10) / 10
    : 0;

  return {
    successful,
    failed,
    unknown,
    successRate,
    total: pastLaunches.length,
  };
}

/**
 * Time grouping options for timeline charts
 */
export type TimeGrouping = 'month' | 'quarter' | 'year';

/**
 * Time series data point
 */
export interface TimeSeriesData {
  period: string;
  date: Date;
  total: number;
  successful: number;
  failed: number;
}

/**
 * Group launches by time period
 * Returns sorted time series data
 */
export function groupLaunchesByTime(
  launches: Launch[],
  grouping: TimeGrouping = 'month'
): TimeSeriesData[] {
  // Filter to only past launches
  const pastLaunches = launches.filter(l => !l.upcoming);

  // Group launches by period
  const grouped = new Map<string, TimeSeriesData>();

  pastLaunches.forEach(launch => {
    const date = new Date(launch.date_utc);
    let periodStart: Date;
    let periodKey: string;

    switch (grouping) {
      case 'month':
        periodStart = startOfMonth(date);
        periodKey = format(periodStart, 'yyyy-MM');
        break;
      case 'quarter':
        periodStart = startOfQuarter(date);
        periodKey = format(periodStart, 'yyyy-QQQ');
        break;
      case 'year':
        periodStart = startOfYear(date);
        periodKey = format(periodStart, 'yyyy');
        break;
    }

    if (!grouped.has(periodKey)) {
      grouped.set(periodKey, {
        period: periodKey,
        date: periodStart,
        total: 0,
        successful: 0,
        failed: 0,
      });
    }

    const data = grouped.get(periodKey)!;
    data.total++;
    if (launch.success === true) {
      data.successful++;
    } else if (launch.success === false) {
      data.failed++;
    }
  });

  // Convert to array and sort chronologically
  return Array.from(grouped.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Mass distribution bucket
 */
export interface MassBucket {
  range: string;
  min: number;
  max: number;
  count: number;
}

/**
 * Calculate payload mass distribution
 * Groups payloads into mass buckets
 */
export function calculateMassDistribution(
  payloads: Payload[],
  bucketSize: number = 1000
): MassBucket[] {
  // Filter payloads with valid mass data
  const validPayloads = payloads.filter(p => p.mass_kg !== null && p.mass_kg > 0);

  if (validPayloads.length === 0) {
    return [];
  }

  // Find max mass to determine number of buckets
  const maxMass = Math.max(...validPayloads.map(p => p.mass_kg!));
  const numBuckets = Math.ceil(maxMass / bucketSize);

  // Initialize buckets
  const buckets: MassBucket[] = [];
  for (let i = 0; i < numBuckets; i++) {
    const min = i * bucketSize;
    const max = (i + 1) * bucketSize;
    buckets.push({
      range: `${min / 1000}-${max / 1000}k`,
      min,
      max,
      count: 0,
    });
  }

  // Count payloads in each bucket
  validPayloads.forEach(payload => {
    const mass = payload.mass_kg!;
    const bucketIndex = Math.min(
      Math.floor(mass / bucketSize),
      numBuckets - 1
    );
    buckets[bucketIndex].count++;
  });

  // Filter out empty buckets
  return buckets.filter(b => b.count > 0);
}

/**
 * Filter launches by date range
 */
export function filterByDateRange(
  launches: Launch[],
  startDate: Date | null,
  endDate: Date | null
): Launch[] {
  return launches.filter(launch => {
    const launchDate = new Date(launch.date_utc);

    if (startDate && launchDate < startDate) {
      return false;
    }

    if (endDate) {
      // Set end date to end of day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (launchDate > endOfDay) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique rocket IDs from launches
 */
export function getRocketIdsFromLaunches(launches: Launch[]): string[] {
  const rocketIds = new Set<string>();
  launches.forEach(launch => {
    if (launch.rocket) {
      rocketIds.add(launch.rocket);
    }
  });
  return Array.from(rocketIds);
}

/**
 * Homepage statistics summary
 */
export interface HomepageStats {
  totalLaunches: number;
  successRate: number;
  totalPayloadMass: number;
  activeRockets: number;
}

/**
 * Calculate statistics for homepage summary
 */
export function calculateHomepageStats(
  launches: Launch[],
  payloads: Payload[],
  rockets: Rocket[]
): HomepageStats {
  const successStats = calculateSuccessRate(launches);

  // Calculate total payload mass (in tonnes)
  const totalPayloadMass = payloads.reduce((sum, payload) => {
    return sum + (payload.mass_kg || 0);
  }, 0) / 1000; // Convert kg to tonnes

  // Count active rockets
  const activeRockets = rockets.filter(r => r.active).length;

  return {
    totalLaunches: launches.filter(l => !l.upcoming).length,
    successRate: successStats.successRate,
    totalPayloadMass: Math.round(totalPayloadMass * 10) / 10,
    activeRockets,
  };
}
