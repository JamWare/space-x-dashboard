import { useMemo } from 'react';
import type { Launch } from '@/lib/schemas/launches.schema';
import type { Payload } from '@/lib/schemas/payloads.schema';
import type { Rocket } from '@/lib/schemas/rockets.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateSuccessRate } from '@/lib/utils/analytics';

interface StatsOverviewProps {
  launches: Launch[];
  payloads: Payload[];
  rockets: Rocket[];
}

export function StatsOverview({ launches, payloads, rockets }: StatsOverviewProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const successStats = calculateSuccessRate(launches);
    const totalPayloadMass = payloads.reduce((sum, p) => sum + (p.mass_kg || 0), 0) / 1000;
    const activeRockets = rockets.filter(r => r.active).length;

    return {
      totalLaunches: successStats.total,
      successRate: successStats.successRate,
      totalPayloadMass: Math.round(totalPayloadMass * 10) / 10,
      activeRockets,
    };
  }, [launches, payloads, rockets]);

  // Get success rate badge variant
  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'failure';
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Launches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Launches</CardTitle>
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalLaunches.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Past missions completed
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Badge variant={getSuccessRateBadge(stats.successRate)}>
            {stats.successRate}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.successRate}%
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mission success percentage
          </p>
        </CardContent>
      </Card>

      {/* Total Payload Mass */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payload Mass</CardTitle>
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalPayloadMass.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tonnes delivered to orbit
          </p>
        </CardContent>
      </Card>

      {/* Active Rockets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rockets</CardTitle>
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.activeRockets}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Operational launch vehicles
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
