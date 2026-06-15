'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch {
      setError('Erro na conversão. Verifique o input.');
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Codificar
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decodificar
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? 'Texto para codificar' : 'Base64 para decodificar'}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Digite seu texto aqui…' : 'Cole o Base64 aqui…'}
            rows={4}
            spellCheck={false}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleConvert}
          fullWidth
          className="mb-6 group"
          leftIcon={<span className="group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>}
        >
          {mode === 'encode' ? 'Codificar' : 'Decodificar'}
        </Button>

        {error && (
          <Alert variant="error" className="mb-4">{error}</Alert>
        )}

        {output && (
          <ResultCard title="Resultado">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Texto Final</span>
              <CopyButton text={output} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
              <p className="font-mono text-sm sm:text-base text-gray-900 break-all">{output}</p>
            </div>
          </ResultCard>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é Base64?</h2>
        <p>
          Base64 é um esquema de codificação que representa dados binários em formato de texto ASCII. 
          É amplamente usado para transmitir dados em URLs, emails e APIs que trabalham com texto.
        </p>
      </article>
    </>
  );
}
