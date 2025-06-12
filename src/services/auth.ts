
import { api, ApiError } from './api';
import { LoginRequest, LoginResponse, ApiUserResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/Auth/Login', credentials);
      
      console.log('Login response:', response);
      
      // Armazenar token e dados do usuário no localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.usuario));
        console.log('Token and user data stored successfully');
      }
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error instanceof ApiError) {
        // Mapear erros específicos da API
        switch (error.status) {
          case 401:
            throw new Error('Email ou senha incorretos');
          case 400:
            throw new Error('Dados inválidos. Verifique email e senha');
          case 500:
            throw new Error('Erro interno do servidor. Tente novamente');
          default:
            throw new Error('Erro ao fazer login. Tente novamente');
        }
      }
      
      throw new Error('Erro de conexão. Verifique sua internet');
    }
  },

  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      // Fazer uma requisição simples para validar o token
      // Usando endpoint correto que exige autenticação
      await api.get('/api/Usuario');
      return true;
    } catch (error) {
      console.log('Token inválido ou expirado:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return false;
    }
  },

  getUserData(): ApiUserResponse | null {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  updateUserData(userData: ApiUserResponse): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
};
