
// Tipos específicos para a API de Agendamentos
export interface ApiAgendamento {
  id: number;
  usuarioId: number;
  totemId: number;
  bicicletaId: number;
  aluguelId?: number; // Opcional - vinculado após conclusão
  data_Horario: string; // ISO date string
  status: AgendamentoStatus;
}

// Enum para status do agendamento
export enum AgendamentoStatus {
  Pendente = 0,
  Confirmado = 1,
  Cancelado = 2
}

export interface CreateAgendamentoRequest {
  usuarioId: number;
  totemId: number;
  bicicletaId: number;
  data_Horario: string;
  status: AgendamentoStatus;
}

export interface UpdateAgendamentoRequest extends CreateAgendamentoRequest {
  id: number;
  aluguelId?: number;
}

// Interface para dados de exibição (compatibilidade com UI existente)
export interface DisplayAgendamento {
  id: string;
  usuarioId: number;
  totemId: number;
  totemName: string;
  bicicletaId: number;
  bikeModel: string;
  aluguelId?: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  statusMessage: string;
  createdAt: string;
  canCancel: boolean;
  canConfirm: boolean;
}
