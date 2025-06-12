
import { ApiBike, CreateBikeRequest, DisplayBike, BikeStatus } from '@/types/api-bike';

export class BikeTransformer {
  // Mapear status numérico para string - APENAS status 0 (Disponivel) é 'available'
  static mapStatusToString(status: BikeStatus): 'available' | 'rented' | 'maintenance' | 'reserved' | 'disabled' {
    switch (status) {
      case BikeStatus.Disponivel:
        return 'available'; // ÚNICA opção que permite aluguel
      case BikeStatus.Reservada:
        return 'reserved';
      case BikeStatus.Andamento:
        return 'rented';
      case BikeStatus.Manutencao:
        return 'maintenance';
      case BikeStatus.Desativada:
        return 'disabled';
      default:
        console.warn('⚠️ Status desconhecido:', status);
        return 'disabled'; // Fallback seguro - não permite aluguel
    }
  }

  // Verificar se a bike pode ser alugada
  static canBeRented(status: BikeStatus): boolean {
    return status === BikeStatus.Disponivel; // APENAS bikes disponíveis podem ser alugadas
  }

  // Obter mensagem de status para exibição
  static getStatusMessage(status: BikeStatus): string {
    switch (status) {
      case BikeStatus.Disponivel:
        return 'Disponível';
      case BikeStatus.Reservada:
        return 'Reservada';
      case BikeStatus.Andamento:
        return 'Em uso';
      case BikeStatus.Manutencao:
        return 'Manutenção';
      case BikeStatus.Desativada:
        return 'Desativada';
      default:
        return 'Indisponível';
    }
  }

  // Mapear tipo da API para tipo da UI
  static mapTypeToUI(tipo?: string): 'electric' | 'mountain' | 'road' | 'hybrid' {
    if (!tipo) return 'hybrid';
    
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('elétrica') || tipoLower.includes('eletrica')) return 'electric';
    if (tipoLower.includes('mountain')) return 'mountain';
    if (tipoLower.includes('speed') || tipoLower.includes('road')) return 'road';
    return 'hybrid';
  }

  // Transformar ApiBike para DisplayBike
  static toDisplayBike(apiBike: ApiBike, fallbackData?: Partial<DisplayBike>): DisplayBike {
    // Verificar se apiBike tem as propriedades mínimas necessárias
    if (!apiBike || apiBike.id === undefined || apiBike.id === null) {
      console.warn('ApiBike inválida recebida:', apiBike);
      // Retornar um objeto padrão se a bike for inválida
      return {
        id: 'invalid-' + Math.random().toString(36).substr(2, 9),
        model: 'Bike Indisponível',
        type: 'hybrid',
        location: {
          lat: -23.5505,
          lng: -46.6333,
          address: 'Localização não definida'
        },
        hourlyRate: 0,
        dailyRate: 0,
        status: 'disabled',
        image: '',
        features: [],
        rating: 0,
        totalRides: 0,
        rawStatus: BikeStatus.Desativada
      };
    }

    return {
      id: apiBike.id.toString(),
      model: apiBike.modelo || `${apiBike.marca || 'Bike'} ${apiBike.id}`,
      type: this.mapTypeToUI(apiBike.tipo),
      batteryLevel: apiBike.tipo?.toLowerCase().includes('elétrica') ? 85 : undefined,
      location: fallbackData?.location || {
        lat: -23.5505,
        lng: -46.6333,
        address: 'Localização não definida'
      },
      hourlyRate: fallbackData?.hourlyRate || 15.00,
      dailyRate: fallbackData?.dailyRate || 80.00,
      status: this.mapStatusToString(apiBike.status),
      image: fallbackData?.image || '',
      features: fallbackData?.features || ['GPS Integrado', 'Freios Hidráulicos'],
      rating: fallbackData?.rating || 4.5,
      totalRides: fallbackData?.totalRides || 0,
      marca: apiBike.marca,
      cor: apiBike.cor,
      tamanho: apiBike.tamanho,
      totemId: apiBike.totemId,
      rawStatus: apiBike.status // Manter status original para validações
    };
  }

  // Transformar DisplayBike para CreateBikeRequest
  static toCreateRequest(displayBike: Partial<DisplayBike>): CreateBikeRequest {
    const now = new Date().toISOString();
    
    return {
      marca: displayBike.marca,
      modelo: displayBike.model,
      cor: displayBike.cor,
      tipo: displayBike.type,
      tamanho: displayBike.tamanho,
      cadastro: now,
      atualizacao: now,
      status: BikeStatus.Disponivel,
      totemId: displayBike.totemId
    };
  }
}
