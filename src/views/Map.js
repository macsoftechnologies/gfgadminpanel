import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({ initialPosition, onPositionChange, apiKey }) => {
  const [mapMarkerPosition, setMapMarkerPosition] = useState({
    lat: initialPosition[0],
    lng: initialPosition[1],
  });
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    console.log('Initial position set:', initialPosition);
    setMapMarkerPosition({
      lat: initialPosition[0],
      lng: initialPosition[1],
    });
  }, [initialPosition]);

  useEffect(() => {
    if (map && !marker) {
      console.log('Creating new marker');

      const newMarker = new window.google.maps.Marker({
        position: mapMarkerPosition,
        map,
        draggable: true,
        title: 'Marker',
      });

      newMarker.addListener('dragend', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        console.log('Marker dragged to:', lat, lng);
        updatePosition(lat, lng);
      });

      setMarker(newMarker);
    } else if (marker) {
      console.log('Updating marker position');
      marker.setPosition(mapMarkerPosition);
    }
  }, [map, marker, mapMarkerPosition]);

  const updatePosition = async (lat, lng) => {
    setMapMarkerPosition({ lat, lng });
    try {
      const address = await reverseGeocode(lat, lng);
      setAddress(address);
      onPositionChange(lat, lng, address);
      console.log('Updated address:', address);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress('Failed to fetch address');
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    console.log('addressData', data);
    if (data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error('No address found');
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log('Map clicked at:', lat, lng);
    updatePosition(lat, lng);
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapMarkerPosition}
      zoom={15}
      onClick={handleMapClick}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {marker && <Marker position={mapMarkerPosition} map={map} />}
    </GoogleMap>
  );
};

export default MapComponent;
