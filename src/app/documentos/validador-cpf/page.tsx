'use client';

import { useState } from 'react';
import { validateCPF, formatCPF } from '@/lib/cpf';

export default function ValidadorCPF() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Por favor, insira um CPF.' });
      return;
    }

    const isValid = validateCPF(input);
    setResult({
      valid: isValid,
      message: isValid ? 'CPF válido!' : 'CPF inválido.',
    });
  };

  const handleInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length <= 11) {
      const formatted = cleaned.length === 11 ? formatCPF(cleaned) : cleaned;
      setInput(formatted);
      setResult(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Validador de CPF</h1>
      <p className="text-gray-600 mb-8">
        Verifique se um CPF é válido usando o algoritmo oficial de cálculo dos dígitos verificadores.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
          />
        </div>

        <button
          onClick={handleValidate}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Validar CPF
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg text-center font-semibold text-lg ${
              result.valid
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {result.valid ? '✅' : '❌'} {result.message}
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a validação de CPF?</h2>
        <p>
          A validação segue o algoritmo oficial da Receita Federal. O sistema verifica se os dois 
          dígitos verificadores estão corretos, calculando-os a partir dos 9 primeiros dígitos 
          usando pesos decrescentes.
        </p>
        <h2>O que torna um CPF inválido?</h2>
        <p>
          Um CPF é considerado inválido quando: possui menos ou mais de 11 dígitos, todos os dígitos 
          são iguais (ex: 111.111.111-11), ou os dígitos verificadores não conferem com o cálculo.
        </p>
      </article>
    </div>
  );
}
