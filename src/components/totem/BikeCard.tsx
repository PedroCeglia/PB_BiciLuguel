
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Battery, Star, Calendar, Zap } from 'lucide-react';
import { DisplayBike } from '@/types/api-bike';

interface BikeCardProps {
  bike: DisplayBike;
  onRent: (bike: DisplayBike) => void;
  onSchedule: (bikeId: string, bikeName: string) => void;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike, onRent, onSchedule }) => {
  const getBikeTypeColor = (type: string) => {
    switch (type) {
      case 'electric':
        return 'bg-blue-100 text-blue-800';
      case 'mountain':
        return 'bg-green-100 text-green-800';
      case 'road':
        return 'bg-purple-100 text-purple-800';
      case 'hybrid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBikeTypeLabel = (type: string) => {
    switch (type) {
      case 'electric':
        return 'Elétrica';
      case 'mountain':
        return 'Mountain';
      case 'road':
        return 'Speed';
      case 'hybrid':
        return 'Híbrida';
      default:
        return type;
    }
  };

  return (
    <Card className="border border-gray-200 hover:border-bike-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{bike.model}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getBikeTypeColor(bike.type)}>
                {getBikeTypeLabel(bike.type)}
              </Badge>
              {bike.type === 'electric' && bike.batteryLevel && (
                <div className="flex items-center text-sm text-gray-600">
                  <Battery className="w-3 h-3 mr-1" />
                  <span>{bike.batteryLevel}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-bike-primary">
              R$ {bike.hourlyRate.toFixed(2)}/h
            </div>
            <div className="text-xs text-gray-500">
              R$ {bike.dailyRate.toFixed(2)}/dia
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-3 h-3 mr-1 text-yellow-500" />
            <span>{bike.rating}</span>
            <span className="mx-2">•</span>
            <span>{bike.totalRides} viagens</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={() => onRent(bike)}
            className="flex-1 bg-bike-gradient hover:opacity-90"
            size="sm"
            disabled={bike.status !== 'available'}
          >
            <Zap className="w-4 h-4 mr-1" />
            Alugar Agora
          </Button>
          <Button 
            onClick={() => onSchedule(bike.id, bike.model)}
            variant="outline"
            size="sm"
            className="border-bike-primary text-bike-primary hover:bg-bike-primary hover:text-white"
            disabled={bike.status !== 'available'}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Agendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BikeCard;
