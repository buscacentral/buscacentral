'use client';

import { useState, useEffect } from 'react';

interface VehicleType {
  codigo: string;
  nome: string;
}

interface Brand {
  codigo: string;
  nome: string;
}

interface Model {
  codigo: string;
  nome: string;
}

interface Year {
  codigo: string;
  nome: string;
}

interface FipeResult {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

const vehicleTypes: VehicleType[] = [
  { codigo: 'carros', nome: 'Carros' },
  { codigo: 'motos', nome: 'Motos' },
  { codigo: 'caminhoes', nome: 'Caminhões' },
];

const API_BASE = 'https://parallelum.com.br/fipe/api/v1';

export default function TabelaFipeClient() {
  const [vehicleType, setVehicleType] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [result, setResult] = useState<FipeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    setError('');
    setBrands([]);
    setModels([]);
    setYears([]);
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/${vehicleType}/marcas`);
      const data = await res.json();
      setBrands(data);
    } catch {
      setError('Erro ao buscar marcas');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    setLoading(true);
    setError('');
    setModels([]);
    setYears([]);
    setSelectedModel('');
    setSelectedYear('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos`);
      const data = await res.json();
      setModels(data.modelos || []);
    } catch {
      setError('Erro ao buscar modelos');
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    setLoading(true);
    setError('');
    setYears([]);
    setSelectedYear('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos`);
      const data = await res.json();
      setYears(data);
    } catch {
      setError('Erro ao buscar anos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleType) {
      fetchBrands();
    }
  }, [vehicleType]);

  useEffect(() => {
    if (vehicleType && selectedBrand) {
      fetchModels();
    }
  }, [selectedBrand, vehicleType]);

  useEffect(() => {
    if (vehicleType && selectedBrand && selectedModel) {
      fetchYears();
    }
  }, [selectedModel, selectedBrand, vehicleType]);

  const fetchPrice = async () => {
    if (!selectedYear) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(
        `${API_BASE}/${vehicleType}/marcas/${selectedBrand}/modelos/${selectedModel}/anos/${selectedYear}`
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Erro ao buscar preço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Veículo</label>
            <div className="grid grid-cols-3 gap-3">
              {vehicleTypes.map((type) => (
                <button
                  key={type.codigo}
                  onClick={() => setVehicleType(type.codigo)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    vehicleType === type.codigo
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.nome}
                </button>
              ))}
            </div>
          </div>

          {vehicleType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione uma marca</option>
                {brands.map((brand) => (
                  <option key={brand.codigo} value={brand.codigo}>
                    {brand.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedBrand && models.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione um modelo</option>
                {models.map((model) => (
                  <option key={model.codigo} value={model.codigo}>
                    {model.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedModel && years.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione o ano</option>
                {years.map((year) => (
                  <option key={year.codigo} value={year.codigo}>
                    {year.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedYear && (
            <button
              onClick={fetchPrice}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Consultando...' : 'Consultar Preço'}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{result.Marca} {result.Modelo}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Preço Médio</p>
                <p className="text-3xl font-bold text-green-600">{result.Valor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ano Modelo</p>
                <p className="text-xl font-semibold">{result.AnoModelo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Combustível</p>
                <p className="font-medium">{result.Combustivel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Código FIPE</p>
                <p className="font-mono font-medium">{result.CodigoFipe}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Referência: {result.MesReferencia}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
