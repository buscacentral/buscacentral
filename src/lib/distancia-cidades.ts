import fs from 'node:fs';
import path from 'node:path';

/**
 * Lógica das páginas programáticas de "distância entre cidades".
 *
 * IMPORTANTE: este módulo lê o arquivo de cidades do filesystem em tempo de
 * build, portanto só pode ser importado por código server-side (page.tsx com
 * generateStaticParams / sitemap.ts). Nunca importar em Client Components.
 */

export interface City {
  n: string; // nome
  u: string; // UF
  lat: number;
  lon: number;
}

export interface CityResolved extends City {
  slug: string;
}

export interface DistanceResult {
  origin: CityResolved;
  dest: CityResolved;
  straightLine: number; // km em linha reta
  road: number; // km estimados por estrada
}

/** Capitais brasileiras (nome como aparece no IBGE + UF). */
const CAPITAIS: { nome: string; uf: string }[] = [
  { nome: 'Rio Branco', uf: 'AC' },
  { nome: 'Maceió', uf: 'AL' },
  { nome: 'Macapá', uf: 'AP' },
  { nome: 'Manaus', uf: 'AM' },
  { nome: 'Salvador', uf: 'BA' },
  { nome: 'Fortaleza', uf: 'CE' },
  { nome: 'Brasília', uf: 'DF' },
  { nome: 'Vitória', uf: 'ES' },
  { nome: 'Goiânia', uf: 'GO' },
  { nome: 'São Luís', uf: 'MA' },
  { nome: 'Cuiabá', uf: 'MT' },
  { nome: 'Campo Grande', uf: 'MS' },
  { nome: 'Belo Horizonte', uf: 'MG' },
  { nome: 'Belém', uf: 'PA' },
  { nome: 'João Pessoa', uf: 'PB' },
  { nome: 'Curitiba', uf: 'PR' },
  { nome: 'Recife', uf: 'PE' },
  { nome: 'Teresina', uf: 'PI' },
  { nome: 'Rio de Janeiro', uf: 'RJ' },
  { nome: 'Natal', uf: 'RN' },
  { nome: 'Porto Alegre', uf: 'RS' },
  { nome: 'Porto Velho', uf: 'RO' },
  { nome: 'Boa Vista', uf: 'RR' },
  { nome: 'Florianópolis', uf: 'SC' },
  { nome: 'São Paulo', uf: 'SP' },
  { nome: 'Aracaju', uf: 'SE' },
  { nome: 'Palmas', uf: 'TO' },
];

/** Remove acentos e normaliza para comparação/slug. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Gera o slug de uma cidade: "São Paulo" + "SP" -> "sao-paulo-sp". */
export function citySlug(nome: string, uf: string): string {
  const base = normalize(nome)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${base}-${uf.toLowerCase()}`;
}

let _capitaisCache: CityResolved[] | null = null;

/** Carrega as capitais resolvidas (com coordenadas) a partir do cidades.json. */
export function getCapitais(): CityResolved[] {
  if (_capitaisCache) return _capitaisCache;

  const filePath = path.join(
    process.cwd(),
    'public',
    'localizacao',
    'distancia-cidades',
    'cidades.json',
  );
  const cities: City[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const resolved: CityResolved[] = [];
  for (const cap of CAPITAIS) {
    const match = cities.find(
      (c) => c.u === cap.uf && normalize(c.n) === normalize(cap.nome),
    );
    if (match) {
      resolved.push({ ...match, slug: citySlug(match.n, match.u) });
    }
  }

  _capitaisCache = resolved;
  return resolved;
}

/** Busca uma capital pelo slug. */
export function getCapitalBySlug(slug: string): CityResolved | undefined {
  return getCapitais().find((c) => c.slug === slug);
}

/** Distância em linha reta (Haversine) em km. */
export function haversine(a: City, b: City): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Pares canônicos (não-direcionais) de capitais, ordenados por slug.
 * Evita conteúdo duplicado: cada par gera UMA página.
 */
export function getCityPairs(): { origem: string; destino: string }[] {
  const capitais = getCapitais();
  const pairs: { origem: string; destino: string }[] = [];
  for (let i = 0; i < capitais.length; i++) {
    for (let j = i + 1; j < capitais.length; j++) {
      const [a, b] = [capitais[i].slug, capitais[j].slug].sort();
      pairs.push({ origem: a, destino: b });
    }
  }
  return pairs;
}

/** Resolve um par (origem, destino) e calcula as distâncias. */
export function resolvePair(
  origemSlug: string,
  destinoSlug: string,
): DistanceResult | null {
  const origin = getCapitalBySlug(origemSlug);
  const dest = getCapitalBySlug(destinoSlug);
  if (!origin || !dest || origin.slug === dest.slug) return null;

  const straightLine = Math.round(haversine(origin, dest));
  return {
    origin,
    dest,
    straightLine,
    road: Math.round(straightLine * 1.3),
  };
}

/** Outras capitais (para links internos), excluindo as duas do par atual. */
export function getOtherCapitais(
  excludeSlugs: string[],
  limit = 8,
): CityResolved[] {
  return getCapitais()
    .filter((c) => !excludeSlugs.includes(c.slug))
    .slice(0, limit);
}

/** Monta a URL canônica (slugs ordenados) de um par. */
export function pairUrl(slugA: string, slugB: string): string {
  const [a, b] = [slugA, slugB].sort();
  return `/localizacao/distancia/${a}/${b}`;
}
