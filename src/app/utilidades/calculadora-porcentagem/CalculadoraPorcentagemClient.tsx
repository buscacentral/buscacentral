'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

type Modo = 'percentual' | 'valor' | 'variacao' | 'proporcao';

interface Resultado {
  label: string;
  valor: string;
  detalhe?: string;
}

export default function CalculadoraPorcentagemClient() {
  const [modo, setModo] = useState<Modo>('percentual');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const modos: { id: Modo; label: string; descA: string; descB: string; btnLabel: string }[] = [
    { id: 'percentual', label: 'Quanto é X% de Y', descA: 'Porcentagem (%)', descB: 'Valor', btnLabel: 'Calcular' },
    { id: 'valor', label: 'X é quantos % de Y', descA: 'Valor parcial', descB: 'Valor total', btnLabel: 'Calcular' },
    { id: 'variacao', label: 'Variação percentual', descA: 'Valor inicial', descB: 'Valor final', btnLabel: 'Calcular variação' },
    { id: 'proporcao', label: 'Acréscimo/Desconto', descA: 'Valor', descB: 'Porcentagem (%)', btnLabel: 'Calcular' },
  ];

  const modoAtual = modos.find(m => m.id === modo)!;

  const calcular = () => {
    const va = parseFloat(a.replace(',', '.'));
    const vb = parseFloat(b.replace(',', '.'));
    if (isNaN(va) || isNaN(vb)) return;

    const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

    switch (modo) {
      case 'percentual': {
        const r = (va / 100) * vb;
        setResultado({ label: `${a}% de ${b}`, valor: fmt(r), detalhe: `${a} ÷ 100 × ${b} = ${fmt(r)}` });
        break;
      }
      case 'valor': {
        const r = (va / vb) * 100;
        setResultado({ label: `${a} é quanto % de ${b}`, valor: `${fmt(r)}%`, detalhe: `${a} ÷ ${b} × 100 = ${fmt(r)}%` });
        break;
      }
      case 'variacao': {
        const r = ((vb - va) / va) * 100;
        const sinal = r >= 0 ? '+' : '';
        setResultado({ label: `De ${a} para ${b}`, valor: `${sinal}${fmt(r)}%`, detalhe: `(${b} - ${a}) ÷ ${a} × 100 = ${sinal}${fmt(r)}%` });
        break;
      }
      case 'proporcao': {
        const acrescimo = va + (va * vb / 100);
        const desconto = va - (va * vb / 100);
        setResultado({
          label: `${b}% sobre ${a}`,
          valor: `+ ${fmt(acrescimo)} / - ${fmt(desconto)}`,
          detalhe: `Com ${b}% de acréscimo: ${fmt(acrescimo)} | Com ${b}% de desconto: ${fmt(desconto)}`
        });
        break;
      }
    }
  };

  const limpar = () => { setA(''); setB(''); setResultado(null); };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium text-slate-700 mb-3">Modo de cálculo</p>
              <div className="grid grid-cols-2 gap-2">
                {modos.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setModo(m.id); setResultado(null); }}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-lg border transition-all ${
                      modo === m.id
                        ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{modoAtual.descA}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={a}
                  onChange={e => setA(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{modoAtual.descB}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={b}
                  onChange={e => setB(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                  onKeyDown={e => e.key === 'Enter' && calcular()}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={calcular} className="flex-1">{modoAtual.btnLabel}</Button>
              <Button onClick={limpar} variant="outline">Limpar</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {resultado ? (
            <ResultCard title="Resultado" className="animate-fade-in">
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm text-center">
                  <p className="text-sm font-medium text-slate-500 mb-2">{resultado.label}</p>
                  <p className="text-4xl font-black text-slate-900">{resultado.valor}</p>
                </div>
                {resultado.detalhe && (
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Cálculo</p>
                    <p className="text-sm text-slate-700 font-mono">{resultado.detalhe}</p>
                  </div>
                )}
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">🔢</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Calculadora de Porcentagem</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Escolha o modo de cálculo à esquerda, preencha os valores e clique em calcular.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Calculadora de Porcentagem Online</h2>
        <p>
          A calculadora de porcentagem da BuscaCentral permite resolver os cálculos percentuais mais comuns
          do dia a dia de forma rápida e gratuita. Ideal para compras, investimentos, estudos e trabalho.
        </p>
        <h3>Modos disponíveis</h3>
        <ul>
          <li><strong>Quanto é X% de Y:</strong> Descubra o valor de uma porcentagem sobre um número.</li>
          <li><strong>X é quantos % de Y:</strong> Descubra qual a porcentagem de um valor em relação a outro.</li>
          <li><strong>Variação percentual:</strong> Calcule a variação entre dois valores (aumento ou redução).</li>
          <li><strong>Acrescentar/Descontar %:</strong> Veja o resultado com acréscimo e desconto simultaneamente.</li>
        </ul>
      </article>
    </>
  );
}
