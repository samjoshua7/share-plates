import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix generic Leaflet icon paths in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle clicks on the map to drop a pin
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapUpdater({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.flyTo([coordinates.lat, coordinates.lng], 14);
    }
  }, [coordinates, map]);
  return null;
}

export default function FoodMap({ coordinates, setCoordinates }) {
  const defaultCenter = [40.7128, -74.0060];
  
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1.5px solid var(--border)" }}>
      <MapContainer 
        center={coordinates ? [coordinates.lat, coordinates.lng] : defaultCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={coordinates} setPosition={setCoordinates} />
        <MapUpdater coordinates={coordinates} />
      </MapContainer>
    </div>
  );
}
