'use client';

import { useState } from 'react';
import { validateCNPJ, formatCNPJ } from '@/lib/cnpj';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';

export default function ValidadorCNPJClient() {
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700 mb-2">
              Digite o CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono transition-colors"
            />
          </div>

          <Button onClick={handleValidate} className="w-full" size="lg">
            Validar CNPJ
          </Button>
        </div>
      </div>

      <div className="lg:col-span-7">
        {result && (
          <ResultCard title="Resultado da Validação" className="animate-fade-in h-full">
            <div className="flex flex-col items-center justify-center h-full py-8">
              {result.valid ? (
                <>
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">CNPJ Válido!</h3>
                  <p className="text-slate-500 text-center max-w-sm">O formato e os dígitos verificadores estão corretos segundo as regras da Receita Federal.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">CNPJ Inválido</h3>
                  <p className="text-slate-500 text-center max-w-sm">{result.message}</p>
                </>
              )}
            </div>
          </ResultCard>
        )}
        {!result && (
          <div className="h-full flex items-center justify-center min-h-[250px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
             <div className="text-center p-6 opacity-60">
               <span className="text-4xl mb-3 block">✅</span>
               <p className="text-sm font-medium text-slate-600">Insira um CNPJ e clique em "Validar" para ver o resultado.</p>
             </div>
          </div>
        )}
      </div>
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
    </>
  );
}
