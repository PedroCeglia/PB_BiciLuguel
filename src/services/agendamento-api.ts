
import { api } from './api';
import { 
  ApiAgendamento, 
  CreateAgendamentoRequest, 
  UpdateAgendamentoRequest, 
  DisplayAgendamento,
  AgendamentoStatus 
} from '@/types/api-agendamento';
import { convertUTCToSaoPaulo } from '@/utils/dateHelpers';

export class AgendamentoApiService {
  // Buscar todos os agendamentos
  static async getAllAgendamentos(): Promise<ApiAgendamento[]> {
    console.log('📅 Buscando todos os agendamentos...');
    
    try {
      const agendamentos = await api.get<ApiAgendamento[]>('/api/Agendamento');
      console.log('✅ Agendamentos obtidos da API:', agendamentos);
      return agendamentos;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', error);
      throw error;
    }
  }

  // Buscar agendamento por ID
  static async getAgendamentoById(id: number): Promise<ApiAgendamento> {
    console.log('📅 Buscando agendamento por ID:', id);
    
    try {
      const agendamento = await api.get<ApiAgendamento>(`/api/Agendamento/${id}`);
      console.log('✅ Agendamento obtido:', agendamento);
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento:', error);
      throw error;
    }
  }

  // Criar novo agendamento
  static async createAgendamento(data: CreateAgendamentoRequest): Promise<ApiAgendamento> {
    console.log('📅 Criando novo agendamento:', data);
    
    try {
      const agendamento = await api.post<ApiAgendamento>('/api/Agendamento', data);
      console.log('✅ Agendamento criado:', agendamento);
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw error;
    }
  }

  // Atualizar agendamento
  static async updateAgendamento(id: number, data: UpdateAgendamentoRequest): Promise<ApiAgendamento> {
    console.log('📅 Atualizando agendamento:', { id, data });
    
    try {
      const agendamento = await api.put<ApiAgendamento>(`/api/Agendamento/${id}`, data);
      console.log('✅ Agendamento atualizado:', agendamento);
      return agendamento;
    } catch (error) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      throw error;
    }
  }

  // Deletar agendamento
  static async deleteAgendamento(id: number): Promise<void> {
    console.log('🗑️ Deletando agendamento:', id);
    
    try {
      await api.delete<void>(`/api/Agendamento/${id}`);
      console.log('✅ Agendamento deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar agendamento:', error);
      throw error;
    }
  }
}

// Transformer para converter dados da API para interface de display
export class AgendamentoTransformer {
  static toDisplayAgendamento(
    apiAgendamento: ApiAgendamento,
    totemName?: string,
    bikeModel?: string
  ): DisplayAgendamento {
    // Converter data UTC (da API) para São Paulo (para usuário)
    const saoPauloDate = convertUTCToSaoPaulo(apiAgendamento.data_Horario);
    const now = new Date();
    
    console.log('🌍 Conversão de timezone para exibição:', {
      utcFromAPI: apiAgendamento.data_Horario,
      saoPauloForUser: saoPauloDate.toISOString(),
      scheduledDate: saoPauloDate.toISOString().split('T')[0],
      scheduledTime: saoPauloDate.toTimeString().slice(0, 5)
    });
    
    return {
      id: apiAgendamento.id.toString(),
      usuarioId: apiAgendamento.usuarioId,
      totemId: apiAgendamento.totemId,
      totemName: totemName || `Totem ${apiAgendamento.totemId}`,
      bicicletaId: apiAgendamento.bicicletaId,
      bikeModel: bikeModel || `Bike ${apiAgendamento.bicicletaId}`,
      aluguelId: apiAgendamento.aluguelId,
      scheduledDate: saoPauloDate.toISOString().split('T')[0], // Data em São Paulo
      scheduledTime: saoPauloDate.toTimeString().slice(0, 5), // Hora em São Paulo
      status: this.getDisplayStatus(apiAgendamento.status),
      statusMessage: this.getStatusMessage(apiAgendamento.status),
      createdAt: apiAgendamento.data_Horario,
      canCancel: apiAgendamento.status !== AgendamentoStatus.Cancelado && saoPauloDate > now,
      canConfirm: apiAgendamento.status === AgendamentoStatus.Pendente && saoPauloDate > now
    };
  }

  static getDisplayStatus(status: AgendamentoStatus): 'pending' | 'confirmed' | 'cancelled' {
    switch (status) {
      case AgendamentoStatus.Pendente:
        return 'pending';
      case AgendamentoStatus.Confirmado:
        return 'confirmed';
      case AgendamentoStatus.Cancelado:
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  static getStatusMessage(status: AgendamentoStatus): string {
    switch (status) {
      case AgendamentoStatus.Pendente:
        return 'Aguardando confirmação';
      case AgendamentoStatus.Confirmado:
        return 'Confirmado';
      case AgendamentoStatus.Cancelado:
        return 'Cancelado';
      default:
        return 'Status desconhecido';
    }
  }
}
