
import { Rental } from '@/types/bike';

export const mockRentals: Rental[] = [
  {
    id: '1',
    bikeId: '1',
    bikeName: 'E-Bike Pro',
    bikeImage: '',
    startDate: '2024-06-05T09:00:00Z',
    endDate: '2024-06-05T11:30:00Z',
    duration: 150,
    cost: 37.50,
    status: 'completed',
    startLocation: 'Av. Paulista, 1000',
    endLocation: 'Vila Madalena',
    paymentMethod: 'Cartão de Crédito',
    rating: 5,
    review: 'Excelente bike, bateria durou todo o percurso!'
  },
  {
    id: '2',
    bikeId: '2',
    bikeName: 'Mountain Explorer',
    bikeImage: '',
    startDate: '2024-06-04T14:00:00Z',
    endDate: '2024-06-04T18:00:00Z',
    duration: 240,
    cost: 48.00,
    status: 'completed',
    startLocation: 'Parque Ibirapuera',
    endLocation: 'Parque Ibirapuera',
    paymentMethod: 'PIX',
    rating: 4,
    review: 'Ótima para trilhas no parque!'
  },
  {
    id: '3',
    bikeId: '3',
    bikeName: 'City Cruiser',
    bikeImage: '',
    startDate: '2024-06-05T08:00:00Z',
    duration: 90,
    cost: 22.50,
    status: 'active',
    startLocation: 'Vila Madalena',
    paymentMethod: 'Cartão de Crédito'
  }
];
