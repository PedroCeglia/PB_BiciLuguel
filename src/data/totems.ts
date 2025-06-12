
import { Totem } from '@/types/bike';
import { mockBikes } from './bikes';

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
