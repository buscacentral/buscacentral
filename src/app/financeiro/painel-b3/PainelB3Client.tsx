'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResultCard } from '@/components/ui/ResultCard';
import { Button } from '@/components/ui/Button';

export interface StockData {
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
      // Chama o proxy interno; o token da Brapi fica somente no servidor.
      const res = await fetch(`/api/b3/quote?ticker=${encodeURIComponent(cleanTicker)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || 'Ativo não encontrado. Verifique o código digitado.');
      }

      if (data.results && data.results.length > 0) {
        setStockData(data.results[0]);
      } else {
        throw new Error('Nenhum dado retornado para este ativo.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao buscar os dados.');
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
          <Button type="submit" disabled={loading || !ticker.trim()} className="py-3 px-8 text-base min-w-[160px] relative overflow-hidden group">
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Buscando...</span>
                </>
              ) : (
                <span>Buscar Ativo</span>
              )}
            </div>
            {/* Magnetic highlight spell on hover */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
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
            {initialStocks.map((stock, idx) => {
              const isPositive = stock.regularMarketChange >= 0;
              return (
                <div 
                  key={stock.symbol}
                  onClick={() => fetchStock(stock.symbol)}
                  className={`relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-transparent cursor-pointer flex flex-col items-center text-center group transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
                >
                  {/* Subtle glowing background spell */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isPositive 
                      ? 'bg-gradient-to-b from-emerald-500/5 to-transparent shadow-[0_8px_30px_rgb(16,185,129,0.12)]' 
                      : 'bg-gradient-to-b from-rose-500/5 to-transparent shadow-[0_8px_30px_rgb(244,63,94,0.12)]'
                  }`} />
                  
                  {stock.logourl ? (
                    <div className="relative w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-2 shadow-sm mb-4 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                      <Image 
                        src={stock.logourl} 
                        alt={stock.symbol} 
                        width={36} 
                        height={36} 
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="relative w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                      <span className="text-slate-400 font-bold text-lg">B3</span>
                    </div>
                  )}
                  <h4 className="font-extrabold text-slate-900 tracking-tight text-lg mb-0.5">{stock.symbol}</h4>
                  <p className="text-xs font-medium text-slate-500 line-clamp-1 mb-4 h-4">{stock.shortName}</p>
                  
                  <div className="w-full pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Preço</span>
                      <span className="font-bold text-slate-800">{formatCurrency(stock.regularMarketPrice)}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                      isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      <span>{isPositive ? '↗' : '↘'}</span>
                      <span>{Math.abs(stock.regularMarketChangePercent || 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
