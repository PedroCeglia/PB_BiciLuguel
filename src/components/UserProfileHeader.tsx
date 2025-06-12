
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { User } from '@/types/bike';

interface UserProfileHeaderProps {
  user: User;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user }) => {
  const memberSinceDate = new Date(user.memberSince).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="w-16 h-16">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-bike-gradient text-white text-lg font-semibold">
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Membro desde {memberSinceDate}</span>
        </div>
        {user.status && (
          <div className="mt-2">
            <Badge variant={user.status === 'ativo' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
