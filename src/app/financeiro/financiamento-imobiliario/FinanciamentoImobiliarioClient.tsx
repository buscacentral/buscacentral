'use client';

import { useState, useMemo } from 'react';
import { sanitizeNumber, calcularFinanciamento } from '@/lib/financiamento-logic';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const parseBRL = (v: string) => sanitizeNumber(v);

export default function FinanciamentoImobiliarioClient() {
  const [valorImovel, setValorImovel] = useState('400000');
  const [valorEntrada, setValorEntrada] = useState('80000');
  const [tipoEntrada, setTipoEntrada] = useState<'valor' | 'percentual'>('valor');
  const [anos, setAnos] = useState(30);
  const [taxaAnual, setTaxaAnual] = useState('11');
  const [sistema, setSistema] = useState<'price' | 'sac'>('sac');
  const [mostrarTabela, setMostrarTabela] = useState(false);

  const resultado = useMemo(() => {
    const imovel = parseBRL(valorImovel);
    let entrada = parseBRL(valorEntrada);
    if (tipoEntrada === 'percentual') {
      entrada = imovel * (entrada / 100);
    }
    const prazoMeses = anos * 12;

    const r = calcularFinanciamento({
      valorImovel: imovel,
      valorEntrada: entrada,
      prazoMeses,
      taxaJurosAnual: sanitizeNumber(taxaAnual),
    });

    if (!r.resumoPrice || !r.resumoSAC || r.valorFinanciado <= 0) return null;

    return { ...r, resumoPrice: r.resumoPrice, resumoSAC: r.resumoSAC, entradaCalculada: entrada, prazoMeses };
  }, [valorImovel, valorEntrada, tipoEntrada, anos, taxaAnual]);

  const resumoAtivo = sistema === 'price' ? resultado?.resumoPrice : resultado?.resumoSAC;
  const tabelaAtiva = sistema === 'price' ? resultado?.tabelaPrice : resultado?.tabelaSAC;

  const percentualEntrada = parseBRL(valorImovel) > 0
    ? ((resultado?.entradaCalculada ?? 0) / parseBRL(valorImovel)) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Entradas */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Financiamento</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Imóvel (R$)</label>
            <input
              type="text"
              value={valorImovel}
              onChange={(e) => setValorImovel(e.target.value)}
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
              {percentualEntrada.toFixed(1)}% do valor do imóvel
              {percentualEntrada < 20 && ' — bancos costumam exigir no mínimo 20%'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo: <span className="text-blue-600 font-bold">{anos} anos</span> ({anos * 12}x)
            </label>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={anos}
              onChange={(e) => setAnos(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span><span>15</span><span>25</span><span>35 anos</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros Anual (% a.a.)</label>
            <input
              type="text"
              value={taxaAnual}
              onChange={(e) => setTaxaAnual(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Taxas de financiamento imobiliário costumam ficar entre 9% e 12% ao ano.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sistema de Amortização</label>
            <div className="flex gap-2">
              {(['sac', 'price'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSistema(s)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    sistema === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s === 'sac' ? 'SAC' : 'Price'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {sistema === 'sac'
                ? 'SAC: parcelas começam mais altas e diminuem ao longo do tempo.'
                : 'Price: parcelas fixas do início ao fim.'}
            </p>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="space-y-4">
        {resultado && resumoAtivo ? (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resultado — {sistema === 'price' ? 'Price' : 'SAC'}
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Valor Financiado</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(resultado.valorFinanciado)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Entrada</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(resultado.entradaCalculada)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <dt className="text-gray-500">Primeira Parcela</dt>
                  <dd className="font-bold text-blue-700 text-lg">{formatCurrency(resumoAtivo.primeiraParcela)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Última Parcela</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(resumoAtivo.ultimaParcela)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Total Pago (com entrada)</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(resumoAtivo.totalPago + resultado.entradaCalculada)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-red-500">Total de Juros</dt>
                  <dd className="font-medium text-red-600">{formatCurrency(resumoAtivo.totalJuros)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparativo SAC vs Price</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 text-center border ${resultado.melhorSistema === 'sac' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-sm text-gray-500 mb-1">SAC</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(resultado.resumoSAC.totalPago)}</p>
                  <p className="text-xs text-gray-400 mt-1">Juros: {formatCurrency(resultado.resumoSAC.totalJuros)}</p>
                  {resultado.melhorSistema === 'sac' && <p className="text-xs text-green-600 font-semibold mt-2">Paga menos juros</p>}
                </div>
                <div className={`rounded-lg p-4 text-center border ${resultado.melhorSistema === 'price' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(resultado.resumoPrice.totalPago)}</p>
                  <p className="text-xs text-gray-400 mt-1">Juros: {formatCurrency(resultado.resumoPrice.totalJuros)}</p>
                  {resultado.melhorSistema === 'price' && <p className="text-xs text-green-600 font-semibold mt-2">Paga menos juros</p>}
                </div>
              </div>
              {resultado.melhorSistema !== 'empate' && (
                <p className="text-center text-sm text-green-700 font-medium mt-3">
                  Economia de {formatCurrency(resultado.economia)} em juros com o sistema {resultado.melhorSistema === 'sac' ? 'SAC' : 'Price'}
                </p>
              )}
            </div>

            <Button
              onClick={() => setMostrarTabela(!mostrarTabela)}
              variant="outline"
              fullWidth
              className="mt-2"
              leftIcon={<span className={`transition-transform duration-300 inline-block ${mostrarTabela ? 'rotate-180' : ''}`}>⬇️</span>}
            >
              {mostrarTabela ? 'Ocultar' : 'Mostrar'} Tabela de Amortização
            </Button>

            {mostrarTabela && tabelaAtiva && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm overflow-x-auto mt-2">
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

            <p className="text-xs text-gray-400 text-center mt-4">
              Simulação para fins informativos. As condições reais variam conforme o banco, seu perfil de crédito e taxas/seguros obrigatórios (que não estão incluídos aqui).
            </p>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <EmptyState
              icon="🏠"
              title="Pronto para simular"
              description="Preencha o valor do imóvel, a entrada e a taxa para comparar SAC e Price."
            />
          </div>
        )}
      </div>
    </div>
  );
}
