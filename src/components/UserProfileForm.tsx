
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  metodo_Pagamento: string;
}

interface UserProfileFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Nome</label>
        <Input
          value={formData.nome}
          onChange={(e) => onInputChange('nome', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Telefone</label>
        <Input
          type="tel"
          placeholder="(11) 99999-9999"
          value={formData.telefone}
          onChange={(e) => onInputChange('telefone', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Documento</label>
        <Input
          placeholder="CPF ou RG"
          value={formData.documento}
          onChange={(e) => onInputChange('documento', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Método de Pagamento</label>
        <Select value={formData.metodo_Pagamento} onValueChange={(value) => onInputChange('metodo_Pagamento', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione um método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cartao">Cartão de Crédito</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserProfileForm;
