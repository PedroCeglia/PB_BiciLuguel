
import { api } from '../api';
import { ApiBike, CreateBikeRequest, UpdateBikeRequest, BikeStatus } from '@/types/api-bike';

export class BikeService {
  // Buscar todas as bicicletas
  static async getAllBikes(): Promise<ApiBike[]> {
    try {
      const response = await api.get<any>('/api/Bicicleta');
      console.log('🚴 Raw API response:', response);
      console.log('🚴 Response type:', typeof response);
      console.log('🚴 Is response an array?', Array.isArray(response));
      
      // A API retorna dados em response.$values
      if (response && response.$values && Array.isArray(response.$values)) {
        console.log('✅ Found bikes in $values:', response.$values.length, 'bikes');
        console.log('🚴 First bike data:', response.$values[0]);
        console.log('🚴 All bikes data:', response.$values);
        return response.$values;
      }
      
      // Fallback: se a resposta já for um array
      if (Array.isArray(response)) {
        console.log('✅ Response is already an array with', response.length, 'bikes');
        console.log('🚴 Bikes data:', response);
        return response;
      }
      
      console.warn('⚠️ API response format unexpected:', response);
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar bicicletas:', error);
      throw error;
    }
  }

  // Buscar bicicleta por ID
  static async getBikeById(id: number): Promise<ApiBike> {
    try {
      return await api.get<ApiBike>(`/api/Bicicleta/${id}`);
    } catch (error) {
      console.error(`Erro ao buscar bicicleta ${id}:`, error);
      throw error;
    }
  }

  // Criar nova bicicleta
  static async createBike(bike: CreateBikeRequest): Promise<ApiBike> {
    try {
      return await api.post<ApiBike>('/api/Bicicleta', bike);
    } catch (error) {
      console.error('Erro ao criar bicicleta:', error);
      throw error;
    }
  }

  // Atualizar bicicleta
  static async updateBike(id: number, bike: UpdateBikeRequest): Promise<ApiBike> {
    try {
      return await api.put<ApiBike>(`/api/Bicicleta/${id}`, bike);
    } catch (error) {
      console.error(`Erro ao atualizar bicicleta ${id}:`, error);
      throw error;
    }
  }

  // Atualizar status da bicicleta
  static async updateBikeStatus(bikeId: number, bike: ApiBike, newStatus: BikeStatus): Promise<ApiBike> {
    try {
      console.log('🔄 Atualizando status da bike:', {
        bikeId,
        statusAtual: bike.status,
        novoStatus: newStatus,
        bikeData: bike
      });

      // Preparar dados para atualização com todos os campos obrigatórios
      const updateData = {
        marca: bike.marca || '',
        modelo: bike.modelo || '',
        cor: bike.cor || '',
        tipo: bike.tipo || '',
        tamanho: bike.tamanho || '',
        status: newStatus,
        totemId: bike.totemId || 0,
        manutencoes: [] // Campo obrigatório conforme especificação
      };

      console.log('📤 Enviando dados para atualização:', updateData);
      const result = await api.put<ApiBike>(`/api/Bicicleta/${bikeId}`, updateData);
      console.log('✅ Status da bike atualizado com sucesso:', result);
      
      return result;
    } catch (error) {
      console.error(`❌ Erro ao atualizar status da bicicleta ${bikeId}:`, error);
      throw error;
    }
  }

  // Buscar bicicletas por totem
  static async getBikesByTotem(totemId: number): Promise<ApiBike[]> {
    try {
      console.log('🎯 Buscando bikes do totem:', totemId);
      const allBikes = await this.getAllBikes();
      const filteredBikes = allBikes.filter(bike => bike.totemId === totemId);
      console.log('🎯 Bikes filtradas para totem', totemId, ':', filteredBikes.length, 'bikes');
      console.log('🎯 Bikes do totem:', filteredBikes);
      return filteredBikes;
    } catch (error) {
      console.error(`❌ Erro ao buscar bicicletas do totem ${totemId}:`, error);
      throw error;
    }
  }
}
