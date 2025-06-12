
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bike } from 'lucide-react';
import { DisplayBike } from '@/types/api-bike';

interface BikeInfoCardProps {
  bike: DisplayBike;
}

const BikeInfoCard: React.FC<BikeInfoCardProps> = ({ bike }) => {
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

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Bike className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{bike.model}</h3>
            <Badge className={getBikeTypeColor(bike.type)}>
              {getBikeTypeLabel(bike.type)}
            </Badge>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{bike.location.address}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BikeInfoCard;
