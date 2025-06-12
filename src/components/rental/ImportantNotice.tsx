
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ImportantNotice: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800 mb-1">Importante:</p>
          <ul className="text-amber-700 space-y-1 text-xs">
            <li>• Retire a bike em até 15 minutos</li>
            <li>• Devolva em qualquer totem da rede</li>
            <li>• Cobrança por tempo de uso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotice;
