
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AluguelApiService } from '@/services/aluguel-api';
import { FinishRentalRequest } from './types';
import { AluguelStatus, CreateAluguelRequest } from '@/types/api-aluguel';
import { BikeApiService } from '@/services/bike-api';
import { getCurrentUTCISOString } from '@/utils/dateHelpers';

export const useFinishRentalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FinishRentalRequest) => {
      console.log('🚀 Iniciando finalização do aluguel:', data);
      
      // PRIMEIRO: Atualizar status da bicicleta para 0 (disponível)
      console.log('🚲 ETAPA 1: Atualizando status da bicicleta para disponível...');
      try {
        // Buscar dados atuais da bicicleta
        const bikeData = await BikeApiService.getBikeById(parseInt(data.bikeId));
        console.log('🚲 Dados atuais da bicicleta:', bikeData);
        
        // Atualizar status para 0 (disponível) com timestamp UTC
        const bikeUpdateData = {
          ...bikeData,
          status: 0, // Status "Disponível"
          atualizacao: getCurrentUTCISOString() // UTC para API
        };
        
        console.log('🚲 Enviando dados para atualizar bike (UTC):', bikeUpdateData);
        await BikeApiService.updateBike(parseInt(data.bikeId), bikeUpdateData);
        console.log('✅ SUCESSO: Status da bike atualizado para "Disponível" (status 0)');
        
      } catch (bikeError) {
        console.error('❌ ERRO ao atualizar status da bike:', bikeError);
        console.error('❌ Detalhes do erro da bike:', {
          bikeId: data.bikeId,
          error: bikeError
        });
        // Continuar mesmo com erro na bike
      }
      
      // SEGUNDO: Finalizar aluguel (independente do resultado da bike)
      console.log('🏁 ETAPA 2: Finalizando aluguel...');
      
      // VERIFICAÇÃO FINAL E DEFINITIVA: Garantir que o valor seja SEMPRE positivo
      let valorFinalSeguro = data.valorFinal;
      
      // Log do valor original
      console.log('💰 Valor original recebido:', data.valorFinal);
      
      // Se for negativo, transformar em positivo
      if (valorFinalSeguro < 0) {
        valorFinalSeguro = valorFinalSeguro * -1;
        console.log('⚠️ VALOR NEGATIVO DETECTADO! Convertendo para positivo:', {
          valorOriginal: data.valorFinal,
          valorConvertido: valorFinalSeguro
        });
      }
      
      // Verificação adicional com Math.abs como backup
      valorFinalSeguro = Math.abs(valorFinalSeguro);
      
      // Log final antes de enviar para API
      console.log('✅ Valor final que será enviado para API:', valorFinalSeguro);
      console.log('🔍 Verificação final - valor é positivo?', valorFinalSeguro >= 0);
      
      // Incluir todos os campos obrigatórios na atualização
      const updateData = {
        usuarioId: data.usuarioId,
        totem_SaidaId: data.totemSaidaId,
        bicicletaId: parseInt(data.bikeId),
        totem_ChegadaId: data.totemChegadaId,
        valor_Cobrado: valorFinalSeguro, // VALOR GARANTIDAMENTE POSITIVO
        data_Inicio: data.dataInicio,
        data_Fim: getCurrentUTCISOString(), // UTC para API
        status: 7 // STATUS 7 = FINALIZADO conforme API
      };
      
      console.log('📋 Dados completos que serão enviados para API (UTC):', updateData);
      console.log('🏁 STATUS enviado para API:', updateData.status, '(deve ser 7 = finalizado)');
      
      // Finalizar aluguel
      const aluguelFinalizado = await AluguelApiService.updateAluguel(data.aluguelId, updateData);
      console.log('✅ SUCESSO: Aluguel finalizado');
      
      return aluguelFinalizado;
    },
    onSuccess: (response, variables) => {
      console.log('✅ Processo completo finalizado com sucesso:', response);
      
      // Invalidar cache dos aluguéis e bikes para refletir mudanças
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
    onError: (error, variables) => {
      console.error('❌ Erro no processo de finalização:', error);
      console.error('❌ Dados enviados que causaram erro:', variables);
      
      // Mesmo com erro, invalidar cache para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    }
  });
};

// Mutation para criar aluguel - CORRIGIDA
export const useCreateRentalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bikeId: string;
      totemId: number;
      bikeData: any;
    }) => {
      console.log('🚀 Criando novo aluguel com dados:', data);
      
      // Extrair usuarioId do contexto ou dos dados
      const userData = localStorage.getItem('userData');
      let usuarioId: number;
      
      if (userData) {
        const user = JSON.parse(userData);
        usuarioId = parseInt(user.id);
        console.log('👤 UsuarioId obtido do localStorage:', usuarioId);
      } else {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar dados para criação do aluguel
      const currentDateUTC = getCurrentUTCISOString(); // UTC para API
      const aluguelData: CreateAluguelRequest = {
        usuarioId: usuarioId,
        totem_SaidaId: data.totemId,
        bicicletaId: parseInt(data.bikeId),
        data_Inicio: currentDateUTC, // UTC para API
        valor_Cobrado: 0, // Valor inicial, será calculado na finalização
        status: AluguelStatus.EmAndamento
      };
      
      console.log('📋 Dados do aluguel para criação (UTC):', aluguelData);
      
      // Criar aluguel na API
      const aluguelCriado = await AluguelApiService.createAluguel(aluguelData);
      console.log('✅ Aluguel criado:', aluguelCriado);
      
      // Atualizar status da bike para "Em uso" (status 1)
      try {
        const bikeUpdateData = {
          ...data.bikeData,
          status: 1, // Status "Em uso"
          atualizacao: currentDateUTC // UTC para API
        };
        
        console.log('🚲 Atualizando status da bike (UTC):', bikeUpdateData);
        await BikeApiService.updateBike(parseInt(data.bikeId), bikeUpdateData);
        console.log('✅ Status da bike atualizado para "Em uso"');
      } catch (bikeError) {
        console.error('⚠️ Erro ao atualizar status da bike:', bikeError);
        // Não falhar a criação do aluguel por causa disso
      }
      
      return aluguelCriado;
    },
    onSuccess: (response) => {
      console.log('✅ Aluguel criado com sucesso:', response);
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao criar aluguel:', error);
    }
  });
};

export const useProcessPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      console.log('🚀 Processando pagamento:', data);
      // Mock implementation - adapt based on your payment API
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao processar pagamento:', error);
    }
  });
};
