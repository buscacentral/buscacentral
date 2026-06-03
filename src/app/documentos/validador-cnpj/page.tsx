'use client';

import { useState } from 'react';
import { validateCNPJ, formatCNPJ } from '@/lib/cnpj';

export default function ValidadorCNPJ() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Por favor, insira um CNPJ.' });
      return;
    }

    const isValid = validateCNPJ(input);
    setResult({
      valid: isValid,
      message: isValid ? 'CNPJ válido!' : 'CNPJ inválido.',
    });
  };

  const handleInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14);
    if (cleaned.length <= 14) {
      const formatted = cleaned.length === 14 ? formatCNPJ(cleaned) : cleaned;
      setInput(formatted);
      setResult(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Validador de CNPJ</h1>
      <p className="text-gray-600 mb-8">
        Verifique se um CNPJ é válido usando o algoritmo oficial de cálculo dos dígitos verificadores.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o CNPJ
          </label>
          <input
            id="cnpj"
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="00.000.000/0001-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
          />
        </div>

        <button
          onClick={handleValidate}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Validar CNPJ
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
        <h2>Como funciona a validação de CNPJ?</h2>
        <p>
          A validação segue o algoritmo oficial da Receita Federal do Brasil. O sistema verifica 
          se os dois dígitos verificadores estão corretos, calculando-os a partir dos 12 primeiros 
          dígitos usando pesos específicos.
        </p>
        <h2>O que torna um CNPJ inválido?</h2>
        <p>
          Um CNPJ é considerado inválido quando: possui menos ou mais de 14 dígitos, todos os dígitos 
          são iguais, ou os dígitos verificadores não conferem com o cálculo esperado.
        </p>
      </article>
    </div>
  );
}
