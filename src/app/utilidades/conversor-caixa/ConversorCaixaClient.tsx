'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ConversorCaixaClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const transformations = [
    {
      name: 'TUDO MAIÚSCULO',
      icon: 'AA',
      transform: (text: string) => text.toUpperCase(),
    },
    {
      name: 'tudo minúsculo',
      icon: 'aa',
      transform: (text: string) => text.toLowerCase(),
    },
    {
      name: 'Primeira Letra Maiúscula',
      icon: 'Aa',
      transform: (text: string) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase()),
    },
    {
      name: 'InVeRtIdO',
      icon: 'aA',
      transform: (text: string) =>
        text
          .split('')
          .map((char) =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join(''),
    },
    {
      name: 'Capitalizar Frases',
      icon: '.A',
      transform: (text: string) =>
        text.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase()),
    },
    {
      name: 'Remover Espaços Extras',
      icon: '⎵',
      transform: (text: string) => text.replace(/\s+/g, ' ').trim(),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Texto Original</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow hover:shadow-sm"
          />
        </div>
        <div>
          {output ? (
            <ResultCard title="Resultado" className="h-full flex flex-col m-0 border-gray-300">
              <div className="flex-1 relative group">
                <textarea
                  value={output}
                  readOnly
                  rows={8}
                  className="w-full h-full px-4 py-3 bg-transparent resize-none font-medium text-gray-800 focus:outline-none"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={output} label="Copiar" />
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center p-6">
              <EmptyState 
                icon="Aa" 
                title="Aguardando texto" 
                description="Escolha uma das opções abaixo para transformar seu texto."
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {transformations.map((t) => (
          <button
            key={t.name}
            onClick={() => setOutput(t.transform(input))}
            disabled={!input}
            className="group flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:shadow-none"
          >
            <span className="text-2xl font-mono font-black text-blue-600 group-hover:scale-110 transition-transform duration-300">{t.icon}</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">{t.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
