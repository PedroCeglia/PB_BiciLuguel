
import React from 'react';

interface RideSummaryProps {
  duration: number;
  cost: number;
  paymentMethod: string;
}

const RideSummary: React.FC<RideSummaryProps> = ({ duration, cost, paymentMethod }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit-card': return 'Cartão de Crédito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };

  return (
    <>
      {/* Resumo dos Custos */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-gray-900">Resumo da Corrida</h4>
        <div className="flex justify-between text-sm">
          <span>Duração:</span>
          <span>{formatDuration(duration)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Taxa por hora:</span>
          <span>R$ 15,00</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total:</span>
          <span className="text-bike-primary">R$ {cost.toFixed(2)}</span>
        </div>
      </div>

      {paymentMethod && (
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Pagamento via {getPaymentMethodLabel(paymentMethod)}</strong>
            <br />
            O valor será processado após a finalização da corrida.
          </p>
        </div>
      )}
    </>
  );
};

export default RideSummary;
