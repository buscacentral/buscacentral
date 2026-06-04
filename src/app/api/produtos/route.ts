import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

const FALLBACK_PRODUCTS = [
  {
    id: 'MLB1',
    title: 'iPhone 15 Pro Max 256GB - Titânio Natural',
    price: 8999.99,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_938331-MLA45268824993_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/apple-iphone-15-pro-max-256-gb-titanio-natural/p/MLB23456789',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1500,
  },
  {
    id: 'MLB2',
    title: 'Samsung Galaxy S24 Ultra 256GB - Preto Titanium',
    price: 5499.90,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_643476-MLA45268824996_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/samsung-galaxy-s24-ultra-256-gb/p/MLB34567890',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 2300,
  },
  {
    id: 'MLB3',
    title: 'Notebook Lenovo IdeaPad 3i Intel Core i5 8GB 256GB SSD',
    price: 2899.99,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_606024-MLA45268828929_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/notebook-lenovo-ideapad-3i/p/MLB45678901',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 800,
  },
  {
    id: 'MLB4',
    title: 'Fone de Ouvido Bluetooth JBL Tune 510BT - Preto',
    price: 149.90,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_938331-MLA45268824993_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/fone-jbl-tune-510bt/p/MLB56789012',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 5600,
  },
  {
    id: 'MLB5',
    title: 'Smart TV Samsung 50" 4K Crystal UHD UN50CU7700',
    price: 2199.00,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_643476-MLA45268824996_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/smart-tv-samsung-50-4k/p/MLB67890123',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1200,
  },
  {
    id: 'MLB6',
    title: 'Tênis Nike Air Max 90 Masculino - Branco',
    price: 699.99,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_606024-MLA45268828929_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/tenis-nike-air-max-90/p/MLB78901234',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 3400,
  },
  {
    id: 'MLB7',
    title: 'Câmera GoPro HERO12 Black - Acessórios Inclusos',
    price: 2499.00,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_938331-MLA45268824993_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/camera-gopro-hero12/p/MLB89012345',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 450,
  },
  {
    id: 'MLB8',
    title: 'Perfume Malbec Gold Premium 100ml - Boticário',
    price: 179.90,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_643476-MLA45268824996_032021-I.jpg',
    permalink: 'https://www.mercadolivre.com.br/perfume-malbec-gold/p/MLB90123456',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 8900,
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
