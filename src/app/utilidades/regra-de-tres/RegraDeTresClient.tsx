'use client';

import { useState } from 'react';

export default function RegraDeTresClient() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [tipo, setTipo] = useState<'direta' | 'inversa'>('direta');

  const calcX = () => {
    const valA = parseFloat(a.replace(',', '.'));
    const valB = parseFloat(b.replace(',', '.'));
    const valC = parseFloat(c.replace(',', '.'));

    if (isNaN(valA) || isNaN(valB) || isNaN(valC) || valA === 0) return null;

    if (tipo === 'direta') {
      // A / B = C / X => A * X = B * C => X = (B * C) / A
      return ((valB * valC) / valA);
    } else {
      // A * B = C * X => X = (A * B) / C
      if (valC === 0) return null;
      return ((valA * valB) / valC);
    }
  };

  const resultado = calcX();
  
  const handleClear = () => {
    setA('');
    setB('');
    setC('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1">
            <button
              onClick={() => setTipo('direta')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tipo === 'direta' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diretamente Proporcional
            </button>
            <button
              onClick={() => setTipo('inversa')}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tipo === 'inversa' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inversamente Proporcional
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-12">
          {/* Row 1 */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Valor A</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Ex: 100"
              className="w-full text-center text-3xl font-bold bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="text-2xl font-bold text-slate-400">está para</div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Valor B</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="Ex: 50"
              className="w-full text-center text-3xl font-bold bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Separator */}
          <div className="col-span-3 flex items-center justify-center py-4">
            <div className="h-px bg-slate-200 w-full max-w-[100px]"></div>
            <div className="px-4 text-slate-400 font-medium">Assim como</div>
            <div className="h-px bg-slate-200 w-full max-w-[100px]"></div>
          </div>

          {/* Row 2 */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Valor C</label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(e.target.value)}
              placeholder="Ex: 20"
              className="w-full text-center text-3xl font-bold bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="text-2xl font-bold text-slate-400">está para</div>
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
            <label className="block text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">Valor X (Resultado)</label>
            <div className="w-full text-center text-4xl font-black text-blue-700 p-2 break-all">
              {resultado !== null ? parseFloat(resultado.toFixed(4)).toString().replace('.', ',') : '?'}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleClear}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Limpar valores
          </button>
        </div>

        {/* Step by step explanation */}
        {resultado !== null && a && b && c && (
          <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-3">📝</span>
              Passo a Passo da Conta
            </h3>
            
            <div className="space-y-4 font-mono text-lg bg-slate-800 p-6 rounded-2xl border border-slate-700">
              {tipo === 'direta' ? (
                <>
                  <div className="flex justify-between items-center text-slate-300">
                    <div>{a} <span className="mx-2 text-slate-500">→</span> {b}</div>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <div>{c} <span className="mx-2 text-slate-500">→</span> <span className="text-blue-400">X</span></div>
                  </div>
                  <div className="h-px bg-slate-700 my-4"></div>
                  <div className="text-slate-300">
                    1. Multiplica cruzado: {a} · <span className="text-blue-400">X</span> = {b} · {c}
                  </div>
                  <div className="text-slate-300">
                    2. Resolve a multiplicação: {a} · <span className="text-blue-400">X</span> = {parseFloat(b) * parseFloat(c)}
                  </div>
                  <div className="text-slate-300">
                    3. Passa dividindo: <span className="text-blue-400">X</span> = {parseFloat(b) * parseFloat(c)} ÷ {a}
                  </div>
                  <div className="text-xl text-green-400 font-bold mt-4">
                    <span className="text-blue-400">X</span> = {parseFloat(resultado.toFixed(4)).toString()}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-slate-300">
                    <div>{a} <span className="mx-2 text-slate-500">→</span> {b}</div>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <div>{c} <span className="mx-2 text-slate-500">→</span> <span className="text-blue-400">X</span></div>
                  </div>
                  <div className="h-px bg-slate-700 my-4"></div>
                  <div className="text-slate-300">
                    1. Multiplica em linha (inversa): {c} · <span className="text-blue-400">X</span> = {a} · {b}
                  </div>
                  <div className="text-slate-300">
                    2. Resolve a multiplicação: {c} · <span className="text-blue-400">X</span> = {parseFloat(a) * parseFloat(b)}
                  </div>
                  <div className="text-slate-300">
                    3. Passa dividindo: <span className="text-blue-400">X</span> = {parseFloat(a) * parseFloat(b)} ÷ {c}
                  </div>
                  <div className="text-xl text-green-400 font-bold mt-4">
                    <span className="text-blue-400">X</span> = {parseFloat(resultado.toFixed(4)).toString()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
