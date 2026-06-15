'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';

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

  const fetchBrands = useCallback(async () => {
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
  }, [vehicleType]);

  const fetchModels = useCallback(async () => {
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
  }, [vehicleType, selectedBrand]);

  const fetchYears = useCallback(async () => {
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
  }, [vehicleType, selectedBrand, selectedModel]);

  useEffect(() => {
    if (vehicleType) {
      const initFetch = async () => {
        await Promise.resolve();
        fetchBrands();
      };
      initFetch();
    }
  }, [vehicleType, fetchBrands]);

  useEffect(() => {
    if (vehicleType && selectedBrand) {
      const initFetch = async () => {
        await Promise.resolve();
        fetchModels();
      };
      initFetch();
    }
  }, [selectedBrand, vehicleType, fetchModels]);

  useEffect(() => {
    if (vehicleType && selectedBrand && selectedModel) {
      const initFetch = async () => {
        await Promise.resolve();
        fetchYears();
      };
      initFetch();
    }
  }, [selectedModel, selectedBrand, vehicleType, fetchYears]);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Dados do Veículo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Veículo</label>
              <div className="grid grid-cols-3 gap-2">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.codigo}
                    onClick={() => setVehicleType(type.codigo)}
                    className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-colors ${
                      vehicleType === type.codigo
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type.nome}
                  </button>
                ))}
              </div>
            </div>

            {vehicleType && (
              <div>
                <label htmlFor="marca-select" className="block text-sm font-medium text-slate-700 mb-2">Marca</label>
                <select
                  id="marca-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
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
                <label htmlFor="modelo-select" className="block text-sm font-medium text-slate-700 mb-2">Modelo</label>
                <select
                  id="modelo-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
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
                <label htmlFor="ano-select" className="block text-sm font-medium text-slate-700 mb-2">Ano</label>
                <select
                  id="ano-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
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
              <Button
                onClick={fetchPrice}
                disabled={loading}
                isLoading={loading}
                fullWidth
              >
                Consultar Preço
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert
            variant="error"
            title="Erro"
          >{error}</Alert>
        )}
      </div>

      <div className="lg:col-span-7">
        {result ? (
          <ResultCard title="Resultado da Tabela FIPE">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{result.Marca} {result.Modelo}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Preço Médio</p>
                <p className="text-3xl font-black text-emerald-600">{result.Valor}</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ano Modelo</p>
                <p className="text-2xl font-bold text-slate-800">{result.AnoModelo}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Combustível</p>
                <p className="text-lg font-semibold text-slate-700">{result.Combustivel}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Código FIPE</p>
                <p className="text-lg font-mono font-medium text-slate-700">{result.CodigoFipe}</p>
              </div>
            </div>
            
            <div className="bg-sky-50 text-sky-800 p-4 rounded-xl text-sm font-medium">
              🗓 Mês de Referência: {result.MesReferencia}
            </div>
          </ResultCard>
        ) : (
          <div className="h-full flex items-center justify-center min-h-[300px]">
             <EmptyState
                icon="🚗"
                title="Consulte um Veículo"
                description="Selecione o tipo, marca, modelo e ano para ver o valor da Tabela FIPE atualizado."
             />
          </div>
        )}
      </div>
    </div>
  );
}
