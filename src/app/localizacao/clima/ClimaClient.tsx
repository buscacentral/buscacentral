'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { buscarClima, traduzirCodigoTempo, type DadosClima } from '@/lib/clima-logic';

interface Cidade {
  nome: string;
  lat: number;
  lng: number;
  admin1?: string;
}

const CIDADES_PADRAO: Cidade[] = [
  { nome: 'Uberaba', lat: -19.7476, lng: -47.9392, admin1: 'MG' },
  { nome: 'São Paulo', lat: -23.5505, lng: -46.6333, admin1: 'SP' },
  { nome: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, admin1: 'RJ' },
  { nome: 'Belo Horizonte', lat: -19.9167, lng: -43.9345, admin1: 'MG' },
  { nome: 'Brasília', lat: -15.7975, lng: -47.8919, admin1: 'DF' },
  { nome: 'Curitiba', lat: -25.4284, lng: -49.2733, admin1: 'PR' },
  { nome: 'Salvador', lat: -12.9714, lng: -38.5124, admin1: 'BA' },
  { nome: 'Manaus', lat: -3.119, lng: -60.0217, admin1: 'AM' },
];

function formatCidadeNome(c: Cidade): string {
  return c.admin1 ? `${c.nome}, ${c.admin1}` : c.nome;
}

export default function ClimaClient() {
  const [cidade, setCidade] = useState<Cidade>(CIDADES_PADRAO[0]);
  const [dados, setDados] = useState<DadosClima | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<Cidade[]>([]);
  const [buscandoCidade, setBuscandoCidade] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Busca cidades via API Open-Meteo Geocoding
  const buscarCidades = useCallback(async (termo: string) => {
    if (termo.length < 2) {
      setResultados([]);
      setDropdownAberto(false);
      return;
    }

    setBuscandoCidade(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(termo)}&count=6&language=pt`
      );
      const data = await res.json();

      if (data.results) {
        const cidades: Cidade[] = data.results.map((r: Record<string, unknown>) => ({
          nome: String(r.name),
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          admin1: r.admin1 ? String(r.admin1) : undefined,
        }));
        setResultados(cidades);
        setDropdownAberto(cidades.length > 0);
      } else {
        setResultados([]);
        setDropdownAberto(false);
      }
    } catch {
      setResultados([]);
    } finally {
      setBuscandoCidade(false);
    }
  }, []);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarCidades(busca);
    }, 400);
    return () => clearTimeout(timer);
  }, [busca, buscarCidades]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Busca clima sempre que a cidade muda
  const fetchClima = useCallback(async () => {
    setCarregando(true);
    setErro('');
    setDados(null);

    const res = await buscarClima(cidade.lat, cidade.lng);
    if (res) {
      setDados(res);
    } else {
      setErro('Não foi possível obter os dados climáticos. Tente novamente.');
    }
    setCarregando(false);
  }, [cidade]);

  useEffect(() => {
    fetchClima();
  }, [fetchClima]);

  const selecionarCidade = (c: Cidade) => {
    setCidade(c);
    setBusca('');
    setResultados([]);
    setDropdownAberto(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Campo de busca de cidade */}
      <div className="mb-6" ref={dropdownRef}>
        <label className="block text-sm md:text-base font-bold text-slate-800 mb-2">
          Busque sua cidade
        </label>
        <div className="relative">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onFocus={() => resultados.length > 0 && setDropdownAberto(true)}
            placeholder="Digite o nome da sua cidade..."
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-base md:text-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
          {buscandoCidade && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Buscando...</span>
          )}

          {/* Dropdown de resultados */}
          {dropdownAberto && resultados.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
              {resultados.map((c, idx) => (
                <button
                  key={`${c.nome}-${c.lat}-${idx}`}
                  onClick={() => selecionarCidade(c)}
                  className="w-full text-left px-4 py-3 hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between"
                >
                  <span className="text-base font-medium text-slate-800">{c.nome}</span>
                  <span className="text-sm text-slate-400">{c.admin1 || ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cidades rápidas */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">Ou selecione uma cidade popular:</p>
        <div className="flex flex-wrap gap-2">
          {CIDADES_PADRAO.map((c) => (
            <button
              key={c.nome}
              onClick={() => selecionarCidade(c)}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
                cidade.nome === c.nome && cidade.lat === c.lat
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {formatCidadeNome(c)}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      {carregando ? (
        <div className="text-center py-12">
          <p className="text-base text-slate-500">Consultando clima de {formatCidadeNome(cidade)}...</p>
        </div>
      ) : erro ? (
        <div className="text-center py-12">
          <p className="text-base text-rose-600 font-medium">{erro}</p>
          <button
            onClick={fetchClima}
            className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : dados ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">{formatCidadeNome(cidade)}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black text-slate-950">
                {dados.temperaturaAtual}°C
              </span>
              <span className="text-lg md:text-xl font-semibold text-sky-600">
                {traduzirCodigoTempo(dados.codigoTempo)}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-sm md:text-base text-slate-600">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Umidade Relativa:</span>
              <strong className="text-slate-900">{dados.umidade}%</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Velocidade do Vento:</span>
              <strong className="text-slate-900">{dados.velocidadeVento} km/h</strong>
            </div>
            <div className="flex justify-between">
              <span>Condição:</span>
              <strong className="text-slate-900">{traduzirCodigoTempo(dados.codigoTempo)}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
