
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { convertUTCToSaoPaulo, getCurrentDateInSaoPaulo } from '@/utils/dateHelpers';

interface RideTimerProps {
  startTime: string;
  hourlyRate: number;
  onTimeUpdate: (duration: number, cost: number) => void;
}

const RideTimer: React.FC<RideTimerProps> = ({ startTime, hourlyRate, onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentDateInSaoPaulo());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentDateInSaoPaulo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Converter startTime UTC para São Paulo
  const startDateInSaoPaulo = convertUTCToSaoPaulo(startTime);
  const now = getCurrentDateInSaoPaulo();
  
  // Verificar se a data de início é válida
  if (isNaN(startDateInSaoPaulo.getTime())) {
    console.error('❌ Data de início inválida:', startTime);
    return <div className="flex items-center space-x-2 text-lg font-semibold text-red-500">
      <Clock className="w-5 h-5" />
      <span>Data inválida</span>
    </div>;
  }

  if (startDateInSaoPaulo.getTime() > now.getTime()) {
    console.warn('⚠️ Data de início está no futuro (em São Paulo):', {
      startTimeUTC: startTime,
      startDateSaoPaulo: startDateInSaoPaulo.toISOString(),
      nowSaoPaulo: now.toISOString()
    });
  }

  // Calcular duração usando horários de São Paulo
  const durationMs = now.getTime() - startDateInSaoPaulo.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));
  const durationHours = durationMinutes / 60;
  const currentCost = durationHours * hourlyRate;

  console.log('⏱️ Cálculo do timer (São Paulo timezone):', {
    startTimeUTC: startTime,
    startTimeSaoPaulo: startDateInSaoPaulo.toISOString(),
    currentTimeSaoPaulo: now.toISOString(),
    durationMs,
    durationMinutes,
    durationHours,
    hourlyRate,
    currentCost
  });

  useEffect(() => {
    onTimeUpdate(durationMinutes, currentCost);
  }, [durationMinutes, currentCost, onTimeUpdate]);

  const formatDuration = (minutes: number) => {
    const isNegative = minutes < 0;
    const absoluteMinutes = Math.abs(minutes);
    const hours = Math.floor(absoluteMinutes / 60);
    const mins = absoluteMinutes % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    return isNegative ? `-${formattedTime}` : formattedTime;
  };

  return (
    <div className="flex items-center space-x-2 text-lg font-semibold">
      <Clock className="w-5 h-5 text-bike-primary" />
      <span>{formatDuration(durationMinutes)}</span>
    </div>
  );
};

export default RideTimer;
