
import { useState } from 'react';
import { DisplayTotem } from '@/types/api-totem';
import { useAuth } from '@/context/AuthContext';
import { useCreateAgendamentoMutation } from '@/hooks/useAgendamentos';
import { AgendamentoStatus } from '@/types/api-agendamento';
import { useToast } from '@/hooks/use-toast';
import { convertUserDateTimeToUTC } from '@/utils/dateHelpers';

export const useBookingForm = (useApiData: boolean = false) => {
  const [selectedTotem, setSelectedTotem] = useState<DisplayTotem | null>(null);
  const [selectedBike, setSelectedBike] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const createAgendamentoMutation = useCreateAgendamentoMutation();

  const resetForm = () => {
    setSelectedTotem(null);
    setSelectedBike('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const validateForm = () => {
    if (!selectedTotem || !selectedBike || !selectedDate || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return false;
    }

    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar logado para fazer agendamentos.",
        variant: "destructive"
      });
      return false;
    }

    // Verificar se a data/hora é no futuro (comparação em São Paulo)
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const now = new Date();
    
    if (scheduledDateTime <= now) {
      toast({
        title: "Data inválida",
        description: "O agendamento deve ser para uma data e hora futuras.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const submitBooking = async (availableBikes: any[]) => {
    if (!validateForm()) return;

    const bike = availableBikes.find(b => b.id === selectedBike);

    if (useApiData) {
      try {
        // Converter data/hora do usuário (São Paulo) para UTC (API)
        const utcDateTime = convertUserDateTimeToUTC(selectedDate, selectedTime);
        
        console.log('📅 Conversão de timezone para agendamento:', {
          userInput: `${selectedDate} ${selectedTime}`,
          saoPauloTime: `${selectedDate}T${selectedTime}:00`,
          utcForAPI: utcDateTime
        });

        await createAgendamentoMutation.mutateAsync({
          usuarioId: parseInt(user!.id),
          totemId: parseInt(selectedTotem!.id),
          bicicletaId: parseInt(selectedBike),
          data_Horario: utcDateTime, // Enviar UTC para API
          status: AgendamentoStatus.Pendente
        });

        toast({
          title: "Agendamento criado!",
          description: `Bike ${bike?.model || 'selecionada'} agendada para ${selectedDate} às ${selectedTime} no ${selectedTotem!.name}.`
        });

        resetForm();
      } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error);
        toast({
          title: "Erro ao agendar",
          description: "Houve um problema ao criar o agendamento. Tente novamente.",
          variant: "destructive"
        });
      }
    } else {
      // Modo mock (compatibilidade)
      toast({
        title: "Agendamento realizado!",
        description: `Bike ${bike?.model || 'selecionada'} agendada para ${selectedDate} às ${selectedTime} no ${selectedTotem!.name}.`
      });
      resetForm();
    }
  };

  const handleTotemChange = (totem: DisplayTotem | null) => {
    console.log('📍 Totem changed to:', totem?.name);
    setSelectedTotem(totem);
    setSelectedBike(''); // Reset bike selection when totem changes
  };

  return {
    selectedTotem,
    selectedBike,
    selectedDate,
    selectedTime,
    setSelectedBike,
    setSelectedDate,
    setSelectedTime,
    handleTotemChange,
    submitBooking,
    isLoading: createAgendamentoMutation.isPending
  };
};
