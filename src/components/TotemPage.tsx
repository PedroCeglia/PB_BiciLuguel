
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bike, Users, RefreshCw } from 'lucide-react';
import { DisplayTotem } from '@/types/api-totem';
import { useTotems } from '@/hooks/useTotems';
import TotemBikeSelector from './TotemBikeSelector';

interface TotemPageProps {
  useApiData?: boolean;
}

const TotemPage = ({ useApiData = false }: TotemPageProps) => {
  const [selectedTotem, setSelectedTotem] = useState<DisplayTotem | null>(null);
  const { totems, isLoading, error } = useTotems(useApiData);

  const getStatusColor = (status: string, occupiedSlots: number, totalSlots: number) => {
    if (status === 'maintenance') return 'bg-gray-500';
    if (occupiedSlots === 0) return 'bg-red-500';
    if (occupiedSlots / totalSlots < 0.3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (status: string, occupiedSlots: number) => {
    if (status === 'maintenance') return 'Manutenção';
    if (occupiedSlots === 0) return 'Sem bikes';
    return `${occupiedSlots} bikes`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <RefreshCw className="w-16 h-16 mb-4 text-gray-300 animate-spin" />
        <p className="text-lg font-medium mb-2">Carregando totens...</p>
        <p className="text-sm text-center">
          {useApiData ? 'Conectando com a API...' : 'Carregando dados mock...'}
        </p>
      </div>
    );
  }

  if (error && useApiData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MapPin className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">Erro ao carregar totens</p>
        <p className="text-sm text-center mb-4">
          Não foi possível conectar com a API. Usando dados offline.
        </p>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Modo Offline
        </Badge>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Mapa dos Totens */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-bike-primary" />
              Mapa de Totens
            </div>
            {useApiData && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                API Conectada
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Clique em um totem para ver as bikes disponíveis
            </div>
            
            {/* Lista de Totens */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {totems.map((totem) => (
                <div
                  key={totem.id}
                  onClick={() => setSelectedTotem(totem)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedTotem?.id === totem.id 
                      ? 'border-bike-primary bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${getStatusColor(totem.status, totem.occupiedSlots, totem.totalSlots)}`}
                        ></div>
                        <h3 className="font-semibold text-gray-900">{totem.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {getStatusText(totem.status, totem.occupiedSlots)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{totem.address}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Bike className="w-3 h-3 mr-1" />
                          <span>{totem.occupiedSlots}/{totem.totalSlots} slots</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{totem.status === 'active' ? 'Ativo' : 'Manutenção'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seletor de Bikes */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Bike className="w-5 h-5 mr-2 text-bike-primary" />
            {selectedTotem ? `Bikes do ${selectedTotem.name}` : 'Selecione um Totem'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTotem ? (
            <TotemBikeSelector totem={selectedTotem} useApiData={useApiData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MapPin className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum totem selecionado</p>
              <p className="text-sm text-center">
                Clique em um totem no mapa ao lado para ver as bikes disponíveis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TotemPage;
