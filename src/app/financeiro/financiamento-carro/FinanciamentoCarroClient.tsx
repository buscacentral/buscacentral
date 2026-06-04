'use client';

import { useState, useMemo } from 'react';

const parseBRL = (v: string) => parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Parcela {
  numero: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
}

function calcularPrice(financiado: number, taxa: number, parcelas: number): Parcela[] {
  if (financiado <= 0 || taxa <= 0 || parcelas <= 0) return [];
  const i = taxa / 100;
  const pmt = financiado * (i * Math.pow(1 + i, parcelas)) / (Math.pow(1 + i, parcelas) - 1);
  const tabela: Parcela[] = [];
  let saldo = financiado;

  for (let n = 1; n <= parcelas; n++) {
    const juros = saldo * i;
    const amortizacao = pmt - juros;
    saldo -= amortizacao;
    tabela.push({
      numero: n,
      parcela: pmt,
      juros,
      amortizacao,
      saldoDevedor: Math.max(saldo, 0),
    });
  }
  return tabela;
}

function calcularSAC(financiado: number, taxa: number, parcelas: number): Parcela[] {
  if (financiado <= 0 || taxa <= 0 || parcelas <= 0) return [];
  const i = taxa / 100;
  const amortizacaoConst = financiado / parcelas;
  const tabela: Parcela[] = [];
  let saldo = financiado;

  for (let n = 1; n <= parcelas; n++) {
    const juros = saldo * i;
    const parcela = amortizacaoConst + juros;
    saldo -= amortizacaoConst;
    tabela.push({
      numero: n,
      parcela,
      juros,
      amortizacao: amortizacaoConst,
      saldoDevedor: Math.max(saldo, 0),
    });
  }
  return tabela;
}

function resumo(tabela: Parcela[]) {
  if (tabela.length === 0) return null;
  const totalPago = tabela.reduce((s, p) => s + p.parcela, 0);
  const totalJuros = tabela.reduce((s, p) => s + p.juros, 0);
  return {
    primeira: tabela[0].parcela,
    ultima: tabela[tabela.length - 1].parcela,
    totalPago,
    totalJuros,
  };
}

