
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useTotems } from '@/hooks/useTotems';
import { useBikesByTotem } from '@/hooks/useBikes';
import { useBookingForm } from '@/hooks/useBookingForm';
import TotemSelector from './TotemSelector';
import BikeSelection from './booking/BikeSelection';
import DateTimeSelection from './booking/DateTimeSelection';

interface BookingSchedulerProps {
  useApiData?: boolean;
}

const BookingScheduler = ({ useApiData = false }: BookingSchedulerProps) => {
  const { totems } = useTotems(useApiData);
  const {
    selectedTotem,
    selectedBike,
    selectedDate,
    selectedTime,
    setSelectedBike,
    setSelectedDate,
    setSelectedTime,
    handleTotemChange,
    submitBooking,
    isLoading: isSubmitting
  } = useBookingForm(useApiData);

  // Use API to get bikes from selected totem when using API data
  const totemIdForApi = useApiData && selectedTotem ? Number(selectedTotem.id) : null;
  const { 
    bikes: totemBikesFromApi, 
    isLoading: isLoadingBikes, 
    error: bikesError 
  } = useBikesByTotem(totemIdForApi, useApiData);

  const getAvailableBikes = () => {
    if (!selectedTotem) return [];
    
    // When using API data, use bikes from API
    if (useApiData) {
      console.log('🔍 Getting available bikes from API for totem:', selectedTotem.id);
      console.log('🔍 API bikes:', totemBikesFromApi);
      const availableBikes = totemBikesFromApi.filter(bike => bike.status === 'available');
      console.log('🔍 Available bikes (status === available):', availableBikes);
      return availableBikes;
    }
    
    // When using mock data, use bikes from totem
    console.log('🔍 Getting available bikes from mock data for totem:', selectedTotem.name);
    const availableBikes = selectedTotem.bikes.filter(bike => bike.status === 'available');
    console.log('🔍 Available bikes (mock):', availableBikes);
    return availableBikes;
  };

  const availableBikes = getAvailableBikes();
  const isLoading = isSubmitting || (useApiData && isLoadingBikes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(availableBikes);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Calendar className="w-5 h-5 mr-2 text-bike-primary" />
          Agendar Bike
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Totem Selection */}
          <TotemSelector
            selectedTotem={selectedTotem}
            onTotemChange={handleTotemChange}
            availableTotems={totems}
          />

          {/* Bike Selection */}
          <BikeSelection
            selectedTotem={selectedTotem}
            selectedBike={selectedBike}
            onBikeChange={setSelectedBike}
            availableBikes={availableBikes}
            isLoading={isLoadingBikes}
            error={bikesError}
            useApiData={useApiData}
          />

          {/* Date and Time Selection */}
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bike-gradient text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingScheduler;
