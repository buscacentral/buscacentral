'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function RemovedorDuplicatas() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, final: 0, removed: 0 });

  const processList = (mode: 'remove-duplicates' | 'sort-asc' | 'sort-desc' | 'both') => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const originalCount = lines.length;

    let result: string[] = [];

    switch (mode) {
      case 'remove-duplicates':
        result = [...new Set(lines)];
        break;
      case 'sort-asc':
        result = [...new Set(lines)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        break;
      case 'sort-desc':
        result = [...new Set(lines)].sort((a, b) => b.localeCompare(a, 'pt-BR'));
        break;
      case 'both':
        result = [...new Set(lines)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        break;
    }

    setOutput(result.join('\n'));
    setStats({
      original: originalCount,
      final: result.length,
      removed: originalCount - result.length,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Removedor de Duplicatas</h1>
      <p className="text-gray-600 mb-8">
        Remova linhas duplicadas e ordene suas listas automaticamente.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lista Original</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole sua lista aqui (um item por linha)..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
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
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => processList('remove-duplicates')}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Remover Duplicatas
        </button>
        <button
          onClick={() => processList('sort-asc')}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Ordenar A-Z
        </button>
        <button
          onClick={() => processList('sort-desc')}
          className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Ordenar Z-A
        </button>
        <button
          onClick={() => processList('both')}
          className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          Remover + Ordenar
        </button>
      </div>

      {stats.original > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 flex gap-6">
          <div>
            <span className="text-sm text-gray-500">Original:</span>
            <span className="ml-2 font-bold">{stats.original} linhas</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Resultado:</span>
            <span className="ml-2 font-bold">{stats.final} linhas</span>
          </div>
          {stats.removed > 0 && (
            <div>
              <span className="text-sm text-gray-500">Removidas:</span>
              <span className="ml-2 font-bold text-red-600">{stats.removed} duplicatas</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
