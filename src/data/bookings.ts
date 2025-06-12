
import { Booking } from '@/types/bike';

export const mockBookings: Booking[] = [
  {
    id: '1',
    bikeId: '1',
    bikeName: 'E-Bike Pro',
    bikeImage: '',
    scheduledDate: '2024-06-07',
    scheduledTime: '09:00',
    duration: 3,
    estimatedCost: 45.00,
    pickupLocation: 'Av. Paulista, 1000',
    status: 'confirmed',
    createdAt: '2024-06-05T10:30:00Z'
  },
  {
    id: '2',
    bikeId: '4',
    bikeName: 'Speed Racer',
    bikeImage: '',
    scheduledDate: '2024-06-08',
    scheduledTime: '07:00',
    duration: 2,
    estimatedCost: 36.00,
    pickupLocation: 'Centro Histórico',
    status: 'pending',
    createdAt: '2024-06-05T12:15:00Z'
  }
];
