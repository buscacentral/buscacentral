'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

type Tab = 'json' | 'xml';

function formatJSON(input: string): { result: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'JSON inválido';
    return { result: '', error: msg };
  }
}

function minifyJSON(input: string): { result: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed), error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'JSON inválido';
    return { result: '', error: msg };
  }
}

function validateJSON(input: string): { valid: boolean; error: string | null } {
  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'JSON inválido';
    const lineMatch = msg.match(/position\s+(\d+)/);
    let errorMsg = msg;
    if (lineMatch) {
      const pos = parseInt(lineMatch[1]);
      const lines = input.substring(0, pos).split('\n');
      errorMsg = `Erro na linha ${lines.length}: ${msg}`;
    }
    return { valid: false, error: errorMsg };
  }
}

function formatXML(input: string): { result: string; error: string | null } {
  try {
    const xml = input.trim();
    if (!xml.startsWith('<')) return { result: '', error: 'XML inválido: não começa com tag' };

    let formatted = '';
    let indent = 0;
    const lines = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/).filter(Boolean);

    for (const line of lines) {
      if (line.match(/^<\/\w/)) indent--;
      formatted += '  '.repeat(Math.max(indent, 0)) + line.trim() + '\n';
      if (line.match(/^<\w[^>]*[^\/]>$/) && !line.match(/^<\?/)) indent++;
    }

    return { result: formatted.trim(), error: null };
  } catch {
    return { result: '', error: 'Erro ao formatar XML' };
  }
}

function minifyXML(input: string): { result: string; error: string | null } {
  try {
    const minified = input.replace(/>\s+</g, '><').replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    return { result: minified, error: null };
  } catch {
    return { result: '', error: 'Erro ao minificar XML' };
  }
}

function validateXML(input: string): { valid: boolean; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed.startsWith('<')) return { valid: false, error: 'XML inválido: não começa com tag' };

  const openTags: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)[^>]*\/?>/g;
  let match;

  while ((match = tagRegex.exec(trimmed)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith('<?')) continue;
    if (fullTag.startsWith('<!')) continue;
    if (fullTag.endsWith('/>')) continue;
    if (fullTag.startsWith('</')) {
      if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
        return { valid: false, error: `Tag de fechamento inesperada: </${tagName}>` };
      }
      openTags.pop();
    } else {
      openTags.push(tagName);
    }
  }

  if (openTags.length > 0) {
    return { valid: false, error: `Tags não fechadas: ${openTags.join(', ')}` };
  }

  return { valid: true, error: null };
}

export default function FormatadorCodigoClient() {
  const [tab, setTab] = useState<Tab>('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (tab === 'json') {
      const { result, error } = formatJSON(input);
      setOutput(result);
      setError(error || '');
    } else {
      const { result, error } = formatXML(input);
      setOutput(result);
      setError(error || '');
    }
  };

  const handleMinify = () => {
    if (tab === 'json') {
      const { result, error } = minifyJSON(input);
      setOutput(result);
      setError(error || '');
    } else {
      const { result, error } = minifyXML(input);
      setOutput(result);
      setError(error || '');
    }
  };

  const handleValidate = () => {
    if (tab === 'json') {
      const { valid, error } = validateJSON(input);
      if (valid) {
        setError('');
        setOutput('✅ JSON válido!');
      } else {
        setError(error || 'JSON inválido');
        setOutput('');
      }
    } else {
      const { valid, error } = validateXML(input);
      if (valid) {
        setError('');
        setOutput('✅ XML válido!');
      } else {
        setError(error || 'XML inválido');
        setOutput('');
      }
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {(['json', 'xml'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setInput(''); setOutput(''); setError(''); }}
              className={`flex-1 py-3 px-4 font-semibold text-sm transition-colors ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.toUpperCase()} Formatter
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cole seu {tab.toUpperCase()} aqui
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === 'json' ? '{"chave": "valor"}' : '<root><item>valor</item></root>'}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={handleFormat} variant="primary" className="flex-1 sm:flex-none">
              Formatar
            </Button>
            <Button onClick={handleMinify} variant="secondary" className="flex-1 sm:flex-none bg-slate-800 text-white hover:bg-slate-900 border-none">
              Minificar
            </Button>
            <Button onClick={handleValidate} className="flex-1 sm:flex-none bg-emerald-600 text-white hover:bg-emerald-700 border-none">
              Validar
            </Button>
            <Button onClick={handleCopy} disabled={!output} variant="outline" className="flex-1 sm:flex-none">
              {copied ? '✅ Copiado!' : '📋 Copiar'}
            </Button>
            <Button onClick={handleClear} variant="ghost" className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50">
              🗑️ Limpar
            </Button>
          </div>

          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          {output && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
              <textarea
                value={output}
                readOnly
                className="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm resize-y"
              />
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Por que formatar JSON e XML?</h2>
        <p>
          JSON e XML são os formatos de dados mais utilizados em APIs e integrações. Código minificado
          ou mal indentado é difícil de ler e depurar. Esta ferramenta organiza automaticamente seu
          código, facilitando a análise e correção de erros.
        </p>
        <h2>Validação de JSON e XML</h2>
        <p>
          A validação verifica se a sintaxe está correta. Para JSON, verifica se o parse é possível.
          Para XML, verifica se todas as tags estão abertas e fechadas corretamente.
        </p>
      </article>
    </>
  );
}
