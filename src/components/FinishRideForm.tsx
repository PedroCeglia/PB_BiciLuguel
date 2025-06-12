
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { DisplayTotem } from '@/types/api-totem';
import { DisplayAluguel } from '@/types/api-aluguel';
import PaymentSelector from './PaymentSelector';
import TotemSelector from './TotemSelector';
import RideSummary from './RideSummary';
import { useToast } from '@/hooks/use-toast';
import { useRentals } from '@/hooks/useRentals';
import { useAuth } from '@/context/AuthContext';

interface FinishRideFormProps {
  totems: DisplayTotem[];
  currentDuration: number;
  currentCost: number;
  useApiData?: boolean;
  activeRental: DisplayAluguel;
}

const FinishRideForm: React.FC<FinishRideFormProps> = ({ 
  totems, 
  currentDuration, 
  currentCost,
  useApiData = true,
  activeRental
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { finishRental, isFinishingRental } = useRentals(useApiData);
  const [selectedTotem, setSelectedTotem] = useState<DisplayTotem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleFinishRide = async () => {
    if (!selectedTotem) {
      toast({
        title: "Totem obrigatório",
        description: "Por favor, selecione um totem para finalizar a corrida.",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pagamento obrigatório",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive"
      });
      return;
    }

    // VERIFICAÇÃO CRÍTICA: Garantir que o valor final seja sempre positivo
    let valorFinalParaEnvio = currentCost;
    
    console.log('💰 Valor antes da verificação na FinishRideForm:', currentCost);
    
    // Se for negativo, multiplicar por -1
    if (valorFinalParaEnvio < 0) {
      valorFinalParaEnvio = valorFinalParaEnvio * -1;
      console.log('⚠️ VALOR NEGATIVO DETECTADO na FinishRideForm! Convertendo:', {
        valorOriginal: currentCost,
        valorConvertido: valorFinalParaEnvio
      });
    }
    
    // Verificação adicional com Math.abs
    valorFinalParaEnvio = Math.abs(valorFinalParaEnvio);
    
    console.log('✅ Valor final que será enviado da FinishRideForm:', valorFinalParaEnvio);

    if (!useApiData) {
      // Simulação para modo offline
      setTimeout(() => {
        toast({
          title: "Corrida finalizada!",
          description: `Pagamento de R$ ${valorFinalParaEnvio.toFixed(2)} processado com sucesso.`
        });
        navigate('/');
      }, 2000);
      return;
    }

    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar logado para finalizar a corrida.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🏁 Dados completos para finalização na FinishRideForm:', {
        aluguelId: parseInt(activeRental.id),
        usuarioId: parseInt(user.id),
        totemSaidaId: activeRental.totemSaidaId,
        bicicletaId: activeRental.bikeId,
        totemChegadaId: parseInt(selectedTotem.id),
        valorFinal: valorFinalParaEnvio, // VALOR GARANTIDAMENTE POSITIVO
        dataInicio: activeRental.startDate
      });

      finishRental({
        aluguelId: parseInt(activeRental.id),
        usuarioId: parseInt(user.id),
        totemChegadaId: parseInt(selectedTotem.id),
        valorFinal: valorFinalParaEnvio, // VALOR GARANTIDAMENTE POSITIVO
        totemSaidaId: activeRental.totemSaidaId,
        bikeId: activeRental.bikeId,
        dataInicio: activeRental.startDate
      });

      toast({
        title: "Corrida finalizada!",
        description: `Aluguel finalizado no totem ${selectedTotem.name}. Valor: R$ ${valorFinalParaEnvio.toFixed(2)}`
      });
      
      // Navegar para home após sucesso
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erro ao finalizar aluguel:', error);
      
      toast({
        title: "Erro ao finalizar",
        description: "Houve um problema ao finalizar a corrida. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Garantir que o custo exibido seja sempre positivo
  const displayCost = Math.abs(currentCost);

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <CreditCard className="w-5 h-5 mr-2 text-bike-primary" />
          Finalizar Corrida
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totem de Término */}
        <TotemSelector 
          selectedTotem={selectedTotem}
          onTotemChange={setSelectedTotem}
          availableTotems={totems}
        />

        {/* Método de Pagamento */}
        <PaymentSelector 
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />

        <RideSummary 
          duration={currentDuration}
          cost={displayCost}
          paymentMethod={paymentMethod}
        />

        {/* Botão de Finalizar */}
        <Button 
          onClick={handleFinishRide}
          disabled={!selectedTotem || !paymentMethod || isFinishingRental}
          className="w-full bg-bike-gradient hover:opacity-90 text-white font-semibold py-3"
        >
          {isFinishingRental ? 'Processando...' : `Finalizar Corrida - R$ ${displayCost.toFixed(2)}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FinishRideForm;
