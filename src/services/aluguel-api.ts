import { api } from './api';
import { ApiAluguel, CreateAluguelRequest, UpdateAluguelRequest, AluguelStatus, DisplayAluguel } from '@/types/api-aluguel';
import { BikeApiService } from './bike-api';
import { TotemApiService } from './totem-api';
import { convertUTCToSaoPaulo } from '@/utils/dateHelpers';

export class AluguelApiService {
  // Buscar todos os aluguéis
  static async getAllAlugueis(): Promise<ApiAluguel[]> {
    try {
      const response = await api.get<any>('/api/Aluguel');
      console.log('💳 Raw API response (aluguéis):', response);
      
      // A API retorna dados em response.$values
      if (response && response.$values && Array.isArray(response.$values)) {
        console.log('✅ Found aluguéis in $values:', response.$values.length, 'aluguéis');
        return response.$values;
      }
      
      // Fallback: se a resposta já for um array
      if (Array.isArray(response)) {
        console.log('✅ Response is already an array with', response.length, 'aluguéis');
        return response;
      }
      
      console.warn('⚠️ API response format unexpected:', response);
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar aluguéis:', error);
      throw error;
    }
  }

  // Buscar aluguel por ID
  static async getAluguelById(id: number): Promise<ApiAluguel> {
    try {
      return await api.get<ApiAluguel>(`/api/Aluguel/${id}`);
    } catch (error) {
      console.error(`Erro ao buscar aluguel ${id}:`, error);
      throw error;
    }
  }

  // Criar novo aluguel
  static async createAluguel(aluguel: CreateAluguelRequest): Promise<ApiAluguel> {
    try {
      return await api.post<ApiAluguel>('/api/Aluguel', aluguel);
    } catch (error) {
      console.error('Erro ao criar aluguel:', error);
      throw error;
    }
  }

  // Atualizar aluguel
  static async updateAluguel(id: number, aluguel: UpdateAluguelRequest): Promise<ApiAluguel> {
    try {
      return await api.put<ApiAluguel>(`/api/Aluguel/${id}`, aluguel);
    } catch (error) {
      console.error(`Erro ao atualizar aluguel ${id}:`, error);
      throw error;
    }
  }

  // Buscar aluguéis por usuário
  static async getAluguelsByUser(usuarioId: number): Promise<ApiAluguel[]> {
    try {
      const allAlugueis = await this.getAllAlugueis();
      return allAlugueis.filter(aluguel => aluguel.usuarioId === usuarioId);
    } catch (error) {
      console.error(`Erro ao buscar aluguéis do usuário ${usuarioId}:`, error);
      throw error;
    }
  }
}

// Classe para transformação de dados
export class AluguelTransformer {
  // Mapear status da API para status da UI
  static mapStatusToUI(status: AluguelStatus): 'active' | 'completed' | 'cancelled' | 'scheduled' {
    switch (status) {
      case AluguelStatus.EmAndamento:
        return 'active';
      case AluguelStatus.Finalizado:
      case AluguelStatus.Pago:
      case AluguelStatus.Devolvido:
        return 'completed';
      case AluguelStatus.Cancelado:
        return 'cancelled';
      case AluguelStatus.Pendente:
      case AluguelStatus.AguardandoPagamento:
        return 'scheduled';
      default:
        return 'scheduled';
    }
  }

  // Calcular duração em minutos
  static calculateDuration(dataInicio: string, dataFim?: string | null): number {
    const start = new Date(dataInicio);
    const end = dataFim ? new Date(dataFim) : new Date();
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  }

