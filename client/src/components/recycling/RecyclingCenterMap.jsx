import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DistanceBadge, VerificationBadge } from "./Badges.jsx";
import OpeningStatus from "./OpeningStatus.jsx";
import { buildDirectionsUrl } from "../../utils/recyclingUtils.js";

// Fix default marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function RecyclingCenterMap({
  centers = [],
  userCoords,
  height = 420,
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const defaultCenter = userCoords
    ? [userCoords.lat, userCoords.lng]
    : [6.9271, 79.8612];

  if (!ready) {
    return (
      <div className="map-placeholder" style={{ height }} aria-busy="true">
        Loading map…
      </div>
    );
  }

  return (
    <div className="rg-map" style={{ height }} role="region" aria-label="Recycling centers map">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userCoords && (
          <CircleMarker
            center={[userCoords.lat, userCoords.lng]}
            radius={8}
            pathOptions={{ color: "#0c4a3e", fillColor: "#1a7a5c", fillOpacity: 0.8 }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}
        {centers.map((c) => {
          const coords = c.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const [lng, lat] = coords;
          const directions = buildDirectionsUrl(c, userCoords);
          return (
            <Marker key={c._id} position={[lat, lng]}>
              <Popup>
                <strong>{c.name}</strong>
                <div>
                  <DistanceBadge distance={c.distance} />
                </div>
                <p>Accepted: {(c.acceptedWaste || []).join(", ")}</p>
                <OpeningStatus openingHours={c.openingHours} />
                <VerificationBadge
                  verified={c.verified}
                  verificationStatus={c.verificationStatus}
                  isDemo={c.isDemo}
                />
                <div className="map-popup-actions">
                  <Link to={`/recycling-centers/${c._id}`}>View Details</Link>
                  {directions && (
                    <a href={directions} target="_blank" rel="noopener noreferrer">
                      Directions
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
