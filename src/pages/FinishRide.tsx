
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ActiveRideCard from '@/components/ActiveRideCard';
import FinishRideForm from '@/components/FinishRideForm';
import { useTotems } from '@/hooks/useTotems';
import { useRentals } from '@/hooks/useRentals';

interface FinishRideProps {
  useApiData?: boolean;
}

const FinishRide = ({ useApiData = true }: FinishRideProps) => {
  const navigate = useNavigate();
  const [currentDuration, setCurrentDuration] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const { totems } = useTotems(useApiData);
  const { activeRental } = useRentals(useApiData);

  useEffect(() => {
    if (!activeRental) {
      navigate('/');
      return;
    }
  }, [activeRental, navigate]);

  const handleTimeUpdate = (duration: number, cost: number) => {
    setCurrentDuration(duration);
    setCurrentCost(cost);
  };

  if (!activeRental) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finalizar Corrida</h1>
            <p className="text-gray-600">Complete sua viagem e processe o pagamento</p>
          </div>
        </div>

        {/* Informações da Corrida Atual */}
        <ActiveRideCard 
          rental={activeRental}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Formulário de Finalização */}
        <FinishRideForm 
          totems={totems}
          currentDuration={currentDuration}
          currentCost={currentCost}
          useApiData={useApiData}
          activeRental={activeRental}
        />
      </div>
    </div>
  );
};

export default FinishRide;
