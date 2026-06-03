'use client';

import { useState } from 'react';

interface City {
  name: string;
  lat: number;
  lon: number;
}

const majorCities: City[] = [
  { name: 'São Paulo - SP', lat: -23.5505, lon: -46.6333 },
  { name: 'Rio de Janeiro - RJ', lat: -22.9068, lon: -43.1729 },
  { name: 'Brasília - DF', lat: -15.7975, lon: -47.8919 },
  { name: 'Salvador - BA', lat: -12.9714, lon: -38.5124 },
  { name: 'Fortaleza - CE', lat: -3.7172, lon: -38.5433 },
  { name: 'Belo Horizonte - MG', lat: -19.9167, lon: -43.9345 },
  { name: 'Manaus - AM', lat: -3.119, lon: -60.0217 },
  { name: 'Curitiba - PR', lat: -25.4284, lon: -49.2733 },
  { name: 'Recife - PE', lat: -8.0476, lon: -34.877 },
  { name: 'Porto Alegre - RS', lat: -30.0346, lon: -51.2177 },
  { name: 'Belém - PA', lat: -1.4558, lon: -48.5024 },
  { name: 'Goiânia - GO', lat: -16.6869, lon: -49.2648 },
  { name: 'Guarulhos - SP', lat: -23.4538, lon: -46.5333 },
  { name: 'Campinas - SP', lat: -22.9099, lon: -47.0626 },
  { name: 'São Luís - MA', lat: -2.5297, lon: -44.2825 },
  { name: 'Maceió - AL', lat: -9.6658, lon: -35.7353 },
  { name: 'Campo Grande - MS', lat: -20.4697, lon: -54.6201 },
  { name: 'Teresina - PI', lat: -5.0892, lon: -42.8019 },
  { name: 'João Pessoa - PB', lat: -7.1195, lon: -34.845 },
  { name: 'Natal - RN', lat: -5.7945, lon: -35.211 },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DistanciaCidades() {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [result, setResult] = useState<{
    from: City;
    to: City;
    distance: number;
    estimatedRoad: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    const origin = majorCities.find((c) => c.name === city1);
    const destination = majorCities.find((c) => c.name === city2);

    if (!origin || !destination) {
      setError('Selecione duas cidades válidas da lista');
      return;
    }

    if (origin.name === destination.name) {
      setError('Selecione cidades diferentes');
      return;
    }

    const distance = haversineDistance(origin.lat, origin.lon, destination.lat, destination.lon);
    const estimatedRoad = distance * 1.3;

    setResult({
      from: origin,
      to: destination,
      distance: Math.round(distance),
      estimatedRoad: Math.round(estimatedRoad),
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Distância entre Cidades</h1>
      <p className="text-gray-600 mb-8">
        Calcule a distância em linha reta e a estimativa rodoviária entre cidades brasileiras.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="city1" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade de Origem
            </label>
            <select
              id="city1"
              value={city1}
              onChange={(e) => setCity1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione uma cidade</option>
              {majorCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                const temp = city1;
                setCity1(city2);
                setCity2(temp);
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Inverter cidades"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div>
            <label htmlFor="city2" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade de Destino
            </label>
            <select
              id="city2"
              value={city2}
              onChange={(e) => setCity2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione uma cidade</option>
              {majorCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Calcular Distância
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Distância de</p>
              <p className="text-xl font-bold text-gray-900">{result.from.name}</p>
              <p className="text-sm text-gray-500 my-2">até</p>
              <p className="text-xl font-bold text-gray-900">{result.to.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Em linha reta</p>
                <p className="text-3xl font-bold text-blue-600">{result.distance.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500">quilômetros</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Estimativa rodoviária</p>
                <p className="text-3xl font-bold text-green-600">{result.estimatedRoad.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500">quilômetros</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> A estimativa rodoviária considera um fator de 1.3x sobre a distância 
                em linha reta, representando o desvio médio das rodovias brasileiras.
              </p>
            </div>
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como calculamos a distância?</h2>
        <p>
          Utilizamos a fórmula de Haversine, que calcula a distância entre dois pontos na superfície 
          da Terra usando suas coordenadas geográficas (latitude e longitude). O resultado mostra 
          tanto a distância em linha reta quanto uma estimativa para percurso rodoviário.
        </p>
        <h2>Cidades disponíveis</h2>
        <p>
          Atualmente oferecemos cálculo entre as 20 maiores capitais brasileiras. A estimativa 
          rodoviária é baseada na média de desvio das estradas brasileiras, mas o percurso real 
          pode variar dependendo da rota escolhida.
        </p>
      </article>
    </div>
  );
}
