
import { DisplayBike } from '@/types/api-bike';

export const DEFAULT_BIKE_IMAGE = 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const getBikeImage = (bikeImage: string) => {
  return bikeImage && bikeImage.trim() !== '' ? bikeImage : DEFAULT_BIKE_IMAGE;
};

export const getTypeColor = (type: DisplayBike['type']) => {
  switch (type) {
    case 'electric':
      return 'bg-blue-100 text-blue-800';
    case 'mountain':
      return 'bg-green-100 text-green-800';
    case 'road':
      return 'bg-purple-100 text-purple-800';
    case 'hybrid':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTypeLabel = (type: DisplayBike['type']) => {
  switch (type) {
    case 'electric':
      return 'Elétrica';
    case 'mountain':
      return 'Mountain';
    case 'road':
      return 'Speed';
    case 'hybrid':
      return 'Híbrida';
    default:
      return type;
  }
};
