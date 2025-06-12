
import { Bike, Rental, User, Booking, Totem } from '@/types/bike';

// Foto padrão para bikes - usando uma URL válida do Unsplash
const defaultBikeImage = 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  totalRides: 47,
  totalSpent: 2350.50,
  memberSince: '2023-03-15',
  favoriteLocations: ['Centro', 'Parque Ibirapuera', 'Vila Madalena']
};

export const mockBikes: Bike[] = [
  {
    id: '1',
    model: 'E-Bike Pro',
    type: 'electric',
    batteryLevel: 85,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Av. Paulista, 1000 - São Paulo'
    },
    hourlyRate: 15.00,
    dailyRate: 80.00,
    status: 'available',
    image: defaultBikeImage,
    features: ['GPS Integrado', 'Bateria de Longa Duração', 'Freios Hidráulicos'],
    rating: 4.8,
    totalRides: 234
  },
  {
    id: '2',
    model: 'Mountain Explorer',
    type: 'mountain',
    location: {
      lat: -23.5489,
      lng: -46.6388,
      address: 'Parque Ibirapuera - São Paulo'
    },
    hourlyRate: 12.00,
    dailyRate: 60.00,
    status: 'available',
    image: defaultBikeImage,
    features: ['Suspensão Dianteira', '21 Marchas', 'Pneus Off-Road'],
    rating: 4.6,
    totalRides: 189
  },
  {
    id: '3',
    model: 'City Cruiser',
    type: 'hybrid',
    location: {
      lat: -23.5475,
      lng: -46.6361,
      address: 'Vila Madalena - São Paulo'
    },
    hourlyRate: 10.00,
    dailyRate: 50.00,
    status: 'available',
    image: defaultBikeImage,
    features: ['Cesta Frontal', 'Luzes LED', 'Banco Confortável'],
    rating: 4.7,
    totalRides: 156
  },
  {
    id: '4',
    model: 'Speed Racer',
    type: 'road',
    location: {
      lat: -23.5558,
      lng: -46.6396,
      address: 'Centro Histórico - São Paulo'
    },
    hourlyRate: 18.00,
    dailyRate: 95.00,
    status: 'rented',
    image: defaultBikeImage,
    features: ['Guidão Aerodinâmico', 'Pedais Clip', 'Quadro Carbono'],
    rating: 4.9,
    totalRides: 98
  }
];

export const mockRentals: Rental[] = [
  {
    id: '1',
    bikeId: '1',
    bikeName: 'E-Bike Pro',
    bikeImage: defaultBikeImage,
    startDate: '2024-12-10T12:00:00Z', // Data mais recente em UTC
    endDate: '2024-12-10T14:30:00Z',
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
    bikeImage: defaultBikeImage,
    startDate: '2024-12-09T17:00:00Z', // Data mais recente em UTC
    endDate: '2024-12-09T21:00:00Z',
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
    bikeImage: defaultBikeImage,
    startDate: '2024-12-11T11:00:00Z', // Data atual em UTC para corrida ativa
    duration: 90,
    cost: 22.50,
    status: 'active',
    startLocation: 'Vila Madalena',
    paymentMethod: 'Cartão de Crédito'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    bikeId: '1',
    bikeName: 'E-Bike Pro',
    bikeImage: defaultBikeImage,
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
    bikeImage: defaultBikeImage,
    scheduledDate: '2024-06-08',
    scheduledTime: '07:00',
    duration: 2,
    estimatedCost: 36.00,
    pickupLocation: 'Centro Histórico',
    status: 'pending',
    createdAt: '2024-06-05T12:15:00Z'
  }
];

// Totens mockados com bikes distribuídas
export const mockTotems: Totem[] = [
  {
    id: '1',
    name: 'Totem Paulista',
    address: 'Av. Paulista, 1000',
    location: { lat: -23.5505, lng: -46.6333 },
    status: 'active',
    totalSlots: 8,
    occupiedSlots: 3,
    bikes: [
      { ...mockBikes[0], id: 'bike-1-1' },
      { ...mockBikes[1], id: 'bike-1-2', type: 'electric', model: 'E-Bike City' },
      { ...mockBikes[2], id: 'bike-1-3', type: 'hybrid', model: 'Urban Rider' }
    ]
  },
  {
    id: '2',
    name: 'Totem Ibirapuera',
    address: 'Parque Ibirapuera, Portão 2',
    location: { lat: -23.5489, lng: -46.6388 },
    status: 'active',
    totalSlots: 12,
    occupiedSlots: 5,
    bikes: [
      { ...mockBikes[1], id: 'bike-2-1' },
      { ...mockBikes[2], id: 'bike-2-2', model: 'Park Explorer' },
      { ...mockBikes[0], id: 'bike-2-3', batteryLevel: 92 },
      { ...mockBikes[3], id: 'bike-2-4', status: 'available' },
      { ...mockBikes[1], id: 'bike-2-5', model: 'Trail Master' }
    ]
  },
  {
    id: '3',
    name: 'Totem Vila Madalena',
    address: 'R. Aspicuelta, 500',
    location: { lat: -23.5475, lng: -46.6361 },
    status: 'active',
    totalSlots: 6,
    occupiedSlots: 2,
    bikes: [
      { ...mockBikes[2], id: 'bike-3-1' },
      { ...mockBikes[0], id: 'bike-3-2', batteryLevel: 78 }
    ]
  },
  {
    id: '4',
    name: 'Totem Centro Histórico',
    address: 'Largo do Paissandu, 100',
    location: { lat: -23.5558, lng: -46.6396 },
    status: 'active',
    totalSlots: 10,
    occupiedSlots: 4,
    bikes: [
      { ...mockBikes[3], id: 'bike-4-1', status: 'available' },
      { ...mockBikes[0], id: 'bike-4-2', model: 'City E-Bike' },
      { ...mockBikes[1], id: 'bike-4-3', model: 'Downtown MTB' },
      { ...mockBikes[2], id: 'bike-4-4', model: 'Commuter Pro' }
    ]
  },
  {
    id: '5',
    name: 'Totem Faria Lima',
    address: 'Av. Faria Lima, 2000',
    location: { lat: -23.5742, lng: -46.6892 },
    status: 'active',
    totalSlots: 15,
    occupiedSlots: 7,
    bikes: [
      { ...mockBikes[0], id: 'bike-5-1', batteryLevel: 95 },
      { ...mockBikes[1], id: 'bike-5-2' },
      { ...mockBikes[2], id: 'bike-5-3' },
      { ...mockBikes[3], id: 'bike-5-4', status: 'available' },
      { ...mockBikes[0], id: 'bike-5-5', model: 'Business E-Bike' },
      { ...mockBikes[1], id: 'bike-5-6', model: 'Executive MTB' },
      { ...mockBikes[2], id: 'bike-5-7', model: 'Corporate Cruiser' }
    ]
  },
  {
    id: '6',
    name: 'Totem Liberdade',
    address: 'R. da Liberdade, 300',
    location: { lat: -23.5577, lng: -46.6349 },
    status: 'maintenance',
    totalSlots: 8,
    occupiedSlots: 0,
    bikes: []
  }
];
