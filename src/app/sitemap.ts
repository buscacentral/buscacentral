import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { artigos } from './artigos/page';
import { TOP_10 as cryptoIds } from './financeiro/criptomoedas/[id]/page';

const baseUrl = 'https://buscacentral.com.br';

/**
 * Descobre automaticamente todas as rotas estáticas varrendo o diretório
 * `src/app` em busca de arquivos `page.tsx`. Dessa forma, toda nova ferramenta
 * entra no sitemap sem precisar de manutenção manual.
 *
 * Segmentos dinâmicos ([slug]), route groups ((grupo)), pastas privadas (_) e a
 * pasta `api` são ignorados — as rotas dinâmicas são adicionadas explicitamente
 * a partir das suas respectivas fontes de dados.
 */
function getStaticRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const routes: string[] = [];

  function walk(dir: string, route: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const hasPage = entries.some(
      (entry) => entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name),
    );
    if (hasPage) {
      routes.push(route === '' ? '/' : route);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      // Ignora API, segmentos dinâmicos, route groups e pastas privadas.
      if (
        name === 'api' ||
        name.startsWith('[') ||
        name.startsWith('(') ||
        name.startsWith('_')
      ) {
        continue;
      }
      walk(path.join(dir, name), `${route}/${name}`);
    }
  }

  walk(appDir, '');
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = getStaticRoutes();
  const articleRoutes = artigos.map((artigo) => `/artigos/${artigo.slug}`);
  const cryptoRoutes = cryptoIds.map((id) => `/financeiro/criptomoedas/${id}`);

  // Rotas que não devem aparecer no sitemap (ex.: resultados de busca, marcados
  // como noindex).
  const excludedRoutes = new Set(['/buscar']);

  // Remove duplicatas e ordena (mantendo a home em primeiro).
  const allRoutes = Array.from(
    new Set([...staticRoutes, ...articleRoutes, ...cryptoRoutes]),
  )
    .filter((route) => !excludedRoutes.has(route))
    .sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
