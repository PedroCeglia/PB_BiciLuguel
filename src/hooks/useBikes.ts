
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BikeApiService, BikeTransformer } from '@/services/bike-api';
import { DisplayBike } from '@/types/api-bike';
import { mockBikes } from '@/data/bikes';

export const useBikes = (useApiData: boolean = false) => {
  const [bikes, setBikes] = useState<DisplayBike[]>([]);

  // Query para buscar dados da API
  const { 
    data: apiBikes, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['bikes'],
    queryFn: BikeApiService.getAllBikes,
    enabled: useApiData,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  useEffect(() => {
    console.log('🔄 useBikes useEffect triggered');
    console.log('🔄 useApiData:', useApiData);
    console.log('🔄 apiBikes:', apiBikes);
    
    if (useApiData && apiBikes) {
      console.log('📊 Processing API bikes data');
      console.log('📊 API bikes count:', apiBikes.length);
      console.log('📊 API bikes raw data:', apiBikes);
      
      // Verificar se apiBikes é um array
      if (Array.isArray(apiBikes) && apiBikes.length > 0) {
        console.log('✅ API returned valid array with', apiBikes.length, 'bikes');
        
        // Transformar dados da API para formato de exibição
        const transformedBikes = apiBikes.map((apiBike, index) => {
          const fallbackData = mockBikes[index % mockBikes.length];
          console.log(`🔄 Transforming bike ${index + 1}:`, apiBike);
          const transformed = BikeTransformer.toDisplayBike(apiBike, fallbackData);
          console.log(`✅ Transformed bike ${index + 1}:`, transformed);
          return transformed;
        });
        
        console.log('🎉 Final transformed bikes:', transformedBikes);
        setBikes(transformedBikes);
      } else {
        console.warn('⚠️ API returned non-array data or empty array, falling back to mock data');
        console.log('📋 Using mock bikes:', mockBikes);
        setBikes(mockBikes);
      }
    } else {
      console.log('📋 Using mock data');
      console.log('📋 Mock bikes count:', mockBikes.length);
      console.log('📋 Mock bikes data:', mockBikes);
      setBikes(mockBikes);
    }
  }, [apiBikes, useApiData]);

  return {
    bikes,
    isLoading,
    error,
    refetch
  };
};

export const useBikesByTotem = (totemId: number | null, useApiData: boolean = false) => {
  const { 
    data: totemBikes, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['bikes', 'totem', totemId],
    queryFn: () => totemId ? BikeApiService.getBikesByTotem(totemId) : Promise.resolve([]),
    enabled: useApiData && totemId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const [bikes, setBikes] = useState<DisplayBike[]>([]);

  useEffect(() => {
    if (useApiData && totemBikes && totemId) {
      console.log('Totem bikes data:', totemBikes, 'Type:', typeof totemBikes, 'Is array:', Array.isArray(totemBikes));
      
      if (Array.isArray(totemBikes)) {
        const transformedBikes = totemBikes.map((apiBike, index) => {
          const fallbackData = mockBikes[index % mockBikes.length];
          return BikeTransformer.toDisplayBike(apiBike, fallbackData);
        });
        setBikes(transformedBikes);
      } else {
        console.warn('Totem API returned non-array data, using empty array');
        setBikes([]);
      }
    } else if (!useApiData && totemId) {
      // Filtrar bikes mock pelo totemId (simulado)
      const filteredBikes = mockBikes.filter((_, index) => 
        (index % 4) === (totemId % 4)
      );
      setBikes(filteredBikes);
    } else {
      setBikes([]);
    }
  }, [totemBikes, totemId, useApiData]);

  return {
    bikes,
    isLoading,
    error
  };
};
