import Link from 'next/link';
import { Payload } from '@/lib/schemas/payloads.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PayloadCardProps {
  payload: Payload;
}

export function PayloadCard({ payload }: PayloadCardProps) {
  const hasDragon = payload.dragon !== null;
  const primaryCustomer = payload.customers[0] || 'Unknown';
  const massDisplay = payload.mass_kg
    ? `${payload.mass_kg.toFixed(0)} kg (${payload.mass_lbs?.toFixed(0)} lbs)`
    : 'Mass unknown';
  const orbitDisplay = payload.orbit && payload.regime
    ? `${payload.orbit} (${payload.regime})`
    : payload.orbit || payload.regime || 'Unknown orbit';

  return (
    <Link href={`/payloads/${payload.id}`}>
      <Card className="h-full transition-all hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={payload.reused ? 'warning' : 'neutral'}>
                  {payload.reused ? 'Reused' : 'New'}
                </Badge>
                {hasDragon && <Badge variant="success">Dragon</Badge>}
              </div>
              <CardTitle className="line-clamp-2 text-lg">
                {payload.name}
              </CardTitle>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {payload.type}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Mass:</span> {massDisplay}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Orbit:</span> {orbitDisplay}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Customer:</span> {primaryCustomer}
            </div>
            {payload.manufacturers.length > 0 && (
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Manufacturer:</span>{' '}
                {payload.manufacturers[0]}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
