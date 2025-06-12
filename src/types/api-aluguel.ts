
// Enum para os status de aluguel conforme documentação da API
export enum AluguelStatus {
  Pendente = 0,
  EmAndamento = 1,
  Finalizado = 2,
  Cancelado = 3,
  AguardandoPagamento = 4,
  Pago = 5,
  Devolvido = 6,
  EmDisputa = 7
}

// Interface principal da entidade Aluguel da API
export interface ApiAluguel {
  id: number;
  usuarioId: number;
  totem_SaidaId: number;
  totem_ChegadaId?: number | null;
  bicicletaId: number;
  pagamentoId?: number | null;
  data_Inicio: string; // ISO date-time
  data_Fim?: string | null; // ISO date-time
  valor_Cobrado: number;
  status: AluguelStatus;
}

// Interface para criar novo aluguel
export interface CreateAluguelRequest {
  usuarioId: number;
  totem_SaidaId: number;
  bicicletaId: number;
  data_Inicio: string;
  valor_Cobrado: number;
  status: AluguelStatus;
}

// Interface para atualizar aluguel existente
export interface UpdateAluguelRequest {
  usuarioId?: number;
  totem_SaidaId?: number; // Adicionado para incluir totem de saída original
  bicicletaId?: number; // Adicionado para incluir bike original
  totem_ChegadaId?: number;
  pagamentoId?: number;
  data_Inicio?: string; // Adicionado para incluir data de início original
  data_Fim?: string;
  valor_Cobrado?: number;
  status?: AluguelStatus;
}

// Interface para exibição no frontend (compatível com Rental existente)
export interface DisplayAluguel {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeImage: string;
  startDate: string;
  endDate?: string;
  duration: number; // em minutos
  cost: number;
  status: 'active' | 'completed' | 'cancelled' | 'scheduled';
  startLocation: string;
  endLocation?: string;
  paymentMethod?: string;
  rating?: number;
  review?: string;
  usuarioId: number;
  totemSaidaId: number;
  totemChegadaId?: number;
}
