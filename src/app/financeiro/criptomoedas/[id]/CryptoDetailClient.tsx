'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface CoinData {
  market_data: {
    current_price: { brl: number };
    market_cap: { brl: number };
    total_volume: { brl: number };
    high_24h: { brl: number };
    low_24h: { brl: number };
    circulating_supply: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
  };
  description: { pt: string };
  links: { homepage: string[] };
}

interface MarketChart {
  prices: [number, number][];
}

export default function CryptoDetailClient({ id, name, symbol }: { id: string; name: string; symbol: string }) {
  const [data, setData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [profitQty, setProfitQty] = useState('');
  const [profitBuyPrice, setProfitBuyPrice] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coinRes, chartRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`),
        fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=brl&days=7`),
      ]);
      if (coinRes.ok) setData(await coinRes.json());
      if (chartRes.ok) setChartData(await chartRes.json());
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPrice = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatCompact = (n: number) => {
    if (n >= 1e12) return `R$ ${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `R$ ${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `R$ ${(n / 1e6).toFixed(2)}M`;
    return `R$ ${formatPrice(n)}`;
  };

  const formatSupply = (n: number) =>
    n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const getProfitCalc = () => {
    if (!data) return null;
    const qty = parseFloat(profitQty.replace(',', '.'));
    const buyPrice = parseFloat(profitBuyPrice.replace(',', '.'));
    if (isNaN(qty) || isNaN(buyPrice) || buyPrice <= 0) return null;
    const invested = qty * buyPrice;
    const currentValue = qty * data.market_data.current_price.brl;
    const profit = currentValue - invested;
    const pct = (profit / invested) * 100;
    return { invested, currentValue, profit, pct };
  };

  const getChartFormatted = () => {
    if (!chartData) return null;
    const labels = chartData.prices.map((p) => {
      const d = new Date(p[0]);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    const values = chartData.prices.map((p) => p[1]);
    const isUp = values[values.length - 1] >= values[0];
    const color = isUp ? '#16a34a' : '#dc2626';
    return {
      labels,
      datasets: [{
        data: values,
        borderColor: color,
        backgroundColor: `${color}15`,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      }],
    };
  };

  const profitCalc = getProfitCalc();
  const chart = getChartFormatted();

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Carregando dados de {name}...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Erro ao carregar dados de {name}.</div>;
  }

  const md = data.market_data;

  return (
    <div className="space-y-6">
      {/* Preço e variação */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-3xl font-extrabold text-gray-900">
            R$ {formatPrice(md.current_price.brl)}
          </span>
          <span className={`text-lg font-bold ${md.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {md.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(md.price_change_percentage_24h).toFixed(2)}% (24h)
          </span>
        </div>
      </div>

      {/* Gráfico 7 dias */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Preço 7 dias (BRL)</h2>
        {chart ? (
          <div className="h-64">
            <Line
              data={chart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { tooltip: { mode: 'index', intersect: false }, legend: { display: false } },
                scales: {
                  x: { display: true, grid: { display: false }, ticks: { maxTicksLimit: 7, font: { size: 11 } } },
                  y: { display: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, callback: (v) => `R$${Number(v).toLocaleString('pt-BR')}` } },
                },
              }}
            />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">Gráfico indisponível</div>
        )}
      </div>

      {/* Dados de mercado */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Dados de Mercado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Capitalização de mercado:</span>
            <span className="font-semibold">{formatCompact(md.market_cap.brl)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Volume 24h:</span>
            <span className="font-semibold">{formatCompact(md.total_volume.brl)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Máxima 24h:</span>
            <span className="font-semibold text-green-600">R$ {formatPrice(md.high_24h.brl)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Mínima 24h:</span>
            <span className="font-semibold text-red-600">R$ {formatPrice(md.low_24h.brl)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg sm:col-span-2">
            <span className="text-gray-500">Supply circulante:</span>
            <span className="font-semibold">{formatSupply(md.circulating_supply)} {symbol}</span>
          </div>
        </div>
      </div>

      {/* Calculadora de Lucro */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Calculadora de Lucro/Perda — {name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantidade comprada</label>
            <input
              type="text"
              value={profitQty}
              onChange={(e) => setProfitQty(e.target.value)}
              placeholder="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Preço de compra (R$)</label>
            <input
              type="text"
              value={profitBuyPrice}
              onChange={(e) => setProfitBuyPrice(e.target.value)}
              placeholder="150.000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {profitCalc ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total investido:</span>
              <span className="font-medium">R$ {formatPrice(profitCalc.invested)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Valor atual:</span>
              <span className="font-medium">R$ {formatPrice(profitCalc.currentValue)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
              <span>Resultado:</span>
              <span className={profitCalc.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                {profitCalc.profit >= 0 ? '+' : ''}R$ {formatPrice(profitCalc.profit)}{' '}
                ({profitCalc.pct >= 0 ? '+' : ''}{profitCalc.pct.toFixed(2)}%)
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Preencha os campos para calcular seu lucro ou prejuízo.</p>
        )}
      </div>
    </div>
  );
}
