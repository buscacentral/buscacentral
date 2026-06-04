import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_BASE = 'https://lista.mercadolivre.com.br';
const TOOL_ID = '60275712';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ScrapedProduct {
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

function extractProducts(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];

  // Split by product item container
  const items = html.split('<li class="ui-search-layout__item">');
  // Skip the first part (header/nav before the first item)
  items.shift();

  for (const block of items) {
    // Title and Link
    const titleMatch = block.match(
      /<a[^>]*class="[^"]*poly-component__title[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/
    ) || block.match(
      /<a[^>]*href="([^"]*)"[^>]*class="[^"]*poly-component__title[^"]*"[^>]*>([\s\S]*?)<\/a>/
    );
    
    if (!titleMatch) continue;

    const rawLink = titleMatch[1].replace(/&amp;/g, '&');
    const title = titleMatch[2].replace(/<[^>]+>/g, '').trim();
    if (!title) continue;

    // Image
    const imgMatch = block.match(
      /<img[^>]*class="[^"]*poly-component__picture[^"]*"[^>]*src="([^"]*)"/
    );
    const thumbnail = imgMatch ? imgMatch[1] : '';

    // Price
    const priceSectionMatch = block.match(/poly-price__current[\s\S]*?andes-money-amount__fraction[^>]*>([\d.]+)</);
    const priceStr = priceSectionMatch ? priceSectionMatch[1].replace(/\./g, '') : '0';
    
    const centsMatch = block.match(/poly-price__current[\s\S]*?andes-money-amount__cents[^>]*>(\d+)</);
    const cents = centsMatch ? parseInt(centsMatch[1], 10) : 0;
    const price = parseInt(priceStr, 10) + cents / 100;

    if (price === 0) continue;

    // Free shipping
    const freeShipping = block.includes('Frete gr') || block.includes('shipping--free') || block.includes('poly-component__shipping--free');

    // Rating
    let reviews: ScrapedProduct['reviews'] = undefined;
    const ratingMatch = block.match(
      /poly-component__review[\s\S]*?polylabel-label[^>]*>([\d.]+)<\/span>/
    );
    if (ratingMatch) {
      reviews = { rating_average: parseFloat(ratingMatch[1]), total: 0 };
    }

    const idMatch = rawLink.match(/MLA\d+/);
    const id = idMatch ? idMatch[0] : `scraped-${products.length}`;
    
    // Clean the permalink and append the affiliate tracking ID
    const baseUrl = rawLink.split('#')[0].split('?')[0];
    const permalink = `${baseUrl}?matt_tool=38524122`;

    products.push({
      id,
      title,
      price,
      currency_id: 'BRL',
      thumbnail,
      permalink,
      shipping: { free_shipping: freeShipping },
      accepts_mercadopago: true,
      condition: 'new',
      sold_quantity: 0,
      reviews,
    });
  }

  return products;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function scrapeProducts(
  query: string,
  limit: number
): Promise<{ results: ScrapedProduct[]; paging: { total: number } }> {
  // Check cache first
  const cacheKey = `${query}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[API /api/produtos] Cache hit for:', query);
    return cached.data as { results: ScrapedProduct[]; paging: { total: number } };
  }

  // Build the search URL - replace spaces with dashes for Mercado Livre URL format
  const formattedQuery = query.trim().replace(/\s+/g, '-');
  const searchUrl = `${ML_SEARCH_BASE}/${encodeURIComponent(formattedQuery)}`;
  console.log('[API /api/produtos] Scraping:', searchUrl);

  const response = await fetch(searchUrl, {
    cache: 'no-store',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Mercado Livre retornou status ${response.status}`
    );
  }

  const html = await response.text();

  if (html.length < 10000) {
    throw new Error(
      'Resposta do Mercado Livre muito curta — possível bloqueio temporário'
    );
  }

  const allProducts = extractProducts(html);
  const results = allProducts.slice(0, limit);

  // Extract total from the page if available
  const totalMatch = html.match(/(\d[\d.]*)\s*resultado/i);
  const total = totalMatch
    ? parseInt(totalMatch[1].replace(/\./g, ''), 10)
    : allProducts.length;

  const data = { results, paging: { total } };

  // Store in cache
  cache.set(cacheKey, { data, timestamp: Date.now() });

  console.log(
    `[API /api/produtos] Found ${results.length} products for "${query}" (total: ${total})`
  );

  return data;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!query) {
    return NextResponse.json(
      { error: 'Parâmetro "q" é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const data = await scrapeProducts(query.trim(), limit);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[API /api/produtos] Erro:', message);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: message },
      { status: 500 }
    );
  }
}
