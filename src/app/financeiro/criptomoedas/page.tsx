'use client';

import { useState, useEffect } from 'react';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

export default function Criptomoedas() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [brlValue, setBrlValue] = useState('100');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchCryptos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
      );
      const data = await response.json();
      setCryptos(data);
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch {
      setError('Erro ao buscar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  const getConvertedValue = () => {
    const value = parseFloat(brlValue.replace(',', '.'));
    if (isNaN(value)) return '0';
    const crypto = cryptos.find(c => c.id === selectedCrypto);
    if (!crypto || crypto.current_price === 0) return '0';
    return (value / crypto.current_price).toFixed(8);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cotação de Criptomoedas</h1>
      <p className="text-gray-600 mb-8">
        Top 10 criptomoedas por valor de mercado com cotação em tempo real.
      </p>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {lastUpdate ? `Última atualização: ${lastUpdate}` : 'Carregando...'}
        </p>
        <button
          onClick={fetchCryptos}
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

      {loading && cryptos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando dados do CoinGecko...</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moeda</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço (BRL)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">24h</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cryptos.map((crypto) => (
                    <tr
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedCrypto === crypto.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-500">{crypto.market_cap_rank}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                          <div>
                            <p className="font-semibold text-gray-900">{crypto.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{crypto.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-semibold">
                        R$ {formatPrice(crypto.current_price)}
                      </td>
                      <td className={`px-4 py-4 text-right font-medium ${
                        crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversor BRL → Cripto</h2>
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-600 mb-1">Valor em Reais (R$)</label>
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
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-600 mb-1">
                  {cryptos.find(c => c.id === selectedCrypto)?.name || 'Crypto'}
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-mono font-bold text-gray-900">
                  {getConvertedValue()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre as criptomoedas</h2>
        <p>
          Os dados são obtidos em tempo real através da API do CoinGecko, uma das maiores 
          plataformas de dados de criptomoedas do mundo. A tabela mostra as 10 maiores 
          criptomoedas por valor de mercado, com preços em Reais (BRL).
        </p>
      </article>
    </div>
  );
}
