'use client';

import { useState } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';

type Categoria = 'comprimento' | 'peso' | 'temperatura' | 'area' | 'volume' | 'velocidade' | 'dados';

interface Unidade {
  id: string;
  label: string;
  fator: number; // relativo à unidade base
}

const categorias: Record<Categoria, { label: string; icon: string; unidades: Unidade[] }> = {
  comprimento: {
    label: 'Comprimento',
    icon: '📏',
    unidades: [
      { id: 'mm', label: 'Milímetro (mm)', fator: 0.001 },
      { id: 'cm', label: 'Centímetro (cm)', fator: 0.01 },
      { id: 'm', label: 'Metro (m)', fator: 1 },
      { id: 'km', label: 'Quilômetro (km)', fator: 1000 },
      { id: 'in', label: 'Polegada (in)', fator: 0.0254 },
      { id: 'ft', label: 'Pé (ft)', fator: 0.3048 },
      { id: 'yd', label: 'Jarda (yd)', fator: 0.9144 },
      { id: 'mi', label: 'Milha (mi)', fator: 1609.344 },
    ],
  },
  peso: {
    label: 'Peso / Massa',
    icon: '⚖️',
    unidades: [
      { id: 'mg', label: 'Miligrama (mg)', fator: 0.000001 },
      { id: 'g', label: 'Grama (g)', fator: 0.001 },
      { id: 'kg', label: 'Quilograma (kg)', fator: 1 },
      { id: 't', label: 'Tonelada (t)', fator: 1000 },
      { id: 'oz', label: 'Onça (oz)', fator: 0.0283495 },
      { id: 'lb', label: 'Libra (lb)', fator: 0.453592 },
      { id: 'ar', label: 'Arroba (@)', fator: 14.6888 },
    ],
  },
  temperatura: {
    label: 'Temperatura',
    icon: '🌡️',
    unidades: [
      { id: 'c', label: 'Celsius (°C)', fator: 1 },
      { id: 'f', label: 'Fahrenheit (°F)', fator: 1 },
      { id: 'k', label: 'Kelvin (K)', fator: 1 },
    ],
  },
  area: {
    label: 'Área',
    icon: '📐',
    unidades: [
      { id: 'mm2', label: 'mm²', fator: 0.000001 },
      { id: 'cm2', label: 'cm²', fator: 0.0001 },
      { id: 'm2', label: 'm²', fator: 1 },
      { id: 'km2', label: 'km²', fator: 1000000 },
      { id: 'ha', label: 'Hectare', fator: 10000 },
      { id: 'acre', label: 'Acre', fator: 4046.86 },
    ],
  },
  volume: {
    label: 'Volume',
    icon: '🧪',
    unidades: [
      { id: 'ml', label: 'Mililitro (mL)', fator: 0.001 },
      { id: 'l', label: 'Litro (L)', fator: 1 },
      { id: 'm3', label: 'Metro cúbico (m³)', fator: 1000 },
      { id: 'gal', label: 'Galão US', fator: 3.78541 },
      { id: 'cup', label: 'Xícara', fator: 0.24 },
    ],
  },
  velocidade: {
    label: 'Velocidade',
    icon: '🏎️',
    unidades: [
      { id: 'ms', label: 'm/s', fator: 1 },
      { id: 'kmh', label: 'km/h', fator: 0.277778 },
      { id: 'mph', label: 'mi/h', fator: 0.44704 },
      { id: 'kn', label: 'Nó', fator: 0.514444 },
    ],
  },
  dados: {
    label: 'Dados Digitais',
    icon: '💾',
    unidades: [
      { id: 'b', label: 'Byte (B)', fator: 1 },
      { id: 'kb', label: 'Kilobyte (KB)', fator: 1024 },
      { id: 'mb', label: 'Megabyte (MB)', fator: 1048576 },
      { id: 'gb', label: 'Gigabyte (GB)', fator: 1073741824 },
      { id: 'tb', label: 'Terabyte (TB)', fator: 1099511627776 },
    ],
  },
};

