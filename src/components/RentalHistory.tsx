
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Calendar, Loader2 } from 'lucide-react';
import { useRentals } from '@/hooks/useRentals';

interface RentalHistoryProps {
  useApiData?: boolean;
}

const RentalHistory = ({ useApiData = true }: RentalHistoryProps) => {
  const { userRentals, isLoadingUserRentals, error } = useRentals(useApiData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'scheduled':
        return 'Agendado';
      default:
        return status;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingUserRentals) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Calendar className="w-5 h-5 mr-2 text-bike-primary" />
            Histórico de Aluguéis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-bike-primary" />
          <span className="ml-2 text-gray-600">Carregando histórico...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Calendar className="w-5 h-5 mr-2 text-bike-primary" />
            Histórico de Aluguéis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-600">Erro ao carregar histórico de aluguéis</p>
          <p className="text-sm text-gray-500 mt-2">
            {useApiData ? 'Verifique sua conexão com a API' : 'Erro nos dados mock'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Calendar className="w-5 h-5 mr-2 text-bike-primary" />
          Histórico de Aluguéis
          {!useApiData && (
            <Badge variant="outline" className="ml-2 text-xs">
              MOCK
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userRentals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum aluguel encontrado</p>
            <p className="text-sm text-gray-400 mt-2">
              Quando você alugar uma bike, o histórico aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userRentals.map((rental) => (
              <div key={rental.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rental.bikeImage || '/placeholder.svg'}
                      alt={rental.bikeName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{rental.bikeName}</h4>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(rental.startDate)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(rental.status)}>
                    {getStatusLabel(rental.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Duração:</span>
                    <span className="ml-2 font-medium">{formatDuration(rental.duration)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Custo:</span>
                    <span className="ml-2 font-bold text-bike-primary">R$ {rental.cost.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{rental.startLocation}</span>
                      {rental.endLocation && (
                        <>
                          <span className="mx-2">→</span>
                          <span>{rental.endLocation}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {rental.rating && (
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-500 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= rental.rating! ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">Sua avaliação</span>
                    </div>
                    {rental.status === 'completed' && !rental.rating && (
                      <Button variant="outline" size="sm">
                        Avaliar
                      </Button>
                    )}
                  </div>
                )}

                {rental.review && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                    "{rental.review}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentalHistory;
