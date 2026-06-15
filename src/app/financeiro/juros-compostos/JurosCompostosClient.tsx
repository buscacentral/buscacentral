'use client';

import { useState, useMemo } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function JurosCompostosClient() {
  const [aporteInicial, setAporteInicial] = useState('1000');
  const [aporteMensal, setAporteMensal] = useState('200');
  const [taxaJuros, setTaxaJuros] = useState('1');
  const [tempo, setTempo] = useState('12');
  const [tipoTempo, setTipoTempo] = useState<'meses' | 'anos'>('meses');

  const resultado = useMemo(() => {
    const inicial = parseFloat(aporteInicial.replace(',', '.')) || 0;
    const mensal = parseFloat(aporteMensal.replace(',', '.')) || 0;
    const taxa = (parseFloat(taxaJuros.replace(',', '.')) || 0) / 100;
    const meses = tipoTempo === 'anos' ? (parseInt(tempo) || 0) * 12 : parseInt(tempo) || 0;

    if (meses === 0 || taxa === 0) return null;

    const pontos: { mes: number; total: number; investido: number; juros: number }[] = [];
    let saldo = inicial;
    let totalInvestido = inicial;

    for (let i = 1; i <= meses; i++) {
      saldo = saldo * (1 + taxa) + mensal;
      totalInvestido += mensal;
      const jurosAcumulados = saldo - totalInvestido;
      pontos.push({
        mes: i,
        total: saldo,
        investido: totalInvestido,
        juros: jurosAcumulados,
      });
    }

    const ultimoPonto = pontos[pontos.length - 1];
    return {
      montanteFinal: ultimoPonto.total,
      totalInvestido: ultimoPonto.investido,
      totalJuros: ultimoPonto.juros,
      pontos,
    };
  }, [aporteInicial, aporteMensal, taxaJuros, tempo, tipoTempo]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const maximoGrafico = resultado ? resultado.montanteFinal : 1;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aporte Inicial (R$)</label>
              <input
                type="text"
                value={aporteInicial}
                onChange={(e) => setAporteInicial(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aporte Mensal (R$)</label>
              <input
                type="text"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros (% ao mês)</label>
              <input
                type="text"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempo</label>
                <input
                  type="number"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTipoTempo('meses')}
                    className={`flex-1 sm:flex-none px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      tipoTempo === 'meses' ? 'bg-blue-600 text-white shadow-md scale-[1.02]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Meses
                  </button>
                  <button
                    onClick={() => setTipoTempo('anos')}
                    className={`flex-1 sm:flex-none px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      tipoTempo === 'anos' ? 'bg-blue-600 text-white shadow-md scale-[1.02]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Anos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {resultado ? (
            <ResultCard title="Projeção de Rendimento" className="h-full">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
                  <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">Montante Final</p>
                  <p className="text-4xl font-black text-green-700">{formatCurrency(resultado.montanteFinal)}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Investido</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(resultado.totalInvestido)}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total em Juros</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(resultado.totalJuros)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolução do Patrimônio</h3>
                  <div className="h-48 flex items-end gap-1">
                    {resultado.pontos.filter((_, i) => i % Math.max(1, Math.floor(resultado.pontos.length / 24)) === 0 || i === resultado.pontos.length - 1).map((ponto) => {
                      const altura = (ponto.total / maximoGrafico) * 100;
                      const alturaInvestido = (ponto.investido / maximoGrafico) * 100;
                      return (
                        <div key={ponto.mes} className="flex-1 flex flex-col items-center justify-end h-full group" title={`Mês ${ponto.mes}: ${formatCurrency(ponto.total)}`}>
                          <div className="w-full relative transition-all duration-300 group-hover:opacity-80" style={{ height: `${altura}%` }}>
                            <div className="absolute bottom-0 w-full bg-blue-200 rounded-b" style={{ height: `${(alturaInvestido / altura) * 100}%` }} />
                            <div className="absolute bottom-0 w-full bg-blue-500 rounded-t" style={{ height: '100%' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                    <span>Hoje</span>
                    <span>{tipoTempo === 'anos' ? `${tempo} anos` : `${tempo} meses`}</span>
                  </div>
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full">
              <EmptyState
                icon="📈"
                title="Simule seus investimentos"
                description="Preencha os valores ao lado para visualizar a mágica dos juros compostos atuando no seu patrimônio."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
