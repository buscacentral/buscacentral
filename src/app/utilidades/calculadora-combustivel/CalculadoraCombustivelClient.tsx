'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

export default function CalculadoraCombustivelClient() {
  const [distancia, setDistancia] = useState<string>('');
  const [consumo, setConsumo] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  
  const [resultado, setResultado] = useState<{
    litros: number;
    custoTotal: number;
    custoKm: number;
  } | null>(null);

  const [valorAbastecer, setValorAbastecer] = useState<string>('');
  const [resultadoRende, setResultadoRende] = useState<{ litros: number; distancia: number } | null>(null);

  useEffect(() => {
    // Lê o parâmetro da URL apenas na montagem (fonte externa ao React).
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get('distancia');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d) setDistancia(d.replace('.', ','));
  }, []);

  const formatCurrencyInput = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return (Number(num) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const formatDecimalInput = (value: string) => {
    // Permite números e uma vírgula
    let v = value.replace(/[^\d,]/g, '');
    const parts = v.split(',');
    if (parts.length > 2) {
      v = parts[0] + ',' + parts.slice(1).join('');
    }
    return v;
  };

  const parseNumber = (value: string) => {
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.'));
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcular = () => {
    const dist = parseNumber(distancia);
    const cons = parseNumber(consumo);
    const prc = parseNumber(preco);

    if (dist <= 0 || cons <= 0 || prc <= 0) return;

    const litros = dist / cons;
    const custoTotal = litros * prc;
    const custoKm = custoTotal / dist;

    setResultado({
      litros,
      custoTotal,
      custoKm
    });
  };

  const calcularRende = () => {
    const valor = parseNumber(valorAbastecer);
    const prc = parseNumber(preco);
    if (valor <= 0 || prc <= 0) return;

    const litros = valor / prc;
    const cons = parseNumber(consumo);
    const distancia = cons > 0 ? litros * cons : 0;

    setResultadoRende({ litros, distancia });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Distância da Viagem</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={distancia}
                onChange={(e) => setDistancia(formatDecimalInput(e.target.value))}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="Ex: 150,5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">km</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <span>Não sabe a distância?</span>
              <a href="/localizacao/distancia-cidades" className="text-sky-600 hover:underline font-medium">Calcule a rota 📍</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Consumo do Veículo</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={consumo}
                onChange={(e) => setConsumo(formatDecimalInput(e.target.value))}
                className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="Ex: 12,5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">km/L</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Preço do Combustível</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={preco}
                onChange={(e) => setPreco(formatCurrencyInput(e.target.value))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={calcular} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!distancia || !consumo || !preco}>
            Calcular Viagem
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado do Cálculo">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 text-center mb-6">
            <p className="text-sm font-bold text-sky-800 uppercase tracking-wider mb-2">Custo Total da Viagem</p>
            <p className="text-4xl sm:text-5xl font-black text-sky-600">
              {formatarMoeda(resultado.custoTotal)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase">Combustível Necessário</p>
              <p className="text-2xl font-bold text-slate-700 mt-2">{resultado.litros.toFixed(1)} <span className="text-lg text-slate-500">Litros</span></p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase">Custo por Quilômetro</p>
              <p className="text-2xl font-bold text-slate-700 mt-2">{formatarMoeda(resultado.custoKm)} <span className="text-lg text-slate-500">/ km</span></p>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center mt-6">
            * O consumo real pode variar de acordo com o trânsito, uso do ar condicionado e condições da via.
          </div>
        </ResultCard>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-10">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Quanto rende um valor? (R$ → litros)</h2>
        <p className="text-sm text-slate-500 mb-4">
          Digite quanto vai abastecer. Usa o <strong>preço do litro</strong> (e o <strong>consumo</strong>, se preenchido) informados acima.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Valor a abastecer</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={valorAbastecer}
                onChange={(e) => setValorAbastecer(formatCurrencyInput(e.target.value))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                placeholder="100,00"
              />
            </div>
          </div>
          <Button onClick={calcularRende} className="w-full sm:w-auto px-10 py-3" disabled={!valorAbastecer || !preco}>
            Ver litros
          </Button>
        </div>

        {resultadoRende && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-sky-700 uppercase">Você abastece</p>
              <p className="text-3xl font-black text-sky-600 mt-1">{resultadoRende.litros.toFixed(1)} <span className="text-lg">litros</span></p>
            </div>
            {resultadoRende.distancia > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase">Dá para rodar</p>
                <p className="text-3xl font-bold text-slate-700 mt-1">{resultadoRende.distancia.toFixed(0)} <span className="text-lg text-slate-500">km</span></p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
