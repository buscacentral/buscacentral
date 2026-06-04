'use client';

import { useState, useEffect } from 'react';

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  bid: string;
  ask: string;
  variation: string;
  flag: string;
}

const defaultCurrencies: CurrencyRate[] = [
  { code: 'USD-BRL', name: 'Dólar Americano', symbol: 'US$', bid: '0.00', ask: '0.00', variation: '0', flag: '🇺🇸' },
  { code: 'EUR-BRL', name: 'Euro', symbol: '€', bid: '0.00', ask: '0.00', variation: '0', flag: '🇪🇺' },
  { code: 'GBP-BRL', name: 'Libra Esterlina', symbol: '£', bid: '0.00', ask: '0.00', variation: '0', flag: '🇬🇧' },
  { code: 'ARS-BRL', name: 'Peso Argentino', symbol: 'AR$', bid: '0.00', ask: '0.00', variation: '0', flag: '🇦🇷' },
  { code: 'BTC-BRL', name: 'Bitcoin', symbol: '₿', bid: '0.00', ask: '0.00', variation: '0', flag: '₿' },
];

export default function CotacaoClient() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(defaultCurrencies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [brlValue, setBrlValue] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState('USD-BRL');

  const fetchRates = async () => {
    setLoading(true);
    setError('');
    try {
      const codes = ['USD-BRL', 'EUR-BRL', 'GBP-BRL', 'ARS-BRL', 'BTC-BRL'];
      const response = await fetch(`https://economia.awesomeapi.com.br/last/${codes.join(',')}`);
      const data = await response.json();

      const updated = currencies.map(curr => {
        const key = curr.code.replace('-', '');
        if (data[key]) {
          return {
            ...curr,
            bid: parseFloat(data[key].bid).toFixed(curr.code === 'BTC-BRL' ? 2 : 4),
            ask: parseFloat(data[key].ask).toFixed(curr.code === 'BTC-BRL' ? 2 : 4),
            variation: parseFloat(data[key].pctChange).toFixed(2),
          };
        }
        return curr;
      });

      setCurrencies(updated);
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch {
      setError('Erro ao buscar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const getConvertedValue = () => {
    const value = parseFloat(brlValue.replace(',', '.'));
    if (isNaN(value)) return '0.00';
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency) return '0.00';
    const rate = parseFloat(currency.bid);
    if (rate === 0) return '0.00';
    return (value / rate).toFixed(currency.code === 'BTC-BRL' ? 8 : 2);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {lastUpdate ? `Última atualização: ${lastUpdate}` : 'Carregando...'}
        </p>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar agora'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currencies.map((curr) => (
          <div
            key={curr.code}
            className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-all ${
              selectedCurrency === curr.code ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedCurrency(curr.code)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{curr.flag}</span>
                <div>
                  <p className="font-semibold text-gray-900">{curr.code.replace('-BRL', '')}</p>
                  <p className="text-xs text-gray-500">{curr.name}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                parseFloat(curr.variation) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(curr.variation) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(curr.variation))}%
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                R$ {curr.bid}
              </p>
              <p className="text-xs text-gray-500 mt-1">Compra / Venda: R$ {curr.ask}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversor R$ → Moeda</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Valor em Reais</label>
            <input
              type="text"
              value={brlValue}
              onChange={(e) => setBrlValue(e.target.value)}
              placeholder="100.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <div className="text-center px-4">
            <p className="text-2xl">→</p>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">{selectedCurrency.replace('-BRL', '')}</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900">
              {getConvertedValue()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
