'use client';

import { use } from 'react';
import Link from 'next/link';
import { useStarlinkById } from '@/hooks/use-starlink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate, formatDateTime } from '@/lib/utils/format-date';

interface StarlinkDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StarlinkDetailPage({ params }: StarlinkDetailPageProps) {
  const { id } = use(params);
  const { starlink, isLoading, isError } = useStarlinkById(id);

  if (isLoading) {
    return <LoadingSkeleton count={4} />;
  }

  if (isError || !starlink) {
    return <ErrorMessage error={isError} title="Failed to load satellite" />;
  }

  const isActive = starlink.spaceTrack.DECAYED === 0;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/starlink">
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
          Back to Starlink
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              NORAD: {starlink.spaceTrack.NORAD_CAT_ID}
            </span>
            <Badge variant={isActive ? 'success' : 'neutral'}>
              {isActive ? 'Active' : 'Deorbited'}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {starlink.spaceTrack.OBJECT_NAME}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {starlink.spaceTrack.OBJECT_ID}
          </p>
        </div>
      </div>

      {/* Current Position */}
      <Card>
        <CardHeader>
          <CardTitle>Current Position</CardTitle>
        </CardHeader>
        <CardContent>
          {starlink.latitude !== null && starlink.longitude !== null &&
           starlink.height_km !== null && starlink.velocity_kms !== null ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Latitude</dt>
                <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {starlink.latitude.toFixed(4)}°
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Longitude</dt>
                <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {starlink.longitude.toFixed(4)}°
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Altitude</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {starlink.height_km.toFixed(2)} km
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Velocity</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {starlink.velocity_kms.toFixed(2)} km/s
                </dd>
              </div>
              {starlink.version && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {starlink.version}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Position data is currently unavailable for this satellite.</p>
              {starlink.version && (
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {starlink.version}
                  </dd>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orbital Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Orbital Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Epoch</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDateTime(starlink.spaceTrack.EPOCH)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Period</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.PERIOD.toFixed(2)} minutes
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mean Motion</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.MEAN_MOTION.toFixed(4)} rev/day
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Inclination</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.INCLINATION.toFixed(4)}°
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Eccentricity</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.ECCENTRICITY.toFixed(7)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Semi-major Axis</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.SEMIMAJOR_AXIS.toFixed(2)} km
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Apoapsis</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.APOAPSIS.toFixed(2)} km
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Periapsis</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.PERIAPSIS.toFixed(2)} km
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mean Anomaly</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.MEAN_ANOMALY.toFixed(4)}°
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Right Ascension
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.RA_OF_ASC_NODE.toFixed(4)}°
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Arg of Pericenter
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.ARG_OF_PERICENTER.toFixed(4)}°
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Launch Information */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Launch Date</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(starlink.spaceTrack.LAUNCH_DATE, 'PPP')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Launch Site</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.SITE}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.COUNTRY_CODE}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Revolutions at Epoch
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.REV_AT_EPOCH.toLocaleString()}
              </dd>
            </div>
            {starlink.spaceTrack.DECAY_DATE && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Decay Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(starlink.spaceTrack.DECAY_DATE, 'PPP')}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Tracking Data */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking & Technical Data</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Object Type</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.OBJECT_TYPE}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reference Frame
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.REF_FRAME}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Element Theory
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.MEAN_ELEMENT_THEORY}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                BSTAR Drag Term
              </dt>
              <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.BSTAR.toExponential(4)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Data Originator
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.ORIGINATOR}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Creation Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDateTime(starlink.spaceTrack.CREATION_DATE)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* TLE Data */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Line Element Set (TLE)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Line 0</dt>
              <dd className="mt-1 rounded-md bg-gray-100 p-2 font-mono text-xs text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.TLE_LINE0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Line 1</dt>
              <dd className="mt-1 rounded-md bg-gray-100 p-2 font-mono text-xs text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.TLE_LINE1}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Line 2</dt>
              <dd className="mt-1 rounded-md bg-gray-100 p-2 font-mono text-xs text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {starlink.spaceTrack.TLE_LINE2}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
