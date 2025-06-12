
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, LogOut } from 'lucide-react';

interface UserProfileActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onLogout: () => void;
}

const UserProfileActions: React.FC<UserProfileActionsProps> = ({
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onLogout
}) => {
  return (
    <div className="flex space-x-2">
      {!isEditing ? (
        <>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="text-bike-primary border-bike-primary hover:bg-blue-50"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sair
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={onSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </>
      )}
    </div>
  );
};

export default UserProfileActions;
