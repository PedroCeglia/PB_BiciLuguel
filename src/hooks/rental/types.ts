
import { DisplayAluguel } from '@/types/api-aluguel';
import { convertUTCToSaoPaulo } from '@/utils/dateHelpers';

// Função para converter Rental para DisplayAluguel
export const convertRentalToDisplayAluguel = (rental: any): DisplayAluguel => {
  // Converter datas de UTC para São Paulo se existirem
  let startDateSaoPaulo = rental.startDate;
  let endDateSaoPaulo = rental.endDate;
  
  if (rental.startDate) {
    const startDateConverted = convertUTCToSaoPaulo(rental.startDate);
    startDateSaoPaulo = startDateConverted.toISOString();
  }
  
  if (rental.endDate) {
    const endDateConverted = convertUTCToSaoPaulo(rental.endDate);
    endDateSaoPaulo = endDateConverted.toISOString();
  }

  return {
    id: rental.id,
    bikeId: rental.bikeId,
    bikeName: rental.bikeName,
    bikeImage: rental.bikeImage,
    startDate: startDateSaoPaulo,
    endDate: endDateSaoPaulo,
    duration: rental.duration,
    cost: rental.cost,
    status: rental.status,
    startLocation: rental.startLocation,
    endLocation: rental.endLocation,
    paymentMethod: rental.paymentMethod,
    rating: rental.rating,
    review: rental.review,
    usuarioId: parseInt(rental.id) || 1, // Mock user ID
    totemSaidaId: 1, // Mock totem ID
    totemChegadaId: rental.endLocation ? 2 : undefined
  };
};

// Tipo para finalizar aluguel - incluindo usuarioId
export interface FinishRentalRequest {
  aluguelId: number;
  usuarioId: number; // Adicionado campo obrigatório
  totemChegadaId: number;
  valorFinal: number;
  totemSaidaId: number;
  bikeId: string;
  dataInicio: string;
}
