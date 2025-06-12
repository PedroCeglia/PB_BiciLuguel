
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TotemApiService, TotemTransformer } from '@/services/totem-api';
import { DisplayTotem } from '@/types/api-totem';
import { mockTotems } from '@/data/totems';

export const useTotems = (useApiData: boolean = false) => {
  const [totems, setTotems] = useState<DisplayTotem[]>([]);

  // Query para buscar dados da API
  const { 
    data: apiTotems, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['totems'],
    queryFn: TotemApiService.getAllTotems,
    enabled: useApiData,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  useEffect(() => {
    console.log('🔄 useTotems useEffect triggered');
    console.log('🔄 useApiData:', useApiData);
    console.log('🔄 apiTotems:', apiTotems);
    
    if (useApiData && apiTotems) {
      console.log('📊 Processing API totems data');
      console.log('📊 API totems count:', apiTotems.length);
      console.log('📊 API totems raw data:', apiTotems);
      
      // Verificar se apiTotems é um array
      if (Array.isArray(apiTotems) && apiTotems.length > 0) {
        console.log('✅ API returned valid array with', apiTotems.length, 'totems');
        
        // Transformar dados da API para formato de exibição
        const transformedTotems = apiTotems.map((apiTotem, index) => {
          console.log(`🔄 Transforming totem ${index + 1}:`, apiTotem);
          const transformed = TotemTransformer.toDisplayTotem(apiTotem);
          console.log(`✅ Transformed totem ${index + 1}:`, transformed);
          return transformed;
        });
        
        console.log('🎉 Final transformed totems:', transformedTotems);
        setTotems(transformedTotems);
      } else {
        console.warn('⚠️ API returned non-array data or empty array, falling back to mock data');
        console.log('📋 Using mock totems:', mockTotems);
        setTotems(mockTotems);
      }
    } else {
      console.log('📋 Using mock data');
      console.log('📋 Mock totems count:', mockTotems.length);
      console.log('📋 Mock totems data:', mockTotems);
      setTotems(mockTotems);
    }
  }, [apiTotems, useApiData]);

  return {
    totems,
    isLoading,
    error,
    refetch
  };
};
