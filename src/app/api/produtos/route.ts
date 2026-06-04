import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

const FALLBACK_PRODUCTS = [
  {
    id: 'MLB1',
    title: 'Smartphone 256GB - Última Geração',
    price: 3999.99,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Smartphone',
    permalink: 'https://lista.mercadolivre.com.br/smartphone',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1500,
  },
  {
    id: 'MLB2',
    title: 'Notebook Intel Core i5 8GB 256GB SSD',
    price: 2899.99,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/10B981/FFFFFF?text=Notebook',
    permalink: 'https://lista.mercadolivre.com.br/notebook',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 800,
  },
  {
    id: 'MLB3',
    title: 'Fone de Ouvido Bluetooth com Cancelamento de Ruído',
    price: 249.90,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=Fone+Bluetooth',
    permalink: 'https://lista.mercadolivre.com.br/fone-bluetooth',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 5600,
  },
  {
    id: 'MLB4',
    title: 'Smart TV 50" 4K Crystal UHD',
    price: 2199.00,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/F59E0B/FFFFFF?text=Smart+TV',
    permalink: 'https://lista.mercadolivre.com.br/smart-tv',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1200,
  },
  {
    id: 'MLB5',
    title: 'Tênis Esportivo Masculino - Corrida e Caminhada',
    price: 299.99,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/EF4444/FFFFFF?text=T%C3%AAnis',
    permalink: 'https://lista.mercadolivre.com.br/tenis-esportivo',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 3400,
  },
  {
    id: 'MLB6',
    title: 'Câmera de Ação 4K - À Prova D\'água',
    price: 1299.00,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/EC4899/FFFFFF?text=C%C3%A2mera',
    permalink: 'https://lista.mercadolivre.com.br/camera-acao',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 450,
  },
  {
    id: 'MLB7',
    title: 'Perfume Masculino Premium 100ml',
    price: 179.90,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/6366F1/FFFFFF?text=Perfume',
    permalink: 'https://lista.mercadolivre.com.br/perfume-masculino',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 8900,
  },
  {
    id: 'MLB8',
    title: 'Relógio Smartwatch com GPS e Monitor Cardíaco',
    price: 599.99,
    currency_id: 'BRL',
    thumbnail: 'https://placehold.co/400x400/14B8A6/FFFFFF?text=Smartwatch',
    permalink: 'https://lista.mercadolivre.com.br/smartwatch',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 2100,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '20';
  const sort = searchParams.get('sort') || 'relevance';

  if (!query) {
    return NextResponse.json(
      { error: 'Parâmetro "q" é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const url = `${ML_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}&sort=${sort}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        });
      }
    }
  } catch (error) {
    console.warn('[API /api/produtos] API ML indisponível, usando fallback');
  }

  const filtered = FALLBACK_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    results: filtered.length > 0 ? filtered : FALLBACK_PRODUCTS,
    paging: {
      total: filtered.length > 0 ? filtered.length : FALLBACK_PRODUCTS.length,
      offset: 0,
      limit: parseInt(limit),
    },
  });
}
