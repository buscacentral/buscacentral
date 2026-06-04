'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function ExtratorEmailsClient() {
  const [input, setInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, unique: 0 });

  const extractEmails = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const found = input.match(regex) || [];
    const unique = [...new Set(found.map(e => e.toLowerCase()))];
    
    setEmails(unique);
    setStats({ total: found.length, unique: unique.length });
  };

  const handleClear = () => {
    setInput('');
    setEmails([]);
    setStats({ total: 0, unique: 0 });
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Cole o texto aqui
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole qualquer texto, HTML, código ou documento que contenha emails..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={extractEmails}
            disabled={!input.trim()}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Extrair Emails
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Limpar
          </button>
        </div>

        {emails.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">
                  Encontrados: <strong className="text-gray-900">{stats.total}</strong>
                </span>
                <span className="text-sm text-gray-500">
                  Únicos: <strong className="text-green-600">{stats.unique}</strong>
                </span>
              </div>
              <CopyButton text={emails.join('\n')} label="Copiar todos" />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-100"
                  >
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-600 hover:underline font-mono text-sm"
                    >
                      {email}
                    </a>
                    <CopyButton text={email} label="Copiar" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {input && emails.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Nenhum email encontrado no texto informado.
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o Extrator de Emails?</h2>
        <p>
          O extrator usa expressões regulares para identificar padrões de endereços de email 
          em qualquer texto. Ele reconhece formatos como usuario@dominio.com, 
          nome.sobrenome@empresa.com.br e outros padrões comuns.
        </p>
        <h2>Casos de uso</h2>
        <ul>
          <li>Extrair contatos de páginas web ou documentos</li>
          <li>Limpar listas de email removendo duplicatas</li>
          <li>Verificar se um texto contém endereços de email</li>
          <li>Preparar listas para campanhas de marketing</li>
        </ul>
      </article>
    </>
  );
}
