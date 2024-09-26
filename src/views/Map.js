import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './MapComponent.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const libraries = ['places'];

const MapComponent = ({ initialPosition, onPositionChange, apiKey }) => {
  const [mapMarkerPosition, setMapMarkerPosition] = useState({
    lat: initialPosition[0],
    lng: initialPosition[1],
  });
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        updatePosition(lat, lng);
      }
    }
  };

  const updatePosition = async (lat, lng) => {
    setMapMarkerPosition({ lat, lng });
    try {
      const address = await reverseGeocode(lat, lng);
      setAddress(address);
      onPositionChange(lat, lng, address);
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
    if (data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error('No address found');
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    updatePosition(lat, lng);
  };

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current = autocomplete;
      autocomplete.addListener('place_changed', handlePlaceChanged);

      // Move the pac-container to the body or another high-level container
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        document.body.appendChild(pacContainer); // Append to body to avoid modal overflow
      }
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (map && isLoaded && !marker) {
      const newMarker = new window.google.maps.Marker({
        position: mapMarkerPosition,
        map,
        draggable: true,
      });

      newMarker.addListener('dragend', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        updatePosition(lat, lng);
      });

      setMarker(newMarker);
    } else if (marker) {
      marker.setPosition(mapMarkerPosition);
    }
  }, [map, marker, mapMarkerPosition, isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        placeholder="Search location"
        className='locationInput'
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapMarkerPosition}
        zoom={15}
        onClick={handleMapClick}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {marker && <Marker position={mapMarkerPosition} map={map} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;