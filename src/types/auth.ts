
import { User } from './bike';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiUserResponse {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
  totalViagens: number;
  totalGasto: number;
  membroDesde: string;
  locaisFavoritos: string[];
}

export interface LoginResponse {
  token: string;
  usuario: ApiUserResponse;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
