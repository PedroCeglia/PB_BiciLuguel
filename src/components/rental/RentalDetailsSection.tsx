
import React from 'react';
import { Clock } from 'lucide-react';
import { DisplayBike } from '@/types/api-bike';

interface RentalDetailsSectionProps {
  bike: DisplayBike;
}

const RentalDetailsSection: React.FC<RentalDetailsSectionProps> = ({ bike }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-bike-primary" />
        <span className="font-medium">Detalhes do Aluguel</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tarifa por hora:</span>
          <span className="font-medium">R$ {bike.hourlyRate.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tarifa diária:</span>
          <span className="font-medium">R$ {bike.dailyRate.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Início:</span>
          <span className="font-medium">Agora</span>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsSection;
