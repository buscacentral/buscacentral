'use client';

import { useState } from 'react';

export default function ConsumoAguaClient() {
  const [peso, setPeso] = useState<string>('');
  const [atividade, setAtividade] = useState<'sedentario' | 'moderado' | 'intenso'>('moderado');

  const calcular = () => {
    const valPeso = parseFloat(peso.replace(',', '.'));
    if (isNaN(valPeso) || valPeso <= 0) return null;

    let multiplicador = 35; // base: 35ml por kg
    if (atividade === 'sedentario') multiplicador = 35;
    if (atividade === 'moderado') multiplicador = 45;
    if (atividade === 'intenso') multiplicador = 55;

    const totalMl = valPeso * multiplicador;
    const totalL = totalMl / 1000;
    const copos = Math.ceil(totalMl / 250); // considerando copos de 250ml

    return {
      ml: totalMl,
      litros: totalL.toFixed(1),
      copos: copos
    };
  };

  const resultado = calcular();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <span className="text-3xl mr-3">💧</span>
            Descubra sua meta diária
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Seu peso atual (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ex: 70"
                  className="w-full text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl p-4 pl-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  ⚖️
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  KG
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Nível de atividade física</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setAtividade('sedentario')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    atividade === 'sedentario'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl mb-1">🛋️</span>
                  <span className="font-semibold text-sm">Sedentário</span>
                </button>
                <button
                  onClick={() => setAtividade('moderado')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    atividade === 'moderado'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl mb-1">🚶</span>
                  <span className="font-semibold text-sm">Moderado</span>
                </button>
                <button
                  onClick={() => setAtividade('intenso')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    atividade === 'intenso'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl mb-1">🏃‍♂️</span>
                  <span className="font-semibold text-sm">Intenso</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 h-full text-white shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
            {/* Water drop background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-900 rounded-full mix-blend-overlay filter blur-3xl opacity-30 transform -translate-x-10 translate-y-10"></div>
            
            {!resultado ? (
              <div className="text-center z-10">
                <div className="text-6xl mb-4 opacity-50">💧</div>
                <h3 className="text-xl font-medium opacity-90">Informe seu peso para ver sua meta</h3>
              </div>
            ) : (
              <div className="text-center z-10 w-full">
                <p className="text-cyan-100 font-medium mb-2 uppercase tracking-widest text-sm">Você deve beber</p>
                <div className="text-6xl md:text-7xl font-black mb-2 drop-shadow-md">
                  {resultado.litros} L
                </div>
                <p className="text-blue-100 text-lg mb-8">por dia</p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full max-w-sm mx-auto">
                  <p className="text-sm text-cyan-100 mb-3">Isso equivale a aproximadamente:</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl">🥤</span>
                    <span className="text-3xl font-bold">{resultado.copos}</span>
                    <span className="text-lg text-blue-100 text-left leading-tight">copos<br/>de 250ml</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
