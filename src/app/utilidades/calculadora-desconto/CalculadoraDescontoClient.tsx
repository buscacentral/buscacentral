'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

export default function CalculadoraDescontoClient() {
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [desconto, setDesconto] = useState('');
  const [resultado, setResultado] = useState<{
    precoFinal: number;
    economia: number;
    percentual: number;
    precoOriginal: number;
  } | null>(null);

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calcular = () => {
    const p = parseFloat(precoOriginal.replace(',', '.'));
    const d = parseFloat(desconto.replace(',', '.'));
    if (isNaN(p) || isNaN(d) || p <= 0) return;

    const economia = p * d / 100;
    setResultado({
      precoFinal: p - economia,
      economia,
      percentual: d,
      precoOriginal: p,
    });
  };

  const limpar = () => { setPrecoOriginal(''); setDesconto(''); setResultado(null); };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preço original (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={precoOriginal}
                  onChange={e => setPrecoOriginal(e.target.value)}
                  placeholder="199,90"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Desconto (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={desconto}
                  onChange={e => setDesconto(e.target.value)}
                  placeholder="15"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                  onKeyDown={e => e.key === 'Enter' && calcular()}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={calcular} className="flex-1">Calcular Desconto</Button>
              <Button onClick={limpar} variant="outline">Limpar</Button>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Atalhos rápidos</p>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 25, 30, 40, 50].map(d => (
                  <button
                    key={d}
                    onClick={() => { setDesconto(String(d)); }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      desconto === String(d)
                        ? 'bg-sky-100 border-sky-300 text-sky-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {resultado ? (
            <ResultCard title="Resultado do Desconto" className="animate-fade-in">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm text-center">
                  <p className="text-sm font-medium text-green-600 mb-1">Preço com desconto</p>
                  <p className="text-4xl font-black text-green-700">{fmt(resultado.precoFinal)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Preço original</p>
                    <p className="text-lg font-bold text-slate-600 line-through">{fmt(resultado.precoOriginal)}</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm text-center">
                    <p className="text-xs font-semibold text-red-400 mb-1">Desconto</p>
                    <p className="text-lg font-bold text-red-600">-{resultado.percentual}%</p>
                  </div>
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shadow-sm text-center">
                    <p className="text-xs font-semibold text-sky-500 mb-1">Você economiza</p>
                    <p className="text-lg font-bold text-sky-700">{fmt(resultado.economia)}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comparativo</p>
                  <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${100 - resultado.percentual}%` }}
                    />
                    <div
                      className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-300 to-red-400 rounded-full transition-all duration-700"
                      style={{ width: `${resultado.percentual}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-green-600 font-bold">Você paga: {(100 - resultado.percentual).toFixed(0)}%</span>
                    <span className="text-xs text-red-500 font-bold">Economiza: {resultado.percentual}%</span>
                  </div>
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">🏷️</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Calculadora de Desconto</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Informe o preço original e a porcentagem de desconto para ver quanto você economiza.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como Calcular Desconto?</h2>
        <p>
          Para calcular o desconto de um produto, basta multiplicar o preço original pela porcentagem
          de desconto e dividir por 100. O resultado é o valor economizado. Subtraia esse valor do preço
          original para obter o preço final.
        </p>
        <h3>Exemplo prático</h3>
        <p>
          Um produto de R$ 200,00 com 15% de desconto: R$ 200 × 15 ÷ 100 = R$ 30,00 de economia.
          Preço final: R$ 200 - R$ 30 = R$ 170,00.
        </p>
      </article>
    </>
  );
}
