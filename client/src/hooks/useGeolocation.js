import { useState, useCallback } from "react";

/**
 * useGeolocation — custom hook wrapping navigator.geolocation.
 *
 * Usage:
 *   const { coords, status, error, requestLocation } = useGeolocation();
 *
 * status values:
 *   "idle"        — initial state, nothing requested yet
 *   "loading"     — currently fetching position
 *   "success"     — coords populated
 *   "denied"      — user denied permission
 *   "unsupported" — browser doesn't support geolocation
 *
 * coords: { lat: number, lng: number } | null
 * error: string | null  — always a friendly message, never a raw Error
 * requestLocation: () => void — call to trigger the geolocation prompt
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    // Check browser support first
    if (!navigator.geolocation) {
      setStatus("unsupported");
      setError(
        "Your browser does not support geolocation. You can still submit the report without a location."
      );
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
        setError(null);
      },
      // Error callback — map to friendly messages
      (geoError) => {
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setStatus("denied");
            setError(
              "Location access was denied. You can still submit the report without a location."
            );
            break;
          case geoError.POSITION_UNAVAILABLE:
            setStatus("denied");
            setError(
              "Unable to determine your location right now. You can still submit the report without a location."
            );
            break;
          case geoError.TIMEOUT:
            setStatus("denied");
            setError(
              "Location request timed out. You can still submit the report without a location."
            );
            break;
          default:
            setStatus("denied");
            setError(
              "An unexpected error occurred while fetching your location. You can still submit without it."
            );
        }
      },
      // Options — 10s timeout, high accuracy
      // Assumption: 10s timeout is reasonable for mobile networks in Sri Lanka
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { coords, status, error, requestLocation };
}
