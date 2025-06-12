
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bike } from 'lucide-react';
import { DisplayBike } from '@/types/api-bike';
import { DisplayTotem } from '@/types/api-totem';
import { User as UserType } from '@/types/bike';
import { useToast } from '@/hooks/use-toast';
import { useRentals } from '@/hooks/useRentals';
import { getCurrentSaoPauloISOString } from '@/utils/dateHelpers';
import BikeInfoCard from './rental/BikeInfoCard';
import TotemInfoCard from './rental/TotemInfoCard';
import UserInfoCard from './rental/UserInfoCard';
import RentalDetailsSection from './rental/RentalDetailsSection';
import ImportantNotice from './rental/ImportantNotice';

interface RentalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: DisplayBike;
  totem?: DisplayTotem | null;
  user: UserType;
  useApiData: boolean;
}

const RentalConfirmationModal: React.FC<RentalConfirmationModalProps> = ({
  isOpen,
  onClose,
  bike,
  totem,
  user,
  useApiData
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();
  const { createRental } = useRentals(useApiData);

  const handleConfirmRental = async () => {
    console.log('🚀 Iniciando confirmação de aluguel...');
    console.log('📊 useApiData:', useApiData);
    console.log('👤 user:', user);
    console.log('🚲 bike:', bike);
    console.log('📍 totem:', totem);
    console.log('🏢 bike.totemId:', bike.totemId);
    
    setIsConfirming(true);
    
    try {
      if (useApiData && user?.id) {
        console.log('🌐 Usando API real - criando aluguel...');
        
        // Obter totemId - usar do totem se disponível, senão usar da bike
        let totemId: number;
        if (totem && totem.id) {
          totemId = parseInt(totem.id, 10);
          console.log('📋 TotemId obtido do objeto totem:', totemId);
        } else if (bike.totemId) {
          totemId = typeof bike.totemId === 'string' ? parseInt(bike.totemId, 10) : bike.totemId;
          console.log('📋 TotemId obtido da bike:', totemId);
        } else {
          throw new Error('TotemId não encontrado');
        }

        // Obter data atual no fuso horário de São Paulo
        const currentSaoPauloDate = getCurrentSaoPauloISOString();
        console.log('📅 Data atual em São Paulo:', currentSaoPauloDate);

        // Preparar dados da bike para atualização de status
        const bikeDataForUpdate = {
          id: parseInt(bike.id),
          marca: bike.marca || '',
          modelo: bike.model || '',
          cor: bike.cor || '',
          tipo: bike.type || '',
          tamanho: bike.tamanho || '',
          status: bike.rawStatus || 0, // Status atual
          totemId: bike.totemId || totemId,
          cadastro: currentSaoPauloDate, // Usando fuso horário de São Paulo
          atualizacao: currentSaoPauloDate // Usando fuso horário de São Paulo
        };
        
        console.log('📋 Parâmetros finais:', {
          bikeId: bike.id,
          totemId: totemId,
          userId: user.id,
          bikeDataForUpdate
        });
        
        await createRental({
          bikeId: bike.id,
          totemId: totemId,
          bikeData: bikeDataForUpdate
        });
        
        console.log('✅ Aluguel criado com sucesso via API');
        
        const totemName = totem?.name || `Totem ${totemId}`;
        toast({
          title: "Aluguel confirmado!",
          description: `${bike.model} foi reservada para você. Retire no ${totemName} em até 15 minutos.`,
        });
      } else {
        console.log('📦 Simulando aluguel (motivos):');
        console.log('  - useApiData:', useApiData);
        console.log('  - user.id existe:', !!user?.id);
        
        // Simular aluguel para dados mock
        const totemName = totem?.name || 'localização indicada';
        toast({
          title: "Aluguel confirmado!",
          description: `${bike.model} foi reservada para você. Retire no ${totemName} em até 15 minutos.`,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Erro ao confirmar aluguel:', error);
      toast({
        title: "Erro ao confirmar aluguel",
        description: "Tente novamente ou escolha outra bike.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-bike-primary" />
            Confirmar Aluguel
          </DialogTitle>
          <DialogDescription>
            Revise os detalhes do seu aluguel antes de confirmar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da Bike */}
          <BikeInfoCard bike={bike} />

          {/* Informações do Totem */}
          {totem && <TotemInfoCard totem={totem} />}

          {/* Informações do Usuário */}
          <UserInfoCard user={user} />

          <Separator />

          {/* Detalhes do Aluguel */}
          <RentalDetailsSection bike={bike} />

          <Separator />

          {/* Informações Importantes */}
          <ImportantNotice />
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmRental}
            disabled={isConfirming}
            className="bg-bike-gradient hover:opacity-90"
          >
            {isConfirming ? 'Confirmando...' : 'Confirmar Aluguel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentalConfirmationModal;
