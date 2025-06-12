import { ApiAluguel } from './api-aluguel';

// Tipos para a entidade Usuário da API
export interface ApiUsuario {
  id: number;
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  documento?: string;
  metodo_Pagamento?: string;
  status?: string;
  alugueis?: ApiAluguel[]; // Propriedade que vem quando busca detalhes do usuário
}

// Tipos para requisições
export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  documento?: string;
  metodo_Pagamento?: string;
  status: string;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  documento?: string;
  metodo_Pagamento?: string;
  status?: string;
}

// Tipos para respostas
export interface UsuarioListResponse {
  usuarios: ApiUsuario[];
  total: number;
}
