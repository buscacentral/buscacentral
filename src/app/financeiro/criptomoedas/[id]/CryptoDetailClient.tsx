'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const LineChartLazy = dynamic(() => import('@/components/LineChartLazy'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
      Carregando gráfico…
    </div>
  ),
});

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

export default function CryptoDetailClient({
  id,
  name,
  symbol,
  faqItems,
}: {
  id: string;
  name: string;
  symbol: string;
  faqItems: { question: string; answer: string }[];
}) {
  const [data, setData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profitQty, setProfitQty] = useState('');
  const [profitBuyPrice, setProfitBuyPrice] = useState('');
  const [convertCrypto, setConvertCrypto] = useState('');
  const [convertBrl, setConvertBrl] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sanitiza o ID: apenas letras, números e hífens
  const safeId = id.replace(/[^a-z0-9-]/g, '');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const isClient = typeof window !== 'undefined';
      const cacheKey = `crypto-data-${safeId}`;
      const cached = isClient ? sessionStorage.getItem(cacheKey) : null;
      const cachedChart = isClient ? sessionStorage.getItem(`${cacheKey}-chart`) : null;
      const cacheTime = isClient ? sessionStorage.getItem(`${cacheKey}-time`) : null;

      const now = Date.now();
      if (cached && cachedChart && cacheTime && now - parseInt(cacheTime) < 60000) { // 60s cache
        setData(JSON.parse(cached));
        setChartData(JSON.parse(cachedChart));
        setLoading(false);
        return;
      }

      const [coinRes, chartRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(safeId)}?localization=false&tickers=false&community_data=false&developer_data=false`),
        fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(safeId)}/market_chart?vs_currency=brl&days=7`),
      ]);

      let coinData = null;
      let marketChart = null;

      if (coinRes.ok) {
        try {
          coinData = await coinRes.json();
          setData(coinData);
        } catch {
          setError(`Erro ao processar dados de ${name}.`);
        }
      } else if (coinRes.status === 429) {
        setError('Limite de requisições atingido. Aguarde alguns segundos e tente novamente.');
      } else {
        setError(`Erro ao carregar dados de ${name}.`);
      }

      if (chartRes.ok) {
        try {
          marketChart = await chartRes.json();
          setChartData(marketChart);
        } catch {
          // gráfico é opcional
        }
      }

      if (coinData && isClient) {
        sessionStorage.setItem(cacheKey, JSON.stringify(coinData));
        if (marketChart) {
          sessionStorage.setItem(`${cacheKey}-chart`, JSON.stringify(marketChart));
        }
        sessionStorage.setItem(`${cacheKey}-time`, now.toString());
      }
    } catch {
      setError(`Erro de conexão ao carregar ${name}. Verifique sua internet.`);
    } finally {
      setLoading(false);
    }
  }, [safeId, name]);

  useEffect(() => {
    const initFetch = async () => {
      await Promise.resolve();
      fetchData();
    };
    initFetch();
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

  // Tabela de conversões rápidas (valores adaptados por tipo de moeda)
  const isStablecoin = ['USDT', 'USDC'].includes(symbol);
  const quickAmounts = isStablecoin
    ? [1, 10, 100, 500, 1000, 5000]
    : [0.001, 0.01, 0.1, 0.5, 1, 5];

  const currentPrice = data?.market_data?.current_price?.brl ?? 0;

  // Conversor bidirecional CRYPTO <=> BRL
  const handleConvertCrypto = (val: string) => {
    setConvertCrypto(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num) && num > 0 && currentPrice > 0) {
      setConvertBrl((num * currentPrice).toFixed(2));
    } else {
      setConvertBrl('');
    }
  };

  const handleConvertBrl = (val: string) => {
    setConvertBrl(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num) && num > 0 && currentPrice > 0) {
      setConvertCrypto((num / currentPrice).toFixed(8));
    } else {
      setConvertCrypto('');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Carregando dados de {name}…</div>;
  }

  if (error && !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Erro ao carregar dados de {name}.</div>;
  }

  const md = data.market_data;

  return (
    <div className="space-y-6">
      {/* Preço e variação */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-3xl font-extrabold text-gray-900">
            R$ {formatPrice(md.current_price.brl)}
          </span>
          <span className={`text-lg font-bold ${md.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {md.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(md.price_change_percentage_24h).toFixed(2)}% (24h)
          </span>
        </div>
      </section>

      {/* Gráfico 7 dias */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Preço 7 dias (BRL)</h2>
        {chart ? (
          <div className="h-64">
            <LineChartLazy
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
      </section>

      {/* Dados de mercado */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Dados de Mercado</h2>
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
      </section>

      {/* Conversor Dinâmico CRYPTO <=> BRL */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
          Conversor {symbol} ⇄ BRL
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label htmlFor="convert-crypto" className="block text-base md:text-lg text-slate-600 mb-2 font-medium">
              Quantidade de {symbol}
            </label>
            <input
              id="convert-crypto"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={convertCrypto}
              onChange={(e) => handleConvertCrypto(e.target.value)}
              placeholder="0.5"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-mono"
            />
          </div>
          <div className="text-center pb-3">
            <span className="text-2xl text-slate-400 font-light">⇄</span>
          </div>
          <div>
            <label htmlFor="convert-brl" className="block text-base md:text-lg text-slate-600 mb-2 font-medium">
              Valor em R$ (BRL)
            </label>
            <input
              id="convert-brl"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={convertBrl}
              onChange={(e) => handleConvertBrl(e.target.value)}
              placeholder="50.000"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-mono"
            />
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-3 text-center">
          Cotação atual: R$ {formatPrice(currentPrice)} por {symbol}
        </p>
      </section>

      {/* Tabela de Conversões Rápidas */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
          Conversões Rápidas — {name}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-base md:text-lg">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left py-3 px-3 sm:px-5 text-slate-600 font-semibold">Quantidade</th>
                <th className="text-right py-3 px-3 sm:px-5 text-slate-600 font-semibold">Valor Estimado (BRL)</th>
              </tr>
            </thead>
            <tbody>
              {quickAmounts.map((amt) => (
                <tr key={amt} className="odd:bg-slate-50 even:bg-white border-t border-slate-100">
                  <td className="py-3 px-3 sm:px-5 font-mono font-semibold text-slate-800">
                    {amt} {symbol}
                  </td>
                  <td className="py-3 px-3 sm:px-5 text-right font-mono font-semibold text-green-700">
                    R$ {formatPrice(amt * currentPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-400 mt-3">
          Valores calculados com base na cotação atual de R$ {formatPrice(currentPrice)}.
        </p>
      </section>

      {/* Calculadora de Lucro */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Calculadora de Lucro/Perda — {name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="detail-profit-qty" className="block text-sm text-gray-600 mb-1">Quantidade comprada</label>
            <input
              id="detail-profit-qty"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={profitQty}
              onChange={(e) => setProfitQty(e.target.value)}
              placeholder="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <label htmlFor="detail-profit-buy-price" className="block text-sm text-gray-600 mb-1">Preço de compra (R$)</label>
            <input
              id="detail-profit-buy-price"
              type="text"
              inputMode="decimal"
              spellCheck={false}
              value={profitBuyPrice}
              onChange={(e) => setProfitBuyPrice(e.target.value)}
              placeholder="150.000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
          Perguntas Frequentes — {name}
        </h2>
        <div className="divide-y divide-slate-200">
          {faqItems.map((item, idx) => (
            <div key={idx}>
              <button
                id={`faq-btn-${idx}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-4 text-left gap-4"
                aria-expanded={openFaq === idx}
                aria-controls={`faq-panel-${idx}`}
              >
                <h3 className="text-base md:text-lg font-medium text-slate-800">
                  {item.question}
                </h3>
                <span className={`text-slate-400 text-xl transition-transform duration-200 flex-shrink-0 ${openFaq === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div
                id={`faq-panel-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                aria-hidden={openFaq !== idx}
                className={`overflow-hidden transition-all duration-200 ${openFaq === idx ? 'max-h-96 pb-4' : 'max-h-0'}`}
              >
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
