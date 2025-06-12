
import React, { useState } from 'react';
import { DisplayBike } from '@/types/api-bike';
import { useBikes } from '@/hooks/useBikes';
import { useAuth } from '@/context/AuthContext';
import RentalConfirmationModal from './RentalConfirmationModal';
import BikeGridHeader from './BikeGridHeader';
import BikeCard from './BikeCard';
import { BikeGridLoading, BikeGridError } from './BikeGridStates';

interface BikeGridProps {
  onRentBike?: (bikeId: string) => void;
  onScheduleBike?: (bikeId: string) => void;
  useApiData: boolean;
}

const BikeGrid: React.FC<BikeGridProps> = ({ onRentBike, onScheduleBike, useApiData }) => {
  console.log('🎯 BikeGrid - useApiData recebido:', useApiData);
  
  const { bikes, isLoading, error, refetch } = useBikes(useApiData);
  const { user } = useAuth();
  const [selectedBike, setSelectedBike] = useState<DisplayBike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRentBike = (bike: DisplayBike) => {
    console.log('🚲 BikeGrid - Selecionando bike para aluguel:', bike.model);
    console.log('📡 BikeGrid - useApiData que será passado para o modal:', useApiData);
    console.log('🏢 BikeGrid - totemId da bike:', bike.totemId);
    
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

  if (isLoading) {
    return <BikeGridLoading />;
  }

  if (error) {
    return <BikeGridError onRefetch={refetch} />;
  }

  return (
    <div className="space-y-4">
      <BikeGridHeader 
        useApiData={useApiData}
        bikesCount={bikes.length}
        onRefetch={refetch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onRentBike={handleRentBike}
            onScheduleBike={onScheduleBike}
          />
        ))}
      </div>

      {/* Modal de Confirmação */}
      {selectedBike && user && (
        <RentalConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bike={selectedBike}
          totem={null}
          user={user}
          useApiData={useApiData}
        />
      )}
    </div>
  );
};

export default BikeGrid;
