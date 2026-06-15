'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

type Modo = 'numeros' | 'nomes';

export default function SorteadorClient() {
  const [modo, setModo] = useState<Modo>('numeros');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [qtd, setQtd] = useState('1');
  const [allowDupes, setAllowDupes] = useState(false);
  const [nomes, setNomes] = useState('');
  
  const [resultado, setResultado] = useState<string[] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const sortearNumeros = () => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const count = parseInt(qtd);

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(count) || count < 1) return;
    if (minVal > maxVal) return;
    
    if (!allowDupes && count > (maxVal - minVal + 1)) {
      alert('A quantidade a sortear é maior que a quantidade de números possíveis.');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      const res: number[] = [];
      let iter = 0;
      while (res.length < count && iter < 10000) {
        const n = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        if (allowDupes || !res.includes(n)) {
          res.push(n);
        }
        iter++;
      }
      setResultado(res.map(String));
      setIsAnimating(false);
    }, 600);
  };

  const sortearNomes = () => {
    const list = nomes.split('\n').map(n => n.trim()).filter(n => n);
    const count = parseInt(qtd);

    if (list.length === 0 || isNaN(count) || count < 1) return;

    if (!allowDupes && count > list.length) {
      alert('A quantidade a sortear é maior que a quantidade de nomes na lista.');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      const res: string[] = [];
      let iter = 0;
      const pool = [...list];
      
      while (res.length < count && iter < 10000) {
        const idx = Math.floor(Math.random() * pool.length);
        res.push(pool[idx]);
        if (!allowDupes) {
          pool.splice(idx, 1);
        }
        iter++;
      }
      setResultado(res);
      setIsAnimating(false);
    }, 600);
  };

  const sortear = () => {
    if (modo === 'numeros') sortearNumeros();
    else sortearNomes();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium text-slate-700 mb-3">O que você quer sortear?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setModo('numeros'); setResultado(null); }}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg border transition-all ${
                    modo === 'numeros' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  🔢 Números
                </button>
                <button
                  onClick={() => { setModo('nomes'); setResultado(null); }}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg border transition-all ${
                    modo === 'nomes' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  📝 Nomes
                </button>
              </div>
            </div>

            {modo === 'numeros' ? (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mínimo</label>
                    <input type="number" value={min} onChange={e => setMin(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-lg font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Máximo</label>
                    <input type="number" value={max} onChange={e => setMax(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-lg font-mono" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lista de nomes (um por linha)</label>
                  <textarea rows={5} value={nomes} onChange={e => setNomes(e.target.value)} placeholder="João&#10;Maria&#10;Pedro" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-base" />
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade a sortear</label>
                <input type="number" min="1" max="100" value={qtd} onChange={e => setQtd(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-lg font-mono" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={allowDupes} onChange={e => setAllowDupes(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                <span className="text-sm text-slate-600">Permitir repetição</span>
              </label>
            </div>

            <Button onClick={sortear} className="w-full h-14 text-lg">🎲 Sortear Agora</Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {isAnimating ? (
            <div className="h-full flex items-center justify-center min-h-[300px] border border-slate-200 rounded-xl bg-slate-50">
              <div className="animate-bounce text-6xl">🎲</div>
            </div>
          ) : resultado ? (
            <ResultCard title="Resultado do Sorteio" className="animate-fade-in h-full">
              <div className="flex flex-wrap gap-4 justify-center items-center h-full min-h-[250px] content-center p-4">
                {resultado.map((res, i) => (
                  <div key={i} className="bg-sky-50 border-2 border-sky-200 text-sky-800 font-black text-3xl sm:text-4xl px-6 py-4 rounded-2xl shadow-sm text-center min-w-[100px] animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    {res}
                  </div>
                ))}
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">🎰</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Sorteador Online</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">Configure os parâmetros à esquerda e clique em sortear para ver o resultado aqui.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
