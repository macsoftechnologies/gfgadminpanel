import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const MapViewComponent = ({ initialPosition }) => {
  const defaultCenter = initialPosition.length === 2 ? {
    lat: initialPosition[0],
    lng: initialPosition[1],
  } : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={10}
    >
      <Marker position={defaultCenter} title="Marker title" />
    </GoogleMap>
  );
};

export default MapViewComponent;
