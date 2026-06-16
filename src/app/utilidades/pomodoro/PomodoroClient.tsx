'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMES: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const playAlarm = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play();
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

export default function PomodoroClient() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMES.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(TIMES[newMode]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer finalizado: dispara o alarme e avança o ciclo.
      // setState aqui é intencional (reação à contagem chegar a zero).
      /* eslint-disable react-hooks/set-state-in-effect */
      playAlarm();
      setIsRunning(false);

      if (mode === 'pomodoro') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('pomodoro');
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, mode, cycles, switchMode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMES[mode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Dynamically update document title with the timer
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${mode === 'pomodoro' ? 'Foco' : 'Pausa'} | BuscaCentral`;
    return () => {
      document.title = 'Cronômetro Pomodoro Online | BuscaCentral';
    };
  }, [timeLeft, mode]);

  const getBgColor = () => {
    if (mode === 'pomodoro') return 'from-red-500 to-rose-600';
    if (mode === 'shortBreak') return 'from-teal-400 to-emerald-500';
    return 'from-blue-500 to-indigo-600';
  };

  return (
    <div className={`bg-gradient-to-br ${getBgColor()} p-6 md:p-12 rounded-3xl shadow-xl border border-white/20 max-w-2xl mx-auto transition-colors duration-500`}>
      
      <div className="flex justify-center gap-2 mb-8 bg-black/10 p-1.5 rounded-xl backdrop-blur-sm w-fit mx-auto">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'pomodoro' ? 'bg-white text-red-600 shadow' : 'text-white/80 hover:bg-white/20'}`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'shortBreak' ? 'bg-white text-teal-600 shadow' : 'text-white/80 hover:bg-white/20'}`}
        >
          Pausa Curta
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'longBreak' ? 'bg-white text-blue-600 shadow' : 'text-white/80 hover:bg-white/20'}`}
        >
          Pausa Longa
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="text-[100px] md:text-[140px] font-extrabold text-white leading-none tracking-tighter drop-shadow-md font-mono">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex justify-center items-center gap-6">
        <button
          onClick={toggleTimer}
          className={`px-10 py-4 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95 ${isRunning ? 'bg-white/20 text-white border-2 border-white/50' : 'bg-white text-slate-900'}`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>

        {(!isRunning && timeLeft !== TIMES[mode]) && (
          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-white/20 text-white hover:bg-white/30 transition-colors"
            title="Zerar cronômetro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-12 text-center text-white/80 font-medium">
        <p>Ciclos concluídos: <span className="font-bold text-white text-lg">{cycles}</span></p>
      </div>

    </div>
  );
}
