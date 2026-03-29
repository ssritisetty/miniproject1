import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Define a custom marker icon for the provider
const providerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972130.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// A small component to recenter the map when coordinates change
const MapRecenter = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
};

const GpsTracker = ({ providerId, providerName }) => {
    const [position, setPosition] = useState([12.9716, 77.5946]); // Bangalore default
    const clientRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS('/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 2000,
            onConnect: () => {
                stompClient.subscribe(`/topic/gps/${providerId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    setPosition([data.lat, data.lng]);
                });
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) clientRef.current.deactivate();
        };
    }, [providerId]);

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 w-full relative">
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={providerIcon}>
                    <Popup>
                        <span className="font-bold">{providerName}</span> is on the way!
                    </Popup>
                </Marker>
                <MapRecenter lat={position[0]} lng={position[1]} />
            </MapContainer>
            <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary-600 border border-primary-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                LIVE TRACKING
            </div>
        </div>
    );
};

export default GpsTracker;
