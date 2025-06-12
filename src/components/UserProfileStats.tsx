
import React from 'react';
import { Bike } from 'lucide-react';
import { User } from '@/types/bike';

interface UserProfileStatsProps {
  user: User;
}

const UserProfileStats: React.FC<UserProfileStatsProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <Bike className="w-6 h-6 text-bike-primary" />
        </div>
        <div className="text-2xl font-bold text-bike-primary">{user.totalRides || 0}</div>
        <div className="text-sm text-gray-600">Total de Viagens</div>
      </div>
      
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl">💰</span>
        </div>
        <div className="text-2xl font-bold text-bike-secondary">
          R$ {user.totalSpent ? user.totalSpent.toFixed(2) : '0.00'}
        </div>
        <div className="text-sm text-gray-600">Total Gasto</div>
      </div>
      
      <div className="text-center p-4 bg-amber-50 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl">⭐</span>
        </div>
        <div className="text-2xl font-bold text-bike-accent">4.8</div>
        <div className="text-sm text-gray-600">Avaliação Média</div>
      </div>
    </div>
  );
};

export default UserProfileStats;
