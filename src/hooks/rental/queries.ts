import { useQuery } from '@tanstack/react-query';
import { DisplayAluguel } from '@/types/api-aluguel';
import { mockRentals } from '@/data';
import { convertRentalToDisplayAluguel } from './types';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user';
import { convertUTCToSaoPaulo } from '@/utils/dateHelpers';

export const useRentalsQuery = (useApiData: boolean) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['rentals', useApiData, user?.id],
    queryFn: async (): Promise<DisplayAluguel[]> => {
      if (!useApiData || !user?.id) {
        console.log('📦 useRentals: Usando dados mock para aluguéis');
        return mockRentals.map(convertRentalToDisplayAluguel);
      }

      console.log('🌐 useRentals: Buscando aluguéis do usuário da API...');
      
      try {
        // Buscar dados do usuário que já inclui os aluguéis
        const userData = await userService.getById(parseInt(user.id));
        console.log('📥 useRentals: Dados do usuário obtidos:', userData);
        
        // Se o usuário tem aluguéis, transformá-los para o formato de exibição
        if (userData.alugueis && Array.isArray(userData.alugueis)) {
          console.log('✅ useRentals: Encontrados', userData.alugueis.length, 'aluguéis');
          
          // Transformar aluguéis convertendo datas de UTC para São Paulo
          const displayAlugueis = userData.alugueis.map(aluguel => {
            // Converter data_Inicio de UTC para São Paulo
            const startDateSaoPaulo = convertUTCToSaoPaulo(aluguel.data_Inicio);
            
            // Converter data_Fim se existir
            let endDateSaoPaulo: Date | undefined;
            if (aluguel.data_Fim) {
              endDateSaoPaulo = convertUTCToSaoPaulo(aluguel.data_Fim);
            }
            
            return {
              id: aluguel.id.toString(),
              bikeId: aluguel.bicicletaId.toString(),
              bikeName: `Bike ${aluguel.bicicletaId}`,
              bikeImage: '',
              startDate: startDateSaoPaulo.toISOString(), // Data já convertida para São Paulo
              endDate: endDateSaoPaulo ? endDateSaoPaulo.toISOString() : undefined,
              duration: calculateDuration(startDateSaoPaulo.toISOString(), endDateSaoPaulo?.toISOString()),
              cost: aluguel.valor_Cobrado,
              status: mapStatusToUI(aluguel.status),
              startLocation: `Totem ${aluguel.totem_SaidaId}`,
              endLocation: aluguel.totem_ChegadaId ? `Totem ${aluguel.totem_ChegadaId}` : undefined,
              usuarioId: aluguel.usuarioId,
              totemSaidaId: aluguel.totem_SaidaId,
              totemChegadaId: aluguel.totem_ChegadaId || undefined
            };
          });
          
          return displayAlugueis;
        }
        
        console.log('📦 useRentals: Usuário sem aluguéis');
        return [];
        
      } catch (error) {
        console.error('❌ useRentals: Erro ao buscar dados do usuário:', error);
        // Fallback para dados mock em caso de erro
        return mockRentals.map(convertRentalToDisplayAluguel);
      }
    },
    staleTime: useApiData ? 30000 : Infinity,
    enabled: true
  });
};

export const useUserRentalsQuery = (useApiData: boolean, userId?: string) => {
  // Reutilizar os mesmos dados da query principal
  const { data: allRentals = [] } = useRentalsQuery(useApiData);
  
  return useQuery({
    queryKey: ['userRentals', userId, useApiData],
    queryFn: async (): Promise<DisplayAluguel[]> => {
      // Filtrar apenas aluguéis ativos ou completos do usuário
      return allRentals.filter(rental => 
        rental.status === 'active' || rental.status === 'completed'
      );
    },
    enabled: !!userId && allRentals.length > 0,
    staleTime: useApiData ? 30000 : Infinity
  });
};

// Funções utilitárias movidas para dentro do arquivo para evitar imports circulares
function calculateDuration(dataInicio: string, dataFim?: string | null): number {
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}

function mapStatusToUI(status: number): 'active' | 'completed' | 'cancelled' | 'scheduled' {
  switch (status) {
    case 1: // EmAndamento
      return 'active';
    case 2: // Finalizado
    case 5: // Pago
    case 6: // Devolvido
      return 'completed';
    case 3: // Cancelado
      return 'cancelled';
    case 0: // Pendente
    case 4: // AguardandoPagamento
      return 'scheduled';
    default:
      return 'scheduled';
  }
}
