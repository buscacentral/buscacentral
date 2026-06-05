/**
 * Clima Logic Module
 *
 * Módulo de lógica para consumo da API Open-Meteo (gratuita, sem chave).
 * Fornece dados meteorológicos atuais por coordenadas geográficas.
 */

export interface DadosClima {
  readonly temperaturaAtual: number;
  readonly velocidadeVento: number;
  readonly umidade: number;
  readonly codigoTempo: number;
}

/**
 * Busca as condições climáticas atuais com base em coordenadas geográficas.
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Dados climáticos ou null em caso de erro
 */
export async function buscarClima(lat: number, lng: number): Promise<DadosClima | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    return {
      temperaturaAtual: Math.round(data.current_weather.temperature),
      velocidadeVento: Math.round(data.current_weather.windspeed),
      umidade: data.hourly?.relativehumidity_2m?.[0] ?? 60,
      codigoTempo: data.current_weather.weathercode,
    };
  } catch {
    return null;
  }
}

/**
 * Traduz o código numérico da API para uma descrição em português.
 *
 * @param code - Código WMO do tempo
 * @returns Descrição legível com emoji
 */
export function traduzirCodigoTempo(code: number): string {
  if (code === 0) return 'Céu Limpo ☀️';
  if (code >= 1 && code <= 3) return 'Parcialmente Nublado ⛅';
  if (code >= 45 && code <= 48) return 'Névoa 🌫️';
  if (code >= 51 && code <= 67) return 'Chuva Leve 🌧️';
  if (code >= 71 && code <= 82) return 'Possibilidade de Chuva/Neve 🌨️';
  if (code >= 95 && code <= 99) return 'Tempestade com Raios ⛈️';
  return 'Instável 🌤️';
}
