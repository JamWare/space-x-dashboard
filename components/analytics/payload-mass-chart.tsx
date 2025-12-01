'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Payload } from '@/lib/schemas/payloads.schema';
import { calculateMassDistribution } from '@/lib/utils/analytics';

interface PayloadMassChartProps {
  payloads: Payload[];
  bucketSize?: number;
}

export function PayloadMassChart({
  payloads,
  bucketSize = 1000
}: PayloadMassChartProps) {
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate mass distribution
  const distributionData = useMemo(() => {
    return calculateMassDistribution(payloads, bucketSize);
  }, [payloads, bucketSize]);

  // Color palette (light/dark mode)
  const colors = {
    bar: isDark ? '#60a5fa' : '#3b82f6',
    grid: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#9ca3af' : '#6b7280',
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {data.min} - {data.max} kg
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} payload{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (distributionData.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-gray-500 dark:text-gray-400">
        No payload mass data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={distributionData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
          <XAxis
            dataKey="range"
            stroke={colors.text}
            style={{ fontSize: '12px' }}
            label={{
              value: 'Mass Range (kg)',
              position: 'insideBottom',
              offset: -5,
              style: { fill: colors.text, fontSize: '12px' },
            }}
          />
          <YAxis
            stroke={colors.text}
            style={{ fontSize: '12px' }}
            label={{
              value: 'Number of Payloads',
              angle: -90,
              position: 'insideLeft',
              style: { fill: colors.text, fontSize: '12px', textAnchor: 'middle' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill={colors.bar} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {payloads.filter(p => p.mass_kg !== null && p.mass_kg > 0).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Payloads with mass data
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {Math.max(...distributionData.map(d => d.count))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Largest bucket
          </div>
        </div>
      </div>
    </div>
  );
}
