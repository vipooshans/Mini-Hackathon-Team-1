import { useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default marker icon paths (Vite bundling breaks them)
// Assumption: using CDN marker icons to avoid asset bundling issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * Internal component — listens for map clicks and places marker.
 */
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

/**
 * Internal component — flies map to a given position.
 */
function FlyToPosition({ position }) {
  const map = useMap();
  const hasFlewRef = useRef(false);

  useEffect(() => {
    if (position && !hasFlewRef.current) {
      map.flyTo(position, 16, { duration: 1.2 });
      hasFlewRef.current = true;
    }
  }, [position, map]);

  return null;
}

/**
 * LocationPicker — interactive Leaflet map for selecting a report location.
 *
 * Features:
 * - Default view: Sri Lanka center (~7.8°N, 80.7°E)
 * - "Use my current location" button → GPS fly-to + marker
 * - Click anywhere on map → move marker
 * - Draggable marker → fine-tune position
 * - Exposes { lat, lng } to parent via onChange callback
 *
 * Props:
 *   value: { lat: number, lng: number } | null
 *   onChange: (coords: { lat: number, lng: number }) => void
 */
function LocationPicker({ value, onChange }) {
  const markerRef = useRef(null);

  // Sri Lanka center as default
  const defaultCenter = [7.8731, 80.7718];
  const defaultZoom = 8;

  const handleMapClick = useCallback(
    (latlng) => {
      onChange({ lat: latlng.lat, lng: latlng.lng });
    },
    [onChange]
  );

  const handleMarkerDrag = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const pos = marker.getLatLng();
      onChange({ lat: pos.lat, lng: pos.lng });
    }
  }, [onChange]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        // Silently fail — map still works for manual click
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange]);

  return (
    <div className="lp-wrapper">
      <div className="lp-toolbar">
        <span className="lp-toolbar__label">Pin location on map</span>
        <button
          type="button"
          className="rf-btn rf-btn--secondary lp-toolbar__btn"
          onClick={handleGeolocate}
        >
          📍 Use my current location
        </button>
      </div>

      <div className="lp-map-container">
        <MapContainer
          center={value ? [value.lat, value.lng] : defaultCenter}
          zoom={value ? 16 : defaultZoom}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onMapClick={handleMapClick} />

          {value && <FlyToPosition position={[value.lat, value.lng]} />}

          {value && (
            <Marker
              position={[value.lat, value.lng]}
              draggable={true}
              ref={markerRef}
              eventHandlers={{ dragend: handleMarkerDrag }}
            />
          )}
        </MapContainer>
      </div>

      {value && (
        <div className="lp-coords">
          <span>Lat: {value.lat.toFixed(6)}</span>
          <span>Lng: {value.lng.toFixed(6)}</span>
        </div>
      )}

      <p className="lp-hint">
        Click anywhere on the map to place a pin, or use your current location.
        You can drag the pin to adjust.
      </p>
    </div>
  );
}

export default LocationPicker;
