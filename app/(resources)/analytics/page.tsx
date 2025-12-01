'use client';

import { useState, useMemo } from 'react';
import { useLaunches } from '@/hooks/use-launches';
import { usePayloads } from '@/hooks/use-payloads';
import { useRockets } from '@/hooks/use-rockets';
import { filterByDateRange } from '@/lib/utils/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { AnalyticsFilters } from '@/components/analytics/analytics-filters';
import { StatsOverview } from '@/components/analytics/stats-overview';
import { LaunchSuccessChart } from '@/components/analytics/launch-success-chart';
import { LaunchesTimelineChart } from '@/components/analytics/launches-timeline-chart';
import { PayloadMassChart } from '@/components/analytics/payload-mass-chart';

export default function AnalyticsPage() {
  // Fetch data
  const { launches, isLoading: launchesLoading, isError: launchesError, mutate: mutateLaunches } = useLaunches();
  const { payloads, isLoading: payloadsLoading, isError: payloadsError, mutate: mutatePayloads } = usePayloads();
  const { rockets, isLoading: rocketsLoading, isError: rocketsError, mutate: mutateRockets } = useRockets();

  // Filter state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRockets, setSelectedRockets] = useState<string[]>([]);

  // Handle date range change
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Handle rocket filter change
  const handleRocketFilterChange = (rocketIds: string[]) => {
    setSelectedRockets(rocketIds);
  };

  // Filter launches based on filters
  const filteredLaunches = useMemo(() => {
    let filtered = launches;

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filterByDateRange(filtered, startDate, endDate);
    }

    // Apply rocket filter
    if (selectedRockets.length > 0) {
      filtered = filtered.filter(l => selectedRockets.includes(l.rocket));
    }

    return filtered;
  }, [launches, startDate, endDate, selectedRockets]);

  // Filter payloads based on filtered launches
  const filteredPayloads = useMemo(() => {
    const launchIds = new Set(filteredLaunches.map(l => l.id));
    return payloads.filter(p => launchIds.has(p.launch));
  }, [payloads, filteredLaunches]);

  // Loading state
  const isLoading = launchesLoading || payloadsLoading || rocketsLoading;

  // Error state
  const error = launchesError || payloadsError || rocketsError;

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          SpaceX Analytics
        </h1>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
          SpaceX Analytics
        </h1>
        <ErrorMessage
          error={error}
          onRetry={() => {
            mutateLaunches();
            mutatePayloads();
            mutateRockets();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          SpaceX Analytics
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive mission data analysis and visualizations
        </p>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        onDateRangeChange={handleDateRangeChange}
        onRocketFilterChange={handleRocketFilterChange}
        rockets={rockets}
      />

      {/* Stats Overview */}
      <StatsOverview
        launches={filteredLaunches}
        payloads={filteredPayloads}
        rockets={rockets}
      />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Launch Success Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Launch Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <LaunchSuccessChart launches={filteredLaunches} />
          </CardContent>
        </Card>

        {/* Launches Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Launches Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LaunchesTimelineChart launches={filteredLaunches} />
          </CardContent>
        </Card>

        {/* Payload Mass Chart - Full width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payload Mass Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PayloadMassChart payloads={filteredPayloads} />
          </CardContent>
        </Card>
      </div>

      {/* Filter info */}
      {(selectedRockets.length > 0 || startDate || endDate) && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Showing analytics for filtered data
            {startDate && ` from ${startDate.toLocaleDateString()}`}
            {endDate && ` to ${endDate.toLocaleDateString()}`}
            {selectedRockets.length > 0 && ` (${selectedRockets.length} rocket${selectedRockets.length !== 1 ? 's' : ''})`}
          </p>
        </div>
      )}
    </div>
  );
}
