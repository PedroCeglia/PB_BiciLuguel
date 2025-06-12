
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bike, MapPin } from 'lucide-react';
import RideTimer from './RideTimer';
import { convertUTCToSaoPaulo } from '@/utils/dateHelpers';

interface ActiveRideCardProps {
  rental: {
    id: string;
    bikeName: string;
    bikeImage: string;
    startDate: string;
    startLocation: string;
    status: string;
  };
  onTimeUpdate: (duration: number, cost: number) => void;
}

const ActiveRideCard: React.FC<ActiveRideCardProps> = ({ rental, onTimeUpdate }) => {
  // Converter data UTC para São Paulo para exibição
  const startDateInSaoPaulo = convertUTCToSaoPaulo(rental.startDate);
  console.log("Start Date in São Paulo:", rental.startDate);
  console.log("Start Date in São Paulo 2:", startDateInSaoPaulo);

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Bike className="w-5 h-5 mr-2 text-bike-primary" />
          Corrida em Andamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <img
            src={rental.bikeImage}
            alt={rental.bikeName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{rental.bikeName}</h3>
            <Badge className="bg-green-100 text-green-800">Em andamento</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Início da corrida</label>
            <p className="font-medium">
              {rental.startDate.split("T")[0]}, {rental.startDate.split("T")[1].slice(0, 5)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Duração atual</label>
            <RideTimer 
              startTime={rental.startDate}
              hourlyRate={15} // Usar taxa da bike quando disponível
              onTimeUpdate={onTimeUpdate}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Início: {rental.startLocation}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveRideCard;
