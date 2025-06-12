
import { DisplayAluguel } from '@/types/api-aluguel';

export const findActiveRental = (rentals: DisplayAluguel[]): DisplayAluguel | undefined => {
  return rentals.find(rental => rental.status === 'active');
};

export const logRentalHookUsage = (useApiData: boolean, user: any) => {
  console.log('🔧 useRentals hook - useApiData:', useApiData);
  console.log('👤 useRentals hook - user:', user);
};
