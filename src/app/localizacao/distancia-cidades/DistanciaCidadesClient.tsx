'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface City {
  n: string;
  u: string;
  lat: number;
  lon: number;
}

export default function DistanciaCidadesClient() {
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
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [consumo, setConsumo] = useState('10');
  const [precoGasolina, setPrecoGasolina] = useState('6.00');
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/localizacao/distancia-cidades/cidades.json')
      .then(res => res.json())
      .then((data: City[]) => setCities(data))
      .catch(() => setError('Erro ao carregar cidades'));
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

  const filterCities = useCallback((search: string) => {
    if (search.length < 2) return [];
    const lower = search.toLowerCase();
    return cities
      .filter(c =>
        c.n.toLowerCase().includes(lower) ||
        c.u.toLowerCase() === lower
      )
      .sort((a, b) => {
        const aStarts = a.n.toLowerCase().startsWith(lower) ? 0 : 1;
        const bStarts = b.n.toLowerCase().startsWith(lower) ? 0 : 1;
        return aStarts - bStarts;
      })
      .slice(0, 10);
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
    setOriginSearch(`${city.n} - ${city.u}`);
    setShowOriginDropdown(false);
  };

  const selectDest = (city: City) => {
    setDestCity(city);
    setDestSearch(`${city.n} - ${city.u}`);
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

    if (originCity.n === destCity.n && originCity.u === destCity.u) {
      setError('Selecione cidades diferentes');
      return;
    }

    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const distance = haversineDistance(originCity.lat, originCity.lon, destCity.lat, destCity.lon);
    setResult({
      distance: Math.round(distance),
      estimatedRoad: Math.round(distance * 1.3),
    });
    setCalculating(false);
  };

  const handleSwap = () => {
    setOriginCity(destCity);
    setOriginSearch(destCity ? `${destCity.n} - ${destCity.u}` : '');
    setDestCity(originCity);
    setDestSearch(originCity ? `${originCity.n} - ${originCity.u}` : '');
    setResult(null);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div ref={originRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cidade de Origem
              <span className="text-gray-400 font-normal ml-2">({cities.length} cidades)</span>
            </label>
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
                {filteredOrigin.map((city, idx) => (
                  <button
                    key={`${city.n}-${city.u}-${idx}`}
                    onClick={() => selectOrigin(city)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between"
                  >
                    <span>
                      <span className="font-medium">{highlightMatch(city.n, originSearch)}</span>
                      <span className="text-gray-400 ml-1 text-sm">- {city.u}</span>
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{city.u}</span>
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
                placeholder="Ex: Rio de Janeiro, Fortaleza, Manaus..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {destCity && (
                <span className="absolute right-3 top-3.5 text-green-500">✓</span>
              )}
            </div>
            {showDestDropdown && filteredDest.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {filteredDest.map((city, idx) => (
                  <button
                    key={`${city.n}-${city.u}-${idx}`}
                    onClick={() => selectDest(city)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between"
                  >
                    <span>
                      <span className="font-medium">{highlightMatch(city.n, destSearch)}</span>
                      <span className="text-gray-400 ml-1 text-sm">- {city.u}</span>
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{city.u}</span>
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
              <p className="text-lg font-bold text-gray-900">{originCity.n} - {originCity.u}</p>
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-12 bg-gray-300" />
                <span className="text-gray-400">→</span>
                <div className="h-px w-12 bg-gray-300" />
              </div>
              <p className="text-lg font-bold text-gray-900">{destCity.n} - {destCity.u}</p>
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

            {/* Tempo estimado de viagem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🚗</div>
                <p className="text-sm font-medium text-purple-700 mb-1">De Carro (80 km/h)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor(result.estimatedRoad / 80)}h {Math.round((result.estimatedRoad % 80) * 60 / 80)}min
                </p>
                <p className="text-sm text-purple-500 mt-1">tempo estimado</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🚌</div>
                <p className="text-sm font-medium text-orange-700 mb-1">De Ônibus (60 km/h)</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.floor(result.estimatedRoad / 60)}h {Math.round((result.estimatedRoad % 60) * 60 / 60)}min
                </p>
                <p className="text-sm text-orange-500 mt-1">tempo estimado</p>
              </div>
            </div>

            {/* Calculadora de combustível */}
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⛽ Calculadora de Combustível</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Consumo (km/l)</label>
                  <input
                    type="number"
                    value={consumo}
                    onChange={(e) => setConsumo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="1"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gasolina (R$/litro)</label>
                  <input
                    type="number"
                    value={precoGasolina}
                    onChange={(e) => setPrecoGasolina(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0.01"
                    step="0.10"
                  />
                </div>
              </div>
              {(() => {
                const consumoNum = parseFloat(consumo) || 10;
                const precoNum = parseFloat(precoGasolina) || 6;
                const litros = result.estimatedRoad / consumoNum;
                const custoTotal = litros * precoNum;
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-amber-600 mb-1">Litros Necessários</p>
                      <p className="text-xl font-bold text-amber-700">{litros.toFixed(1)}L</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-red-600 mb-1">Custo Total</p>
                      <p className="text-xl font-bold text-red-700">R$ {custoTotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Botão Google Maps */}
            <div className="mt-4">
              <a
                href={`https://maps.google.com/maps?saddr=${encodeURIComponent(originCity.n + ' - ' + originCity.u)}&daddr=${encodeURIComponent(destCity.n + ' - ' + destCity.u)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Ver rota no Google Maps
              </a>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>💡 Como calculamos:</strong> A distância em linha reta usa a fórmula de Haversine 
                com coordenadas oficiais do IBGE. A estimativa rodoviária aplica um fator de 1.3x.
              </p>
            </div>
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre a ferramenta</h2>
        <p>
          Esta ferramenta calcula a distância entre <strong>{cities.length} municípios brasileiros</strong> usando 
          coordenadas geográficas oficiais do IBGE. Basta digitar o nome da cidade ou UF para encontrá-la.
        </p>
      </article>
    </>
  );
}
