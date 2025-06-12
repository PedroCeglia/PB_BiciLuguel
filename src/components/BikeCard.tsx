
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Battery, Star, Clock, AlertTriangle } from 'lucide-react';
import { DisplayBike, BikeStatus } from '@/types/api-bike';
import { BikeTransformer } from '@/services/bike-api';
import { getBikeImage, getTypeColor, getTypeLabel } from '@/utils/bikeHelpers';

interface BikeCardProps {
  bike: DisplayBike;
  onRentBike: (bike: DisplayBike) => void;
  onScheduleBike?: (bikeId: string) => void;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike, onRentBike, onScheduleBike }) => {
  // Verificar se a bike pode ser alugada baseado no status
  const canBeRented = bike.status === 'available' && 
                      (bike.rawStatus === undefined || bike.rawStatus === BikeStatus.Disponivel);

  // Obter mensagem de status específica
  const getStatusBadge = () => {
    if (bike.rawStatus !== undefined) {
      // Se temos o status da API, usar a mensagem específica
      const statusMessage = BikeTransformer.getStatusMessage(bike.rawStatus);
      let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
      
      switch (bike.rawStatus) {
        case BikeStatus.Disponivel:
          variant = 'default';
          break;
        case BikeStatus.Andamento:
        case BikeStatus.Reservada:
          variant = 'destructive';
          break;
        default:
          variant = 'secondary';
      }
      
      return <Badge variant={variant}>{statusMessage}</Badge>;
    }
    
    // Fallback para status genérico
    return (
      <Badge variant={bike.status === 'available' ? 'default' : 'secondary'}>
        {bike.status === 'available' ? 'Disponível' : 
         bike.status === 'rented' ? 'Em uso' : 
         bike.status === 'reserved' ? 'Reservada' :
         bike.status === 'disabled' ? 'Desativada' : 'Manutenção'}
      </Badge>
    );
  };

  // Validação de segurança para tentativa de aluguel
  const handleRentClick = () => {
    if (!canBeRented) {
      console.warn('🚫 Tentativa de aluguel bloqueada:', {
        bikeId: bike.id,
        status: bike.status,
        rawStatus: bike.rawStatus,
        model: bike.model
      });
      return; // Bloquear silenciosamente
    }

    console.log('✅ Aluguel permitido para bike:', {
      bikeId: bike.id,
      status: bike.status,
      rawStatus: bike.rawStatus,
      model: bike.model
    });

    onRentBike(bike);
  };

  // Verificar se deve mostrar aviso de indisponibilidade
  const showUnavailableWarning = !canBeRented && bike.rawStatus !== undefined;

  return (
    <Card className="hover-scale border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <img
          src={getBikeImage(bike.image)}
          alt={bike.model}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getTypeColor(bike.type)}>
            {getTypeLabel(bike.type)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        
        {showUnavailableWarning && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-red-100 border border-red-300 rounded-md p-2 flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-xs text-red-700">
                {bike.rawStatus === BikeStatus.Andamento ? 'Bike em uso por outro usuário' :
                 bike.rawStatus === BikeStatus.Reservada ? 'Bike reservada' :
                 bike.rawStatus === BikeStatus.Manutencao ? 'Bike em manutenção' :
                 'Bike indisponível'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{bike.model}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium ml-1">{bike.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{bike.location.address}</span>
        </div>

        {bike.type === 'electric' && bike.batteryLevel && (
          <div className="flex items-center text-green-600 mb-3">
            <Battery className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{bike.batteryLevel}% bateria</span>
          </div>
        )}

        {/* Informações adicionais da API */}
        {(bike.marca || bike.cor || bike.tamanho) && (
          <div className="mb-3 text-xs text-gray-500 space-y-1">
            {bike.marca && <div>Marca: {bike.marca}</div>}
            {bike.cor && <div>Cor: {bike.cor}</div>}
            {bike.tamanho && <div>Tamanho: {bike.tamanho}</div>}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center text-gray-900">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-bold">R$ {bike.hourlyRate.toFixed(2)}/h</span>
            </div>
            <span className="text-xs text-gray-500">R$ {bike.dailyRate.toFixed(2)}/dia</span>
          </div>
          <span className="text-xs text-gray-500">{bike.totalRides} viagens</span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleRentClick}
            disabled={!canBeRented}
            className="w-full bike-gradient text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canBeRented ? 'Alugar Agora' : 
             bike.rawStatus === BikeStatus.Andamento ? 'Em uso' :
             bike.rawStatus === BikeStatus.Reservada ? 'Reservada' :
             bike.rawStatus === BikeStatus.Manutencao ? 'Manutenção' :
             bike.rawStatus === BikeStatus.Desativada ? 'Desativada' :
             'Indisponível'}
          </Button>
          
          {canBeRented && (
            <Button
              onClick={() => onScheduleBike?.(bike.id)}
              variant="outline"
              className="w-full border-bike-primary text-bike-primary hover:bg-bike-primary hover:text-white transition-all duration-300"
            >
              Agendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BikeCard;
