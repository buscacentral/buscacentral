'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResultCard } from '@/components/ui/ResultCard';
import { Button } from '@/components/ui/Button';

interface StockData {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap: number;
  logourl: string;
  error?: boolean;
  message?: string;
}

interface PainelB3ClientProps {
  initialStocks?: StockData[];
}

export default function PainelB3Client({ initialStocks = [] }: PainelB3ClientProps) {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);

  const fetchStock = async (e: React.FormEvent | string) => {
    let searchTicker = '';
    
    if (typeof e === 'string') {
      searchTicker = e;
      setTicker(e);
    } else {
      e.preventDefault();
      searchTicker = ticker;
    }
    
    if (!searchTicker.trim()) return;

    setLoading(true);
    setError('');
    setStockData(null);

    try {
      const cleanTicker = searchTicker.trim().toUpperCase();
      // Using brapi.dev with user provided token.
      const res = await fetch(`https://brapi.dev/api/quote/${cleanTicker}?token=ma5LADevQ1H7H4r9UCa8if`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || 'Ativo não encontrado. Verifique o código digitado.');
      }

      if (data.results && data.results.length > 0) {
        setStockData(data.results[0]);
      } else {
        throw new Error('Nenhum dado retornado para este ativo.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatCompact = (value: number) => {
    if (!value) return '-';
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={fetchStock} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Digite o Ticker (ex: PETR4, MXRF11)"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-semibold text-slate-800 placeholder:normal-case placeholder:font-normal"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !ticker.trim()} className="py-3 px-8 text-base">
            {loading ? 'Buscando...' : 'Buscar Ativo'}
          </Button>
        </form>
        <p className="text-xs text-slate-500 mt-3 flex gap-2">
          <span className="font-semibold text-slate-700">Populares:</span>
          <button onClick={() => fetchStock('PETR4')} className="hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-400 underline-offset-2">PETR4</button>
          <button onClick={() => fetchStock('VALE3')} className="hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-400 underline-offset-2">VALE3</button>
          <button onClick={() => fetchStock('MXRF11')} className="hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-400 underline-offset-2">MXRF11</button>
          <button onClick={() => fetchStock('ITUB4')} className="hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-400 underline-offset-2">ITUB4</button>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State: Ativos Populares (SSR) */}
      {!stockData && !loading && !error && initialStocks.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Em Destaque Hoje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {initialStocks.map((stock) => (
              <div 
                key={stock.symbol}
                onClick={() => fetchStock(stock.symbol)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group"
              >
                {stock.logourl ? (
                  <div className="w-12 h-12 bg-white rounded-full border border-slate-100 flex items-center justify-center p-1.5 shadow-sm mb-3">
                    <Image 
                      src={stock.logourl} 
                      alt={stock.symbol} 
                      width={32} 
                      height={32} 
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-slate-400 font-bold">B3</span>
                  </div>
                )}
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stock.symbol}</h4>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2 h-4">{stock.shortName}</p>
                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="font-bold text-slate-800">{formatCurrency(stock.regularMarketPrice)}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    stock.regularMarketChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {stock.regularMarketChange >= 0 ? '+' : ''}{stock.regularMarketChangePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stockData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ResultCard className="overflow-hidden relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  {stockData.logourl && (
                    <div className="w-16 h-16 bg-white rounded-full border border-slate-200 flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Image 
                        src={stockData.logourl} 
                        alt={stockData.symbol} 
                        width={48} 
                        height={48} 
                        className="object-contain max-w-full max-h-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{stockData.symbol}</h2>
                    <p className="text-sm font-medium text-slate-500 mt-0.5 line-clamp-1">{stockData.longName || stockData.shortName}</p>
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(stockData.regularMarketPrice)}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-bold mt-2 ${
                    stockData.regularMarketChange >= 0 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    <span>{stockData.regularMarketChange >= 0 ? '↑' : '↓'}</span>
                    <span>{formatCurrency(Math.abs(stockData.regularMarketChange))}</span>
                    <span>({stockData.regularMarketChangePercent?.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Máx. 24h</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(stockData.regularMarketDayHigh)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mín. 24h</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(stockData.regularMarketDayLow)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Volume</p>
                  <p className="text-lg font-bold text-slate-800">{formatCompact(stockData.regularMarketVolume)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Valor de Mercado</p>
                  <p className="text-lg font-bold text-slate-800">{formatCompact(stockData.marketCap)}</p>
                </div>
              </div>
            </ResultCard>
          </div>
          
          <div className="space-y-6">
            <ResultCard title="O que é a B3?" animateIn={false} className="h-full">
              <p className="text-sm text-slate-600 leading-relaxed">
                A <strong>B3</strong> (Brasil, Bolsa, Balcão) é a bolsa de valores oficial do Brasil. Nela, são negociadas ações de empresas de capital aberto (como Petrobras e Vale) e cotas de Fundos Imobiliários (FIIs).
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">🔹</span>
                  <p className="text-sm text-slate-600"><strong>Ações (Ticker com 3 ou 4):</strong> Representam uma fração do capital de uma empresa. Ex: PETR4.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">🔹</span>
                  <p className="text-sm text-slate-600"><strong>FIIs (Ticker com 11):</strong> Fundos que investem em imóveis e pagam aluguéis aos cotistas. Ex: MXRF11.</p>
                </div>
              </div>
            </ResultCard>
          </div>
        </div>
      )}
    </div>
  );
}
