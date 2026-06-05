'use client';

import { useState, useEffect, useCallback } from 'react';
import { buscarClima, traduzirCodigoTempo, type DadosClima } from '@/lib/clima-logic';

interface Cidade {
  nome: string;
  lat: number;
  lng: number;
}

const CIDADES: Cidade[] = [
  { nome: 'Uberaba, MG', lat: -19.7476, lng: -47.9392 },
  { nome: 'São Paulo, SP', lat: -23.5505, lng: -46.6333 },
  { nome: 'Rio de Janeiro, RJ', lat: -22.9068, lng: -43.1729 },
  { nome: 'Belo Horizonte, MG', lat: -19.9167, lng: -43.9345 },
  { nome: 'Brasília, DF', lat: -15.7975, lng: -47.8919 },
  { nome: 'Curitiba, PR', lat: -25.4284, lng: -49.2733 },
  { nome: 'Salvador, BA', lat: -12.9714, lng: -38.5124 },
  { nome: 'Manaus, AM', lat: -3.119, lng: -60.0217 },
];

export default function ClimaClient() {
  const [cidadeIdx, setCidadeIdx] = useState(0);
  const [dados, setDados] = useState<DadosClima | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const cidade = CIDADES[cidadeIdx];

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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Seletor de cidade */}
      <div className="mb-6">
        <label className="block text-sm md:text-base font-bold text-slate-800 mb-2">
          Selecione uma cidade
        </label>
        <div className="flex flex-wrap gap-2">
          {CIDADES.map((c, idx) => (
            <button
              key={c.nome}
              onClick={() => setCidadeIdx(idx)}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
                cidadeIdx === idx
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      {carregando ? (
        <div className="text-center py-12">
          <p className="text-base text-slate-500">Consultando clima de {cidade.nome}...</p>
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
            <h3 className="text-lg md:text-xl font-bold text-slate-900">{cidade.nome}</h3>
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
