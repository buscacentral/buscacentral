'use client';

import { useState, useMemo } from 'react';

const parseBRL = (v: string) => parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatPercent = (v: number) => v.toFixed(2).replace('.', ',') + '%';

function aliquotaIR(dias: number): number {
  if (dias <= 180) return 0.225;
  if (dias <= 360) return 0.20;
  if (dias <= 720) return 0.175;
  return 0.15;
}

function calcularEvolucao(
  inicial: number,
  aporte: number,
  meses: number,
  taxaMensal: number,
): number[] {
  const valores: number[] = [inicial];
  let saldo = inicial;
  for (let i = 1; i <= meses; i++) {
    saldo = saldo * (1 + taxaMensal) + aporte;
    valores.push(saldo);
  }
  return valores;
}

interface ResultadoInvestimento {
  nome: string;
  icon: string;
  cor: string;
  valorBruto: number;
  ir: number;
  valorLiquido: number;
  rendimentoLiquido: number;
  rendimentoPercentual: number;
  evolucao: number[];
}

export default function SimuladorInvestimentosClient() {
  const [valorInicial, setValorInicial] = useState('10000');
  const [aporteMensal, setAporteMensal] = useState('500');
  const [meses, setMeses] = useState(24);
  const [taxaCDI, setTaxaCDI] = useState('10.5');
  const [percentCDB, setPercentCDB] = useState('110');
  const [taxaSelic, setTaxaSelic] = useState('10.5');

  const resultado = useMemo(() => {
    const inicial = parseBRL(valorInicial);
    const aporte = parseBRL(aporteMensal);
    const cdiAnual = parseFloat(taxaCDI.replace(',', '.')) / 100;
    const selicAnual = parseFloat(taxaSelic.replace(',', '.')) / 100;
    const cdbPercent = parseFloat(percentCDB.replace(',', '.')) / 100;

    if (inicial <= 0 || meses <= 0) return null;

    const dias = meses * 30;
    const aliq = aliquotaIR(dias);
    const totalInvestido = inicial + aporte * meses;

    const selicMensal = Math.pow(1 + selicAnual, 1 / 12) - 1;
    const cdbMensal = Math.pow(1 + cdiAnual * cdbPercent, 1 / 12) - 1;
    const poupancaMensal = selicAnual * 0.7 / 12;

    const evolCDB = calcularEvolucao(inicial, aporte, meses, cdbMensal);
    const evolSelic = calcularEvolucao(inicial, aporte, meses, selicMensal);
    const evolPoup = calcularEvolucao(inicial, aporte, meses, poupancaMensal);

    const brutoCDB = evolCDB[evolCDB.length - 1];
    const brutoSelic = evolSelic[evolSelic.length - 1];
    const brutoPoup = evolPoup[evolPoup.length - 1];

    const rendCDB = brutoCDB - totalInvestido;
    const rendSelic = brutoSelic - totalInvestido;

    const irCDB = rendCDB * aliq;
    const irSelic = rendSelic * aliq;

    const liqCDB = brutoCDB - irCDB;
    const liqSelic = brutoSelic - irSelic;
    const liqPoup = brutoPoup;

    const resCDB: ResultadoInvestimento = {
      nome: 'CDB', icon: '🏦', cor: 'blue',
      valorBruto: brutoCDB, ir: irCDB, valorLiquido: liqCDB,
      rendimentoLiquido: liqCDB - totalInvestido,
      rendimentoPercentual: ((liqCDB - totalInvestido) / totalInvestido) * 100,
      evolucao: evolCDB,
    };
    const resSelic: ResultadoInvestimento = {
      nome: 'Tesouro Selic', icon: '🏛️', cor: 'green',
      valorBruto: brutoSelic, ir: irSelic, valorLiquido: liqSelic,
      rendimentoLiquido: liqSelic - totalInvestido,
      rendimentoPercentual: ((liqSelic - totalInvestido) / totalInvestido) * 100,
      evolucao: evolSelic,
    };
    const resPoup: ResultadoInvestimento = {
      nome: 'Poupança', icon: '🐷', cor: 'orange',
      valorBruto: brutoPoup, ir: 0, valorLiquido: liqPoup,
      rendimentoLiquido: liqPoup - totalInvestido,
      rendimentoPercentual: ((liqPoup - totalInvestido) / totalInvestido) * 100,
      evolucao: evolPoup,
    };

    const todos = [resCDB, resSelic, resPoup];
    const vencedor = todos.reduce((a, b) => a.valorLiquido > b.valorLiquido ? a : b);

    return { investimentos: todos, vencedor, totalInvestido, meses, dias, aliq };
  }, [valorInicial, aporteMensal, meses, taxaCDI, percentCDB, taxaSelic]);

  const maxGrafico = resultado ? Math.max(...resultado.investimentos.map(i => Math.max(...i.evolucao))) : 1;
  const cores = { blue: '#3b82f6', green: '#22c55e', orange: '#f97316' };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="valor-inicial" className="block text-sm font-medium text-gray-700 mb-1">Valor Inicial (R$)</label>
              <input id="valor-inicial" type="text" value={valorInicial} onChange={(e) => setValorInicial(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="aporte-mensal" className="block text-sm font-medium text-gray-700 mb-1">Aporte Mensal (R$)</label>
              <input id="aporte-mensal" type="text" value={aporteMensal} onChange={(e) => setAporteMensal(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="periodo-meses" className="block text-sm font-medium text-gray-700 mb-1">
                Período: <span className="text-blue-600 font-bold">{meses} meses ({(meses / 12).toFixed(1)} anos)</span>
              </label>
              <input id="periodo-meses" type="range" min="1" max="360" value={meses} onChange={(e) => setMeses(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 mês</span><span>10 anos</span><span>20 anos</span><span>30 anos</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="taxa-cdi" className="block text-sm font-medium text-gray-700 mb-1">CDI Anual (%)</label>
                <input id="taxa-cdi" type="text" value={taxaCDI} onChange={(e) => setTaxaCDI(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="percent-cdb" className="block text-sm font-medium text-gray-700 mb-1">CDB (% do CDI)</label>
                <input id="percent-cdb" type="text" value={percentCDB} onChange={(e) => setPercentCDB(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="taxa-selic" className="block text-sm font-medium text-gray-700 mb-1">SELIC Anual (%)</label>
              <input id="taxa-selic" type="text" value={taxaSelic} onChange={(e) => setTaxaSelic(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Poupança: {(parseFloat(taxaSelic.replace(',', '.')) * 0.7).toFixed(1)}% a.a. (70% SELIC)</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          {resultado ? (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparativo</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  {resultado.investimentos.map((inv) => {
                    const isVencedor = inv.nome === resultado.vencedor.nome;
                    return (
                      <div key={inv.nome} className={`rounded-xl p-4 text-center border flex-1 min-w-[140px] ${isVencedor ? 'bg-green-50 border-green-300 ring-2 ring-green-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-2xl mb-1">{inv.icon}</p>
                        <p className="text-sm font-semibold text-gray-500 mb-2 leading-tight break-words">{inv.nome}</p>
                        <p className="text-lg font-bold text-gray-900 break-words">{formatCurrency(inv.valorLiquido)}</p>
                        <p className={`text-xs font-medium mt-1 break-words ${inv.rendimentoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(inv.rendimentoLiquido)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatPercent(inv.rendimentoPercentual)}</p>
                        {isVencedor && <p className="text-xs text-green-600 font-bold mt-2">VENCEDOR</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Evolução</h2>
                <div className="h-48 relative">
                  {resultado.investimentos.map((inv) => (
                    <svg key={inv.nome} className="absolute inset-0 w-full h-full" viewBox={`0 0 ${resultado.meses} 100`} preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke={cores[inv.cor as keyof typeof cores]}
                        strokeWidth="2"
                        points={inv.evolucao.map((v, i) => `${i},${100 - ((v - resultado.totalInvestido) / (maxGrafico - resultado.totalInvestido)) * 95}`).join(' ')}
                      />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {resultado.investimentos.map((inv) => (
                    <div key={inv.nome} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: cores[inv.cor as keyof typeof cores] }} />
                      <span className="text-xs text-gray-500">{inv.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium"></th>
                        {resultado.investimentos.map((inv) => (
                          <th key={inv.nome} className="text-right py-2 text-gray-500 font-medium whitespace-nowrap px-2">{inv.nome}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-50">
                        <td className="py-3 text-gray-500 whitespace-nowrap">Investido</td>
                        {resultado.investimentos.map((inv) => (
                          <td key={inv.nome} className="py-3 px-2 text-right text-gray-900 font-mono whitespace-nowrap">{formatCurrency(resultado.totalInvestido)}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-3 text-gray-500 whitespace-nowrap">Bruto</td>
                        {resultado.investimentos.map((inv) => (
                          <td key={inv.nome} className="py-3 px-2 text-right text-gray-900 font-mono whitespace-nowrap">{formatCurrency(inv.valorBruto)}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-3 text-red-500 whitespace-nowrap">IR</td>
                        {resultado.investimentos.map((inv) => (
                          <td key={inv.nome} className="py-3 px-2 text-right text-red-600 font-mono whitespace-nowrap">{inv.ir > 0 ? `- ${formatCurrency(inv.ir)}` : '—'}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200 font-bold">
                        <td className="py-3 text-gray-900 whitespace-nowrap">Líquido</td>
                        {resultado.investimentos.map((inv) => (
                          <td key={inv.nome} className={`py-3 px-2 text-right font-mono whitespace-nowrap ${inv.nome === resultado.vencedor.nome ? 'text-green-700' : 'text-gray-900'}`}>{formatCurrency(inv.valorLiquido)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500 whitespace-nowrap">Rendimento</td>
                        {resultado.investimentos.map((inv) => (
                          <td key={inv.nome} className={`py-3 px-2 text-right font-medium whitespace-nowrap ${inv.rendimentoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercent(inv.rendimentoPercentual)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Simulação para fins educativos. Não constitui recomendação de investimento.
              </p>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-center py-8">Preencha os parâmetros para ver o resultado.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
