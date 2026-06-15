'use client';

import { useState, useMemo, useEffect } from 'react';
import { calcularPlanejamento, sanitizeNumber, calcularDias } from '@/lib/planejador-viagem-logic';
import { formatCurrency } from '@/lib/formatters';
import { ResultCard } from '@/components/ui/ResultCard';

export default function PlanejadorViagemClient() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [numPessoas, setNumPessoas] = useState('2');
  const [custoPassagem, setCustoPassagem] = useState('800');
  const [diariasHotel, setDiariasHotel] = useState('200');
  const [diasHotel, setDiasHotel] = useState('5');
  const [gastoAlimentacao, setGastoAlimentacao] = useState('80');
  const [gastoTransporte, setGastoTransporte] = useState('30');
  const [gastoAtividades, setGastoAtividades] = useState('300');
  const [outrosGastos, setOutrosGastos] = useState('0');

  useEffect(() => {
    if (dataInicio && dataFim) {
      const dias = calcularDias(dataInicio, dataFim);
      if (dias > 0) {
        setDiasHotel(Math.max(0, dias - 1).toString());
      } else {
        setDiasHotel('0');
      }
    }
  }, [dataInicio, dataFim]);

  const resultado = useMemo(() => {
    return calcularPlanejamento({
      dataInicio,
      dataFim,
      custoPassagem: sanitizeNumber(custoPassagem),
      diariasHotel: sanitizeNumber(diariasHotel),
      diasHotel: sanitizeNumber(diasHotel),
      gastoAlimentacao: sanitizeNumber(gastoAlimentacao),
      gastoTransporte: sanitizeNumber(gastoTransporte),
      gastoAtividades: sanitizeNumber(gastoAtividades),
      outrosGastos: sanitizeNumber(outrosGastos),
      numPessoas: sanitizeNumber(numPessoas, 1),
    });
  }, [dataInicio, dataFim, custoPassagem, diariasHotel, diasHotel, gastoAlimentacao, gastoTransporte, gastoAtividades, outrosGastos, numPessoas]);

  const categorias = [
    { label: 'Passagens', valor: resultado.custoPassagem, icon: '✈️' },
    { label: 'Hospedagem', valor: resultado.custoHospedagem, icon: '🏨' },
    { label: 'Alimentação', valor: resultado.custoAlimentacao, icon: '🍽️' },
    { label: 'Transporte', valor: resultado.custoTransporte, icon: '🚕' },
    { label: 'Atividades', valor: resultado.custoAtividades, icon: '🎯' },
    { label: 'Outros', valor: resultado.outrosGastos, icon: '📦' },
  ];

  const maxCategoria = Math.max(...categorias.map(c => c.valor), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Formulário */}
      <section className="space-y-5 lg:col-span-1">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Datas e Pessoas</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Ida</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Volta</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Número de Pessoas</label>
          <input type="text" value={numPessoas} onChange={(e) => setNumPessoas(e.target.value)} placeholder="2"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 pt-2">Custos</h2>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Passagem por Pessoa (R$)</label>
          <input type="text" value={custoPassagem} onChange={(e) => setCustoPassagem(e.target.value)} placeholder="800"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Diária Hotel (R$)</label>
            <input type="text" value={diariasHotel} onChange={(e) => setDiariasHotel(e.target.value)} placeholder="200"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Noites</label>
            <input type="text" value={diasHotel} onChange={(e) => setDiasHotel(e.target.value)} placeholder="5"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Alimentação por Pessoa/Dia (R$)</label>
          <input type="text" value={gastoAlimentacao} onChange={(e) => setGastoAlimentacao(e.target.value)} placeholder="80"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Transporte Local/Dia (R$)</label>
          <input type="text" value={gastoTransporte} onChange={(e) => setGastoTransporte(e.target.value)} placeholder="30"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Atividades/Passeios (R$)</label>
          <input type="text" value={gastoAtividades} onChange={(e) => setGastoAtividades(e.target.value)} placeholder="300"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Outros Gastos (R$)</label>
          <input type="text" value={outrosGastos} onChange={(e) => setOutrosGastos(e.target.value)} placeholder="0"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </section>

      {/* Resultados */}
      <section className="lg:col-span-2 space-y-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200">
        {/* Resumo da viagem */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Dias</p>
            <p className="text-3xl font-black text-gray-900">{resultado.diasTotais}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Dias Úteis</p>
            <p className="text-3xl font-black text-gray-900">{resultado.diasUteis}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Faltam</p>
            <p className="text-3xl font-black text-blue-600">{resultado.diasParaViagem}</p>
          </div>
        </div>

        {/* Totais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 overflow-hidden">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col justify-center overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 truncate">Custo Total</p>
            <p className="text-lg sm:text-xl lg:text-base xl:text-xl font-black text-emerald-600 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis" title={formatCurrency(resultado.custoTotal)}>{formatCurrency(resultado.custoTotal)}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col justify-center overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 truncate">Por Pessoa</p>
            <p className="text-lg sm:text-xl lg:text-base xl:text-xl font-black text-blue-600 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis" title={formatCurrency(resultado.custoPorPessoa)}>{formatCurrency(resultado.custoPorPessoa)}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col justify-center overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 truncate">Por Dia</p>
            <p className="text-lg sm:text-xl lg:text-base xl:text-xl font-black text-purple-600 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis" title={formatCurrency(resultado.custoPorDia)}>{formatCurrency(resultado.custoPorDia)}</p>
          </div>
        </div>

        {/* Breakdown por categoria */}
        <ResultCard title="Distribuição de Gastos" className="group">
          <div className="space-y-3">
            {categorias.map((cat) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 w-20 sm:w-28 flex-shrink-0">{cat.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-blue-400"
                    style={{ width: `${(cat.valor / maxCategoria) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-24 text-right">
                  {formatCurrency(cat.valor)}
                </span>
              </div>
            ))}
          </div>
        </ResultCard>
      </section>
    </div>
  );
}
