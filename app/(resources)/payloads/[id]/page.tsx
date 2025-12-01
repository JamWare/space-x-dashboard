'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePayloadById } from '@/hooks/use-payloads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate } from '@/lib/utils/format-date';

interface PayloadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PayloadDetailPage({ params }: PayloadDetailPageProps) {
  const { id } = use(params);
  const { payload, isLoading, isError } = usePayloadById(id);

  if (isLoading) {
    return <LoadingSkeleton count={4} />;
  }

  if (isError || !payload) {
    return <ErrorMessage error={isError} title="Failed to load payload" />;
  }

  const hasDragon = payload.dragon !== null;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/payloads">
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
          Back to Payloads
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant={payload.reused ? 'warning' : 'neutral'}>
              {payload.reused ? 'Reused' : 'New'}
            </Badge>
            {hasDragon && <Badge variant="success">Dragon Mission</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {payload.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {payload.type}
          </p>
        </div>
      </div>

      {/* Physical Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {payload.mass_kg && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mass (kg)
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {payload.mass_kg.toLocaleString()} kg
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mass (lbs)
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {payload.mass_lbs?.toLocaleString()} lbs
                  </dd>
                </div>
              </>
            )}
            {payload.lifespan_years && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Lifespan
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.lifespan_years} years
                </dd>
              </div>
            )}
            {payload.manufacturers.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Manufacturers
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.manufacturers.join(', ')}
                </dd>
              </div>
            )}
            {payload.nationalities.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nationalities
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.nationalities.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Customer Information */}
      {payload.customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payload.customers.map((customer, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {customer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orbital Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Orbital Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Orbit</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {payload.orbit || 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Regime</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {payload.regime || 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reference System
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {payload.reference_system || 'Unknown'}
              </dd>
            </div>
            {payload.longitude && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Longitude
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.longitude.toFixed(4)}°
                </dd>
              </div>
            )}
            {payload.semi_major_axis_km && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Semi-major Axis
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.semi_major_axis_km.toFixed(2)} km
                </dd>
              </div>
            )}
            {payload.eccentricity !== null && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Eccentricity
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {payload.eccentricity.toFixed(7)}
                </dd>
              </div>
            )}
            {payload.periapsis_km && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Periapsis
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.periapsis_km.toFixed(2)} km
                </dd>
              </div>
            )}
            {payload.apoapsis_km && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Apoapsis
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.apoapsis_km.toFixed(2)} km
                </dd>
              </div>
            )}
            {payload.inclination_deg && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Inclination
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.inclination_deg.toFixed(4)}°
                </dd>
              </div>
            )}
            {payload.period_min && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Period
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payload.period_min.toFixed(2)} minutes
                </dd>
              </div>
            )}
            {payload.epoch && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Epoch</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(payload.epoch, 'PPP')}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Dragon Mission Data */}
      {hasDragon && payload.dragon && (
        <Card>
          <CardHeader>
            <CardTitle>Dragon Mission Data</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {payload.dragon.capsule && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Capsule ID
                  </dt>
                  <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                    {payload.dragon.capsule}
                  </dd>
                </div>
              )}
              {payload.dragon.mass_returned_kg && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mass Returned (kg)
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {payload.dragon.mass_returned_kg.toLocaleString()} kg
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mass Returned (lbs)
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {payload.dragon.mass_returned_lbs?.toLocaleString()} lbs
                    </dd>
                  </div>
                </>
              )}
              {payload.dragon.flight_time_sec && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Flight Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {(payload.dragon.flight_time_sec / 86400).toFixed(2)} days
                  </dd>
                </div>
              )}
              {(payload.dragon.water_landing || payload.dragon.land_landing) && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Landing Type
                  </dt>
                  <dd className="mt-1">
                    {payload.dragon.water_landing && (
                      <Badge variant="neutral">Water Landing</Badge>
                    )}
                    {payload.dragon.land_landing && (
                      <Badge variant="success">Land Landing</Badge>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Tracking Information */}
      {payload.norad_ids && payload.norad_ids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                NORAD IDs
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {payload.norad_ids.map((noradId, index) => (
                  <Badge key={index} variant="neutral">
                    {noradId}
                  </Badge>
                ))}
              </dd>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