function convertTemperatura(valor: number, de: string, para: string): number {
  let celsius: number;
  if (de === 'c') celsius = valor;
  else if (de === 'f') celsius = (valor - 32) * 5 / 9;
  else celsius = valor - 273.15;

  if (para === 'c') return celsius;
  if (para === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function ConversorUnidadesClient() {
  const [cat, setCat] = useState<Categoria>('comprimento');
  const [de, setDe] = useState('m');
  const [para, setPara] = useState('km');
  const [valor, setValor] = useState('');

  const catData = categorias[cat];
  const valorNum = parseFloat(valor.replace(',', '.'));
  const temResultado = !isNaN(valorNum) && valor !== '';

  const converter = (): number => {
    if (cat === 'temperatura') {
      return convertTemperatura(valorNum, de, para);
    }
    const fatorDe = catData.unidades.find(u => u.id === de)!.fator;
    const fatorPara = catData.unidades.find(u => u.id === para)!.fator;
    return (valorNum * fatorDe) / fatorPara;
  };

  const resultado = temResultado ? converter() : 0;
  const fmtNum = (n: number) => {
    if (Math.abs(n) >= 1) return n.toLocaleString('pt-BR', { maximumFractionDigits: 6 });
    return n.toLocaleString('pt-BR', { maximumSignificantDigits: 6 });
  };

  const trocar = () => { setDe(para); setPara(de); };

  const handleCatChange = (newCat: Categoria) => {
    setCat(newCat);
    const units = categorias[newCat].unidades;
    setDe(units[0].id);
    setPara(units.length > 1 ? units[1].id : units[0].id);
    setValor('');
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-700 mb-3">Categoria</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(Object.keys(categorias) as Categoria[]).map(c => (
                <button
                  key={c}
                  onClick={() => handleCatChange(c)}
                  className={`text-xs font-semibold px-3 py-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    cat === c
                      ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{categorias[c].icon}</span>
                  <span>{categorias[c].label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">De</label>
                <select
                  value={de}
                  onChange={e => setDe(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {catData.unidades.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
              <div className="flex justify-center">
                <button onClick={trocar} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200" title="Trocar">
                  🔄
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Para</label>
                <select
                  value={para}
                  onChange={e => setPara(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {catData.unidades.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {temResultado ? (
            <ResultCard title="Resultado da Conversão" className="animate-fade-in">
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                  <p className="text-sm text-slate-500 mb-1">
                    {valor} {catData.unidades.find(u => u.id === de)?.label}
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    = {fmtNum(resultado)} <span className="text-lg font-bold text-sky-600">{catData.unidades.find(u => u.id === para)?.label}</span>
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Tabela de conversão</p>
                  <div className="space-y-1">
                    {catData.unidades.filter(u => u.id !== de).map(u => {
                      let converted: number;
                      if (cat === 'temperatura') {
                        converted = convertTemperatura(valorNum, de, u.id);
                      } else {
                        const fatorDe = catData.unidades.find(x => x.id === de)!.fator;
                        converted = (valorNum * fatorDe) / u.fator;
                      }
                      return (
                        <div key={u.id} className="flex justify-between text-sm py-1 border-b border-sky-100 last:border-0">
                          <span className="text-slate-600">{u.label}</span>
                          <span className="font-mono font-bold text-slate-900">{fmtNum(converted)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">📐</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Conversor de Unidades</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Selecione a categoria, as unidades e insira um valor para converter automaticamente.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Conversor de Unidades Online</h2>
        <p>
          Converta unidades de comprimento, peso, temperatura, área, volume, velocidade e dados digitais
          de forma rápida e gratuita. Nosso conversor mostra a tabela completa com todas as conversões possíveis.
        </p>
      </article>
    </>
  );
}
