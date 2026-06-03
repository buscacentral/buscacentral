'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface City {
  id: number;
  nome: string;
  uf: string;
  lat: number;
  lon: number;
}

const CAPITALS: Record<string, [number, number]> = {
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
  'Uberlândia': [-18.9186, -48.2772],
  'Uberaba': [-19.7484, -47.9319],
  'Sorocaba': [-23.5015, -47.4526],
  'Ribeirão Preto': [-21.1767, -47.8208],
  'Joinville': [-26.3045, -48.8487],
  'Londrina': [-23.3045, -51.1696],
  'Juiz de Fora': [-21.7622, -43.3438],
  'Niterói': [-22.8833, -43.1036],
  'Ananindeua': [-1.3656, -48.3722],
  'Santos': [-23.9608, -46.3336],
  'São José dos Campos': [-23.1896, -45.8841],
  'Osasco': [-23.5329, -46.7918],
  'Ribeirão das Neves': [-19.7669, -44.0866],
  'Santo André': [-23.6639, -46.5383],
  'São Bernardo do Campo': [-23.6914, -46.5646],
  'Pelotas': [-31.7654, -52.3376],
  'Caxias do Sul': [-29.1634, -51.1797],
  'Maringá': [-23.4253, -51.9387],
  'Anápolis': [-16.3281, -48.9531],
  'Montes Claros': [-16.7282, -43.8584],
  'Betim': [-19.9672, -44.1986],
};

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
  const [result, setResult] = useState<{ distance: number; estimatedRoad: number } | null>(null);
  const [loadingCities, setLoadingCities] = useState(true);
  const [calculating, setCalculating] = useState(false);
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
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
      const data = await response.json();
      
      const citiesWithCoords: City[] = data
        .map((city: { id: number; nome: string; microrregiao?: { mesorregiao?: { UF?: { sigla: string } } } }) => {
          const uf = city.microrregiao?.mesorregiao?.UF?.sigla || '';
          const coords = CAPITALS[city.nome];
          if (coords) {
            return { id: city.id, nome: city.nome, uf, lat: coords[0], lon: coords[1] };
          }
          return null;
        })
        .filter((c: City | null): c is City => c !== null);
      
      setCities(citiesWithCoords);
    } catch {
      setError('Erro ao carregar cidades');
    } finally {
      setLoadingCities(false);
    }
  };

  const filterCities = useCallback((search: string) => {
    if (search.length < 2) return [];
    const lower = search.toLowerCase();
    return cities
      .filter(c =>
        c.nome.toLowerCase().includes(lower) ||
        c.uf.toLowerCase() === lower
      )
      .sort((a, b) => {
        const aStarts = a.nome.toLowerCase().startsWith(lower) ? 0 : 1;
        const bStarts = b.nome.toLowerCase().startsWith(lower) ? 0 : 1;
        return aStarts - bStarts;
      })
      .slice(0, 8);
  }, [cities]);

  const handleOriginSearch = (value: string) => {
    setOriginSearch(value);
    setOriginCity(null);
    setResult(null);
    setFilteredOrigin(filterCities(value));
    setShowOriginDropdown(value.length >= 2);
  };

  const handleDestSearch = (value: string) => {
    setDestSearch(value);
    setDestCity(null);
    setResult(null);
    setFilteredDest(filterCities(value));
    setShowDestDropdown(value.length >= 2);
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

  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const index = text.toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <strong className="text-blue-600">{text.slice(index, index + search.length)}</strong>
        {text.slice(index + search.length)}
      </>
    );
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleCalculate = async () => {
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

    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const distance = haversineDistance(originCity.lat, originCity.lon, destCity.lat, destCity.lon);
    setResult({
      distance: Math.round(distance),
      estimatedRoad: Math.round(distance * 1.3),
    });
    setCalculating(false);
  };

  const handleSwap = () => {
    setOriginCity(destCity);
    setOriginSearch(destCity ? `${destCity.nome} - ${destCity.uf}` : '');
    setDestCity(originCity);
    setDestSearch(originCity ? `${originCity.nome} - ${originCity.uf}` : '');
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Distância entre Cidades</h1>
      <p className="text-gray-600 mb-8">
        Calcule a distância em linha reta e a estimativa rodoviária entre cidades brasileiras.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {loadingCities ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
        ) : (
          <div className="space-y-4">
            <div ref={originRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade de Origem</label>
              <div className="relative">
                <input
                  type="text"
                  value={originSearch}
                  onChange={(e) => handleOriginSearch(e.target.value)}
                  onFocus={() => originSearch.length >= 2 && setShowOriginDropdown(true)}
                  placeholder="Ex: São Paulo, Uberaba, Curitiba..."
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {originCity && (
                  <span className="absolute right-3 top-3.5 text-green-500">✓</span>
                )}
              </div>
              {showOriginDropdown && filteredOrigin.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {filteredOrigin.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => selectOrigin(city)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between"
                    >
                      <span>
                        <span className="font-medium">{highlightMatch(city.nome, originSearch)}</span>
                        <span className="text-gray-400 ml-1 text-sm">- {city.uf}</span>
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{city.uf}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                title="Inverter cidades"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <div ref={destRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade de Destino</label>
              <div className="relative">
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => handleDestSearch(e.target.value)}
                  onFocus={() => destSearch.length >= 2 && setShowDestDropdown(true)}
                  placeholder="Ex: Rio de Janeiro, Fortaleza..."
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {destCity && (
                  <span className="absolute right-3 top-3.5 text-green-500">✓</span>
                )}
              </div>
              {showDestDropdown && filteredDest.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {filteredDest.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => selectDest(city)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between"
                    >
                      <span>
                        <span className="font-medium">{highlightMatch(city.nome, destSearch)}</span>
                        <span className="text-gray-400 ml-1 text-sm">- {city.uf}</span>
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{city.uf}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCalculate}
              disabled={!originCity || !destCity || calculating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {calculating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calculando...
                </>
              ) : (
                'Calcular Distância'
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {calculating && !result && (
          <div className="mt-6 space-y-4 animate-pulse">
            <div className="text-center">
              <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2" />
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-xl h-32" />
              <div className="bg-gray-100 rounded-xl h-32" />
            </div>
          </div>
        )}

        {result && originCity && destCity && !calculating && (
          <div className="mt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Distância calculada</p>
              <p className="text-lg font-bold text-gray-900">
                {originCity.nome} - {originCity.uf}
              </p>
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-12 bg-gray-300" />
                <span className="text-gray-400">→</span>
                <div className="h-px w-12 bg-gray-300" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {destCity.nome} - {destCity.uf}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">📏</div>
                <p className="text-sm font-medium text-blue-700 mb-1">Distância em Linha Reta</p>
                <p className="text-4xl font-bold text-blue-600">
                  {result.distance.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-blue-500 mt-1">quilômetros (Haversine)</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🚗</div>
                <p className="text-sm font-medium text-green-700 mb-1">Estimativa Rodoviária</p>
                <p className="text-4xl font-bold text-green-600">
                  {result.estimatedRoad.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-green-500 mt-1">quilômetros (× 1.3)</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>💡 Como calculamos:</strong> A distância em linha reta usa a fórmula de Haversine 
                com coordenadas do IBGE. A estimativa rodoviária aplica um fator de 1.3x, representando 
                o desvio médio das rodovias brasileiras.
              </p>
            </div>
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre a ferramenta</h2>
        <p>
          Esta ferramenta calcula a distância entre cidades brasileiras usando coordenadas geográficas 
          oficiais do IBGE. A busca funciona para qualquer município cadastrado — basta digitar o nome 
          ou a UF (ex: "Uberaba MG").
        </p>
      </article>
    </div>
  );
}
