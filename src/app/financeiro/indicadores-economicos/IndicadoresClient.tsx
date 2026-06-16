'use client';

import { ResultCard } from '@/components/ui/ResultCard';

interface IndicadorData {
  data: string;
  valor: string;
}

interface IndicadoresEstado {
  selic: IndicadorData | null;
  ipca: IndicadorData | null;
  cdi: IndicadorData | null;
}

export default function IndicadoresClient({ data }: { data: IndicadoresEstado }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SELIC */}
        <ResultCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700">Taxa Selic</h2>
              <span className="text-2xl" title="Taxa Básica de Juros">🏦</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{data.selic?.valor || '--'}%</span>
              <span className="text-sm font-medium text-slate-500">ao ano</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Atualizado em: {data.selic?.data || '--'}
            </p>
          </div>
        </ResultCard>

        {/* IPCA */}
        <ResultCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700">IPCA</h2>
              <span className="text-2xl" title="Inflação Oficial">🛒</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{data.ipca?.valor || '--'}%</span>
              <span className="text-sm font-medium text-slate-500">acumulado (12m)</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Referência: {data.ipca?.data || '--'}
            </p>
          </div>
        </ResultCard>

        {/* CDI */}
        <ResultCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700">Taxa CDI</h2>
              <span className="text-2xl" title="Certificado de Depósito Interbancário">📈</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{data.cdi?.valor || '--'}%</span>
              <span className="text-sm font-medium text-slate-500">ao ano</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Atualizado em: {data.cdi?.data || '--'}
            </p>
          </div>
        </ResultCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard title="O que é a Taxa Selic?" animateIn={false}>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            A <strong>Selic</strong> é a taxa básica de juros da economia brasileira. Ela influencia todas as outras taxas de juros, como as de empréstimos, financiamentos e aplicações financeiras.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Se a Selic sobe, os juros cobrados no crédito ficam mais caros e o consumo cai, o que ajuda a controlar a inflação. Por outro lado, a rentabilidade da renda fixa aumenta.
          </p>
        </ResultCard>
        <ResultCard title="O que é o IPCA?" animateIn={false}>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            O <strong>IPCA</strong> (Índice Nacional de Preços ao Consumidor Amplo) é o índice oficial da inflação no Brasil. Ele mede a variação dos preços de um conjunto de produtos e serviços consumidos pelas famílias.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Se o IPCA está alto, significa que o custo de vida aumentou (seu dinheiro perdeu poder de compra). A meta da Selic é justamente manter o IPCA sob controle.
          </p>
        </ResultCard>
      </div>
    </div>
  );
}
