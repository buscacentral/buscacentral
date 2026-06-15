'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { calcularINSS, calcularIRPF, formatarMoeda } from '@/lib/trabalhista';

export default function DecimoTerceiroClient() {
  const [salarioBruto, setSalarioBruto] = useState<string>('');
  const [meses, setMeses] = useState<number>(12);
  const [dependentes, setDependentes] = useState<number>(0);

  const [resultado, setResultado] = useState<{
    brutoTotal: number;
    primeiraParcela: number;
    brutoSegundaParcela: number;
    inss: number;
    irpf: number;
    liquidoSegundaParcela: number;
    totalLiquido: number;
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
    if (bruto <= 0 || meses <= 0 || meses > 12) return;

    // Calcula o bruto proporcional aos meses trabalhados
    const brutoTotal = (bruto / 12) * meses;

    // Primeira parcela é exatamente a metade do bruto proporcional, sem descontos
    const primeiraParcela = brutoTotal / 2;

    // Segunda parcela é o que sobra, MENOS OS DESCONTOS SOBRE O TOTAL
    const inss = calcularINSS(brutoTotal);
    const irpf = calcularIRPF(brutoTotal - inss, dependentes, 0, 0);

    const brutoSegundaParcela = brutoTotal - primeiraParcela;
    const liquidoSegundaParcela = brutoSegundaParcela - inss - irpf;

    const totalLiquido = primeiraParcela + liquidoSegundaParcela;

    setResultado({
      brutoTotal,
      primeiraParcela,
      brutoSegundaParcela,
      inss,
      irpf,
      liquidoSegundaParcela,
      totalLiquido
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Meses Trabalhados no Ano</label>
            <input
              type="number"
              min="1"
              max="12"
              value={meses}
              onChange={(e) => setMeses(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="Ex: 12"
            />
            {meses > 12 && <p className="text-xs text-red-500 mt-1">O máximo é 12 meses.</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Número de Dependentes</label>
            <input
              type="number"
              min="0"
              value={dependentes}
              onChange={(e) => setDependentes(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="Ex: 0, 1, 2..."
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={calcular} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!salarioBruto}>
            Calcular 13º Salário
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado do Cálculo">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center mb-6">
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Total Líquido (As Duas Parcelas)</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-600">
              {formatarMoeda(resultado.totalLiquido)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Primeira Parcela */}
            <div className="border border-sky-100 rounded-xl p-5 bg-sky-50/50">
              <h4 className="font-bold text-sky-800 mb-2 text-lg">1ª Parcela (Novembro)</h4>
              <p className="text-sm text-slate-600 mb-4">Paga até o dia 30 de novembro, sem nenhum desconto.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Valor Bruto</span>
                  <span className="font-bold text-slate-800">{formatarMoeda(resultado.primeiraParcela)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span className="text-sm font-semibold">Descontos</span>
                  <span className="font-bold">R$ 0,00</span>
                </div>
                <div className="pt-3 border-t border-sky-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-sky-900 uppercase">Líquido 1ª Parcela</span>
                  <span className="font-black text-sky-700 text-xl">{formatarMoeda(resultado.primeiraParcela)}</span>
                </div>
              </div>
            </div>

            {/* Segunda Parcela */}
            <div className="border border-orange-100 rounded-xl p-5 bg-orange-50/50">
              <h4 className="font-bold text-orange-800 mb-2 text-lg">2ª Parcela (Dezembro)</h4>
              <p className="text-sm text-slate-600 mb-4">Paga até o dia 20 de dezembro. Todos os descontos são aplicados aqui.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Valor Bruto</span>
                  <span className="font-bold text-slate-800">{formatarMoeda(resultado.brutoSegundaParcela)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span className="text-sm font-semibold">INSS</span>
                  <span className="font-bold">- {formatarMoeda(resultado.inss)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span className="text-sm font-semibold">IRPF</span>
                  <span className="font-bold">- {formatarMoeda(resultado.irpf)}</span>
                </div>
                <div className="pt-3 border-t border-orange-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-orange-900 uppercase">Líquido 2ª Parcela</span>
                  <span className="font-black text-orange-700 text-xl">{formatarMoeda(resultado.liquidoSegundaParcela)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            * O INSS e IRPF do 13º são calculados sobre o valor total bruto, mas descontados integralmente na 2ª parcela.
          </div>
        </ResultCard>
      )}
    </>
  );
}
