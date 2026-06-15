'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';

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
            placeholder="Onde estão os emails? Cole qualquer texto, HTML, código ou documento..."
            rows={10}
            spellCheck={false}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm transition-all focus:shadow-md"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            onClick={extractEmails}
            disabled={!input.trim()}
            leftIcon="🔍"
            className="flex-1"
          >
            Extrair Emails
          </Button>
          <Button
            onClick={handleClear}
            variant="secondary"
          >
            Limpar
          </Button>
        </div>

        {!input && emails.length === 0 && (
          <EmptyState
            icon="📧"
            title=""
            description="Cole um texto acima para buscar por endereços de email válidos."
            className="mt-4"
            minHeight="min-h-[200px]"
          />
        )}

        {emails.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4">
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
                    className="group flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-100 transition-all duration-200 hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-700 group-hover:text-blue-600 hover:underline font-mono text-sm transition-colors truncate pr-4"
                    >
                      {email}
                    </a>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton text={email} label="Copiar" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {input && emails.length === 0 && (
          <Alert variant="warning" className="mt-4">
            Nenhum email encontrado no texto informado. Verifique se o formato está correto.
          </Alert>
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
