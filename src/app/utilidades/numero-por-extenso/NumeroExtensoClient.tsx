'use client';

import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { numeroPorExtenso, valorPorExtenso, capitalizar } from '@/lib/extenso-logic';

type Modo = 'numero' | 'moeda';

/**
 * Faz o parse de um texto numérico digitado pelo usuário.
 * Aceita formatos como "1234,56", "1.234,56" ou "1234.56".
 */
function parseEntrada(texto: string): number | null {
  if (!texto.trim()) return null;

  let limpo = texto.trim().replace(/[^\d.,-]/g, '');

  // Se houver vírgula, ela é o separador decimal e o ponto é separador de milhar.
  if (limpo.includes(',')) {
    limpo = limpo.replace(/\./g, '').replace(',', '.');
  }

  const numero = parseFloat(limpo);
  return Number.isFinite(numero) ? numero : null;
}

export default function NumeroExtensoClient() {
  const [modo, setModo] = useState<Modo>('moeda');
  const [entrada, setEntrada] = useState('');

  const { resultado, erro } = useMemo(() => {
    const numero = parseEntrada(entrada);
    if (numero === null) return { resultado: '', erro: '' };

    const texto = modo === 'moeda' ? valorPorExtenso(numero) : numeroPorExtenso(numero);

    if (!texto) {
      return { resultado: '', erro: 'Número muito grande. O limite suportado é até 999 trilhões.' };
    }

    return { resultado: capitalizar(texto), erro: '' };
  }, [entrada, modo]);

  return (
    <>
      {/* Seletor de modo */}
      <div className="inline-flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setModo('moeda')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            modo === 'moeda' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Valor em Reais (R$)
        </button>
        <button
          onClick={() => setModo('numero')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            modo === 'numero' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Número
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entrada */}
        <div>
          <label htmlFor="entrada-numero" className="block text-sm font-semibold text-gray-700 mb-2">
            {modo === 'moeda' ? 'Valor em reais' : 'Número'}
          </label>
          <div className="relative">
            {modo === 'moeda' && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
            )}
            <input
              id="entrada-numero"
              type="text"
              inputMode="decimal"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder={modo === 'moeda' ? '1.234,56' : '1234'}
              className={`w-full ${modo === 'moeda' ? 'pl-11' : 'pl-4'} pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow hover:shadow-sm`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {modo === 'moeda'
              ? 'Digite o valor com centavos. Ex.: 1.250,90'
              : 'Digite um número inteiro. Ex.: 1234'}
          </p>
        </div>

        {/* Resultado */}
        <div>
          <span className="block text-sm font-semibold text-gray-700 mb-2">Por extenso</span>
          {resultado ? (
            <ResultCard title="Resultado" className="m-0 border-gray-300">
              <div className="relative group">
                <p className="text-lg font-medium text-gray-800 leading-relaxed pr-10">{resultado}</p>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={resultado} label="Copiar" />
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-[calc(100%-2rem)] min-h-[120px] border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center p-6">
              {erro ? (
                <p className="text-center text-sm text-red-500 font-medium">{erro}</p>
              ) : (
                <EmptyState
                  icon="123"
                  title="Aguardando número"
                  description="Digite um valor ao lado para ver a versão por extenso."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
