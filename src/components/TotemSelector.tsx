
import React, { useState } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { DisplayTotem } from '@/types/api-totem';

interface TotemSelectorProps {
  selectedTotem: DisplayTotem | null;
  onTotemChange: (totem: DisplayTotem | null) => void;
  availableTotems: DisplayTotem[];
}

const TotemSelector: React.FC<TotemSelectorProps> = ({ 
  selectedTotem, 
  onTotemChange, 
  availableTotems 
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (totemId: string) => {
    const totem = availableTotems.find(t => t.id === totemId) || null;
    onTotemChange(totem);
    setOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'maintenance':
        return 'Manutenção';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  // Filtrar apenas totens ativos
  const activeTotems = availableTotems.filter(totem => totem.status === 'active');

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Selecionar Totem
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/80 border-gray-300 focus:border-bike-primary focus:ring-bike-primary"
          >
            {selectedTotem ? (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{selectedTotem.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">Escolha um totem...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[400px] p-0 bg-white border shadow-lg">
          <Command>
            <CommandInput placeholder="Digite para buscar um totem..." className="h-9" />
            <CommandEmpty>Nenhum totem encontrado.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {activeTotems.map((totem) => (
                  <CommandItem
                    key={totem.id}
                    value={`${totem.name} ${totem.address}`}
                    onSelect={() => handleSelect(totem.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedTotem?.id === totem.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{totem.name}</span>
                          <Badge className={getStatusColor(totem.status)}>
                            {getStatusLabel(totem.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{totem.address}</p>
                        <p className="text-xs text-gray-400">
                          {totem.totalSlots - totem.occupiedSlots} vagas disponíveis
                        </p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedTotem && (
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Totem selecionado:</strong> {selectedTotem.name}
            <br />
            {selectedTotem.address}
          </p>
        </div>
      )}
    </div>
  );
};

export default TotemSelector;
