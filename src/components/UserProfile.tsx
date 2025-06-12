
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user';
import { useToast } from '@/hooks/use-toast';
import { UpdateUsuarioRequest } from '@/types/user';
import UserProfileHeader from './UserProfileHeader';
import UserProfileActions from './UserProfileActions';
import UserProfileForm from './UserProfileForm';
import UserProfileStats from './UserProfileStats';
import UserProfileInfo from './UserProfileInfo';

const UserProfile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    documento: user?.documento || '',
    metodo_Pagamento: user?.metodo_Pagamento || ''
  });

  if (!user) return null;

  const handleEdit = () => {
    setFormData({
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      documento: user.documento || '',
      metodo_Pagamento: user.metodo_Pagamento || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      documento: user.documento || '',
      metodo_Pagamento: user.metodo_Pagamento || ''
    });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const updateData: UpdateUsuarioRequest = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || undefined,
        documento: formData.documento || undefined,
        metodo_Pagamento: formData.metodo_Pagamento || undefined
      };

      await userService.update(parseInt(user.id), updateData);
      await refreshUser();
      
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-bike-primary" />
            Meu Perfil
          </div>
          <UserProfileActions
            isEditing={isEditing}
            isLoading={isLoading}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onLogout={logout}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <UserProfileForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        ) : (
          <UserProfileHeader user={user} />
        )}

        {!isEditing && (
          <>
            <UserProfileInfo user={user} />
            <UserProfileStats user={user} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
