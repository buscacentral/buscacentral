'use client';

import { useState, useEffect } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';

export default function TimestampClient() {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimestampToDate = () => {
    setError('');
    try {
      const ts = parseInt(inputTimestamp);
      if (isNaN(ts)) {
        setError('Digite um timestamp válido');
        return;
      }
      const date = new Date(ts * 1000);
      setConvertedDate(date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'full',
        timeStyle: 'long',
      }));
    } catch {
      setError('Erro na conversão');
    }
  };

  const handleDateToTimestamp = () => {
    setError('');
    try {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
        setError('Digite uma data válida');
        return;
      }
      setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch {
      setError('Erro na conversão');
    }
  };

  return (
    <>
      <div className="space-y-8 max-w-4xl mx-auto">
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      <ResultCard title="Timestamp Atual" className="border-sky-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
          <div>
            <p className="text-5xl font-mono font-black text-sky-600 tracking-tight drop-shadow-sm">{currentTimestamp}</p>
            <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">Segundos desde 01/01/1970 UTC</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <CopyButton text={currentTimestamp.toString()} label="Copiar Atual" />
          </div>
        </div>
      </ResultCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResultCard title="Timestamp → Data" className="h-full">
          <div className="space-y-4 flex flex-col h-full">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Timestamp (Segundos)</label>
              <input
                type="text"
                value={inputTimestamp}
                onChange={(e) => setInputTimestamp(e.target.value)}
                placeholder="Ex: 1700000000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-lg transition-colors"
              />
            </div>
            <Button onClick={handleTimestampToDate} className="w-full">
              Converter para Data
            </Button>
            
            <div className="flex-grow flex flex-col justify-end">
              {convertedDate ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mt-4 animate-fade-in text-center">
                  <p className="text-emerald-800 font-bold">{convertedDate}</p>
                </div>
              ) : (
                <div className="h-[74px] mt-4 border-2 border-dashed border-slate-100 rounded-lg"></div>
              )}
            </div>
          </div>
        </ResultCard>

        <ResultCard title="Data → Timestamp" className="h-full">
          <div className="space-y-4 flex flex-col h-full">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Data Local</label>
              <input
                type="datetime-local"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 transition-colors"
              />
            </div>
            <Button onClick={handleDateToTimestamp} className="w-full">
              Converter para Timestamp
            </Button>

            <div className="flex-grow flex flex-col justify-end">
              {convertedTimestamp ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mt-4 animate-fade-in flex items-center justify-between">
                  <p className="text-emerald-800 font-mono font-black text-2xl">{convertedTimestamp}</p>
                  <CopyButton text={convertedTimestamp} label="" />
                </div>
              ) : (
                <div className="h-[74px] mt-4 border-2 border-dashed border-slate-100 rounded-lg"></div>
              )}
            </div>
          </div>
        </ResultCard>
      </div>
    </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é timestamp Unix?</h2>
        <p>
          O timestamp Unix é o número de segundos decorridos desde 1º de janeiro de 1970, 00:00:00 UTC. 
          É amplamente usado em sistemas computacionais para representar data e hora de forma padronizada.
        </p>
      </article>
    </>
  );
}
