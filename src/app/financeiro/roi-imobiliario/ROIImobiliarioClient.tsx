'use client';

import { useState, useMemo } from 'react';
import { calcularROIImobiliario, sanitizeNumber } from '@/lib/roi-imobiliario-logic';
import { formatCurrency } from '@/lib/formatters';
import { ResultCard } from '@/components/ui/ResultCard';

export default function ROIImobiliarioClient() {
  const [valorCompra, setValorCompra] = useState('350000');
  const [custosIniciais, setCustosIniciais] = useState('25000');
  const [valorAluguel, setValorAluguel] = useState('1800');
  const [custosMensais, setCustosMensais] = useState('150');
  const [valorizacao, setValorizacao] = useState('5.5');

  const resultado = useMemo(() => {
    return calcularROIImobiliario({
      valorCompra: sanitizeNumber(valorCompra),
      custosIniciais: sanitizeNumber(custosIniciais),
      valorAluguelMensal: sanitizeNumber(valorAluguel),
      custosMensaisObra: sanitizeNumber(custosMensais),
      valorizacaoAnualPrevia: sanitizeNumber(valorizacao),
    });
  }, [valorCompra, custosIniciais, valorAluguel, custosMensais, valorizacao]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Formulário */}
      <section className="space-y-4 lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
          Aporte e Custos
        </h2>

        <div>
          <label className="block text-sm md:text-base font-bold text-slate-800 mb-1">
            Valor de Compra do Imóvel (R$)
          </label>
          <input
            type="text"
            value={valorCompra}
            onChange={(e) => setValorCompra(e.target.value)}
            placeholder="350000"
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-bold text-slate-800 mb-1">
            Custos Iniciais (ITBI, Escritura, Reforma)
          </label>
          <input
            type="text"
            value={custosIniciais}
            onChange={(e) => setCustosIniciais(e.target.value)}
            placeholder="25000"
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm md:text-base font-bold text-slate-800 mb-1">
              Aluguel Mensal (R$)
            </label>
            <input
              type="text"
              value={valorAluguel}
              onChange={(e) => setValorAluguel(e.target.value)}
              placeholder="1800"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-bold text-slate-800 mb-1">
              Taxas/Custos (Mês)
            </label>
            <input
              type="text"
              value={custosMensais}
              onChange={(e) => setCustosMensais(e.target.value)}
              placeholder="150"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm md:text-base font-bold text-slate-800 mb-1">
            Estimativa de Valorização Anual (%)
          </label>
          <input
            type="text"
            value={valorizacao}
            onChange={(e) => setValorizacao(e.target.value)}
            placeholder="5.5"
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
        </div>
      </section>

      {/* Resultados */}
      <section className="lg:col-span-2">
        <ResultCard title="Desempenho Estimado" className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Cap Rate Anual (Líquido)
              </div>
              <div className="text-3xl font-black text-blue-600 mt-1">
                {resultado.capRatePercentual.toFixed(2)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Retorno imediato baseado apenas no fluxo de caixa do aluguel.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                ROI Anual Total Estimado
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {resultado.roiAnualPercentual.toFixed(2)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Retorno real combinado (lucro do aluguel + valorização do imóvel).
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3 text-sm md:text-base text-gray-600">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Capital Total Injetado:</span>
              <strong className="text-gray-900">{formatCurrency(resultado.investimentoTotal)}</strong>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Ganho Líquido de Aluguel (Ano):</span>
              <strong className="text-gray-900">{formatCurrency(resultado.ganhoAluguelAnualLiquido)}</strong>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Ganho por Valorização Patrimonial (Ano):</span>
              <strong className="text-gray-900">{formatCurrency(resultado.valorizacaoPatrimonialAnual)}</strong>
            </div>
            <div className="flex justify-between pt-2 text-base md:text-lg text-gray-900 font-bold">
              <span>Retorno Financeiro Total (12 meses):</span>
              <span className="text-gray-950">{formatCurrency(resultado.retornoAnualTotal)}</span>
            </div>
          </div>
        </ResultCard>
      </section>
    </div>
  );
}
