import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

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
    console.log('[API /api/produtos] Buscando:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; BuscaCentral/1.0)',
      },
      next: { revalidate: 300 },
    });

    console.log('[API /api/produtos] Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API /api/produtos] Erro ML:', errorText);
      return NextResponse.json(
        { results: [], paging: { total: 0 } },
        { status: 200 }
      );
    }

    const data = await response.json();
    console.log('[API /api/produtos] Resultados:', data.results?.length || 0);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API /api/produtos] Erro:', error);
    return NextResponse.json(
      { results: [], paging: { total: 0 } },
      { status: 200 }
    );
  }
}
