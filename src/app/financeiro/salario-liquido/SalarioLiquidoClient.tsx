'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { calcularINSS, calcularIRPF, formatarMoeda } from '@/lib/trabalhista';

export default function SalarioLiquidoClient() {
  const [salarioBruto, setSalarioBruto] = useState<string>('');
  const [dependentes, setDependentes] = useState<number>(0);
  const [pensao, setPensao] = useState<string>('');
  const [descontos, setDescontos] = useState<string>('');
  
  const [resultado, setResultado] = useState<{
    bruto: number;
    inss: number;
    irpf: number;
    pensao: number;
    outros: number;
    liquido: number;
    percentualDescontos: number;
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
    if (bruto <= 0) return;

    const valPensao = parseCurrencyInput(pensao);
    const valDescontos = parseCurrencyInput(descontos);
    const deps = dependentes || 0;

    const inss = calcularINSS(bruto);
    const irpf = calcularIRPF(bruto - inss, deps, valPensao, 0);

    const totalDescontos = inss + irpf + valPensao + valDescontos;
    const liquido = bruto - totalDescontos;
    const percentualDescontos = bruto > 0 ? (totalDescontos / bruto) * 100 : 0;

    setResultado({
      bruto,
      inss,
      irpf,
      pensao: valPensao,
      outros: valDescontos,
      liquido,
      percentualDescontos
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Número de Dependentes</label>
            <input
              type="number"
              min="0"
              value={dependentes}
              onChange={(e) => setDependentes(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="Ex: 0, 1, 2..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Pensão Alimentícia</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={pensao}
                onChange={(e) => setPensao(formatCurrencyInput(e.target.value))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Outros Descontos</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={descontos}
                onChange={(e) => setDescontos(formatCurrencyInput(e.target.value))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={calcular} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!salarioBruto}>
            Calcular Salário Líquido
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado do Cálculo">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center mb-6">
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Salário Líquido</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-600">
              {formatarMoeda(resultado.liquido)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase">Salário Bruto</p>
              <p className="text-xl font-bold text-slate-700 mt-1">{formatarMoeda(resultado.bruto)}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-red-500 uppercase">Desconto INSS</p>
              <p className="text-xl font-bold text-red-700 mt-1">{formatarMoeda(resultado.inss)}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-red-500 uppercase">Desconto IRPF</p>
              <p className="text-xl font-bold text-red-700 mt-1">{formatarMoeda(resultado.irpf)}</p>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase">% Descontos</p>
              <p className="text-xl font-bold text-slate-700 mt-1">{resultado.percentualDescontos.toFixed(1)}%</p>
            </div>
          </div>

          {(resultado.pensao > 0 || resultado.outros > 0) && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-sm text-orange-800 mb-6 flex justify-between">
              {resultado.pensao > 0 && <span>Pensão: <b>{formatarMoeda(resultado.pensao)}</b></span>}
              {resultado.outros > 0 && <span>Outros: <b>{formatarMoeda(resultado.outros)}</b></span>}
            </div>
          )}
          
          <div className="text-xs text-slate-500 text-center">
            * Cálculo baseado na tabela progressiva do INSS e IRPF de 2024. O cálculo pode variar dependendo de acordos coletivos e outras particularidades.
          </div>
        </ResultCard>
      )}
    </>
  );
}
