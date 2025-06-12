
export interface Bike {
  id: string;
  model: string;
  type: 'electric' | 'mountain' | 'road' | 'hybrid';
  batteryLevel?: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  hourlyRate: number;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  image: string;
  features: string[];
  rating: number;
  totalRides: number;
}

export interface Rental {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeImage: string;
  startDate: string;
  endDate?: string;
  duration: number; // in minutes
  cost: number;
  status: 'active' | 'completed' | 'cancelled' | 'scheduled';
  startLocation: string;
  endLocation?: string;
  paymentMethod: string;
  rating?: number;
  review?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalRides?: number;
  totalSpent?: number;
  memberSince: string;
  favoriteLocations?: string[];
  telefone?: string;
  documento?: string;
  metodo_Pagamento?: string;
  status?: string;
}

export interface Booking {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeImage: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in hours
  estimatedCost: number;
  pickupLocation: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface Totem {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
  totalSlots: number;
  occupiedSlots: number;
  bikes: Bike[];
}
