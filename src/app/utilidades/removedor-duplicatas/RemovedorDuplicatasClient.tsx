'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

export default function RemovedorDuplicatasClient() {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Lista Original</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole sua lista aqui (um item por linha)..."
            rows={12}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none font-mono text-sm shadow-inner transition-colors"
          />

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => processList('remove-duplicates')}
              variant="outline"
              className="w-full text-sm font-bold border-sky-200 text-sky-700 hover:bg-sky-50"
            >
              🧹 Remover Duplicatas
            </Button>
            <Button
              onClick={() => processList('sort-asc')}
              variant="outline"
              className="w-full text-sm font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              ⬇️ Ordenar A-Z
            </Button>
            <Button
              onClick={() => processList('sort-desc')}
              variant="outline"
              className="w-full text-sm font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              ⬆️ Ordenar Z-A
            </Button>
            <Button
              onClick={() => processList('both')}
              className="w-full text-sm font-bold"
            >
              ✨ Limpar + Ordenar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ResultCard title="Resultado" className="h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-end mb-3">
              {output && <CopyButton text={output} label="Copiar Texto" />}
            </div>
            
            <textarea
              value={output}
              readOnly
              rows={12}
              placeholder="O resultado aparecerá aqui..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 resize-none font-mono text-sm text-slate-800 shadow-inner flex-grow focus:outline-none"
            />

            {stats.original > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 bg-sky-50 rounded-lg p-3 border border-sky-100">
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Original</span>
                  <span className="block font-black text-slate-800 text-lg">{stats.original}</span>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Final</span>
                  <span className="block font-black text-sky-600 text-lg">{stats.final}</span>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Removidas</span>
                  <span className="block font-black text-rose-500 text-lg">{stats.removed}</span>
                </div>
              </div>
            )}
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
