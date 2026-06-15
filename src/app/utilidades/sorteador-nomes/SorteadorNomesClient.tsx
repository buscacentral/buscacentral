'use client';

import React, { useState } from 'react';

export default function SorteadorNomesClient() {
  const [namesText, setNamesText] = useState('');
  const [numWinners, setNumWinners] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSortear = () => {
    if (!namesText.trim()) return;

    const nameList = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (nameList.length === 0) return;

    // Reset state and trigger animation
    setWinners([]);
    setIsAnimating(true);

    // Wait a bit to simulate suspense
    setTimeout(() => {
      // Shuffle array logic
      const shuffled = [...nameList].sort(() => 0.5 - Math.random());
      const selectedWinners = shuffled.slice(0, Math.max(1, Math.min(numWinners, nameList.length)));
      
      setWinners(selectedWinners);
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Entrada de Dados */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">📝</span> Lista de Nomes
          </h2>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Digite os nomes (um por linha)</label>
              <textarea
                className="w-full p-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed"
                rows={10}
                placeholder="João da Silva&#10;Maria Souza&#10;Pedro Santos&#10;Ana Paula..."
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
              ></textarea>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>Total de nomes: {namesText.split('\n').filter(n => n.trim()).length}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantos ganhadores?</label>
              <input
                type="number"
                min="1"
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={numWinners}
                onChange={(e) => setNumWinners(parseInt(e.target.value) || 1)}
              />
            </div>

            <button
              onClick={handleSortear}
              disabled={isAnimating || !namesText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black uppercase tracking-widest py-4 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {isAnimating ? (
                <span className="animate-pulse">Sorteando... 🎲</span>
              ) : (
                <span>Sortear Agora 🎲</span>
              )}
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Resultado
          </h2>

          <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center min-h-[300px]">
            {isAnimating ? (
              <div className="text-center">
                <div className="text-6xl animate-bounce mb-4">🎰</div>
                <p className="text-indigo-600 font-bold animate-pulse">Embaralhando os nomes...</p>
              </div>
            ) : winners.length > 0 ? (
              <div className="w-full text-center space-y-6">
                <h3 className="text-2xl font-black text-indigo-800 uppercase">
                  {winners.length === 1 ? 'O Ganhador é:' : 'Os Ganhadores são:'}
                </h3>
                
                <ul className="space-y-3">
                  {winners.map((winner, index) => (
                    <li key={index} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200 text-xl font-bold text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'both' }}>
                      <span className="text-indigo-500 mr-2">#{index + 1}</span> {winner}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setWinners([]);
                    setNamesText('');
                  }}
                  className="mt-6 text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline"
                >
                  Fazer novo sorteio limpo
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <span className="text-5xl block mb-4 opacity-50">🎁</span>
                <p>Os ganhadores aparecerão aqui.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
