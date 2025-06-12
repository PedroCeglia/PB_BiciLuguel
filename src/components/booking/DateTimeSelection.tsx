
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { getCurrentDateInSaoPaulo } from '@/utils/dateHelpers';

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelection = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectionProps) => {
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Usar data mínima no fuso de São Paulo
  const minDate = getCurrentDateInSaoPaulo().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium text-gray-700">
          Data
        </Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
          className="bg-white/80 border-gray-300 focus:border-bike-primary focus:ring-bike-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time" className="text-sm font-medium text-gray-700">
          Horário
        </Label>
        <Select value={selectedTime} onValueChange={onTimeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha o horário" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateTimeSelection;
