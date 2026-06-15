'use client';

import React, { useState } from 'react';

export default function CalculadoraAmorClient() {
  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calcularAmor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome1.trim() || !nome2.trim()) return;

    setIsCalculating(true);
    setResultado(null);

    setTimeout(() => {
      // Deterministic hash based on names so the result is always the same for the same couple
      const combined = (nome1.trim().toLowerCase() + nome2.trim().toLowerCase()).replace(/\s+/g, '');
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0; 
      }
      
      // Map hash to 0-100
      let percentage = Math.abs(hash) % 101;

      // Easter egg/bias: if names are too short, boost slightly so it's funnier
      if (percentage < 10) percentage += 30;

      setResultado(percentage);
      setIsCalculating(false);
    }, 1500);
  };

  const getMessage = (percent: number) => {
    if (percent >= 90) return { title: 'Almas Gêmeas! ❤️‍🔥', desc: 'Vocês nasceram um para o outro! O casamento já está marcado?', color: 'text-rose-600' };
    if (percent >= 70) return { title: 'Combinação Perfeita! 💕', desc: 'Existe uma atração muito forte. Invistam nesse romance!', color: 'text-pink-500' };
    if (percent >= 50) return { title: 'Tem Potencial! 💘', desc: 'Vocês combinam, mas vão precisar de diálogo para fazer dar certo.', color: 'text-orange-500' };
    if (percent >= 30) return { title: 'Apenas Bons Amigos? 🤷‍♀️', desc: 'Pode rolar alguma coisa, mas a "friendzone" está perigosa.', color: 'text-yellow-600' };
    return { title: 'Amor Impossível 💔', desc: 'Vish... as estrelas não estão ajudando muito esse casal. Foge que é cilada!', color: 'text-slate-500' };
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-rose-100 max-w-3xl mx-auto overflow-hidden relative">
      {/* Decorative background hearts */}
      <div className="absolute top-0 left-0 text-9xl opacity-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none">❤️</div>
      <div className="absolute bottom-0 right-0 text-9xl opacity-5 translate-x-1/4 translate-y-1/4 pointer-events-none">💖</div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-rose-100 p-4 rounded-full mb-4">
            <span className="text-5xl">💘</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-rose-600">Teste o Crush!</h2>
          <p className="text-slate-500 mt-2">Será que as estrelas abençoam essa união?</p>
        </div>

        <form onSubmit={calcularAmor} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Seu Nome</label>
              <input
                type="text"
                className="w-full p-4 rounded-full border-2 border-rose-200 focus:border-rose-500 focus:ring-0 outline-none text-center font-bold text-slate-800 bg-rose-50/30"
                placeholder="Ex: Romeu"
                value={nome1}
                onChange={(e) => setNome1(e.target.value)}
                required
              />
            </div>

            <div className="hidden md:flex justify-center text-rose-400 text-3xl font-black animate-pulse">
              +
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Nome do Crush</label>
              <input
                type="text"
                className="w-full p-4 rounded-full border-2 border-rose-200 focus:border-rose-500 focus:ring-0 outline-none text-center font-bold text-slate-800 bg-rose-50/30"
                placeholder="Ex: Julieta"
                value={nome2}
                onChange={(e) => setNome2(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isCalculating || !nome1.trim() || !nome2.trim()}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 text-white font-black text-lg py-4 px-10 rounded-full shadow-lg shadow-rose-200 transition-transform hover:scale-105 active:scale-95"
            >
              {isCalculating ? 'Consultando as Estrelas... ✨' : 'Calcular Amor! ❤️'}
            </button>
          </div>
        </form>

        {(resultado !== null || isCalculating) && (
          <div className="mt-12 text-center animate-in zoom-in duration-500">
            {isCalculating ? (
              <div className="p-10 border-4 border-dashed border-rose-200 rounded-3xl bg-rose-50/50">
                <div className="text-6xl animate-bounce mb-4">🔮</div>
                <p className="text-rose-600 font-bold text-xl animate-pulse">Calculando a química...</p>
              </div>
            ) : resultado !== null ? (
              <div className="p-8 border-4 border-rose-200 rounded-3xl bg-gradient-to-b from-white to-rose-50 shadow-inner">
                <div className="text-[120px] font-black leading-none drop-shadow-md mb-2">
                  <span className={getMessage(resultado).color}>{resultado}%</span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-4 mb-6 max-w-md mx-auto overflow-hidden">
                  <div 
                    className="h-4 rounded-full bg-gradient-to-r from-rose-400 to-pink-600 transition-all duration-1000 ease-out"
                    style={{ width: `${resultado}%` }}
                  ></div>
                </div>

                <h3 className={`text-3xl font-extrabold mb-3 ${getMessage(resultado).color}`}>
                  {getMessage(resultado).title}
                </h3>
                <p className="text-slate-600 text-lg max-w-sm mx-auto">
                  {getMessage(resultado).desc}
                </p>
                
                <button
                  onClick={() => {
                    setNome1('');
                    setNome2('');
                    setResultado(null);
                  }}
                  className="mt-8 text-rose-500 hover:text-rose-700 font-bold underline"
                >
                  Testar com outra pessoa (abafa) 🤫
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
