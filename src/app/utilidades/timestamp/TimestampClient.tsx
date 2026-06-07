'use client';

import { useState, useEffect } from 'react';
import CopyButton from '@/components/CopyButton';

export default function TimestampClient() {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  useEffect(() => {
    setCurrentTimestamp(Math.floor(Date.now() / 1000));
  }, []);
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
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamp Atual</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-4xl font-mono font-bold text-blue-600">{currentTimestamp}</p>
          <p className="text-sm text-gray-500 mt-2">segundos desde 01/01/1970 00:00:00 UTC</p>
        </div>
        <div className="mt-4 flex justify-center">
          <CopyButton text={currentTimestamp.toString()} label="Copiar timestamp" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamp → Data</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="Ex: 1700000000"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={handleTimestampToDate}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Converter
          </button>
        </div>
        {convertedDate && (
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-800 font-medium">{convertedDate}</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data → Timestamp</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="datetime-local"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleDateToTimestamp}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Converter
          </button>
        </div>
        {convertedTimestamp && (
          <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-800 font-mono font-bold text-xl">{convertedTimestamp}</p>
            <CopyButton text={convertedTimestamp} label="Copiar" />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          ❌ {error}
        </div>
      )}

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
