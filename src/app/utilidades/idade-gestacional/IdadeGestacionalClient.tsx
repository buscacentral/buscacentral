'use client';

import React, { useState, useMemo } from 'react';

export default function IdadeGestacionalClient() {
  const [calcMethod, setCalcMethod] = useState<'dum' | 'dpp'>('dum');
  const [dateStr, setDateStr] = useState('');

  const { weeks, days, dpp, trimestre } = useMemo(() => {
    const empty = { weeks: 0, days: 0, dpp: null as Date | null, trimestre: 0 };
    if (!dateStr) return empty;

    const inputDate = new Date(dateStr + 'T12:00:00'); // Midday to avoid timezone shifting
    if (isNaN(inputDate.getTime())) return empty;

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    let calculatedDpp = new Date();
    let currentGestationalAgeDays = 0;

    if (calcMethod === 'dum') {
      // DPP is 280 days (40 weeks) after DUM
      calculatedDpp = new Date(inputDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      
      const diffTime = Math.abs(today.getTime() - inputDate.getTime());
      // If DUM is in the future, age is 0 (or error)
      if (today < inputDate) {
        currentGestationalAgeDays = 0;
      } else {
        currentGestationalAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

    } else {
      // Calc method is DPP
      calculatedDpp = inputDate;
      // DUM was 280 days before DPP
      const calculatedDum = new Date(calculatedDpp.getTime() - 280 * 24 * 60 * 60 * 1000);
      
      const diffTime = today.getTime() - calculatedDum.getTime();
      if (today < calculatedDum) {
        currentGestationalAgeDays = 0;
      } else {
        currentGestationalAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    // Pregnancy goes up to ~42 weeks (294 days)
    if (currentGestationalAgeDays > 294) currentGestationalAgeDays = 294;

    const w = Math.floor(currentGestationalAgeDays / 7);
    const d = currentGestationalAgeDays % 7;
    const tri = w < 13 ? 1 : w < 27 ? 2 : 3;

    return { weeks: w, days: d, dpp: calculatedDpp, trimestre: tri };
  }, [calcMethod, dateStr]);

  const progressPercent = Math.min((((weeks * 7) + days) / 280) * 100, 100);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 max-w-4xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">👶</span> Dados da Gestação
          </h2>

          <div className="bg-pink-50/50 p-5 rounded-xl border border-pink-100 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Método de Cálculo</label>
              <div className="flex bg-white rounded-lg p-1 border border-pink-200">
                <button
                  onClick={() => setCalcMethod('dum')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${calcMethod === 'dum' ? 'bg-pink-500 text-white shadow' : 'text-slate-600 hover:bg-pink-50'}`}
                >
                  Pela DUM
                </button>
                <button
                  onClick={() => setCalcMethod('dpp')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${calcMethod === 'dpp' ? 'bg-pink-500 text-white shadow' : 'text-slate-600 hover:bg-pink-50'}`}
                >
                  Pela DPP
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {calcMethod === 'dum' 
                  ? 'Data da Última Menstruação (DUM)' 
                  : 'Data Provável do Parto (DPP)'}
              </label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-pink-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2">
                {calcMethod === 'dum' 
                  ? 'Informe o primeiro dia em que sua última menstruação desceu.' 
                  : 'Informe a data prevista para o nascimento dada pelo ultrassom.'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span> Resultados
          </h2>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl text-white shadow-lg h-[240px] flex flex-col justify-center">
            {dateStr ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-pink-100 text-sm uppercase tracking-widest mb-1">Idade Gestacional</p>
                  <div className="flex justify-center items-end gap-2">
                    <span className="text-5xl font-extrabold">{weeks}</span>
                    <span className="text-xl mb-1 text-pink-100 font-medium">semanas</span>
                    <span className="text-5xl font-extrabold ml-2">{days}</span>
                    <span className="text-xl mb-1 text-pink-100 font-medium">dias</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-xs text-pink-100 uppercase">Trimestre</p>
                    <p className="font-bold text-lg">{trimestre}º Trimestre</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-xs text-pink-100 uppercase">Data do Parto</p>
                    <p className="font-bold text-lg">{dpp?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-pink-100">
                <span className="text-4xl block mb-2">🤰</span>
                <p>Preencha a data ao lado para calcular sua idade gestacional.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      {dateStr && (
        <div className="mt-8 pt-6 border-t border-pink-100">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Início</span>
            <span className={trimestre === 1 ? 'text-pink-500' : ''}>1º Tri (1-13s)</span>
            <span className={trimestre === 2 ? 'text-pink-500' : ''}>2º Tri (14-26s)</span>
            <span className={trimestre === 3 ? 'text-pink-500' : ''}>3º Tri (27-40s)</span>
            <span>Nascimento</span>
          </div>
          <div className="h-4 bg-pink-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
