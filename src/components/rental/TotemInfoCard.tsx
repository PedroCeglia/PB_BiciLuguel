
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { DisplayTotem } from '@/types/api-totem';

interface TotemInfoCardProps {
  totem: DisplayTotem;
}

const TotemInfoCard: React.FC<TotemInfoCardProps> = ({ totem }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-bike-primary" />
          <span className="font-medium">Ponto de Retirada</span>
        </div>
        <p className="text-sm text-gray-600">{totem.name}</p>
        <p className="text-xs text-gray-500">{totem.address}</p>
      </CardContent>
    </Card>
  );
};

export default TotemInfoCard;
