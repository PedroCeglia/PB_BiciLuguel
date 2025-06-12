
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bike, Calendar, Clock, User, Map, Play, CalendarCheck } from 'lucide-react';
import DashboardStats from './DashboardStats';
import BikeGrid from './BikeGrid';
import RentalHistory from './RentalHistory';
import BookingScheduler from './BookingScheduler';
import AgendamentosList from './AgendamentosList';
import UserProfile from './UserProfile';
import TotemPage from './TotemPage';
import ApiToggle from './ApiToggle';
import NoActiveRideModal from './NoActiveRideModal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRentals } from '@/hooks/useRentals';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [useApiData, setUseApiData] = useState(true);
  const [showNoRideModal, setShowNoRideModal] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Hook de aluguéis
  const { activeRental } = useRentals(useApiData);

  // Verificar se há aluguel ativo
  const handleRentBike = (bikeId: string) => {
    toast({
      title: "Aluguel iniciado!",
      description: "Você pode retirar sua bike no local indicado."
    });
  };

  const handleScheduleBike = (bikeId: string) => {
    setActiveTab('schedule');
    toast({
      title: "Redirecionado para agendamento",
      description: "Complete os dados para agendar sua bike."
    });
  };

  const handleViewRide = () => {
    if (activeRental) {
      navigate('/finish-ride');
    } else {
      setShowNoRideModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-bike-gradient rounded-xl">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">BiciLuguel</h1>
                <p className="text-sm text-gray-600">Olá, {user?.name}! 👋</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Toggle API/Mock */}
              <ApiToggle 
                useApiData={useApiData} 
                onToggle={setUseApiData}
                className="hidden sm:flex"
              />
              
              {/* Botão Ver Corrida - sempre visível */}
              <Button 
                onClick={handleViewRide}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Ver Corrida
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <Bike className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="totems" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Totens</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agendar</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Agendamentos</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-bike-gradient data-[state=active]:text-white">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Bike className="w-5 h-5 mr-2 text-bike-primary" />
                      Bikes Próximas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BikeGrid 
                      onRentBike={handleRentBike} 
                      onScheduleBike={handleScheduleBike}
                      useApiData={useApiData}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <UserProfile />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="totems" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Totens de Bikes</h2>
              <p className="text-gray-600">Encontre estações próximas e escolha sua bike</p>
            </div>
            <TotemPage useApiData={useApiData} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Agendar Bike</h2>
                <p className="text-gray-600">Planeje sua próxima viagem com antecedência</p>
              </div>
              <BookingScheduler useApiData={useApiData} />
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Meus Agendamentos</h2>
              <p className="text-gray-600">Gerencie seus agendamentos de bikes</p>
            </div>
            <AgendamentosList useApiData={useApiData} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Aluguéis</h2>
              <p className="text-gray-600">Acompanhe todas as suas viagens</p>
            </div>
            <RentalHistory useApiData={useApiData} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h2>
                <p className="text-gray-600">Gerencie suas informações e preferências</p>
              </div>
              <UserProfile />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para quando não há corrida ativa */}
      <NoActiveRideModal 
        isOpen={showNoRideModal}
        onClose={() => setShowNoRideModal(false)}
      />
    </div>
  );
};

export default Dashboard;
