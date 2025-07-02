'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface InteractiveMapProps {
  address: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ address }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(() => {
    if (!address || !window.google || !window.google.maps) {
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
        setError(null);
      } else {
        console.error(`Geocode was not successful for the following reason: ${status}`);
        setError(`Adresse konnte nicht gefunden werden. (Status: ${status})`);
        setCenter(null);
      }
    });
  }, [address]);

  useEffect(() => {
    if (isLoaded) {
      geocodeAddress();
    }
  }, [isLoaded, geocodeAddress]);

  if (loadError) {
    return <div className="flex items-center justify-center w-full h-[400px] bg-red-100 text-red-700 rounded-xl">Fehler beim Laden der Karte. Bitte überprüfen Sie den API-Schlüssel in den Umgebungsvariablen.</div>;
  }

  if (!isLoaded) {
    return (
      <div style={containerStyle} className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
        <p className="text-gray-500">Karte wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="relative" style={containerStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || { lat: 48.1351, lng: 11.5820 }} // Fallback to Munich
        zoom={center ? 15 : 8}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {center && <Marker position={center} />}
      </GoogleMap>
      {error && (
         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 rounded-xl">
            <p className="text-white bg-red-600 p-4 rounded-lg shadow-lg">{error}</p>
         </div>
      )}
    </div>
  );
};

export default InteractiveMap;
