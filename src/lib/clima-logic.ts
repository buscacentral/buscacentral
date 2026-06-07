/**
 * Clima Logic Module
 *
 * Módulo de lógica para consumo da API Open-Meteo (gratuita, sem chave).
 * Fornece dados meteorológicos atuais por coordenadas geográficas.
 */

export interface PrevisaoDiaria {
  readonly data: string;
  readonly tempMax: number;
  readonly tempMin: number;
  readonly codigoTempo: number;
  readonly probChuva: number;
}

export interface DadosClima {
  readonly temperaturaAtual: number;
  readonly sensacaoTermica: number;
  readonly velocidadeVento: number;
  readonly umidade: number;
  readonly codigoTempo: number;
  readonly previsaoDiaria: PrevisaoDiaria[];
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    const previsaoDiaria: PrevisaoDiaria[] = [];
    if (data.daily && data.daily.time) {
      for (let i = 0; i < Math.min(5, data.daily.time.length); i++) {
        previsaoDiaria.push({
          data: data.daily.time[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          codigoTempo: data.daily.weather_code[i],
          probChuva: data.daily.precipitation_probability_max[i] ?? 0,
        });
      }
    }

    return {
      temperaturaAtual: Math.round(data.current.temperature_2m),
      sensacaoTermica: Math.round(data.current.apparent_temperature),
      velocidadeVento: Math.round(data.current.wind_speed_10m),
      umidade: Math.round(data.current.relative_humidity_2m),
      codigoTempo: data.current.weather_code,
      previsaoDiaria,
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
