import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Bike, RefreshCw, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAgendamentos, useCancelAgendamentoMutation, useUpdateAgendamentoMutation } from '@/hooks/useAgendamentos';
import { DisplayAgendamento, AgendamentoStatus } from '@/types/api-agendamento';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/api';

interface AgendamentosListProps {
  useApiData?: boolean;
}

const AgendamentosList = ({ useApiData = true }: AgendamentosListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: agendamentos = [], isLoading, error, refetch } = useAgendamentos(
    useApiData, 
    user ? parseInt(user.id) : undefined
  );

  // Não passar callback para erro de conexão - refresh será silencioso
  const cancelMutation = useCancelAgendamentoMutation();
  const updateMutation = useUpdateAgendamentoMutation();

  const handleCancel = async (agendamento: DisplayAgendamento) => {
    try {
      await cancelMutation.mutateAsync(agendamento);
      toast({
        title: "Agendamento removido",
        description: `Agendamento da ${agendamento.bikeModel} foi removido permanentemente.`
      });
    } catch (error) {
      // Verificar se é erro de conexão - não exibir toast para status 0
      if (error instanceof ApiError && error.status === 0) {
        // Erro de conexão - não fazer nada, o refresh já acontece automaticamente
        console.log('Erro de conexão detectado - refresh automático acionado');
      } else {
        // Outros tipos de erro - exibir toast
        toast({
          title: "Erro ao remover",
          description: "Não foi possível remover o agendamento.",
          variant: "destructive"
        });
      }
    }
  };

  const handleConfirm = async (agendamento: DisplayAgendamento) => {
    try {
      const updateData = {
        id: parseInt(agendamento.id),
        usuarioId: agendamento.usuarioId,
        totemId: agendamento.totemId,
        bicicletaId: agendamento.bicicletaId,
        data_Horario: agendamento.createdAt,
        status: AgendamentoStatus.Confirmado,
        aluguelId: agendamento.aluguelId
      };

      await updateMutation.mutateAsync({ id: parseInt(agendamento.id), data: updateData });
      toast({
        title: "Agendamento confirmado",
        description: `Agendamento da ${agendamento.bikeModel} foi confirmado.`
      });
    } catch (error) {
      toast({
        title: "Erro ao confirmar",
        description: "Não foi possível confirmar o agendamento.",
        variant: "destructive"
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="w-16 h-16 mb-4 text-gray-300 animate-spin" />
          <p className="text-lg font-medium mb-2">Carregando agendamentos...</p>
          <p className="text-sm text-gray-500">
            {useApiData ? 'Conectando com a API...' : 'Carregando dados mock...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error && useApiData) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Calendar className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Erro ao carregar agendamentos</p>
          <p className="text-sm text-gray-500 mb-4">
            Não foi possível conectar com a API.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-bike-primary" />
            Meus Agendamentos
          </div>
          {useApiData && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              API Conectada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {agendamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Calendar className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Nenhum agendamento encontrado</p>
            <p className="text-sm text-center">
              Você ainda não possui agendamentos. Que tal agendar uma bike?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bike className="w-4 h-4 text-bike-primary" />
                      <h3 className="font-semibold text-gray-900">{agendamento.bikeModel}</h3>
                      <Badge variant={getStatusVariant(agendamento.status)}>
                        {agendamento.statusMessage}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{agendamento.scheduledDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{agendamento.scheduledTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{agendamento.totemName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex space-x-2">
                  {agendamento.canConfirm && (
                    <Button
                      onClick={() => handleConfirm(agendamento)}
                      disabled={updateMutation.isPending}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Confirmar
                    </Button>
                  )}
                  
                  {agendamento.canCancel && (
                    <Button
                      onClick={() => handleCancel(agendamento)}
                      disabled={cancelMutation.isPending}
                      size="sm"
                      variant="destructive"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgendamentosList;
