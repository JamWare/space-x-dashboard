'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLaunchById } from '@/hooks/use-launches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils/format-date';

interface LaunchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LaunchDetailPage({ params }: LaunchDetailPageProps) {
  const { id } = use(params);
  const { launch, isLoading, isError } = useLaunchById(id);

  if (isLoading) {
    return <LoadingSkeleton count={4} />;
  }

  if (isError || !launch) {
    return <ErrorMessage error={isError} title="Failed to load launch" />;
  }

  const patchImage = launch.links.patch?.large || launch.links.patch?.small;
  const isUpcoming = launch.upcoming;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/launches">
        <Button variant="ghost" size="sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to launches
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              Flight #{launch.flight_number}
            </span>
            {isUpcoming ? (
              <Badge variant="warning">Upcoming</Badge>
            ) : launch.success === true ? (
              <Badge variant="success">Success</Badge>
            ) : launch.success === false ? (
              <Badge variant="failure">Failure</Badge>
            ) : (
              <Badge variant="neutral">Unknown</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {launch.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {formatDateTime(launch.date_utc)} ({formatRelativeTime(launch.date_utc)})
          </p>
        </div>

        {patchImage && (
          <div className="flex-shrink-0">
            <Image
              src={patchImage}
              alt={`${launch.name} mission patch`}
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Details */}
      {launch.details && (
        <Card>
          <CardHeader>
            <CardTitle>Mission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{launch.details}</p>
          </CardContent>
        </Card>
      )}

      {/* Launch Information */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date (UTC)</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDateTime(launch.date_utc)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date (Local)</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {launch.date_local}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Flight Number</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                #{launch.flight_number}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1">
                {isUpcoming ? (
                  <Badge variant="warning">Upcoming</Badge>
                ) : launch.success === true ? (
                  <Badge variant="success">Successful</Badge>
                ) : launch.success === false ? (
                  <Badge variant="failure">Failed</Badge>
                ) : (
                  <Badge variant="neutral">Unknown</Badge>
                )}
              </dd>
            </div>
            {launch.static_fire_date_utc && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Static Fire Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(launch.static_fire_date_utc, 'PPP')}
                </dd>
              </div>
            )}
            {launch.window !== null && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Launch Window
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {launch.window} seconds
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Crew */}
      {launch.crew.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {launch.crew.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Crew Member {index + 1}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Role: {member.role}
                    </p>
                  </div>
                  <Badge variant="neutral">ID: {member.crew.slice(0, 8)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cores */}
      {launch.cores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {launch.cores.map((core, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                    Core {index + 1}
                  </h4>
                  <dl className="grid gap-2 sm:grid-cols-2 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Reused:</dt>
                      <dd className="text-gray-900 dark:text-gray-100">
                        {core.reused ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Flight Number:</dt>
                      <dd className="text-gray-900 dark:text-gray-100">
                        {core.flight ?? 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Landing Attempt:</dt>
                      <dd className="text-gray-900 dark:text-gray-100">
                        {core.landing_attempt ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    {core.landing_attempt && (
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Landing Success:</dt>
                        <dd>
                          {core.landing_success ? (
                            <Badge variant="success">Success</Badge>
                          ) : (
                            <Badge variant="failure">Failed</Badge>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failures */}
      {launch.failures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {launch.failures.map((failure, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
                >
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    {failure.reason}
                  </p>
                  <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                    Time: {failure.time}s | Altitude: {failure.altitude ?? 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {launch.links.webcast && (
              <a
                href={`https://youtube.com/watch?v=${launch.links.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Watch Webcast
                </Button>
              </a>
            )}
            {launch.links.article && (
              <a href={launch.links.article} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Read Article
                </Button>
              </a>
            )}
            {launch.links.wikipedia && (
              <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Wikipedia
                </Button>
              </a>
            )}
            {launch.links.presskit && (
              <a href={launch.links.presskit} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Press Kit
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flickr Images */}
      {launch.links.flickr && launch.links.flickr.original.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {launch.links.flickr.original.slice(0, 6).map((image, index) => (
                <a
                  key={index}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${launch.name} photo ${index + 1}`}
                    width={400}
                    height={300}
                    className="transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
