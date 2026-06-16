'use client';

import React, { useState, useMemo } from 'react';

interface Ingredient {
  id: string;
  name: string;
  purchasedQty: number;
  purchasedUnit: string;
  purchasePrice: number;
  usedQty: number;
  usedUnit: string;
}

const convertToSameUnit = (qty: number, fromUnit: string, toUnit: string) => {
  if (fromUnit === toUnit) return qty;

  // Convert everything to base units (g, ml, un)
  let baseQty = qty;
  if (fromUnit === 'kg') baseQty = qty * 1000;
  if (fromUnit === 'L') baseQty = qty * 1000;

  let finalQty = baseQty;
  if (toUnit === 'kg') finalQty = baseQty / 1000;
  if (toUnit === 'L') finalQty = baseQty / 1000;

  return finalQty;
};

const calculateIngredientCost = (ing: Ingredient) => {
  // If units mismatch but belong to same category (e.g., kg and g)
  const usedQtyInPurchasedUnit = convertToSameUnit(ing.usedQty, ing.usedUnit, ing.purchasedUnit);
  return (ing.purchasePrice / ing.purchasedQty) * usedQtyInPurchasedUnit;
};

export default function PrecificacaoClient() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');
  const [purchasedQty, setPurchasedQty] = useState('');
  const [purchasedUnit, setPurchasedUnit] = useState('g');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [usedQty, setUsedQty] = useState('');
  const [usedUnit, setUsedUnit] = useState('g');

  const [yieldUnits, setYieldUnits] = useState('1');
  const [profitMargin, setProfitMargin] = useState('50');
  const [fixedCosts, setFixedCosts] = useState('15'); // 15% para custos fixos/invisiveis
  const [packagingCost, setPackagingCost] = useState('0');

  const units = ['g', 'kg', 'ml', 'L', 'un'];

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchasedQty || !purchasePrice || !usedQty) return;

    const newIng: Ingredient = {
      id: crypto.randomUUID(),
      name,
      purchasedQty: parseFloat(purchasedQty),
      purchasedUnit,
      purchasePrice: parseFloat(purchasePrice),
      usedQty: parseFloat(usedQty),
      usedUnit,
    };

    setIngredients([...ingredients, newIng]);
    setName('');
    setPurchasedQty('');
    setPurchasePrice('');
    setUsedQty('');
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const results = useMemo(() => {
    const rawCost = ingredients.reduce((sum, ing) => sum + calculateIngredientCost(ing), 0);
    const unitsYield = parseFloat(yieldUnits) || 1;
    const margin = parseFloat(profitMargin) || 0;
    const fixed = parseFloat(fixedCosts) || 0;
    const packageCost = parseFloat(packagingCost) || 0;

    // Total raw materials cost
    const totalRawCost = rawCost + (packageCost * unitsYield);
    
    // Add fixed costs percentage to raw materials
    const costWithFixed = totalRawCost * (1 + fixed / 100);
    
    // Price to achieve profit margin
    // Price = Cost / (1 - Margin%)
    // But commonly in small businesses people just do Cost + Margin%
    // We will use the correct markup formula: Price = Cost / (1 - margin/100)
    let suggestedTotalPrice = costWithFixed;
    if (margin < 100) {
      suggestedTotalPrice = costWithFixed / (1 - margin / 100);
    } else {
      // If margin >= 100, just use simple markup
      suggestedTotalPrice = costWithFixed * (1 + margin / 100);
    }

    const costPerUnit = costWithFixed / unitsYield;
    const suggestedPrice = suggestedTotalPrice / unitsYield;
    const profitPerUnit = suggestedPrice - costPerUnit;
    const totalProfit = suggestedTotalPrice - costWithFixed;

    return {
      totalCost: costWithFixed,
      costPerUnit,
      suggestedPrice,
      profitPerUnit,
      totalProfit,
    };
  }, [ingredients, yieldUnits, profitMargin, fixedCosts, packagingCost]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Formulário de Adição */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛒</span> Adicionar Ingrediente
          </h2>
          
          <form onSubmit={addIngredient} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Ingrediente</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Ex: Farinha de Trigo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Qtd. Comprada</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-2/3 p-3 rounded-l-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Ex: 1"
                    value={purchasedQty}
                    onChange={(e) => setPurchasedQty(e.target.value)}
                    required
                  />
                  <select
                    className="w-1/3 p-3 rounded-r-lg border-y border-r border-slate-300 bg-slate-100"
                    value={purchasedUnit}
                    onChange={(e) => setPurchasedUnit(e.target.value)}
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Preço Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 5.50"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Qtd. Usada na Receita</label>
              <div className="flex">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-2/3 p-3 rounded-l-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 250"
                  value={usedQty}
                  onChange={(e) => setUsedQty(e.target.value)}
                  required
                />
                <select
                  className="w-1/3 p-3 rounded-r-lg border-y border-r border-slate-300 bg-slate-100"
                  value={usedUnit}
                  onChange={(e) => setUsedUnit(e.target.value)}
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Adicionar Ingrediente
            </button>
          </form>

          {ingredients.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Lista de Ingredientes</h3>
              <ul className="space-y-2">
                {ingredients.map(ing => (
                  <li key={ing.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-800">{ing.name}</p>
                      <p className="text-xs text-slate-500">Usou {ing.usedQty}{ing.usedUnit} (de {ing.purchasedQty}{ing.purchasedUnit} por {formatCurrency(ing.purchasePrice)})</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700">{formatCurrency(calculateIngredientCost(ing))}</span>
                      <button onClick={() => removeIngredient(ing.id)} className="text-red-500 hover:text-red-700 p-1">
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Configurações e Resultados */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Custos e Margem
          </h2>
          
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rendimento (Unidades)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={yieldUnits}
                  onChange={(e) => setYieldUnits(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Custo Embalagem/Unid.</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Custos Invariáveis (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 pr-8 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Água, luz, gás, limpeza</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Margem de Lucro (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 pr-8 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span> Resumo da Precificação
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-blue-100 text-sm mb-1">Custo da Receita</p>
                <p className="text-xl font-bold">{formatCurrency(results.totalCost)}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-blue-100 text-sm mb-1">Custo por Unidade</p>
                <p className="text-xl font-bold">{formatCurrency(results.costPerUnit)}</p>
              </div>
            </div>

            <div className="bg-white text-slate-900 p-5 rounded-xl text-center shadow-inner">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Preço Sugerido de Venda</p>
              <p className="text-4xl font-extrabold text-blue-600">{formatCurrency(results.suggestedPrice)} <span className="text-lg text-slate-400 font-medium">/unid</span></p>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm bg-white/10 p-3 rounded-lg">
              <span className="text-blue-100">Lucro Estimado (Unidade):</span>
              <span className="font-bold text-green-300">{formatCurrency(results.profitPerUnit)}</span>
            </div>
            
            {ingredients.length === 0 && (
              <p className="text-xs text-center text-blue-200 mt-4">Adicione ingredientes para ver o cálculo</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
