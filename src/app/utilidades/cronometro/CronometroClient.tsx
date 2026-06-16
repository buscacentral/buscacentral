'use client';

import { useState, useEffect, useRef } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';

export default function CronometroClient() {
  const [modo, setModo] = useState<'cronometro' | 'timer'>('cronometro');
  
  // Cronômetro state
  const [cTempo, setCTempo] = useState(0); // em ms
  const [cRunning, setCRunning] = useState(false);
  const [voltas, setVoltas] = useState<{lap: number, total: number}[]>([]);
  const cRef = useRef<NodeJS.Timeout | null>(null);
  const cStart = useRef(0);

  // Timer state
  const [tInputStr, setTInputStr] = useState('00:05:00');
  const [tTempo, setTTempo] = useState(300000); // 5 min em ms
  const [tRunning, setTRunning] = useState(false);
  const tRef = useRef<NodeJS.Timeout | null>(null);
  const tTarget = useRef(0);

  // Audio for timer
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    return () => {
      if (cRef.current) clearInterval(cRef.current);
      if (tRef.current) clearInterval(tRef.current);
    };
  }, []);

  // --- Cronômetro ---
  const toggleC = () => {
    if (cRunning) {
      clearInterval(cRef.current!);
      setCRunning(false);
    } else {
      cStart.current = Date.now() - cTempo;
      cRef.current = setInterval(() => {
        setCTempo(Date.now() - cStart.current);
      }, 10);
      setCRunning(true);
    }
  };

  const resetC = () => {
    clearInterval(cRef.current!);
    setCRunning(false);
    setCTempo(0);
    setVoltas([]);
  };

  const addVolta = () => {
    if (cRunning) {
      const lastTotal = voltas.length > 0 ? voltas[0].total : 0;
      setVoltas([{ lap: cTempo - lastTotal, total: cTempo }, ...voltas]);
    }
  };

  // --- Timer ---
  const parseTInput = () => {
    const parts = tInputStr.split(':').map(n => parseInt(n) || 0);
    let ms = 0;
    if (parts.length === 3) {
      ms = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    } else if (parts.length === 2) {
      ms = (parts[0] * 60 + parts[1]) * 1000;
    } else if (parts.length === 1) {
      ms = parts[0] * 1000;
    }
    setTTempo(ms);
    return ms;
  };

  const toggleT = () => {
    if (tRunning) {
      clearInterval(tRef.current!);
      setTRunning(false);
    } else {
      let currentMs = tTempo;
      if (currentMs <= 0) currentMs = parseTInput();
      if (currentMs <= 0) return;
      
      tTarget.current = Date.now() + currentMs;
      tRef.current = setInterval(() => {
        const remaining = tTarget.current - Date.now();
        if (remaining <= 0) {
          clearInterval(tRef.current!);
          setTTempo(0);
          setTRunning(false);
          audioRef.current?.play().catch(e => console.log('Audio play failed', e));
        } else {
          setTTempo(remaining);
        }
      }, 50);
      setTRunning(true);
    }
  };

  const resetT = () => {
    clearInterval(tRef.current!);
    setTRunning(false);
    parseTInput();
  };

  // Formatting
  const formatTime = (ms: number, includeMs = true) => {
    const totalS = Math.floor(ms / 1000);
    const h = Math.floor(totalS / 3600);
    const m = Math.floor((totalS % 3600) / 60);
    const s = totalS % 60;
    const millis = Math.floor((ms % 1000) / 10);
    
    let str = '';
    if (h > 0) str += `${h.toString().padStart(2, '0')}:`;
    str += `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (includeMs) str += `.${millis.toString().padStart(2, '0')}`;
    return str;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm inline-flex mb-6 w-full sm:w-auto">
            <button
              onClick={() => { setModo('cronometro'); resetT(); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${modo === 'cronometro' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              ⏱️ Cronômetro
            </button>
            <button
              onClick={() => { setModo('timer'); resetC(); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${modo === 'timer' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              ⏳ Temporizador (Timer)
            </button>
          </div>
        </div>

        <div className="lg:col-span-12">
          {modo === 'cronometro' ? (
            <ResultCard title="Cronômetro" className="border-0 shadow-none bg-slate-50 border-slate-200 border">
              <div className="flex flex-col items-center py-10">
                <div className="text-6xl sm:text-8xl font-mono font-black text-slate-800 tracking-tighter mb-10 tabular-nums">
                  {formatTime(cTempo)}
                </div>
                <div className="flex gap-4">
                  <button onClick={toggleC} className={`w-32 h-14 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${cRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                    {cRunning ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button onClick={cRunning ? addVolta : resetC} className="w-32 h-14 rounded-full font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-sm transition-transform active:scale-95">
                    {cRunning ? 'Volta' : 'Zerar'}
                  </button>
                </div>
              </div>

              {voltas.length > 0 && (
                <div className="max-w-md mx-auto mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0">
                        <tr>
                          <th className="px-4 py-3 border-b">Volta</th>
                          <th className="px-4 py-3 border-b text-right">Tempo da Volta</th>
                          <th className="px-4 py-3 border-b text-right">Tempo Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voltas.map((v, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-slate-50 text-slate-700 font-mono">
                            <td className="px-4 py-3">{voltas.length - i}</td>
                            <td className="px-4 py-3 text-right text-slate-500">{formatTime(v.lap)}</td>
                            <td className="px-4 py-3 text-right font-semibold">{formatTime(v.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </ResultCard>
          ) : (
            <ResultCard title="Temporizador" className="border-0 shadow-none bg-slate-50 border-slate-200 border">
              <div className="flex flex-col items-center py-10">
                {!tRunning && tTempo === 0 ? (
                  <input
                    type="text"
                    value={tInputStr}
                    onChange={e => { setTInputStr(e.target.value); parseTInput(); }}
                    placeholder="HH:MM:SS"
                    className="text-5xl sm:text-7xl font-mono font-black text-center text-slate-800 bg-white border-2 border-slate-300 rounded-2xl p-4 mb-10 w-full max-w-sm focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none"
                    onBlur={parseTInput}
                  />
                ) : (
                  <div className={`text-6xl sm:text-8xl font-mono font-black tracking-tighter mb-10 tabular-nums ${tTempo === 0 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                    {formatTime(tTempo, false)}
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button onClick={toggleT} className={`w-32 h-14 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${tRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                    {tRunning ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button onClick={resetT} className="w-32 h-14 rounded-full font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-sm transition-transform active:scale-95">
                    Zerar
                  </button>
                </div>

                {!tRunning && (
                  <div className="flex gap-2 mt-8">
                    {['00:01:00', '00:05:00', '00:10:00', '00:30:00'].map(t => (
                      <button key={t} onClick={() => { setTInputStr(t); setTimeout(parseTInput, 10); }} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
                        +{parseInt(t.split(':')[1])}m
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ResultCard>
          )}
        </div>
      </div>
    </>
  );
}
