'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import { Alert } from '@/components/ui/Alert';

export default function GeradorSenhaClient() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const generatePassword = () => {
    setError('');
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setError('Selecione pelo menos um tipo de caractere');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const getStrength = () => {
    if (length < 8) return { label: 'Fraca', color: 'text-red-600' };
    if (length < 12) return { label: 'Média', color: 'text-yellow-600' };
    if (length < 16) return { label: 'Forte', color: 'text-green-600' };
    return { label: 'Muito Forte', color: 'text-green-700' };
  };

  const strength = getStrength();

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho: {length} caracteres
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Maiúsculas (A-Z)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Minúsculas (a-z)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Números (0-9)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Símbolos (!@#$...)</span>
          </label>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            onClick={generatePassword}
            fullWidth
            className="flex-1 group"
            leftIcon={<span className="group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>}
          >
            Gerar Senha
          </Button>
          {password && <CopyButton text={password} />}
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-4" />
        )}

        {password && (
          <ResultCard title="Sua Senha Segura">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Nível de Força</span>
              <span className={`text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-50 ${strength.color}`}>{strength.label}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-black text-gray-900 break-all bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner text-center">{password}</p>
          </ResultCard>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Dicas para senhas seguras</h2>
        <ul>
          <li>Use pelo menos 12 caracteres</li>
          <li>Combine maiúsculas, minúsculas, números e símbolos</li>
          <li>Nunca reutilize senhas entre diferentes serviços</li>
          <li>Considere usar um gerenciador de senhas</li>
        </ul>
      </article>
    </>
  );
}
