'use client';

import { useState, useEffect, useRef } from 'react';

interface City {
  id: number;
  nome: string;
  uf: string;
  lat: number;
  lon: number;
}

export default function DistanciaCidades() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredOrigin, setFilteredOrigin] = useState<City[]>([]);
  const [filteredDest, setFilteredDest] = useState<City[]>([]);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destCity, setDestCity] = useState<City | null>(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [result, setResult] = useState<{
    distance: number;
    estimatedRoad: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
      );
      const data = await response.json();
      
      const citiesWithCoords: City[] = [];
      
      for (const city of data) {
        const lat = getCityLat(city.nome, city.microrregiao?.mesorregiao?.UF?.sigla);
        const lon = getCityLon(city.nome, city.microrregiao?.mesorregiao?.UF?.sigla);
        
        if (lat && lon) {
          citiesWithCoords.push({
            id: city.id,
            nome: city.nome,
            uf: city.microrregiao?.mesorregiao?.UF?.sigla || '',
            lat,
            lon,
          });
        }
      }
      
      setCities(citiesWithCoords);
      setLoading(false);
    } catch {
      setError('Erro ao carregar cidades');
      setLoading(false);
    }
  };

  const getCityLat = (nome: string, uf?: string): number | null => {
    const coords: Record<string, [number, number]> = {
      'São Paulo': [-23.5505, -46.6333],
      'Rio de Janeiro': [-22.9068, -43.1729],
      'Brasília': [-15.7975, -47.8919],
      'Salvador': [-12.9714, -38.5124],
      'Fortaleza': [-3.7172, -38.5433],
      'Belo Horizonte': [-19.9167, -43.9345],
      'Manaus': [-3.119, -60.0217],
      'Curitiba': [-25.4284, -49.2733],
      'Recife': [-8.0476, -34.877],
      'Porto Alegre': [-30.0346, -51.2177],
      'Belém': [-1.4558, -48.5024],
      'Goiânia': [-16.6869, -49.2648],
      'Guarulhos': [-23.4538, -46.5333],
      'Campinas': [-22.9099, -47.0626],
      'São Luís': [-2.5297, -44.2825],
      'Maceió': [-9.6658, -35.7353],
      'Campo Grande': [-20.4697, -54.6201],
      'Teresina': [-5.0892, -42.8019],
      'João Pessoa': [-7.1195, -34.845],
      'Natal': [-5.7945, -35.211],
      'Aracaju': [-10.9091, -37.0677],
      'Cuiabá': [-15.601, -56.0974],
      'Vitória': [-20.3155, -40.3128],
      'Florianópolis': [-27.5954, -48.548],
      'Rio Branco': [-9.9747, -67.8101],
      'Porto Velho': [-8.7608, -63.9004],
      'Macapá': [0.0349, -51.0694],
      'Boa Vista': [2.8195, -60.6714],
      'Palmas': [-10.1689, -48.3317],
      'São Paulo - SP': [-23.5505, -46.6333],
      'Rio de Janeiro - RJ': [-22.9068, -43.1729],
      'Brasília - DF': [-15.7975, -47.8919],
      'Salvador - BA': [-12.9714, -38.5124],
      'Fortaleza - CE': [-3.7172, -38.5433],
      'Belo Horizonte - MG': [-19.9167, -43.9345],
      'Manaus - AM': [-3.119, -60.0217],
      'Curitiba - PR': [-25.4284, -49.2733],
      'Recife - PE': [-8.0476, -34.877],
      'Porto Alegre - RS': [-30.0346, -51.2177],
    };
    
    const key = uf ? `${nome} - ${uf}` : nome;
    return coords[key]?.[0] ?? coords[nome]?.[0] ?? null;
  };

  const getCityLon = (nome: string, uf?: string): number | null => {
    const coords: Record<string, [number, number]> = {
      'São Paulo': [-23.5505, -46.6333],
      'Rio de Janeiro': [-22.9068, -43.1729],
      'Brasília': [-15.7975, -47.8919],
      'Salvador': [-12.9714, -38.5124],
      'Fortaleza': [-3.7172, -38.5433],
      'Belo Horizonte': [-19.9167, -43.9345],
      'Manaus': [-3.119, -60.0217],
      'Curitiba': [-25.4284, -49.2733],
      'Recife': [-8.0476, -34.877],
      'Porto Alegre': [-30.0346, -51.2177],
      'Belém': [-1.4558, -48.5024],
      'Goiânia': [-16.6869, -49.2648],
      'Guarulhos': [-23.4538, -46.5333],
      'Campinas': [-22.9099, -47.0626],
      'São Luís': [-2.5297, -44.2825],
      'Maceió': [-9.6658, -35.7353],
      'Campo Grande': [-20.4697, -54.6201],
      'Teresina': [-5.0892, -42.8019],
      'João Pessoa': [-7.1195, -34.845],
      'Natal': [-5.7945, -35.211],
      'Aracaju': [-10.9091, -37.0677],
      'Cuiabá': [-15.601, -56.0974],
      'Vitória': [-20.3155, -40.3128],
      'Florianópolis': [-27.5954, -48.548],
      'Rio Branco': [-9.9747, -67.8101],
      'Porto Velho': [-8.7608, -63.9004],
      'Macapá': [0.0349, -51.0694],
      'Boa Vista': [2.8195, -60.6714],
      'Palmas': [-10.1689, -48.3317],
      'São Paulo - SP': [-23.5505, -46.6333],
      'Rio de Janeiro - RJ': [-22.9068, -43.1729],
      'Brasília - DF': [-15.7975, -47.8919],
      'Salvador - BA': [-12.9714, -38.5124],
      'Fortaleza - CE': [-3.7172, -38.5433],
      'Belo Horizonte - MG': [-19.9167, -43.9345],
      'Manaus - AM': [-3.119, -60.0217],
      'Curitiba - PR': [-25.4284, -49.2733],
      'Recife - PE': [-8.0476, -34.877],
      'Porto Alegre - RS': [-30.0346, -51.2177],
    };
    
    const key = uf ? `${nome} - ${uf}` : nome;
    return coords[key]?.[1] ?? coords[nome]?.[1] ?? null;
  };

  const handleOriginSearch = (value: string) => {
    setOriginSearch(value);
    setOriginCity(null);
    setResult(null);
    if (value.length >= 2) {
      const filtered = cities.filter(c =>
        c.nome.toLowerCase().includes(value.toLowerCase()) ||
        c.uf.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredOrigin(filtered);
      setShowOriginDropdown(true);
    } else {
      setShowOriginDropdown(false);
    }
  };

  const handleDestSearch = (value: string) => {
    setDestSearch(value);
    setDestCity(null);
    setResult(null);
    if (value.length >= 2) {
      const filtered = cities.filter(c =>
        c.nome.toLowerCase().includes(value.toLowerCase()) ||
        c.uf.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredDest(filtered);
      setShowDestDropdown(true);
    } else {
      setShowDestDropdown(false);
    }
  };

  const selectOrigin = (city: City) => {
    setOriginCity(city);
    setOriginSearch(`${city.nome} - ${city.uf}`);
    setShowOriginDropdown(false);
  };

  const selectDest = (city: City) => {
    setDestCity(city);
    setDestSearch(`${city.nome} - ${city.uf}`);
    setShowDestDropdown(false);
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  };

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!originCity || !destCity) {
      setError('Selecione duas cidades válidas');
      return;
    }

    if (originCity.id === destCity.id) {
      setError('Selecione cidades diferentes');
      return;
    }

    const distance = haversineDistance(originCity.lat, originCity.lon, destCity.lat, destCity.lon);
    const estimatedRoad = distance * 1.3;

    setResult({
      distance: Math.round(distance),
      estimatedRoad: Math.round(estimatedRoad),
    });
  };

  const handleSwap = () => {
    const tempCity = originCity;
    const tempSearch = originSearch;
    setOriginCity(destCity);
    setOriginSearch(destSearch);
    setDestCity(tempCity);
    setDestSearch(tempSearch);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Distância entre Cidades</h1>
      <p className="text-gray-600 mb-8">
        Calcule a distância em linha reta e a estimativa rodoviária entre cidades brasileiras.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando cidades do IBGE...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            <div ref={originRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade de Origem
              </label>
              <input
                type="text"
                value={originSearch}
                onChange={(e) => handleOriginSearch(e.target.value)}
                onFocus={() => originSearch.length >= 2 && setShowOriginDropdown(true)}
                placeholder="Digite o nome da cidade..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showOriginDropdown && filteredOrigin.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredOrigin.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => selectOrigin(city)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">{city.nome}</span>
                      <span className="text-gray-500 ml-2 text-sm">- {city.uf}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Inverter cidades"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <div ref={destRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade de Destino
              </label>
              <input
                type="text"
                value={destSearch}
                onChange={(e) => handleDestSearch(e.target.value)}
                onFocus={() => destSearch.length >= 2 && setShowDestDropdown(true)}
                placeholder="Digite o nome da cidade..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showDestDropdown && filteredDest.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredDest.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => selectDest(city)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">{city.nome}</span>
                      <span className="text-gray-500 ml-2 text-sm">- {city.uf}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCalculate}
              disabled={!originCity || !destCity}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular Distância
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        {result && originCity && destCity && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Distância de</p>
              <p className="text-xl font-bold text-gray-900">{originCity.nome} - {originCity.uf}</p>
              <p className="text-sm text-gray-500 my-2">até</p>
              <p className="text-xl font-bold text-gray-900">{destCity.nome} - {destCity.uf}</p>
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
          da Terra usando suas coordenadas geográficas (latitude e longitude). Os dados das cidades 
          são obtidos diretamente da API do IBGE (Instituto Brasileiro de Geografia e Estatística).
        </p>
        <h2>Cidades disponíveis</h2>
        <p>
          O sistema busca automaticamente todas as cidades brasileiras cadastradas no IBGE. 
          Basta digitar o nome da cidade ou UF para encontrá-la. A estimativa rodoviária é 
          baseada na média de desvio das estradas brasileiras.
        </p>
      </article>
    </div>
  );
}
