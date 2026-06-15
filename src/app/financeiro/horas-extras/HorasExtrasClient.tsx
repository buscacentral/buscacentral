'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { formatarMoeda } from '@/lib/trabalhista';

export default function HorasExtrasClient() {
  const [salarioBruto, setSalarioBruto] = useState<string>('');
  const [jornadaMensal, setJornadaMensal] = useState<number>(220);
  const [he50, setHe50] = useState<number>(0);
  const [he100, setHe100] = useState<number>(0);
  
  const [diasUteis, setDiasUteis] = useState<number>(26);
  const [diasNaoUteis, setDiasNaoUteis] = useState<number>(4);

  const [resultado, setResultado] = useState<{
    horaNormal: number;
    valorHe50: number;
    totalHe50: number;
    valorHe100: number;
    totalHe100: number;
    dsr: number;
    totalGeral: number;
  } | null>(null);

  const formatCurrencyInput = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return (Number(num) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const parseCurrencyInput = (value: string) => {
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.'));
  };

  const calcular = () => {
    const bruto = parseCurrencyInput(salarioBruto);
    if (bruto <= 0 || jornadaMensal <= 0) return;

    const horaNormal = bruto / jornadaMensal;
    
    const valorHe50 = horaNormal * 1.5;
    const totalHe50 = valorHe50 * (he50 || 0);
    
    const valorHe100 = horaNormal * 2.0;
    const totalHe100 = valorHe100 * (he100 || 0);

    const totalHe = totalHe50 + totalHe100;
    const dsr = diasUteis > 0 ? (totalHe / diasUteis) * (diasNaoUteis || 0) : 0;

    const totalGeral = totalHe + dsr;

    setResultado({
      horaNormal,
      valorHe50,
      totalHe50,
      valorHe100,
      totalHe100,
      dsr,
      totalGeral
    });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Salário Bruto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(formatCurrencyInput(e.target.value))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Jornada Mensal (Horas)</label>
            <input
              type="number"
              min="1"
              value={jornadaMensal}
              onChange={(e) => setJornadaMensal(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="Ex: 220"
            />
            <p className="text-xs text-slate-500 mt-1">Geralmente 220, 200 ou 180.</p>
          </div>

          <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Quantidade de Horas Extras</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <label className="block text-sm font-bold text-sky-800 mb-2">Horas Normais (50%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={he50}
                  onChange={(e) => setHe50(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  placeholder="Ex: 10"
                />
                <p className="text-xs text-sky-600/80 mt-1">Feitas em dias úteis e sábados.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-bold text-purple-800 mb-2">Domingos/Feriados (100%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={he100}
                  onChange={(e) => setHe100(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  placeholder="Ex: 5"
                />
                <p className="text-xs text-purple-600/80 mt-1">Trabalho aos domingos e feriados.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Cálculo de DSR (Opcional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Dias Úteis no Mês</label>
                <input
                  type="number"
                  min="1"
                  value={diasUteis}
                  onChange={(e) => setDiasUteis(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  placeholder="Ex: 26"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Domingos e Feriados</label>
                <input
                  type="number"
                  min="0"
                  value={diasNaoUteis}
                  onChange={(e) => setDiasNaoUteis(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  placeholder="Ex: 4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={calcular} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!salarioBruto}>
            Calcular Horas Extras
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado do Cálculo">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center mb-6">
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Total a Receber (Bruto)</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-600">
              {formatarMoeda(resultado.totalGeral)}
            </p>
            <p className="text-sm text-emerald-700 mt-2 font-medium">Este valor será somado ao seu salário no fim do mês.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-slate-500 uppercase">Hora Normal</p>
              <p className="text-xl font-bold text-slate-700 mt-1">{formatarMoeda(resultado.horaNormal)}/h</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-sky-600 uppercase">Valor Hora 50%</p>
              <p className="text-xl font-bold text-sky-800 mt-1">{formatarMoeda(resultado.valorHe50)}/h</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-purple-600 uppercase">Valor Hora 100%</p>
              <p className="text-xl font-bold text-purple-800 mt-1">{formatarMoeda(resultado.valorHe100)}/h</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-lg">
              <span className="font-semibold text-slate-700">Total Horas Extras 50%</span>
              <span className="font-bold text-slate-800 text-lg">{formatarMoeda(resultado.totalHe50)}</span>
            </div>
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-lg">
              <span className="font-semibold text-slate-700">Total Horas Extras 100%</span>
              <span className="font-bold text-slate-800 text-lg">{formatarMoeda(resultado.totalHe100)}</span>
            </div>
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-lg">
              <span className="font-semibold text-slate-700">Reflexo no DSR</span>
              <span className="font-bold text-slate-800 text-lg">{formatarMoeda(resultado.dsr)}</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center mt-6">
            * O reflexo no DSR (Descanso Semanal Remunerado) é obrigatório por lei. Valores brutos, sujeitos a descontos de INSS e IRPF.
          </div>
        </ResultCard>
      )}
    </>
  );
}
