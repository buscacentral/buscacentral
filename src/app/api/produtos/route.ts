import { NextRequest, NextResponse } from 'next/server';

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '20';

  if (!query) {
    return NextResponse.json(
      { error: 'Parâmetro "q" é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ML_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error(`[API /api/produtos] Mercado Livre retornou ${response.status}`);
      return NextResponse.json(
        { results: [], paging: { total: 0 } },
        { status: 200 }
      );
    }

    const data = await response.json();

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
