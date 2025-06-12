
import { api, ApiError } from './api';
import { ApiUsuario, CreateUsuarioRequest, UpdateUsuarioRequest, UsuarioListResponse } from '@/types/user';

export const userService = {
  // Buscar todos os usuários (administrativo)
  async getAll(): Promise<ApiUsuario[]> {
    try {
      const response = await api.get<ApiUsuario[]>('/api/Usuario');
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Erro ao carregar lista de usuários');
    }
  },

  // Buscar usuário por ID
  async getById(id: number): Promise<ApiUsuario> {
    try {
      const response = await api.get<ApiUsuario>(`/api/Usuario/${id}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 404:
            throw new Error('Usuário não encontrado');
          case 403:
            throw new Error('Acesso negado');
          default:
            throw new Error('Erro ao carregar dados do usuário');
        }
      }
      
      throw new Error('Erro de conexão ao buscar usuário');
    }
  },

  // Criar novo usuário
  async create(userData: CreateUsuarioRequest): Promise<ApiUsuario> {
    try {
      const response = await api.post<ApiUsuario>('/api/Usuario', userData);
      console.log('Usuário criado com sucesso:', response);
      return response;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            throw new Error('Dados inválidos. Verifique as informações');
          case 409:
            throw new Error('Email já está em uso');
          case 500:
            throw new Error('Erro interno do servidor');
          default:
            throw new Error('Erro ao criar usuário');
        }
      }
      
      throw new Error('Erro de conexão ao criar usuário');
    }
  },

  // Atualizar usuário
  async update(id: number, userData: UpdateUsuarioRequest): Promise<ApiUsuario> {
    try {
      const response = await api.put<ApiUsuario>(`/api/Usuario/${id}`, userData);
      console.log('Usuário atualizado com sucesso:', response);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            throw new Error('Dados inválidos. Verifique as informações');
          case 404:
            throw new Error('Usuário não encontrado');
          case 403:
            throw new Error('Acesso negado para atualizar este usuário');
          case 409:
            throw new Error('Email já está em uso por outro usuário');
          default:
            throw new Error('Erro ao atualizar usuário');
        }
      }
      
      throw new Error('Erro de conexão ao atualizar usuário');
    }
  }
};
