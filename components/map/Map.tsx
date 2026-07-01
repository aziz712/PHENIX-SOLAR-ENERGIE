"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

interface MapProps {
    interactive?: boolean;
    initialCenter?: [number, number];
    onLocationSelect?: (lat: number, lng: number) => void;
    markers?: Array<{ lat: number; lng: number; title?: string }>;
    flyToLocation?: [number, number] | null;
    selectedPosition?: [number, number] | null;
    popupText?: string;
}

const LocationMarker = ({
    onLocationSelect,
    interactive,
    selectedPosition,
    popupText = "Position sélectionnée"
}: {
    onLocationSelect?: (lat: number, lng: number) => void;
    interactive?: boolean;
    selectedPosition?: [number, number] | null;
    popupText?: string;
}) => {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    // Sync internal state with external prop
    useEffect(() => {
        if (selectedPosition) {
            setPosition(L.latLng(selectedPosition[0], selectedPosition[1]));
        }
    }, [selectedPosition]);

    useMapEvents({
        click(e) {
            if (interactive && onLocationSelect) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    return position ? (
        <Marker position={position} icon={defaultIcon}>
            <Popup>{popupText}</Popup>
        </Marker>
    ) : null;
};


const Map = ({
    interactive = false,
    initialCenter = [34.0, 9.5],
    onLocationSelect,
    markers = [],
    selectedPosition,
    popupText,
    ...props
}: MapProps) => {

    // Bounds for Tunisia
    const tunisiaBounds = L.latLngBounds(
        L.latLng(30.0, 7.0), // South West
        L.latLng(38.0, 12.0) // North East
    );

    return (
        <MapContainer
            center={initialCenter}
            zoom={7}
            scrollWheelZoom={interactive}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            maxBounds={tunisiaBounds}
            maxBoundsViscosity={1.0}
            minZoom={6}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Controller for programmatic moves */}
            <MapController flyToLocation={props.flyToLocation} />

            {/* Interactive Picker Marker */}
            <LocationMarker
                onLocationSelect={onLocationSelect}
                interactive={interactive}
                selectedPosition={selectedPosition}
                popupText={popupText}
            />

            {/* Static Markers */}
            {markers.map((marker, idx) => (
                <Marker key={idx} position={[marker.lat, marker.lng]} icon={defaultIcon}>
                    {marker.title && <Popup>{marker.title}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    );
};

// Internal component to handle map moves
const MapController = ({ flyToLocation }: { flyToLocation?: [number, number] | null }) => {
    const map = useMapEvents({});

    useEffect(() => {
        if (flyToLocation) {
            map.flyTo(flyToLocation, 13, {
                animate: true,
                duration: 1.5
            });
        }
    }, [flyToLocation, map]);

    return null;
};

export default Map;
