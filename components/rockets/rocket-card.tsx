import Link from 'next/link';
import { Rocket } from '@/lib/schemas/rockets.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/format-date';

interface RocketCardProps {
  rocket: Rocket;
}

export function RocketCard({ rocket }: RocketCardProps) {
  const firstFlight = formatDate(rocket.first_flight, 'PP');

  return (
    <Link href={`/rockets/${rocket.id}`}>
      <Card className="h-full transition-all hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={rocket.active ? 'success' : 'neutral'}>
                  {rocket.active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="neutral">
                  {rocket.success_rate_pct}% Success
                </Badge>
              </div>
              <CardTitle className="line-clamp-1 text-lg">
                {rocket.name}
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {rocket.country}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>First Flight: <span className="font-medium">{firstFlight}</span></span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Height</div>
                <div className="font-medium">{rocket.height.meters}m</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Stages</div>
                <div className="font-medium">{rocket.stages}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Mass</div>
                <div className="font-medium">{rocket.mass.kg.toLocaleString()} kg</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Cost/Launch</div>
                <div className="font-medium">${(rocket.cost_per_launch / 1000000).toFixed(0)}M</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {rocket.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
