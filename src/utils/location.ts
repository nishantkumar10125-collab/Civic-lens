import { Location } from '../types';

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, you'd use a geocoding service
          const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          const district = getDistrictFromCoords(latitude, longitude);
          
          resolve({
            latitude,
            longitude,
            address,
            district
          });
        } catch (error) {
          resolve({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            district: 'Unknown District'
          });
        }
      },
      (error) => {
        reject(new Error(`Failed to get location: ${error.message}`));
      }
    );
  });
};

// Simplified district mapping - in real app, this would use proper geocoding
const getDistrictFromCoords = (lat: number, lng: number): string => {
  const districts = [
    'Downtown District',
    'North Side District', 
    'South Side District',
    'East End District',
    'West Side District',
    'Central District'
  ];
  
  // Simple hash-based district assignment for demo
  const index = Math.abs(Math.floor((lat + lng) * 1000)) % districts.length;
  return districts[index];
};

export const geocodeAddress = async (address: string): Promise<Location> => {
  // Simplified geocoding for demo - normally would use Google Maps API or similar
  const mockCoords = {
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1
  };
  
  return {
    ...mockCoords,
    address,
    district: getDistrictFromCoords(mockCoords.latitude, mockCoords.longitude)
  };
};