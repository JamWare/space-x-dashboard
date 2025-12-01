'use client';

import Link from 'next/link';
import { useLatestLaunch, useNextLaunch } from '@/hooks/use-launches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { formatDate, formatRelativeTime } from '@/lib/utils/format-date';

export default function Home() {
  const { launch: latestLaunch, isLoading: latestLoading } = useLatestLaunch();
  const { launch: nextLaunch, isLoading: nextLoading } = useNextLaunch();

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
                    {formatDate(latestLaunch.date_utc, 'PPP')}
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
              <p className="text-gray-600 dark:text-gray-400">No data available</p>
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
                    {formatDate(nextLaunch.date_utc, 'PPP')}
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
              <p className="text-gray-600 dark:text-gray-400">No upcoming launches</p>
            )}
          </CardContent>
        </Card>
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
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Launches</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Past & upcoming missions</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rockets">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🛸</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rockets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rocket specifications</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/starlink">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🛰️</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Starlink</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Satellite constellation</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/analytics">
            <Card className="transition-all hover:scale-105">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-2 text-3xl">📊</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data visualizations</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
