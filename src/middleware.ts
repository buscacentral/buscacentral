import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Se o host começar com 'www.', faz o redirect 301 para a versão root
  if (host.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = host.replace(/^www\./, '');
    return NextResponse.redirect(newUrl, 301);
  }

  // IMPORTANTE: Permite que a requisição continue se não for www
  return NextResponse.next();
}

export const config = {
  // Executa o middleware em todas as rotas, exceto ficheiros estáticos, imagens e APIs
  matcher: ['/((?!_next/static|_next/image|assets|favicon.ico|api/).*)'],
};
