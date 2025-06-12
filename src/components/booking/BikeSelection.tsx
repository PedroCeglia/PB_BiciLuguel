
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bike } from 'lucide-react';
import { DisplayTotem } from '@/types/api-totem';
import { DisplayBike } from '@/types/api-bike';

interface BikeSelectionProps {
  selectedTotem: DisplayTotem | null;
  selectedBike: string;
  onBikeChange: (value: string) => void;
  availableBikes: DisplayBike[];
  isLoading: boolean;
  error?: any;
  useApiData: boolean;
}

const BikeSelection = ({ 
  selectedTotem, 
  selectedBike, 
  onBikeChange, 
  availableBikes, 
  isLoading, 
  error, 
  useApiData 
}: BikeSelectionProps) => {
  const getBikeSelectionPlaceholder = () => {
    if (!selectedTotem) {
      return "Primeiro selecione um totem";
    }
    if (useApiData && isLoading) {
      return "Carregando bikes...";
    }
    if (useApiData && error) {
      return "Erro ao carregar bikes";
    }
    if (availableBikes.length === 0) {
      return "Nenhuma bike disponível neste totem";
    }
    return "Escolha uma bike";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="bike" className="text-sm font-medium text-gray-700">
        Selecionar Bike
      </Label>
      <Select 
        value={selectedBike} 
        onValueChange={onBikeChange}
        disabled={!selectedTotem || (useApiData && isLoading)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getBikeSelectionPlaceholder()} />
        </SelectTrigger>
        <SelectContent>
          {availableBikes.map((bike) => (
            <SelectItem key={bike.id} value={bike.id}>
              <div className="flex items-center space-x-2">
                <Bike className="w-4 h-4" />
                <span>{bike.model || `Bike ${bike.id}`} - R$ {bike.hourlyRate?.toFixed(2) || '15.00'}/h</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BikeSelection;
