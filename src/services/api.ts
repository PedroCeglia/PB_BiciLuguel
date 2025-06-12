
import { authEvents } from './authEvents';

const API_BASE_URL = 'https://localhost:7197';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token se existir
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Detectar token expirado (401) e acionar logout automático
        if (response.status === 401) {
          console.log('🔒 Token expirado detectado - acionando logout automático');
          
          // Limpar dados locais imediatamente
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          
          // Emitir evento para o AuthContext
          authEvents.emit('token-expired');
          
          throw new ApiError(response.status, 'Sessão expirada. Faça login novamente.');
        }
        
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || 'Erro na requisição');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Erro de rede ou parsing
      console.error('Erro na requisição:', error);
      throw new ApiError(0, 'Erro de conexão com o servidor');
    }
  },

  get<T>(endpoint: string): Promise<T> {
    return api.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: any): Promise<T> {
    return api.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: any): Promise<T> {
    return api.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return api.request<T>(endpoint, { method: 'DELETE' });
  },
};
