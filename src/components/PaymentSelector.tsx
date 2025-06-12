
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    { value: 'credit-card', label: 'Cartão de Crédito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'cash', label: 'Dinheiro', icon: Banknote }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Método de Pagamento</label>
      <Select value={selectedMethod} onValueChange={onMethodChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o método de pagamento" />
        </SelectTrigger>
        <SelectContent>
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <SelectItem key={method.value} value={method.value}>
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span>{method.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentSelector;
