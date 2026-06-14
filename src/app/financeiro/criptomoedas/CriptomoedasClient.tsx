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

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
}

interface MarketChart {
  prices: [number, number][];
}

interface FearGreed {
  value: string;
  value_classification: string;
}

const TOP_10_IDS = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
  'ripple', 'usd-coin', 'dogecoin', 'cardano', 'staked-ether',
];

export default function CriptomoedasClient() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [fearGreed, setFearGreed] = useState<FearGreed | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [brlValue, setBrlValue] = useState('100');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [profitQty, setProfitQty] = useState('');
  const [profitBuyPrice, setProfitBuyPrice] = useState('');

  const perPage = 10;
  const totalPages = 5;

  const fetchCryptos = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=${perPage}&page=${p}&sparkline=false&price_change_percentage=24h`
      );
      if (!res.ok) throw new Error('Erro na API');
      try {
        const data = await res.json();
        setCryptos(data);
      } catch {
        throw new Error('Resposta inválida da API');
      }
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch {
      setError('Erro ao buscar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFearGreed = useCallback(async () => {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=1');
      const data = await res.json();
      if (data.data?.[0]) {
        setFearGreed(data.data[0]);
      }
    } catch {
      // silencioso — não é crítico
    }
  }, []);

  const fetchChart = useCallback(async (id: string) => {
    setChartLoading(true);
    setChartData(null);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=brl&days=7`
      );
      if (!res.ok) throw new Error('Erro no gráfico');
      const data = await res.json();
      setChartData(data);
    } catch {
      // silencioso
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await Promise.resolve();
      fetchCryptos(page);
      fetchFearGreed();
    };
    initFetch();
    const interval = setInterval(() => fetchCryptos(page), 60000);
    return () => clearInterval(interval);
  }, [page, fetchCryptos, fetchFearGreed]);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setChartData(null);
    } else {
      setExpandedId(id);
      fetchChart(id);
    }
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatCompact = (n: number) => {
    if (n >= 1e12) return `R$ ${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `R$ ${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `R$ ${(n / 1e6).toFixed(2)}M`;
    return `R$ ${formatPrice(n)}`;
  };

  const formatSupply = (n: number) =>
    n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const getConvertedValue = () => {
    const value = parseFloat(brlValue.replace(',', '.'));
    if (isNaN(value)) return '0';
    const crypto = cryptos.find(c => c.id === selectedCrypto);
    if (!crypto || crypto.current_price === 0) return '0';
    return (value / crypto.current_price).toFixed(8);
  };

  const getProfitCalc = () => {
    const qty = parseFloat(profitQty.replace(',', '.'));
    const buyPrice = parseFloat(profitBuyPrice.replace(',', '.'));
    if (isNaN(qty) || isNaN(buyPrice) || buyPrice <= 0) return null;
    const crypto = cryptos.find(c => c.id === selectedCrypto);
    if (!crypto) return null;
    const invested = qty * buyPrice;
    const currentValue = qty * crypto.current_price;
    const profit = currentValue - invested;
    const pct = ((profit / invested) * 100);
    return { invested, currentValue, profit, pct };
  };

  const getChartData = () => {
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
      datasets: [
        {
          data: values,
          borderColor: color,
          backgroundColor: `${color}15`,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };
  };

  const getFearGreedColor = (val: number) => {
    if (val <= 25) return '#dc2626';
    if (val <= 50) return '#f97316';
    if (val <= 75) return '#eab308';
    return '#16a34a';
  };

  const profitCalc = getProfitCalc();
  const chartDataFormatted = getChartData();

  return (
    <>
      {/* Fear & Greed Index */}
      {fearGreed && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Fear & Greed Index</h2>
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: getFearGreedColor(parseInt(fearGreed.value)) }}
                >
                  {fearGreed.value}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {fearGreed.value_classification}
                </span>
              </div>
            </div>
            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${fearGreed.value}%`,
                  backgroundColor: getFearGreedColor(parseInt(fearGreed.value)),
                }}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-500">O que é?</strong> O Fear & Greed Index é um termômetro
              do sentimento do mercado crypto, calculado com base em volatilidade, volume, pesquisas
              em redes sociais, dominância do Bitcoin e tendências de busca. Varia de 0 (medo extremo)
              a 100 (ganância extrema). Historicamente, períodos de <strong>medo extremo</strong> costumam
              preceder recuperações, enquanto <strong>ganância extrema</strong> pode indicar correção próxima.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {lastUpdate ? `Atualizado: ${lastUpdate}` : 'Carregando...'}
        </p>
        <button
          onClick={() => fetchCryptos(page)}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
          {error}
        </div>
      )}

      {/* Tabela */}
      {loading && cryptos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando dados do CoinGecko...</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moeda</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço (BRL)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">24h</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cryptos.map((crypto) => (
                    <CryptoRow
                      key={crypto.id}
                      crypto={crypto}
                      expanded={expandedId === crypto.id}
                      onToggle={() => toggleExpand(crypto.id)}
                      chartData={chartDataFormatted}
                      chartLoading={chartLoading}
                      formatPrice={formatPrice}
                      formatCompact={formatCompact}
                      formatSupply={formatSupply}
                      onSelect={() => setSelectedCrypto(crypto.id)}
                      selected={selectedCrypto === crypto.id}
                      isTop10={TOP_10_IDS.includes(crypto.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); setExpandedId(null); setChartData(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p === 1 ? 'Top 10' : p === 2 ? '11-20' : p === 3 ? '21-30' : p === 4 ? '31-40' : '41-50'}
              </button>
            ))}
          </div>

          {/* Conversor + Calculadora */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Conversor */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Conversor BRL → Cripto</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Valor em Reais (R$)</label>
                  <input
                    type="text"
                    value={brlValue}
                    onChange={(e) => setBrlValue(e.target.value)}
                    placeholder="100.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center text-gray-400">↓</div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {cryptos.find(c => c.id === selectedCrypto)?.name || 'Crypto'}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono font-bold text-gray-900">
                    {getConvertedValue()}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculadora de Lucro */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Calculadora de Lucro/Perda</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
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
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Investido:</span>
                      <span className="font-medium">R$ {formatPrice(profitCalc.invested)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Valor atual:</span>
                      <span className="font-medium">R$ {formatPrice(profitCalc.currentValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1 mt-1">
                      <span>Resultado:</span>
                      <span className={profitCalc.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profitCalc.profit >= 0 ? '+' : ''}R$ {formatPrice(profitCalc.profit)}{' '}
                        ({profitCalc.pct >= 0 ? '+' : ''}{profitCalc.pct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Preencha os campos acima para calcular</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function CryptoRow({
  crypto,
  expanded,
  onToggle,
  chartData,
  chartLoading,
  formatPrice,
  formatCompact,
  formatSupply,
  onSelect,
  selected,
  isTop10,
}: {
  crypto: Crypto;
  expanded: boolean;
  onToggle: () => void;
  chartData: ReturnType<typeof Line>['props']['data'] | null;
  chartLoading: boolean;
  formatPrice: (n: number) => string;
  formatCompact: (n: number) => string;
  formatSupply: (n: number) => string;
  onSelect: () => void;
  selected: boolean;
  isTop10: boolean;
}) {
  return (
    <>
      <tr
        onClick={onSelect}
        className={`cursor-pointer transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      >
        <td className="px-4 py-3 text-sm text-gray-500">
          {crypto.market_cap_rank}
          {isTop10 && <span className="ml-1 text-xs text-yellow-500" title="Página individual disponível">★</span>}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={crypto.image} alt={crypto.name} className="w-7 h-7" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{crypto.name}</p>
              <p className="text-xs text-gray-500 uppercase">{crypto.symbol}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-mono font-semibold text-sm">
          R$ {formatPrice(crypto.current_price)}
        </td>
        <td className={`px-4 py-3 text-right font-medium text-sm ${
          crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {expanded ? 'Fechar' : 'Ver mais'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-gray-50 px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Preço 7 dias (BRL)
                </h3>
                {chartLoading ? (
                  <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                    Carregando gráfico...
                  </div>
                ) : chartData ? (
                  <div className="h-40">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { tooltip: { mode: 'index', intersect: false }, legend: { display: false } },
                        scales: {
                          x: { display: true, grid: { display: false }, ticks: { maxTicksLimit: 5, font: { size: 10 } } },
                          y: { display: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, callback: (v) => `R$${Number(v).toLocaleString('pt-BR')}` } },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                    Dados indisponíveis
                  </div>
                )}
              </div>
              {/* Dados de mercado */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Dados de Mercado</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capitalização:</span>
                    <span className="font-medium">{formatCompact(crypto.market_cap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume 24h:</span>
                    <span className="font-medium">{formatCompact(crypto.total_volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Máxima 24h:</span>
                    <span className="font-medium text-green-600">R$ {formatPrice(crypto.high_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mínima 24h:</span>
                    <span className="font-medium text-red-600">R$ {formatPrice(crypto.low_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Supply circulante:</span>
                    <span className="font-medium">{formatSupply(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Link para página individual (top 10) */}
            {isTop10 && (
              <div className="mt-3 text-right">
                <a
                  href={`/financeiro/criptomoedas/${crypto.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver página completa →
                </a>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
