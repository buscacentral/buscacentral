'use client';

import { useState } from 'react';
import { generateCNPJ } from '@/lib/cnpj';
import CopyButton from '@/components/CopyButton';

export default function GeradorCNPJClient() {
  const [cnpj, setCnpj] = useState('');
  const [formatted, setFormatted] = useState(true);

  const handleGenerate = () => {
    setCnpj(generateCNPJ(formatted));
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
            <span className="text-sm text-gray-700">Formatado (00.000.000/0001-00)</span>
          </label>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Gerar CNPJ
          </button>
          {cnpj && <CopyButton text={cnpj} />}
        </div>

        {cnpj && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-mono font-bold text-gray-900">{cnpj}</p>
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
        <h2>Como funciona o Gerador de CNPJ?</h2>
        <p>
          O gerador cria números de CNPJ válidos utilizando o algoritmo de cálculo dos dígitos 
          verificadores definido pela Receita Federal. O CNPJ é composto por 14 dígitos, sendo 
          8 da raiz, 4 do estabelecimento e 2 dígitos verificadores.
        </p>
        <h2>Para que serve?</h2>
        <p>
          CNPJs gerados são úteis para testar sistemas que fazem validação de cadastro de empresas, 
          emitir notas fiscais de teste ou criar dados fictícios em ambientes de desenvolvimento.
        </p>
      </article>
    </>
  );
}
