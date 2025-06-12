
// Enums para status do totem
export enum TotemStatus {
  Ativo = 'ativo',
  Inativo = 'inativo',
  EmManutencao = 'em manutenção'
}

// Interface para totem da API
export interface ApiTotem {
  id: number;
  localizacao?: string;
  capacidade_Total: number;
  status?: string;
  nome?: string;
  quantidadeDisponivel: number;
  disponivelAluguel: number;
}

// Interface para criar totem
export interface CreateTotemRequest {
  localizacao?: string;
  capacidade_Total: number;
  status?: string;
  nome?: string;
  quantidadeDisponivel: number;
  disponivelAluguel: number;
}

// Interface para atualizar totem
export interface UpdateTotemRequest {
  localizacao?: string;
  capacidade_Total?: number;
  status?: string;
  nome?: string;
  quantidadeDisponivel?: number;
  disponivelAluguel?: number;
}

// Interface para totem de exibição (mantém compatibilidade com mock)
export interface DisplayTotem {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
  totalSlots: number;
  occupiedSlots: number;
  bikes: any[]; // Será preenchido separadamente
}
