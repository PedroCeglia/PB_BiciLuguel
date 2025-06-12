
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

// Fuso horário de São Paulo
const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

/**
 * Obtém a data atual no fuso horário de São Paulo
 */
export const getCurrentDateInSaoPaulo = (): Date => {
  return toZonedTime(new Date(), SAO_PAULO_TIMEZONE);
};

/**
 * Formata uma data para ISO string no fuso horário de São Paulo
 */
export const formatDateToSaoPauloISO = (date: Date = new Date()): string => {
  return formatInTimeZone(date, SAO_PAULO_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

/**
 * Obtém a data atual formatada em ISO no fuso horário de São Paulo
 */
export const getCurrentSaoPauloISOString = (): string => {
  const now = new Date();
  return formatDateToSaoPauloISO(now);
};

/**
 * Converte uma data de São Paulo para UTC (para enviar para API)
 */
export const convertSaoPauloToUTC = (saoPauloDate: Date): string => {
  const utcDate = fromZonedTime(saoPauloDate, SAO_PAULO_TIMEZONE);
  return utcDate.toISOString();
};

/**
 * Converte uma data UTC para São Paulo (para exibir ao usuário)
 * Subtrai 3 horas da data UTC para obter o horário de São Paulo
 */
export const convertUTCToSaoPaulo = (utcDateString: string): Date => {
  const utcDate = new Date(utcDateString);
  // Subtrair 3 horas (3 * 60 * 60 * 1000 milliseconds)
  return new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
};

/**
 * Obtém a data atual em UTC (para enviar para API)
 */
export const getCurrentUTCISOString = (): string => {
  return new Date().toISOString();
};

/**
 * Converte data/hora de input do usuário (SP) para UTC (API)
 */
export const convertUserDateTimeToUTC = (dateString: string, timeString: string): string => {
  const saoPauloDateTime = new Date(`${dateString}T${timeString}:00`);
  return convertSaoPauloToUTC(saoPauloDateTime);
};

/**
 * Log de debug para comparar UTC vs São Paulo
 */
export const logDateComparison = (label: string = 'Data') => {
  const now = new Date();
  const utcString = now.toISOString();
  const saoPauloString = getCurrentSaoPauloISOString();
  
  console.log(`${label} - UTC: ${utcString}`);
  console.log(`${label} - São Paulo: ${saoPauloString}`);
  
  return { utc: utcString, saoPaulo: saoPauloString };
};
