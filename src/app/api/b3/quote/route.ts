import { NextResponse } from 'next/server';

/**
 * Proxy server-side para a API da Brapi.
 *
 * O token fica somente no servidor (process.env.BRAPI_TOKEN) e nunca é
 * enviado ao navegador. O client chama `/api/b3/quote?ticker=PETR4`.
 */
export async function GET(request: Request) {
  const token = process.env.BRAPI_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: true, message: 'Serviço de cotações indisponível no momento.' },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const ticker = (searchParams.get('ticker') || '').trim().toUpperCase();

  // Validação simples para evitar SSRF / parâmetros inesperados.
  if (!ticker || !/^[A-Z0-9.]{1,12}$/.test(ticker)) {
    return NextResponse.json(
      { error: true, message: 'Ticker inválido. Verifique o código digitado.' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}?token=${token}`,
      { next: { revalidate: 60 } },
    );
    const data = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json(
        { error: true, message: data.message || 'Ativo não encontrado. Verifique o código digitado.' },
        { status: res.ok ? 404 : res.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: true, message: 'Ocorreu um erro ao buscar os dados.' },
      { status: 502 },
    );
  }
}
