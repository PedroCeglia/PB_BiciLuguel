
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { User as UserType } from '@/types/bike';

interface UserInfoCardProps {
  user: UserType;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-bike-primary" />
          <span className="font-medium">Usuário</span>
        </div>
        <p className="text-sm text-gray-600">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
