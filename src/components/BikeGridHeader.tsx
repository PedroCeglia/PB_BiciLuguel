
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface BikeGridHeaderProps {
  useApiData: boolean;
  bikesCount: number;
  onRefetch: () => void;
}

const BikeGridHeader: React.FC<BikeGridHeaderProps> = ({ useApiData, bikesCount, onRefetch }) => {
  if (!useApiData) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          API Conectada
        </Badge>
        <span className="text-sm text-gray-600">{bikesCount} bicicletas encontradas</span>
      </div>
      <Button onClick={onRefetch} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-1" />
        Atualizar
      </Button>
    </div>
  );
};

export default BikeGridHeader;
