
import React, { useState } from 'react';
import { DisplayTotem } from '@/types/api-totem';
import { useBikesByTotem } from '@/hooks/useBikes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import RentalConfirmationModal from './RentalConfirmationModal';
import { DisplayBike } from '@/types/api-bike';
import LoadingState from './totem/LoadingState';
import ErrorState from './totem/ErrorState';
import EmptyState from './totem/EmptyState';
import BikeList from './totem/BikeList';

interface TotemBikeSelectorProps {
  totem: DisplayTotem;
  useApiData: boolean;
}

const TotemBikeSelector = ({ totem, useApiData }: TotemBikeSelectorProps) => {
  console.log('🎯 TotemBikeSelector - useApiData recebido:', useApiData);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedBike, setSelectedBike] = useState<DisplayBike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Converter ID do totem para número se estiver usando API
  const totemIdForApi = useApiData ? Number(totem.id) : null;
  
  const { bikes, isLoading, error } = useBikesByTotem(
    totemIdForApi, 
    useApiData
  );

  // Se não estiver usando API, usar bikes do totem mock
  const displayBikes = useApiData ? bikes : totem.bikes;

  const handleRentBike = (bike: DisplayBike) => {
    console.log('🚲 Selecionando bike para aluguel:', bike.model);
    console.log('📡 useApiData que será passado para o modal:', useApiData);
    
    if (!user) {
      console.warn('⚠️ Usuário não está logado');
      return;
    }

    setSelectedBike(bike);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBike(null);
  };

  const handleScheduleBike = (bikeId: string, bikeName: string) => {
    toast({
      title: "Agendamento iniciado",
      description: `Escolha o horário para agendar a ${bikeName}.`
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error && useApiData) {
    return <ErrorState />;
  }

  if (displayBikes.length === 0) {
    return <EmptyState totem={totem} />;
  }

  return (
    <>
      <BikeList
        bikes={displayBikes}
        useApiData={useApiData}
        onRent={handleRentBike}
        onSchedule={handleScheduleBike}
      />

      {/* Modal de Confirmação */}
      {selectedBike && user && (
        <RentalConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bike={selectedBike}
          totem={totem}
          user={user}
          useApiData={useApiData}
        />
      )}
    </>
  );
};

export default TotemBikeSelector;
