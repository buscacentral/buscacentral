'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function GeradorUUIDClient() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade (1-10)
          </label>
          <input
            id="count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
        >
          Gerar UUID{count > 1 ? 's' : ''}
        </button>

        {uuids.length > 0 && (
          <div className="space-y-3">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <code className="flex-1 font-mono text-sm text-gray-900 break-all">{uuid}</code>
                <CopyButton text={uuid} label="Copiar" />
              </div>
            ))}
            {uuids.length > 1 && (
              <button
                onClick={() => navigator.clipboard.writeText(uuids.join('\n'))}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Copiar todos
              </button>
            )}
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é um UUID?</h2>
        <p>
          UUID (Universally Unique Identifier) é um identificador de 128 bits gerado de forma 
          aleatória. O UUID v4 utiliza números aleatórios e tem probabilidade praticamente zero 
          de colisão. É amplamente usado em bancos de dados, APIs e sistemas distribuídos.
        </p>
        <h2>Formato</h2>
        <p>
          O UUID v4 segue o formato: <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>, onde 
          o &quot;4&quot; indica a versão e o caractere &quot;y&quot; é sempre 8, 9, a ou b.
        </p>
      </article>
    </>
  );
}
