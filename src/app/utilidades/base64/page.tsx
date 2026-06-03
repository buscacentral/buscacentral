'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function Base64() {
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Codificador Base64</h1>
      <p className="text-gray-600 mb-8">
        Codifique ou decodifique textos em Base64.
      </p>

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
            placeholder={mode === 'encode' ? 'Digite seu texto aqui...' : 'Cole o Base64 aqui...'}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        <button
          onClick={handleConvert}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
        >
          {mode === 'encode' ? 'Codificar' : 'Decodificar'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
            ❌ {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Resultado:</span>
              <CopyButton text={output} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-mono text-sm text-gray-900 break-all">{output}</p>
            </div>
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é Base64?</h2>
        <p>
          Base64 é um esquema de codificação que representa dados binários em formato de texto ASCII. 
          É amplamente usado para transmitir dados em URLs, emails e APIs que trabalham com texto.
        </p>
      </article>
    </div>
  );
}
