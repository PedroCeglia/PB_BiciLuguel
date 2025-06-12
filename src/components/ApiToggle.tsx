
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Cloud, Database } from 'lucide-react';

interface ApiToggleProps {
  useApiData: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const ApiToggle: React.FC<ApiToggleProps> = ({ useApiData, onToggle, className = "" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Database className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Mock</span>
      </div>
      
      <Switch
        checked={useApiData}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-bike-primary"
      />
      
      <div className="flex items-center space-x-2">
        <Cloud className="w-4 h-4 text-bike-primary" />
        <span className="text-sm font-medium text-gray-700">API</span>
      </div>
      
      <Badge 
        variant={useApiData ? "default" : "secondary"}
        className={useApiData ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {useApiData ? "API Ativa" : "Dados Mock"}
      </Badge>
    </div>
  );
};

export default ApiToggle;
