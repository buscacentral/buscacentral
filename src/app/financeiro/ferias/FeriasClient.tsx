'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { calcularINSS, calcularIRPF, formatarMoeda } from '@/lib/trabalhista';

export default function FeriasClient() {
  const [salarioBruto, setSalarioBruto] = useState<string>('');
  const [diasFerias, setDiasFerias] = useState<number>(30);
  const [dependentes, setDependentes] = useState<number>(0);
  const [venderFerias, setVenderFerias] = useState<boolean>(false);
  const [adiantar13, setAdiantar13] = useState<boolean>(false);

  const [resultado, setResultado] = useState<{
    valorFerias: number;
    tercoConstitucional: number;
    abonoPecuniario: number;
    tercoAbono: number;
    adiantamento13: number;
    inss: number;
    irpf: number;
    totalBruto: number;
    totalDescontos: number;
    liquido: number;
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
    if (bruto <= 0 || diasFerias <= 0 || diasFerias > 30) return;

    // Se vendeu férias, ele tira apenas 20 dias (vendendo 10)
    const diasGozo = venderFerias ? Math.min(20, diasFerias) : diasFerias;
    
    const valorFerias = (bruto / 30) * diasGozo;
    const tercoConstitucional = valorFerias / 3;
    
    let abonoPecuniario = 0;
    let tercoAbono = 0;

    if (venderFerias) {
      // Venda de 1/3 dos dias de direito (máx 10 dias)
      abonoPecuniario = (bruto / 30) * 10;
      tercoAbono = abonoPecuniario / 3;
    }

    const adiantamento13 = adiantar13 ? bruto / 2 : 0;

    // INSS e IRPF incidem apenas sobre férias gozadas + 1/3 (abono pecuniário é indenizatório)
    const baseTributavel = valorFerias + tercoConstitucional;
    
    const inss = calcularINSS(baseTributavel);
    const irpf = calcularIRPF(baseTributavel - inss, dependentes, 0, 0);

    const totalBruto = valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono + adiantamento13;
    const totalDescontos = inss + irpf;
    const liquido = totalBruto - totalDescontos;

    setResultado({
      valorFerias,
      tercoConstitucional,
      abonoPecuniario,
      tercoAbono,
      adiantamento13,
      inss,
      irpf,
      totalBruto,
      totalDescontos,
      liquido
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Dias de Férias</label>
            <input
              type="number"
              min="1"
              max="30"
              value={diasFerias}
              onChange={(e) => setDiasFerias(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              placeholder="Ex: 30"
            />
            {diasFerias > 30 && <p className="text-xs text-red-500 mt-1">O máximo é 30 dias.</p>}
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

          <div className="flex flex-col justify-center space-y-4 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={venderFerias}
                onChange={(e) => setVenderFerias(e.target.checked)}
                className="w-5 h-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Vender 1/3 das férias (Abono Pecuniário)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={adiantar13}
                onChange={(e) => setAdiantar13(e.target.checked)}
                className="w-5 h-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Adiantar 1ª parcela do 13º Salário
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={calcular} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!salarioBruto}>
            Calcular Férias
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado do Cálculo">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center mb-6">
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Total Líquido a Receber</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-600">
              {formatarMoeda(resultado.liquido)}
            </p>
            <p className="text-sm text-emerald-700 mt-2 font-medium">Este valor deve ser pago até 2 dias antes das férias.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-white">
              <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Proventos (Entradas)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Valor das Férias</span>
                  <span className="font-bold text-slate-800">{formatarMoeda(resultado.valorFerias)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">1/3 Constitucional</span>
                  <span className="font-bold text-slate-800">{formatarMoeda(resultado.tercoConstitucional)}</span>
                </div>
                {venderFerias && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-600">Abono Pecuniário (Venda)</span>
                      <span className="font-bold text-slate-800">{formatarMoeda(resultado.abonoPecuniario)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-600">1/3 sobre Abono</span>
                      <span className="font-bold text-slate-800">{formatarMoeda(resultado.tercoAbono)}</span>
                    </div>
                  </>
                )}
                {adiantar13 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-600">Adiantamento 13º</span>
                    <span className="font-bold text-slate-800">{formatarMoeda(resultado.adiantamento13)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Total Bruto</span>
                  <span className="font-black text-sky-700">{formatarMoeda(resultado.totalBruto)}</span>
                </div>
              </div>
            </div>

            <div className="border border-red-100 rounded-xl p-5 bg-red-50/30">
              <h4 className="font-bold text-red-800 mb-4 text-sm uppercase tracking-wider">Descontos (Saídas)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-red-600">Desconto INSS</span>
                  <span className="font-bold text-red-800">- {formatarMoeda(resultado.inss)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-red-600">Desconto IRPF</span>
                  <span className="font-bold text-red-800">- {formatarMoeda(resultado.irpf)}</span>
                </div>
                <div className="pt-2 border-t border-red-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-red-800">Total de Descontos</span>
                  <span className="font-black text-red-700">- {formatarMoeda(resultado.totalDescontos)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            * O Abono Pecuniário (venda de férias) e o adiantamento de 13º são isentos de INSS e IRPF no momento das férias.
          </div>
        </ResultCard>
      )}
    </>
  );
}
