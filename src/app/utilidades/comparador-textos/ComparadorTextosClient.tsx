'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface DiffResult {
  type: 'equal' | 'added' | 'removed';
  text: string;
}

export default function ComparadorTextosClient() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<DiffResult[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const computeDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: DiffResult[] = [];

    const maxLen = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        result.push({ type: 'equal', text: line1 });
      } else {
        if (line1) {
          result.push({ type: 'removed', text: line1 });
        }
        if (line2) {
          result.push({ type: 'added', text: line2 });
        }
      }
    }

    setDiff(result);
    setShowDiff(true);
  };

  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    equal: diff.filter(d => d.type === 'equal').length,
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto Original</label>
          <textarea
            value={text1}
            onChange={(e) => { setText1(e.target.value); setShowDiff(false); }}
            placeholder="Cole o texto original aqui..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto Modificado</label>
          <textarea
            value={text2}
            onChange={(e) => { setText2(e.target.value); setShowDiff(false); }}
            placeholder="Cole o texto modificado aqui..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>
      </div>

      <Button
        onClick={computeDiff}
        disabled={!text1 && !text2}
        fullWidth
        className="mb-6 group"
        leftIcon={<span className="group-hover:rotate-180 transition-transform duration-500 inline-block">⚖️</span>}
      >
        Comparar Textos
      </Button>

      {showDiff ? (
        <ResultCard title="Resultado da Comparação">
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-100">
            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <span className="mr-2">+</span> {stats.added} linhas adicionadas
            </span>
            <span className="flex items-center text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              <span className="mr-2">-</span> {stats.removed} linhas removidas
            </span>
            <span className="flex items-center text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
              <span className="mr-2">=</span> {stats.equal} linhas iguais
            </span>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner border border-slate-800">
            <pre className="text-sm font-mono leading-relaxed">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 rounded-sm ${
                    line.type === 'added'
                      ? 'bg-emerald-900/40 text-emerald-300'
                      : line.type === 'removed'
                      ? 'bg-rose-900/40 text-rose-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="inline-block w-6 text-slate-500 select-none">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span className="break-all whitespace-pre-wrap">{line.text || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </ResultCard>
      ) : (
        <EmptyState
          icon="🔍"
          title="Pronto para comparar"
          description="Preencha os dois campos acima e clique em Comparar Textos para ver a diferença detalhada entre eles."
        />
      )}

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Para que serve o comparador de textos?</h2>
        <p>
          O comparador de textos (Diff Checker) é essencial para revisores, programadores e redatores. 
          Ele mostra exatamente o que mudou entre dois textos, destacando linhas adicionadas em verde 
          e removidas em vermelho.
        </p>
      </article>
    </>
  );
}
