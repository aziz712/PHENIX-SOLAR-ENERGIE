"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Tunisian governorates (approximate centers)
const GOVERNORATE_COORDS: Record<string, [number, number]> = {
    'Ariana': [36.8665, 10.1647],
    'Béja': [36.7256, 9.1817],
    'Ben Arous': [36.7531, 10.2222],
    'Bizerte': [37.2744, 9.8739],
    'Gabès': [33.8815, 10.0982],
    'Gafsa': [34.4250, 8.7842],
    'Jendouba': [36.5011, 8.7794],
    'Kairouan': [35.6781, 10.0963],
    'Kasserine': [35.1675, 8.8319],
    'Kébili': [33.7050, 8.9650],
    'Le Kef': [36.1822, 8.7147],
    'Mahdia': [35.5047, 11.0622],
    'La Manouba': [36.8081, 10.0864],
    'Médenine': [33.3550, 10.4925],
    'Monastir': [35.7780, 10.8262],
    'Nabeul': [36.4561, 10.7376],
    'Sfax': [34.7406, 10.7603],
    'Sidi Bouzid': [35.0382, 9.4849],
    'Siliana': [36.0840, 9.3708],
    'Sousse': [35.8256, 10.6369],
    'Tataouine': [32.9297, 10.4518],
    'Tozeur': [33.9197, 8.1335],
    'Tunis': [36.8065, 10.1815],
    'Zaghouan': [36.4029, 10.1429]
};

interface GovernorateHeatmapProps {
    data: any[];
}

export default function GovernorateHeatmap({ data }: GovernorateHeatmapProps) {
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100">
            <MapContainer
                center={[34.0, 9.5]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <ZoomControl position="bottomright" />
                {data.map((item) => {
                    const coords = GOVERNORATE_COORDS[item._id];
                    if (!coords) return null;

                    const radius = 5 + (item.count / maxCount) * 20;

                    return (
                        <CircleMarker
                            key={item._id}
                            center={coords}
                            radius={radius}
                            pathOptions={{
                                fillColor: '#FF9800',
                                fillOpacity: 0.6,
                                color: '#FFF',
                                weight: 2
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                                <div className="font-bold">{item._id}</div>
                                <div className="text-sm">{item.count} demandes</div>
                            </Tooltip>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
