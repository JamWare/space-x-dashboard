'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { Launch } from '@/lib/schemas/launches.schema';
import { groupLaunchesByTime, type TimeGrouping } from '@/lib/utils/analytics';
import { Button } from '@/components/ui/button';

interface LaunchesTimelineChartProps {
  launches: Launch[];
  grouping?: TimeGrouping;
}

export function LaunchesTimelineChart({
  launches,
  grouping: initialGrouping = 'year'
}: LaunchesTimelineChartProps) {
  const [isDark, setIsDark] = useState(false);
  const [grouping, setGrouping] = useState<TimeGrouping>(initialGrouping);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Group launches by time period
  const timeSeriesData = useMemo(() => {
    return groupLaunchesByTime(launches, grouping);
  }, [launches, grouping]);

  // Format axis label based on grouping
  const formatXAxis = (period: string) => {
    if (!period) return '';

    try {
      switch (grouping) {
        case 'month':
          // Format: "2020-01" -> "Jan 2020"
          const [year, month] = period.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return format(date, 'MMM yy');
        case 'quarter':
          // Format: "2020-Q1" -> "Q1 '20"
          return period.replace(/(\d{4})-Q(\d)/, "Q$2 '$1").replace("'20", "'");
        case 'year':
          // Format: "2020" -> "2020"
          return period;
        default:
          return period;
      }
    } catch {
      return period;
    }
  };

  // Color palette (light/dark mode)
  const colors = {
    successful: isDark ? '#34d399' : '#10b981',
    failed: isDark ? '#f87171' : '#ef4444',
    grid: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#9ca3af' : '#6b7280',
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-2 font-medium text-gray-900 dark:text-gray-100">
            {formatXAxis(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Total: {total}
          </p>
        </div>
      );
    }
    return null;
  };

  if (timeSeriesData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500 dark:text-gray-400">
        No launch data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grouping controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Group by:
        </span>
        <Button
          variant={grouping === 'month' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setGrouping('month')}
        >
          Month
        </Button>
        <Button
          variant={grouping === 'quarter' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setGrouping('quarter')}
        >
          Quarter
        </Button>
        <Button
          variant={grouping === 'year' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setGrouping('year')}
        >
          Year
        </Button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={timeSeriesData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.successful} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.successful} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.failed} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.failed} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
          <XAxis
            dataKey="period"
            tickFormatter={formatXAxis}
            stroke={colors.text}
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke={colors.text} style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            formatter={(value) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="successful"
            name="Successful"
            stackId="1"
            stroke={colors.successful}
            fill="url(#colorSuccessful)"
          />
          <Area
            type="monotone"
            dataKey="failed"
            name="Failed"
            stackId="1"
            stroke={colors.failed}
            fill="url(#colorFailed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
