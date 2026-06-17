import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  getCapitalPairs,
  resolvePair,
  getOtherCapitais,
  pairUrl,
} from '@/lib/distancia-cidades';

// Pré-renderiza no build apenas os pares de capitais; os demais pares são
// gerados sob demanda na primeira visita e ficam em cache (ISR).
export const dynamicParams = true;

interface Props {
  params: Promise<{ origem: string; destino: string }>;
}

export function generateStaticParams() {
  return getCapitalPairs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { origem, destino } = await params;
  const result = resolvePair(origem, destino);
  if (!result) return { title: 'Distância entre cidades' };

  const { origin, dest, road, straightLine } = result;
  const title = `Distância de ${origin.n} a ${dest.n}: ${road.toLocaleString('pt-BR')} km`;
  const description = `A distância entre ${origin.n} (${origin.u}) e ${dest.n} (${dest.u}) é de aproximadamente ${road.toLocaleString('pt-BR')} km por estrada (${straightLine.toLocaleString('pt-BR')} km em linha reta). Veja o tempo de viagem de carro e o custo estimado de combustível.`;
  const canonical = `https://buscacentral.com.br${pairUrl(origin.slug, dest.slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | BuscaCentral`,
      description,
      url: canonical,
      siteName: 'BuscaCentral',
      locale: 'pt_BR',
      type: 'website',
    },
  };
}

function formatHoras(km: number, velocidade: number): string {
  const totalMin = Math.round((km / velocidade) * 60);
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  return `${h}h${min > 0 ? ` ${min}min` : ''}`;
}

export default async function DistanciaParPage({ params }: Props) {
  const { origem, destino } = await params;
  const result = resolvePair(origem, destino);
  if (!result) notFound();

  // Garante uma URL canônica única por par (slugs em ordem alfabética),
  // evitando conteúdo duplicado em /a/b e /b/a.
  const [canonA, canonB] = [origem, destino].sort();
  if (origem !== canonA || destino !== canonB) {
    redirect(`/localizacao/distancia/${canonA}/${canonB}`);
  }

  const { origin, dest, road, straightLine } = result;

  // Estimativa de combustível (valores padrão; o usuário ajusta na ferramenta).
  const consumoPadrao = 10; // km/l
  const precoPadrao = 6.0; // R$/litro
  const litros = road / consumoPadrao;
  const custoCombustivel = litros * precoPadrao;

  const outras = getOtherCapitais([origin.slug, dest.slug], 8);
  const mapsUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(`${origin.n} - ${origin.u}`)}&daddr=${encodeURIComponent(`${dest.n} - ${dest.u}`)}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://buscacentral.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Localização', item: 'https://buscacentral.com.br/localizacao' },
      { '@type': 'ListItem', position: 3, name: 'Distância entre Cidades', item: 'https://buscacentral.com.br/localizacao/distancia-cidades' },
      { '@type': 'ListItem', position: 4, name: `${origin.n} a ${dest.n}`, item: `https://buscacentral.com.br${pairUrl(origin.slug, dest.slug)}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Trilha de navegação">
        <Link href="/" className="hover:text-blue-600">Início</Link>
        <span className="mx-2">›</span>
        <Link href="/localizacao" className="hover:text-blue-600">Localização</Link>
        <span className="mx-2">›</span>
        <Link href="/localizacao/distancia-cidades" className="hover:text-blue-600">Distância entre Cidades</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{origin.n} a {dest.n}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Distância de {origin.n} a {dest.n}
        </h1>
        <p className="text-gray-600 text-lg">
          A distância entre <strong>{origin.n} ({origin.u})</strong> e <strong>{dest.n} ({dest.u})</strong> é de
          aproximadamente <strong>{road.toLocaleString('pt-BR')} km</strong> por estrada.
        </p>
      </header>

      {/* Distâncias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🛣️</div>
          <p className="text-sm font-medium text-blue-700 mb-1">Distância Rodoviária (estimada)</p>
          <p className="text-4xl font-bold text-blue-600">{road.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-blue-500 mt-1">quilômetros</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">📏</div>
          <p className="text-sm font-medium text-slate-700 mb-1">Distância em Linha Reta</p>
          <p className="text-4xl font-bold text-slate-600">{straightLine.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-slate-500 mt-1">quilômetros</p>
        </div>
      </div>

      {/* Tempo de viagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
          <div className="text-3xl mb-2">🚗</div>
          <p className="text-sm font-medium text-slate-600 mb-1">De carro (~80 km/h)</p>
          <p className="text-2xl font-bold text-slate-800">{formatHoras(road, 80)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
          <div className="text-3xl mb-2">🚌</div>
          <p className="text-sm font-medium text-slate-600 mb-1">De ônibus (~60 km/h)</p>
          <p className="text-2xl font-bold text-slate-800">{formatHoras(road, 60)}</p>
        </div>
      </div>

      {/* Custo de combustível */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-amber-900 mb-3">⛽ Custo estimado de combustível</h2>
        <p className="text-amber-800 mb-4">
          Considerando um veículo que faz <strong>{consumoPadrao} km/l</strong> e gasolina a{' '}
          <strong>R$ {precoPadrao.toFixed(2).replace('.', ',')}</strong> por litro:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-1">Litros necessários</p>
            <p className="text-2xl font-bold text-amber-600">{litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} L</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-1">Custo só de ida</p>
            <p className="text-2xl font-bold text-amber-600">
              {custoCombustivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        <p className="text-sm text-amber-700 mt-4">
          Quer ajustar o consumo e o preço do combustível?{' '}
          <Link href="/localizacao/distancia-cidades" className="font-semibold underline hover:text-amber-900">
            Use a calculadora interativa de distância
          </Link>{' '}
          ou a{' '}
          <Link href="/utilidades/calculadora-combustivel" className="font-semibold underline hover:text-amber-900">
            calculadora de combustível
          </Link>.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
        >
          📍 Ver rota no Google Maps
        </a>
        <Link
          href="/localizacao/distancia-cidades"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          🧮 Calcular outra distância
        </Link>
      </div>

      {/* Conteúdo SEO */}
      <article className="prose prose-gray max-w-none mb-10">
        <h2>Como calculamos a distância de {origin.n} a {dest.n}</h2>
        <p>
          A distância em linha reta de <strong>{straightLine.toLocaleString('pt-BR')} km</strong> entre {origin.n} e{' '}
          {dest.n} é calculada com a fórmula de Haversine, usando as coordenadas geográficas oficiais do IBGE.
          Como as estradas não seguem uma linha reta, aplicamos um fator de correção de aproximadamente 30% para
          estimar a <strong>distância rodoviária de {road.toLocaleString('pt-BR')} km</strong> — um valor próximo
          do que você efetivamente percorrerá de carro ou ônibus.
        </p>
        <p>
          Os tempos de viagem são estimativas baseadas em velocidades médias e não consideram paradas, trânsito,
          pedágios ou condições da via. Para a rota exata, recomendamos conferir também no Google Maps.
        </p>
      </article>

      {/* Links internos para outras distâncias */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Distâncias a partir de {origin.n}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outras.map((c) => (
            <Link
              key={c.slug}
              href={pairUrl(origin.slug, c.slug)}
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-slate-800">
                {origin.n} → {c.n} ({c.u})
              </span>
              <span className="text-slate-400">›</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
