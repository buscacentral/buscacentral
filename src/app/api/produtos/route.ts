import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

const FALLBACK_PRODUCTS = [
  {
    id: 'MLB1',
    title: 'iPhone 15 Pro Max 256GB - Titânio Natural',
    price: 8999.99,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_616725-MLA71782914792_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/iphone-15-pro-max',
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
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_878468-MLA71782914793_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/samsung-galaxy-s24-ultra',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 2300,
  },
  {
    id: 'MLB3',
    title: 'Notebook Lenovo IdeaPad 3i Intel Core i5 8GB',
    price: 2899.99,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_954123-MLA71782914794_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/notebook-lenovo-ideapad',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 800,
  },
  {
    id: 'MLB4',
    title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
    price: 149.90,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_742589-MLA71782914795_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/fone-jbl-bluetooth',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 5600,
  },
  {
    id: 'MLB5',
    title: 'Smart TV Samsung 50" 4K Crystal UHD',
    price: 2199.00,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_631478-MLA71782914796_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/smart-tv-samsung-50',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 1200,
  },
  {
    id: 'MLB6',
    title: 'Tênis Nike Air Max 90 Masculino',
    price: 699.99,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_825369-MLA71782914797_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/tenis-nike-air-max',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 3400,
  },
  {
    id: 'MLB7',
    title: 'Câmera GoPro HERO12 Black',
    price: 2499.00,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_914258-MLA71782914798_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/camera-gopro-hero12',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
    condition: 'new',
    sold_quantity: 450,
  },
  {
    id: 'MLB8',
    title: 'Perfume Malbec Gold Premium 100ml',
    price: 179.90,
    currency_id: 'BRL',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_783147-MLA71782914799_092023-F.webp',
    permalink: 'https://lista.mercadolivre.com.br/perfume-malbec',
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
