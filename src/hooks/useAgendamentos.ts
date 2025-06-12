
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgendamentoApiService, AgendamentoTransformer } from '@/services/agendamento-api';
import { 
  CreateAgendamentoRequest, 
  UpdateAgendamentoRequest,
  DisplayAgendamento,
  AgendamentoStatus 
} from '@/types/api-agendamento';
import { useTotems } from './useTotems';
import { useBikes } from './useBikes';
import { ApiError } from '@/services/api';

export const useAgendamentos = (useApiData: boolean = true, usuarioId?: number) => {
  const { totems } = useTotems(useApiData);
  const { bikes } = useBikes(useApiData);

  return useQuery({
    queryKey: ['agendamentos', useApiData, usuarioId],
    queryFn: async (): Promise<DisplayAgendamento[]> => {
      if (!useApiData) {
        // Retornar dados mock se não estiver usando API
        return [];
      }

      try {
        const apiAgendamentos = await AgendamentoApiService.getAllAgendamentos();
        
        // Filtrar por usuário se especificado
        const filteredAgendamentos = usuarioId 
          ? apiAgendamentos.filter(a => a.usuarioId === usuarioId)
          : apiAgendamentos;

        // Transformar para interface de display
        return filteredAgendamentos.map(agendamento => {
          const totem = totems.find(t => parseInt(t.id) === agendamento.totemId);
          const bike = bikes.find(b => parseInt(b.id) === agendamento.bicicletaId);
          
          return AgendamentoTransformer.toDisplayAgendamento(
            agendamento,
            totem?.name,
            bike?.model
          );
        });
      } catch (error) {
        console.error('❌ Erro ao buscar agendamentos:', error);
        throw error;
      }
    },
    enabled: useApiData,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  });
};

export const useCreateAgendamentoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAgendamentoRequest) => {
      console.log('📅 Criando agendamento:', data);
      return await AgendamentoApiService.createAgendamento(data);
    },
    onSuccess: () => {
      console.log('✅ Agendamento criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao criar agendamento:', error);
    }
  });
};

export const useUpdateAgendamentoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAgendamentoRequest }) => {
      console.log('📅 Atualizando agendamento:', { id, data });
      return await AgendamentoApiService.updateAgendamento(id, data);
    },
    onSuccess: () => {
      console.log('✅ Agendamento atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar agendamento:', error);
    }
  });
};

export const useCancelAgendamentoMutation = (onConnectionError?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agendamento: DisplayAgendamento) => {
      console.log('🗑️ Deletando agendamento:', agendamento.id);
      
      return await AgendamentoApiService.deleteAgendamento(parseInt(agendamento.id));
    },
    onSuccess: () => {
      console.log('✅ Agendamento deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao deletar agendamento:', error);
      
      // Verificar se é erro de conexão (status 0)
      if (error instanceof ApiError && error.status === 0) {
        console.log('🔄 Erro de conexão detectado - fazendo refresh da lista...');
        
        // Invalidar queries para forçar refresh
        queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
        queryClient.invalidateQueries({ queryKey: ['bikes'] });
        
        // Chamar callback se fornecido
        if (onConnectionError) {
          onConnectionError();
        }
      }
    }
  });
};