export default function FinanciamentoCarroClient() {
  const [valorVeiculo, setValorVeiculo] = useState('80000');
  const [valorEntrada, setValorEntrada] = useState('20000');
  const [tipoEntrada, setTipoEntrada] = useState<'valor' | 'percentual'>('valor');
  const [parcelas, setParcelas] = useState(48);
  const [taxa, setTaxa] = useState('1.5');
  const [sistema, setSistema] = useState<'price' | 'sac'>('price');
  const [mostrarTabela, setMostrarTabela] = useState(false);

  const resultado = useMemo(() => {
    const veiculo = parseBRL(valorVeiculo);
    let entrada = parseBRL(valorEntrada);
    if (tipoEntrada === 'percentual') {
      entrada = veiculo * (entrada / 100);
    }
    const financiado = Math.max(veiculo - entrada, 0);
    const t = parseFloat(taxa.replace(',', '.')) || 0;

    if (financiado <= 0 || t <= 0 || parcelas <= 0) return null;

    const tabelaPrice = calcularPrice(financiado, t, parcelas);
    const tabelaSAC = calcularSAC(financiado, t, parcelas);
    const resumoPrice = resumo(tabelaPrice);
    const resumoSAC = resumo(tabelaSAC);

    if (!resumoPrice || !resumoSAC) return null;

    const economia = resumoPrice.totalPago - resumoSAC.totalPago;
    const melhor = economia > 0 ? 'sac' : 'price';
    const cetPrice = ((resumoPrice.totalPago / financiado) - 1) * 100;
    const cetSAC = ((resumoSAC.totalPago / financiado) - 1) * 100;

    return {
      financiado,
      entrada,
      tabelaPrice,
      tabelaSAC,
      resumoPrice,
      resumoSAC,
      economia: Math.abs(economia),
      melhor,
      cetPrice,
      cetSAC,
    };
  }, [valorVeiculo, valorEntrada, tipoEntrada, parcelas, taxa]);

  const tabelaAtiva = sistema === 'price' ? resultado?.tabelaPrice : resultado?.tabelaSAC;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Financiamento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Veículo (R$)</label>
              <input
                type="text"
                value={valorVeiculo}
                onChange={(e) => setValorVeiculo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entrada</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setTipoEntrada(tipoEntrada === 'valor' ? 'percentual' : 'valor')}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  {tipoEntrada === 'valor' ? 'R$' : '%'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {tipoEntrada === 'valor'
                  ? `(${((parseBRL(valorEntrada) / (parseBRL(valorVeiculo) || 1)) * 100).toFixed(1)}% do veículo)`
                  : `(R$ ${((parseBRL(valorVeiculo) * parseBRL(valorEntrada)) / 100).toLocaleString('pt-BR')})`
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parcelas: <span className="text-blue-600 font-bold">{parcelas}x</span>
              </label>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={parcelas}
                onChange={(e) => setParcelas(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>12</span><span>24</span><span>36</span><span>48</span><span>60</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros Mensal (%)</label>
              <input
                type="text"
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sistema de Amortização</label>
              <div className="flex gap-2">
                {(['price', 'sac'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSistema(s)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      sistema === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'price' ? 'Price' : 'SAC'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {resultado ? (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultado — {sistema === 'price' ? 'Price' : 'SAC'}
                </h2>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Valor Financiado</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(resultado.financiado)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Entrada</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(resultado.entrada)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="text-gray-500">Primeira Parcela</dt>
                    <dd className="font-bold text-blue-700 text-lg">
                      {formatCurrency(sistema === 'price' ? resultado.resumoPrice.primeira : resultado.resumoSAC.primeira)}
                    </dd>
                  </div>
                  {sistema === 'sac' && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Última Parcela</dt>
                      <dd className="font-medium text-gray-900">{formatCurrency(resultado.resumoSAC.ultima)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Pago</dt>
                    <dd className="font-medium text-gray-900">
                      {formatCurrency(sistema === 'price' ? resultado.resumoPrice.totalPago : resultado.resumoSAC.totalPago)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">Total de Juros</dt>
                    <dd className="font-medium text-red-600">
                      {formatCurrency(sistema === 'price' ? resultado.resumoPrice.totalJuros : resultado.resumoSAC.totalJuros)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">CET Estimado</dt>
                    <dd className="font-medium text-gray-900">
                      {(sistema === 'price' ? resultado.cetPrice : resultado.cetSAC).toFixed(1)}%
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparativo Price vs SAC</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-lg p-4 text-center border ${resultado.melhor === 'price' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(resultado.resumoPrice.totalPago)}</p>
                    <p className="text-xs text-gray-400 mt-1">Juros: {formatCurrency(resultado.resumoPrice.totalJuros)}</p>
                    {resultado.melhor === 'price' && <p className="text-xs text-green-600 font-semibold mt-2">Economiza mais</p>}
                  </div>
                  <div className={`rounded-lg p-4 text-center border ${resultado.melhor === 'sac' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-500 mb-1">SAC</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(resultado.resumoSAC.totalPago)}</p>
                    <p className="text-xs text-gray-400 mt-1">Juros: {formatCurrency(resultado.resumoSAC.totalJuros)}</p>
                    {resultado.melhor === 'sac' && <p className="text-xs text-green-600 font-semibold mt-2">Economiza mais</p>}
                  </div>
                </div>
                <p className="text-center text-sm text-green-700 font-medium mt-3">
                  Economia de {formatCurrency(resultado.economia)} com {resultado.melhor === 'sac' ? 'SAC' : 'Price'}
                </p>
              </div>

              <button
                onClick={() => setMostrarTabela(!mostrarTabela)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {mostrarTabela ? 'Ocultar' : 'Mostrar'} Tabela de Amortização
              </button>

              {mostrarTabela && tabelaAtiva && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-500 font-medium">Nº</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Parcela</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Juros</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Amort.</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabelaAtiva.map((p) => (
                        <tr key={p.numero} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 px-2 text-gray-700">{p.numero}</td>
                          <td className="py-2 px-2 text-right text-gray-900 font-mono">{formatCurrency(p.parcela)}</td>
                          <td className="py-2 px-2 text-right text-red-600 font-mono">{formatCurrency(p.juros)}</td>
                          <td className="py-2 px-2 text-right text-green-700 font-mono">{formatCurrency(p.amortizacao)}</td>
                          <td className="py-2 px-2 text-right text-gray-500 font-mono">{formatCurrency(p.saldoDevedor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center">
                Simulação para fins informativos. Condições reais variam conforme a instituição financeira.
              </p>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-center py-8">Preencha os dados para ver o resultado.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
