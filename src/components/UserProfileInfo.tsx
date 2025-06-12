
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Phone, FileText, CreditCard, MapPin } from 'lucide-react';
import { User } from '@/types/bike';

interface UserProfileInfoProps {
  user: User;
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      {/* Informações pessoais */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <FileText className="w-4 h-4 mr-1 text-bike-primary" />
          Informações Pessoais
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {user.telefone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>{user.telefone}</span>
            </div>
          )}
          {user.documento && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2 text-gray-400" />
              <span>{user.documento}</span>
            </div>
          )}
          {user.metodo_Pagamento && (
            <div className="flex items-center text-sm text-gray-600">
              <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
              <span>{user.metodo_Pagamento}</span>
            </div>
          )}
        </div>
      </div>

      {/* Locais favoritos */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-bike-primary" />
          Locais Favoritos
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.favoriteLocations && user.favoriteLocations.length > 0 ? (
            user.favoriteLocations.map((location, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {location}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum local favorito definido</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
