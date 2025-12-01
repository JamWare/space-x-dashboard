'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRocketById } from '@/hooks/use-rockets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate } from '@/lib/utils/format-date';

interface RocketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RocketDetailPage({ params }: RocketDetailPageProps) {
  const { id } = use(params);
  const { rocket, isLoading, isError } = useRocketById(id);

  if (isLoading) {
    return <LoadingSkeleton count={4} />;
  }

  if (isError || !rocket) {
    return <ErrorMessage error={isError} title="Failed to load rocket" />;
  }

  const firstFlight = formatDate(rocket.first_flight, 'PPP');

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/rockets">
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
          Back to Rockets
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant={rocket.active ? 'success' : 'neutral'}>
              {rocket.active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="neutral">
              {rocket.success_rate_pct}% Success Rate
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {rocket.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {rocket.description}
          </p>
        </div>
        {rocket.wikipedia && (
          <a
            href={rocket.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span className="mr-2">Wikipedia</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.country}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.company}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">First Flight</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {firstFlight}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cost per Launch
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                ${rocket.cost_per_launch.toLocaleString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Physical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.height.meters} m ({rocket.height.feet} ft)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Diameter</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.diameter.meters} m ({rocket.diameter.feet} ft)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mass</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.mass.kg.toLocaleString()} kg ({rocket.mass.lb.toLocaleString()} lb)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Stages</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.stages}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Boosters</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.boosters}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Landing Legs</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.landing_legs.number} {rocket.landing_legs.material && `(${rocket.landing_legs.material})`}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* First Stage */}
      <Card>
        <CardHeader>
          <CardTitle>First Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Engines</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.first_stage.engines}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reusable</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.first_stage.reusable ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fuel Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.first_stage.fuel_amount_tons} tons
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Thrust (Sea Level)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.first_stage.thrust_sea_level.kN.toLocaleString()} kN
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Thrust (Vacuum)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.first_stage.thrust_vacuum.kN.toLocaleString()} kN
              </dd>
            </div>
            {rocket.first_stage.burn_time_sec && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Burn Time</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {rocket.first_stage.burn_time_sec} seconds
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Second Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Second Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Engines</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.engines}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reusable</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.reusable ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fuel Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.fuel_amount_tons} tons
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Thrust</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.thrust.kN.toLocaleString()} kN
              </dd>
            </div>
            {rocket.second_stage.burn_time_sec && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Burn Time</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {rocket.second_stage.burn_time_sec} seconds
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Composite Fairing Height
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.payloads.composite_fairing.height.meters} m
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Composite Fairing Diameter
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.second_stage.payloads.composite_fairing.diameter.meters} m
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Engine Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Engine Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.type} {rocket.engines.version}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Number</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.number}
              </dd>
            </div>
            {rocket.engines.layout && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Layout</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {rocket.engines.layout}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Propellant 1</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.propellant_1}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Propellant 2</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.propellant_2}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Thrust-to-Weight
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.thrust_to_weight}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ISP (Sea Level)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.isp.sea_level}s
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ISP (Vacuum)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {rocket.engines.isp.vacuum}s
              </dd>
            </div>
            {rocket.engines.engine_loss_max !== null && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Engine Loss Max
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {rocket.engines.engine_loss_max}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Payload Capacities */}
      <Card>
        <CardHeader>
          <CardTitle>Payload Capacities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rocket.payload_weights.map((payload) => (
              <div
                key={payload.id}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0 dark:border-gray-700"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {payload.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {payload.id.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {payload.kg.toLocaleString()} kg
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {payload.lb.toLocaleString()} lb
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      {rocket.flickr_images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rocket.flickr_images.map((image, index) => (
                <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${rocket.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
