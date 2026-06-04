'use client';

import { useState } from 'react';

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

      <button
        onClick={computeDiff}
        disabled={!text1 && !text2}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 mb-6"
      >
        Comparar Textos
      </button>

      {showDiff && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex gap-4 mb-4">
            <span className="text-sm font-medium text-green-600">+ {stats.added} adicionadas</span>
            <span className="text-sm font-medium text-red-600">- {stats.removed} removidas</span>
            <span className="text-sm font-medium text-gray-500">{stats.equal} iguais</span>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 ${
                    line.type === 'added'
                      ? 'bg-green-900/50 text-green-300'
                      : line.type === 'removed'
                      ? 'bg-red-900/50 text-red-300'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="inline-block w-6 text-gray-500">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  {line.text || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>
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
