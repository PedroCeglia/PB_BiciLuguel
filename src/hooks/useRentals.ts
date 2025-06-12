
import { useAuth } from '@/context/AuthContext';
import { useRentalsQuery, useUserRentalsQuery } from './rental/queries';
import { useCreateRentalMutation, useFinishRentalMutation, useProcessPaymentMutation } from './rental/mutations';
import { findActiveRental, logRentalHookUsage } from './rental/utils';

export const useRentals = (useApiData: boolean = true) => {
  const { user } = useAuth();

  logRentalHookUsage(useApiData, user);

  // Queries
  const {
    data: rentals = [],
    isLoading,
    error,
    refetch
  } = useRentalsQuery(useApiData);

  const {
    data: userRentals = [],
    isLoading: isLoadingUserRentals
  } = useUserRentalsQuery(useApiData, user?.id);

  // Mutations - sem argumentos extras
  const createRentalMutation = useCreateRentalMutation();
  const finishRentalMutation = useFinishRentalMutation();
  const processPaymentMutation = useProcessPaymentMutation();

  // Derived data
  const activeRental = findActiveRental(rentals);

  return {
    // Dados
    rentals,
    userRentals,
    activeRental,
    
    // Estados de loading
    isLoading,
    isLoadingUserRentals,
    
    // Erros
    error,
    
    // Funções
    refetch,
    
    // Mutations
    createRental: createRentalMutation.mutate,
    finishRental: finishRentalMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    
    // Estados das mutations
    isCreatingRental: createRentalMutation.isPending,
    isFinishingRental: finishRentalMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    
    // Erros das mutations
    createRentalError: createRentalMutation.error,
    finishRentalError: finishRentalMutation.error,
    processPaymentError: processPaymentMutation.error
  };
};
