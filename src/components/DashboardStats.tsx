
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, Clock, Calendar, User } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: "Bikes Disponíveis",
      value: "28",
      change: "+3 desde ontem",
      icon: Bike,
      color: "text-bike-primary bg-blue-50",
      trend: "up"
    },
    {
      title: "Tempo Ativo Hoje",
      value: "2h 30m",
      change: "Em andamento",
      icon: Clock,
      color: "text-bike-secondary bg-emerald-50",
      trend: "up"
    },
    {
      title: "Próximos Agendamentos",
      value: "2",
      change: "Para esta semana",
      icon: Calendar,
      color: "text-bike-accent bg-amber-50",
      trend: "neutral"
    },
    {
      title: "Total de Viagens",
      value: "47",
      change: "+5 este mês",
      icon: User,
      color: "text-purple-600 bg-purple-50",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-scale border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-emerald-600' : 
              stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
