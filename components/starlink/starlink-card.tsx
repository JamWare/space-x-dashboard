import Link from 'next/link';
import { Starlink } from '@/lib/schemas/starlink.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/format-date';

interface StarlinkCardProps {
  starlink: Starlink;
}

export function StarlinkCard({ starlink }: StarlinkCardProps) {
  const isActive = starlink.spaceTrack.DECAYED === 0;
  const launchDate = formatDate(starlink.spaceTrack.LAUNCH_DATE, 'PP');

  return (
    <Link href={`/starlink/${starlink.id}`}>
      <Card className="h-full transition-all hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  NORAD: {starlink.spaceTrack.NORAD_CAT_ID}
                </span>
                <Badge variant={isActive ? 'success' : 'neutral'}>
                  {isActive ? 'Active' : 'Deorbited'}
                </Badge>
              </div>
              <CardTitle className="line-clamp-1 text-lg">
                {starlink.spaceTrack.OBJECT_NAME}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
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
              <span className="font-medium">{launchDate}</span>
            </div>
            {starlink.height_km !== null && starlink.velocity_kms !== null ? (
              <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Altitude</div>
                  <div className="font-medium">{starlink.height_km.toFixed(2)} km</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Velocity</div>
                  <div className="font-medium">{starlink.velocity_kms.toFixed(2)} km/s</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Position data unavailable
              </div>
            )}
            {starlink.latitude !== null && starlink.longitude !== null && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Position</div>
                <div className="font-mono text-gray-600 dark:text-gray-400">
                  {starlink.latitude.toFixed(2)}°, {starlink.longitude.toFixed(2)}°
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
