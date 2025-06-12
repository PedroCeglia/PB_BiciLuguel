
import { Bike } from '@/types/bike';

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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
    features: ['Guidão Aerodinâmico', 'Pedais Clip', 'Quadro Carbono'],
    rating: 4.9,
    totalRides: 98
  }
];
