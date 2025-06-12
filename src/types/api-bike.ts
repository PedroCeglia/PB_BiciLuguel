
// Tipos específicos para a API de Bicicletas
export interface ApiBike {
  id: number;
  marca?: string;
  modelo?: string;
  cor?: string;
  tipo?: string;
  tamanho?: string;
  cadastro: string; // ISO date string
  atualizacao: string; // ISO date string
  status: BikeStatus; // 0-4 enum
  totemId?: number;
  agendamentoId?: number;
}

// Enum corrigido conforme índice fornecido
export enum BikeStatus {
  Disponivel = 0,    // Única opção que permite aluguel
  Reservada = 1,     // Não pode ser alugada
  Andamento = 2,     // Em uso - não pode ser alugada
  Manutencao = 3,    // Em manutenção - não pode ser alugada
  Desativada = 4     // Desativada - não pode ser alugada
}

export interface CreateBikeRequest {
  marca?: string;
  modelo?: string;
  cor?: string;
  tipo?: string;
  tamanho?: string;
  cadastro: string;
  atualizacao: string;
  status: BikeStatus;
  totemId?: number;
  agendamentoId?: number;
}

export interface UpdateBikeRequest extends CreateBikeRequest {
  id: number;
}

// Interface para dados de exibição (mantém compatibilidade com UI existente)
export interface DisplayBike {
  id: string;
  model: string;
  type: 'electric' | 'mountain' | 'road' | 'hybrid';
  batteryLevel?: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  hourlyRate: number;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance' | 'reserved' | 'disabled';
  image: string;
  features: string[];
  rating: number;
  totalRides: number;
  marca?: string;
  cor?: string;
  tamanho?: string;
  totemId?: number;
  rawStatus?: BikeStatus; // Status original da API para validações adicionais
}
