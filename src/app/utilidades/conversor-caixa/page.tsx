'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function ConversorCaixa() {
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversor de Caixa de Texto</h1>
      <p className="text-gray-600 mb-8">
        Transforme seu texto em diferentes formatos com um clique.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto Original</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Resultado</label>
            {output && <CopyButton text={output} label="Copiar" />}
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {transformations.map((t) => (
          <button
            key={t.name}
            onClick={() => setOutput(t.transform(input))}
            disabled={!input}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl font-mono font-bold text-blue-600 w-10">{t.icon}</span>
            <span className="text-sm font-medium text-gray-700">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
