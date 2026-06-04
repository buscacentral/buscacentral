'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const TOOL_ID = '60275712';

const BUSCAS_POPULARES = [
  'iPhone', 'Samsung', 'Notebook', 'Tênis',
  'Fone de ouvido', 'Smart TV', 'Câmera', 'Perfume',
];

interface Product {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  permalink: string;
  shipping: {
    free_shipping: boolean;
  };
  accepts_mercadopago: boolean;
  condition: string;
  sold_quantity: number;
  reviews?: {
    rating_average: number;
    total: number;
  };
}

interface SearchResult {
  results: Product[];
  paging: {
    total: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getImageUrl(thumbnail: string): string {
  if (!thumbnail) return '/placeholder-product.png';
  return thumbnail
    .replace('-I.jpg', '-O.jpg')
    .replace('http://', 'https://');
}

function getAffiliateUrl(permalink: string): string {
  if (!permalink) return '#';
  const separator = permalink.includes('?') ? '&' : '?';
  return `${permalink}${separator}matt_tool=${TOOL_ID}&matt_word=buscacentral`;
}

function StarRating({ rating, total }: { rating: number; total: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {total > 0 && (
        <span className="text-xs text-gray-500">({total})</span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = getImageUrl(product.thumbnail);
  const affiliateUrl = getAffiliateUrl(product.permalink);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.shipping?.free_shipping && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Frete Grátis
            </span>
          )}
          {product.accepts_mercadopago && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              MercadoPago
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {product.reviews && product.reviews.rating_average > 0 && (
          <StarRating
            rating={product.reviews.rating_average}
            total={product.reviews.total}
          />
        )}

        <div className="mt-auto">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </p>
          {product.sold_quantity > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {product.sold_quantity.toLocaleString('pt-BR')} vendidos
            </p>
          )}
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver no Mercado Livre
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function ProdutosClient() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchProducts = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSortBy('relevance');

    try {
      const response = await fetch(
        `/api/produtos?q=${encodeURIComponent(trimmedQuery)}&limit=20`
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: SearchResult = await response.json();

      if (data.results && data.results.length > 0) {
        setProducts(data.results);
        setTotalCount(data.paging.total);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('[ProdutosClient] Erro na busca:', err);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedProducts = useCallback(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(query);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    searchProducts(term);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const displayProducts = sortedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Busca de Produtos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Busque milhões de produtos no Mercado Livre e encontre as melhores ofertas.
            Compare preços, veja avaliações e compre com segurança sem sair do BuscaCentral.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="flex shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos no Mercado Livre..."
                className="w-full pl-12 pr-4 py-4 text-lg focus:outline-none"
                aria-label="Buscar produtos"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Buscar'
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
          {BUSCAS_POPULARES.map((term) => (
            <button
              key={term}
              onClick={() => handleChipClick(term)}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-50"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-8">
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Encontre as melhores ofertas
            </h2>
            <p className="text-gray-500">
              Digite um termo de busca ou clique em uma das sugestões acima
            </p>
          </div>
        )}

        {hasSearched && !loading && !error && products.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{totalCount.toLocaleString('pt-BR')}</span>
              {' '}produtos encontrados
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-gray-500">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevância</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-red-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => searchProducts(query)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && hasSearched && !error && products.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-500">
              Tente buscar com outros termos ou verifique a ortografia
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 mt-12 text-center">
        <p className="text-sm text-gray-400">
          © 2026 BuscaCentral.com.br — Todos os direitos reservados.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Como afiliado do Mercado Livre, recebemos uma comissão por compras qualificadas.
          Os preços e disponibilidade estão sujeitos a alterações.
        </p>
      </footer>
    </div>
  );
}
