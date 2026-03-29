import { useEffect, useState } from 'react';

export type LocationPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface UseUserLocationResult {
  userLocation: [number, number] | null;
  locationPermission: LocationPermissionState;
}

export function useUserLocation(enabled = true): UseUserLocationResult {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>(enabled ? 'prompt' : 'denied');

  useEffect(() => {
    if (!enabled) {
      setUserLocation(null);
      setLocationPermission('denied');
      return;
    }

    if (!navigator.geolocation) {
      setLocationPermission('unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, [enabled]);

  return { userLocation, locationPermission };
}
