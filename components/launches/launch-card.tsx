import Link from 'next/link';
import Image from 'next/image';
import { Launch } from '@/lib/schemas/launches.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/lib/utils/format-date';

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const patchImage = launch.links.patch?.small;
  const isUpcoming = launch.upcoming;
  const launchDate = formatDate(launch.date_utc, 'PPP');
  const relativeTime = formatRelativeTime(launch.date_utc);

  // Determine success badge
  let successBadge = null;
  if (!isUpcoming) {
    if (launch.success === true) {
      successBadge = <Badge variant="success">Success</Badge>;
    } else if (launch.success === false) {
      successBadge = <Badge variant="failure">Failure</Badge>;
    } else {
      successBadge = <Badge variant="neutral">Unknown</Badge>;
    }
  } else {
    successBadge = <Badge variant="warning">Upcoming</Badge>;
  }

  return (
    <Link href={`/launches/${launch.id}`}>
      <Card className="h-full transition-all hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  #{launch.flight_number}
                </span>
                {successBadge}
              </div>
              <CardTitle className="line-clamp-2">{launch.name}</CardTitle>
            </div>
            {patchImage && (
              <div className="flex-shrink-0">
                <Image
                  src={patchImage}
                  alt={`${launch.name} mission patch`}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
              </div>
            )}
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
            <div className="text-gray-500 dark:text-gray-500">
              {relativeTime}
            </div>
            {launch.details && (
              <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
                {launch.details}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