  // Transformar ApiAluguel para DisplayAluguel
  static async toDisplayAluguel(apiAluguel: ApiAluguel): Promise<DisplayAluguel> {
    try {
      // Converter datas de UTC para São Paulo ANTES de processar
      const startDateSaoPaulo = convertUTCToSaoPaulo(apiAluguel.data_Inicio);
      let endDateSaoPaulo: Date | undefined;
      if (apiAluguel.data_Fim) {
        endDateSaoPaulo = convertUTCToSaoPaulo(apiAluguel.data_Fim);
      }

      // Buscar informações da bike
      let bikeName = `Bike ${apiAluguel.bicicletaId}`;
      let bikeImage = '';
      
      try {
        const bike = await BikeApiService.getBikeById(apiAluguel.bicicletaId);
        bikeName = bike.modelo || bikeName;
        bikeImage = ''; // Usar imagem padrão ou buscar de outro lugar
      } catch (error) {
        console.warn(`Não foi possível buscar dados da bike ${apiAluguel.bicicletaId}`);
      }

      // Buscar informações dos totens
      let startLocation = `Totem ${apiAluguel.totem_SaidaId}`;
      let endLocation: string | undefined;

      try {
        const totemSaida = await TotemApiService.getTotemById(apiAluguel.totem_SaidaId);
        startLocation = totemSaida.localizacao || startLocation;
      } catch (error) {
        console.warn(`Não foi possível buscar dados do totem de saída ${apiAluguel.totem_SaidaId}`);
      }

      if (apiAluguel.totem_ChegadaId) {
        try {
          const totemChegada = await TotemApiService.getTotemById(apiAluguel.totem_ChegadaId);
          endLocation = totemChegada.localizacao;
        } catch (error) {
          console.warn(`Não foi possível buscar dados do totem de chegada ${apiAluguel.totem_ChegadaId}`);
        }
      }

      return {
        id: apiAluguel.id.toString(),
        bikeId: apiAluguel.bicicletaId.toString(),
        bikeName,
        bikeImage,
        startDate: startDateSaoPaulo.toISOString(), // Data já convertida para São Paulo
        endDate: endDateSaoPaulo ? endDateSaoPaulo.toISOString() : undefined,
        duration: this.calculateDuration(startDateSaoPaulo.toISOString(), endDateSaoPaulo?.toISOString()),
        cost: apiAluguel.valor_Cobrado,
        status: this.mapStatusToUI(apiAluguel.status),
        startLocation,
        endLocation,
        usuarioId: apiAluguel.usuarioId,
        totemSaidaId: apiAluguel.totem_SaidaId,
        totemChegadaId: apiAluguel.totem_ChegadaId || undefined
      };
    } catch (error) {
      console.error('Erro ao transformar ApiAluguel para DisplayAluguel:', error);
      // Retornar dados básicos em caso de erro (também convertendo as datas)
      const startDateSaoPaulo = convertUTCToSaoPaulo(apiAluguel.data_Inicio);
      let endDateSaoPaulo: Date | undefined;
      if (apiAluguel.data_Fim) {
        endDateSaoPaulo = convertUTCToSaoPaulo(apiAluguel.data_Fim);
      }

      return {
        id: apiAluguel.id.toString(),
        bikeId: apiAluguel.bicicletaId.toString(),
        bikeName: `Bike ${apiAluguel.bicicletaId}`,
        bikeImage: '',
        startDate: startDateSaoPaulo.toISOString(),
        endDate: endDateSaoPaulo ? endDateSaoPaulo.toISOString() : undefined,
        duration: this.calculateDuration(startDateSaoPaulo.toISOString(), endDateSaoPaulo?.toISOString()),
        cost: apiAluguel.valor_Cobrado,
        status: this.mapStatusToUI(apiAluguel.status),
        startLocation: `Totem ${apiAluguel.totem_SaidaId}`,
        endLocation: apiAluguel.totem_ChegadaId ? `Totem ${apiAluguel.totem_ChegadaId}` : undefined,
        usuarioId: apiAluguel.usuarioId,
        totemSaidaId: apiAluguel.totem_SaidaId,
        totemChegadaId: apiAluguel.totem_ChegadaId || undefined
      };
    }
  }

  // Transformar DisplayAluguel para CreateAluguelRequest
  static toCreateRequest(displayAluguel: Partial<DisplayAluguel>, usuarioId: number): CreateAluguelRequest {
    return {
      usuarioId,
      totem_SaidaId: displayAluguel.totemSaidaId!,
      bicicletaId: parseInt(displayAluguel.bikeId!),
      data_Inicio: displayAluguel.startDate || new Date().toISOString(),
      valor_Cobrado: displayAluguel.cost || 0,
      status: AluguelStatus.EmAndamento
    };
  }
}
