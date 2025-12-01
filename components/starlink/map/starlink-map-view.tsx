'use client';

import { useEffect, useState } from 'react';
import { Starlink } from '@/lib/schemas/starlink.schema';
import 'leaflet/dist/leaflet.css';

// Dynamic imports to avoid SSR issues
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;
let MarkerClusterGroup: any;
let L: any;

interface StarlinkMapViewProps {
  satellites: Starlink[];
}

export function StarlinkMapView({ satellites }: StarlinkMapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Dynamic imports for client-side only
    Promise.all([
      import('react-leaflet'),
      import('react-leaflet-cluster'),
      import('leaflet'),
    ]).then(([leaflet, cluster, leafletLib]) => {
      MapContainer = leaflet.MapContainer;
      TileLayer = leaflet.TileLayer;
      Marker = leaflet.Marker;
      Popup = leaflet.Popup;
      MarkerClusterGroup = cluster.default;
      L = leafletLib.default;

      // Fix default marker icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setIsClient(true);
    });
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      className="h-[600px] w-full rounded-lg border border-gray-200 dark:border-gray-800"
      scrollWheelZoom={true}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
      minZoom={2}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        disableClusteringAtZoom={10}
      >
        {satellites.map((satellite) => {
          const isActive = satellite.spaceTrack.DECAYED === 0;

          return (
            <Marker
              key={satellite.id}
              position={[satellite.latitude!, satellite.longitude!]}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold">
                      {satellite.spaceTrack.OBJECT_NAME}
                    </h3>
                    <span
                      className={`text-xs ${
                        isActive ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Deorbited'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">NORAD:</span>{' '}
                      {satellite.spaceTrack.NORAD_CAT_ID}
                    </div>
                    <div>
                      <span className="font-medium">Position:</span>{' '}
                      {satellite.latitude!.toFixed(2)}°,{' '}
                      {satellite.longitude!.toFixed(2)}°
                    </div>
                    <div>
                      <span className="font-medium">Altitude:</span>{' '}
                      {satellite.height_km!.toFixed(2)} km
                    </div>
                    {satellite.velocity_kms !== null && (
                      <div>
                        <span className="font-medium">Velocity:</span>{' '}
                        {satellite.velocity_kms.toFixed(2)} km/s
                      </div>
                    )}
                    {satellite.version && (
                      <div>
                        <span className="font-medium">Version:</span>{' '}
                        {satellite.version}
                      </div>
                    )}
                  </div>
                  <a
                    href={`/starlink/${satellite.id}`}
                    className="mt-2 block rounded bg-blue-500 px-2 py-1 text-center text-xs text-white hover:bg-blue-600"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
