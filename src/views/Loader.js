import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['marker'];

const Loader = ({ apiKey, children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return <>{children}</>;
};

export default Loader;
