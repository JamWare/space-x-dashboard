'use client';

import { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Launch } from '@/lib/schemas/launches.schema';
import { calculateSuccessRate } from '@/lib/utils/analytics';

interface LaunchSuccessChartProps {
  launches: Launch[];
}

export function LaunchSuccessChart({ launches }: LaunchSuccessChartProps) {
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate success statistics
  const stats = useMemo(() => calculateSuccessRate(launches), [launches]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const data = [];
    if (stats.successful > 0) {
      data.push({ name: 'Successful', value: stats.successful });
    }
    if (stats.failed > 0) {
      data.push({ name: 'Failed', value: stats.failed });
    }
    if (stats.unknown > 0) {
      data.push({ name: 'Unknown', value: stats.unknown });
    }
    return data;
  }, [stats]);

  // Color palette (light/dark mode)
  const colors = {
    successful: isDark ? '#34d399' : '#10b981',
    failed: isDark ? '#f87171' : '#ef4444',
    unknown: isDark ? '#9ca3af' : '#6b7280',
  };

  const COLORS = [colors.successful, colors.failed, colors.unknown];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / stats.total) * 100).toFixed(1);
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value} launches ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        No launch data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Success Rate Display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {stats.successRate}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {stats.successful}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Successful</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {stats.failed}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Failed</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {stats.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>
    </div>
  );
}
