'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NoticiasClientProps {
  initialNews: NewsArticle[];
}

export default function NoticiasClient({ initialNews }: NoticiasClientProps) {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<'business' | 'crypto'>('business');

  useEffect(() => {
    // If category is business, we use the server-rendered initialNews.
    if (category === 'business') {
      setNews(initialNews);
      setError('');
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        // Obviamente em produção a chave deve vir de uma API interna ou Server Action.
        const apiKey = '45f51f703fea4d6a81ec8ca9b2e942c4';
        const endpoint = `https://newsapi.org/v2/everything?q=criptomoedas OR bitcoin OR ethereum&language=pt&sortBy=publishedAt&apiKey=${apiKey}`;

        const res = await fetch(endpoint);
        
        if (!res.ok) {
          throw new Error('Falha ao obter as notícias do NewsAPI.');
        }

        const data = await res.json();
        
        if (data && data.articles) {
          const validArticles = data.articles.filter((a: NewsArticle) => a.title && a.title !== '[Removed]' && a.urlToImage);
          setNews(validArticles.slice(0, 30));
        } else {
          throw new Error('Formato de resposta inválido.');
        }
      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar as notícias neste momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, initialNews]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (isoString: string) => {
    const timestamp = new Date(isoString).getTime() / 1000;
    const seconds = Math.floor((new Date().getTime() / 1000) - timestamp);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' anos atrás';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses atrás';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' dias atrás';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas atrás';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' min atrás';
    return Math.floor(seconds) + ' seg atrás';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <p className="text-sm text-slate-500 font-medium">
          Últimas atualizações via NewsAPI
        </p>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => setCategory('business')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              category === 'business' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mercado Financeiro
          </button>
          <button
            onClick={() => setCategory('crypto')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              category === 'crypto' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Criptomoedas
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 h-80 animate-pulse">
              <div className="w-full h-40 bg-slate-200 rounded-xl mb-4"></div>
              <div className="w-20 h-4 bg-slate-200 rounded mb-3"></div>
              <div className="w-full h-5 bg-slate-200 rounded mb-2"></div>
              <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? news.map((item, index) => (
            <a 
              key={index} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden shrink-0">
                <Image
                  src={item.urlToImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm border border-white/20">
                  {item.source.name}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                  {item.description ? item.description.replace(/<\/?[^>]+(>|$)/g, "") : ''}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {getTimeAgo(item.publishedAt)}
                  </span>
                  <span className="text-xs text-slate-400" title={formatDate(item.publishedAt)}>
                    {formatDate(item.publishedAt).split(',')[0]}
                  </span>
                </div>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhuma notícia encontrada no momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
