'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function GeradorSenha() {
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Senha</h1>
      <p className="text-gray-600 mb-8">
        Gere senhas seguras e aleatórias com configurações personalizáveis.
      </p>

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
          <button
            onClick={generatePassword}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Gerar Senha
          </button>
          {password && <CopyButton text={password} />}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
            ❌ {error}
          </div>
        )}

        {password && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Força:</span>
              <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
            </div>
            <p className="text-2xl font-mono font-bold text-gray-900 break-all">{password}</p>
          </div>
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
    </div>
  );
}
