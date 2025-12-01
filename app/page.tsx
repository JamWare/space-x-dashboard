"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  useLatestLaunch,
  useNextLaunch,
  useLaunches,
} from "@/hooks/use-launches";
import { usePayloads } from "@/hooks/use-payloads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/skeleton";
import { formatDate, formatRelativeTime } from "@/lib/utils/format-date";
import { LaunchSuccessChart } from "@/components/analytics/launch-success-chart";
import { calculateSuccessRate } from "@/lib/utils/analytics";
import { subMonths } from "date-fns";

export default function Home() {
  const { launch: latestLaunch, isLoading: latestLoading } = useLatestLaunch();
  const { launch: nextLaunch, isLoading: nextLoading } = useNextLaunch();
  const { launches, isLoading: launchesLoading } = useLaunches();
  const { payloads, isLoading: payloadsLoading } = usePayloads();

  // Calculate analytics stats
  const analyticsStats = useMemo(() => {
    if (launches.length === 0) return null;

    const successStats = calculateSuccessRate(launches);
    const totalPayloadMass =
      payloads.reduce((sum, p) => sum + (p.mass_kg || 0), 0) / 1000;

    // Get recent launches (last 12 months)
    const twelveMonthsAgo = subMonths(new Date(), 12);
    const recentLaunches = launches.filter((l) => {
      const launchDate = new Date(l.date_utc);
      return launchDate >= twelveMonthsAgo && !l.upcoming;
    });

    return {
      totalLaunches: successStats.total,
      successRate: successStats.successRate,
      totalPayloadMass: Math.round(totalPayloadMass * 10) / 10,
      recentLaunches,
    };
  }, [launches, payloads]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 sm:text-6xl">
          SpaceX Dashboard
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Explore SpaceX launches, rockets, and mission data
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/launches">
            <Button size="lg">Browse Launches</Button>
          </Link>
          <Link href="/analytics">
            <Button size="lg" variant="outline">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Latest & Next Launch */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Latest Launch */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Launch</CardTitle>
          </CardHeader>
          <CardContent>
            {latestLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : latestLaunch ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {latestLaunch.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(latestLaunch.date_utc, "PPP")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatRelativeTime(latestLaunch.date_utc)}
                  </p>
                </div>
                <div>
                  {latestLaunch.success === true ? (
                    <Badge variant="success">Successful</Badge>
                  ) : latestLaunch.success === false ? (
                    <Badge variant="failure">Failed</Badge>
                  ) : (
                    <Badge variant="neutral">Unknown</Badge>
                  )}
                </div>
                {latestLaunch.details && (
                  <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                    {latestLaunch.details}
                  </p>
                )}
                <Link href={`/launches/${latestLaunch.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Next Launch */}
        <Card>
          <CardHeader>
            <CardTitle>Next Launch</CardTitle>
          </CardHeader>
          <CardContent>
            {nextLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : nextLaunch ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {nextLaunch.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(nextLaunch.date_utc, "PPP")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatRelativeTime(nextLaunch.date_utc)}
                  </p>
                </div>
                <Badge variant="warning">Upcoming</Badge>
                {nextLaunch.details && (
                  <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                    {nextLaunch.details}
                  </p>
                )}
                <Link href={`/launches/${nextLaunch.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No upcoming launches
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured: Starlink Map */}
      <div>
        <Link href="/starlink/map">
          <Card className="cursor-pointer overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg dark:border-blue-900 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="flex-shrink-0 rounded-full bg-blue-100 p-6 dark:bg-blue-900">
                  <div className="text-6xl">🗺️</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Starlink Satellite Map
                  </h2>
                  <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    Explore real-time positions of Starlink satellites on an interactive world map
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    <Badge variant="success">Live Tracking</Badge>
                    <Badge variant="neutral">Interactive Filters</Badge>
                    <Badge variant="neutral">Clustering</Badge>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button size="lg" className="gap-2">
                    View Map
                    <span>→</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Explore SpaceX Data
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/launches">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🚀</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Launches
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Past & upcoming missions
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rockets">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🛸</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Rockets
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rocket specifications
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/starlink">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🛰️</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Starlink
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Satellite constellation
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/analytics">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">📊</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Data visualizations
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Analytics Preview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Mission Analytics
          </h2>
          <Link href="/analytics">
            <Button variant="outline" size="sm">
              View All Analytics →
            </Button>
          </Link>
        </div>

        {launchesLoading || payloadsLoading ? (
          <LoadingSkeleton count={3} />
        ) : analyticsStats ? (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Success Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <LaunchSuccessChart launches={launches} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Launches
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsStats.totalLaunches.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsStats.successRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Payload Mass
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsStats.totalPayloadMass.toLocaleString()} t
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last 12 Months
                  </p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsStats.recentLaunches.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    launches completed
                  </p>
                  <Link href="/analytics">
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No analytics data available
          </p>
        )}
      </div>
    </div>
  );
}
