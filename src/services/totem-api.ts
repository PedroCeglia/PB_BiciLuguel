
import { api } from './api';
import { ApiTotem, CreateTotemRequest, UpdateTotemRequest, DisplayTotem } from '@/types/api-totem';

export class TotemApiService {
  // Buscar todos os totens
  static async getAllTotems(): Promise<ApiTotem[]> {
    try {
      const response = await api.get<any>('/api/Totem');
      console.log('🏢 Raw API response (totems):', response);
      console.log('🏢 Response type:', typeof response);
      console.log('🏢 Is response an array?', Array.isArray(response));
      
      // A API retorna dados em response.$values
      if (response && response.$values && Array.isArray(response.$values)) {
        console.log('✅ Found totems in $values:', response.$values.length, 'totems');
        console.log('🏢 First totem data:', response.$values[0]);
        console.log('🏢 All totems data:', response.$values);
        return response.$values;
      }
      
      // Fallback: se a resposta já for um array
      if (Array.isArray(response)) {
        console.log('✅ Response is already an array with', response.length, 'totems');
        console.log('🏢 Totems data:', response);
        return response;
      }
      
      console.warn('⚠️ API response format unexpected:', response);
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar totens:', error);
      throw error;
    }
  }

  // Buscar totem por ID
  static async getTotemById(id: number): Promise<ApiTotem> {
    try {
      return await api.get<ApiTotem>(`/api/Totem/${id}`);
    } catch (error) {
      console.error(`Erro ao buscar totem ${id}:`, error);
      throw error;
    }
  }

  // Criar novo totem
  static async createTotem(totem: CreateTotemRequest): Promise<ApiTotem> {
    try {
      return await api.post<ApiTotem>('/api/Totem', totem);
    } catch (error) {
      console.error('Erro ao criar totem:', error);
      throw error;
    }
  }

  // Atualizar totem
  static async updateTotem(id: number, totem: UpdateTotemRequest): Promise<ApiTotem> {
    try {
      return await api.put<ApiTotem>(`/api/Totem/${id}`, totem);
    } catch (error) {
      console.error(`Erro ao atualizar totem ${id}:`, error);
      throw error;
    }
  }
}

// Classe para transformação de dados
export class TotemTransformer {
  // Mapear status da API para status da UI
  static mapStatusToUI(status?: string): 'active' | 'maintenance' | 'inactive' {
    if (!status) return 'active';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ativo')) return 'active';
    if (statusLower.includes('manutenção') || statusLower.includes('manutencao')) return 'maintenance';
    if (statusLower.includes('inativo')) return 'inactive';
    return 'active';
  }

  // Transformar ApiTotem para DisplayTotem
  static toDisplayTotem(apiTotem: ApiTotem): DisplayTotem {
    // Verificar se apiTotem tem as propriedades mínimas necessárias
    if (!apiTotem || apiTotem.id === undefined || apiTotem.id === null) {
      console.warn('ApiTotem inválido recebido:', apiTotem);
      // Retornar um objeto padrão se o totem for inválido
      return {
        id: 'invalid-' + Math.random().toString(36).substr(2, 9),
        name: 'Totem Indisponível',
        address: 'Localização não definida',
        location: { lat: -23.5505, lng: -46.6333 },
        status: 'maintenance',
        totalSlots: 0,
        occupiedSlots: 0,
        bikes: []
      };
    }

    return {
      id: apiTotem.id.toString(),
      name: apiTotem.nome || `Totem ${apiTotem.id}`,
      address: apiTotem.localizacao || 'Endereço não informado',
      location: {
        lat: -23.5505, // Coordenadas padrão - seria ideal ter na API
        lng: -46.6333
      },
      status: this.mapStatusToUI(apiTotem.status),
      totalSlots: apiTotem.capacidade_Total || 0,
      occupiedSlots: apiTotem.quantidadeDisponivel || 0,
      bikes: [] // Será preenchido separadamente com dados das bikes
    };
  }

  // Transformar DisplayTotem para CreateTotemRequest
  static toCreateRequest(displayTotem: Partial<DisplayTotem>): CreateTotemRequest {
    return {
      nome: displayTotem.name,
      localizacao: displayTotem.address,
      capacidade_Total: displayTotem.totalSlots || 0,
      status: displayTotem.status === 'active' ? 'ativo' : 
              displayTotem.status === 'maintenance' ? 'em manutenção' : 'inativo',
      quantidadeDisponivel: displayTotem.occupiedSlots || 0,
      disponivelAluguel: (displayTotem.totalSlots || 0) - (displayTotem.occupiedSlots || 0)
    };
  }
}
