'use client';

import { useState } from 'react';
import { generateCPF } from '@/lib/cpf';
import CopyButton from '@/components/CopyButton';

export default function GeradorCPFClient() {
  const [cpf, setCpf] = useState('');
  const [formatted, setFormatted] = useState(true);

  const handleGenerate = () => {
    setCpf(generateCPF(formatted));
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formatted}
              onChange={(e) => setFormatted(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Formatado (000.000.000-00)</span>
          </label>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Gerar CPF
          </button>
          {cpf && <CopyButton text={cpf} />}
        </div>

        {cpf && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-mono font-bold text-gray-900">{cpf}</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Aviso:</strong> Os dados gerados são fictícios, criados exclusivamente para fins de teste e desenvolvimento. 
          É proibido utilizar estes dados para cadastros reais, fraudes ou qualquer atividade ilícita.
        </p>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o Gerador de CPF?</h2>
        <p>
          O gerador cria números de CPF válidos utilizando o algoritmo de cálculo dos dígitos verificadores 
          definido pela Receita Federal do Brasil. Cada CPF é composto por 9 dígitos aleatórios mais 2 
          dígitos verificadores calculados matematicamente.
        </p>
        <h2>Para que serve?</h2>
        <p>
          CPFs gerados são úteis para desenvolvedores que precisam testar formulários, validar integrações 
          ou criar dados de exemplo em sistemas. Todos os números são fictícios e não correspondem a 
          pessoas reais.
        </p>
      </article>
    </>
  );
}
