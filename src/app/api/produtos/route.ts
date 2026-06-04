import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

const MOCK_PRODUCTS = [
  {
    id: 'MLB1',
    title: 'iPhone 15 Pro Max 256GB - Titânio Natural',
    price: 8999.99,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_938331-MLA45268824993_032021-I.jpg',
    permalink: 'https://produto.mercadolivre.com.br/MLB-1234567890-iphone-15-pro-max-256gb-_JM',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1500,
  },
  {
    id: 'MLB2',
    title: 'Samsung Galaxy S24 Ultra 256GB - Preto',
    price: 5499.90,
    currency_id: 'BRL',
    thumbnail: 'http://http2.mlstatic.com/D_643476-MLA45268824996_032021-I.jpg',
    permalink: 'https://produto.mercadolivre.com.br/MLB-2345678901-samsung-galaxy-s24-ultra-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-3456789012-notebook-lenovo-ideapad-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-4567890123-fone-jbl-bluetooth-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-5678901234-smart-tv-samsung-50-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-6789012345-tenis-nike-air-max-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-7890123456-camera-gopro-hero12-_JM',
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
    permalink: 'https://produto.mercadolivre.com.br/MLB-8901234567-perfume-malbec-gold-_JM',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 8900,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return NextResponse.json(
      { error: 'Parâmetro "q" é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ML_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BuscaCentral/1.0',
        },
        next: { revalidate: 300 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    console.warn(`[API /api/produtos] ML API retornou ${response.status}, usando fallback`);
  } catch (error) {
    console.warn('[API /api/produtos] Erro ao acessar ML API, usando fallback:', error);
  }

  const filtered = MOCK_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    results: filtered.length > 0 ? filtered : MOCK_PRODUCTS,
    paging: {
      total: filtered.length > 0 ? filtered.length : MOCK_PRODUCTS.length,
      offset: 0,
      limit: limit,
    },
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
  });
}
