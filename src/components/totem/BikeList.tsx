
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DisplayBike } from '@/types/api-bike';
import BikeCard from './BikeCard';

interface BikeListProps {
  bikes: DisplayBike[];
  useApiData: boolean;
  onRent: (bike: DisplayBike) => void;
  onSchedule: (bikeId: string, bikeName: string) => void;
}

const BikeList: React.FC<BikeListProps> = ({ bikes, useApiData, onRent, onSchedule }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {bikes.length} bike{bikes.length > 1 ? 's' : ''} disponível{bikes.length > 1 ? 'is' : ''} neste totem
        </div>
        {useApiData && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            API Conectada
          </Badge>
        )}
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onRent={onRent}
            onSchedule={onSchedule}
          />
        ))}
      </div>
    </div>
  );
};

export default BikeList;
