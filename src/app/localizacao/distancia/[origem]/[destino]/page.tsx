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

function formatHoras(km: number, velocidade: number): string {
  const totalMin = Math.round((km / velocidade) * 60);
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  return `${h}h${min > 0 ? `${min}min` : ''}`;
}

// ---------------------------------------------------------------------------
// SEO METADATA — Otimizado para CTR (3 dados no title: km, tempo, R$)
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { origem, destino } = await params;
  const result = resolvePair(origem, destino);
  if (!result) return { title: 'Distância entre cidades' };

  const { origin, dest, road, straightLine } = result;

  const consumoPadrao = 10; // km/l
  const precoPadrao = 6.0; // R$/litro
  const custo = Math.round((road / consumoPadrao) * precoPadrao);
  const tempo = formatHoras(road, 80);

  // Title: responde 3 intenções de busca numa SERP
  const title = `${origin.n} a ${dest.n}: ${road.toLocaleString('pt-BR')} km, ${tempo} e R$ ${custo}`;

  // Description: 140-155 chars, responde à dor + CTA implícito
  const description = `Distância de ${origin.n} a ${dest.n}: ${road.toLocaleString('pt-BR')} km por estrada (${straightLine.toLocaleString('pt-BR')} km em linha reta). Tempo de carro: ${tempo}. Calcule o gasto de combustível da viagem.`;

  const canonical = `https://buscacentral.com.br${pairUrl(origin.slug, dest.slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Distância de ${origin.n} a ${dest.n}: ${road.toLocaleString('pt-BR')} km | BuscaCentral`,
      description,
      url: canonical,
      siteName: 'BuscaCentral',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${origin.n} → ${dest.n}: ${road.toLocaleString('pt-BR')} km`,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function DistanciaParPage({ params }: Props) {
  const { origem, destino } = await params;
  const result = resolvePair(origem, destino);
  if (!result) notFound();

  // Garante URL canônica única por par (slugs em ordem alfabética)
  const [canonA, canonB] = [origem, destino].sort();
  if (origem !== canonA || destino !== canonB) {
    redirect(`/localizacao/distancia/${canonA}/${canonB}`);
  }

  const { origin, dest, road, straightLine } = result;

  // Estimativas de combustível
  const consumoPadrao = 10; // km/l
  const precoPadrao = 6.0; // R$/litro
  const litros = road / consumoPadrao;
  const custoCombustivel = litros * precoPadrao;

  const outras = getOtherCapitais([origin.slug, dest.slug], 8);
  const mapsUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(`${origin.n} - ${origin.u}`)}&daddr=${encodeURIComponent(`${dest.n} - ${dest.u}`)}`;

  // -------------------------------------------------------------------------
  // STRUCTURED DATA — Breadcrumbs
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // STRUCTURED DATA — FAQ Schema (5 perguntas dinâmicas)
  // -------------------------------------------------------------------------
  const faqItems = [
    {
      name: `Qual a distância entre ${origin.n} e ${dest.n}?`,
      text: `A distância entre ${origin.n} (${origin.u}) e ${dest.n} (${dest.u}) é de aproximadamente ${road.toLocaleString('pt-BR')} km por estrada e ${straightLine.toLocaleString('pt-BR')} km em linha reta.`,
    },
    {
      name: `Quanto tempo de carro de ${origin.n} a ${dest.n}?`,
      text: `De carro, a uma velocidade média de 80 km/h, a viagem de ${origin.n} a ${dest.n} leva aproximadamente ${formatHoras(road, 80)}. De ônibus (~60 km/h), leva cerca de ${formatHoras(road, 60)}.`,
    },
    {
      name: `Quanto gasto de gasolina de ${origin.n} a ${dest.n}?`,
      text: `Considerando um veículo que faz ${consumoPadrao} km/l e gasolina a R$ ${precoPadrao.toFixed(2).replace('.', ',')}/litro, o custo estimado é de ${custoCombustivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} só de ida (${litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} litros).`,
    },
    {
      name: `Quantos pedágios tem de ${origin.n} a ${dest.n}?`,
      text: `O número exato de pedágios varia conforme a rota escolhida. Recomendamos consultar o Google Maps ou o app da concessionária da rodovia para obter os valores atualizados de pedágio entre ${origin.n} e ${dest.n}.`,
    },
    {
      name: `Qual o melhor caminho de ${origin.n} para ${dest.n}?`,
      text: `Para visualizar a rota mais rápida ou mais curta de ${origin.n} a ${dest.n}, recomendamos abrir o Google Maps diretamente. Nossa ferramenta calcula a distância estimada (${road.toLocaleString('pt-BR')} km) e o custo de combustível para ajudar no seu planejamento.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.text,
      },
    })),
  };

  // -------------------------------------------------------------------------
  // STRUCTURED DATA — HowTo Schema (rich snippet com passos visuais)
  // -------------------------------------------------------------------------
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Como calcular a distância de ${origin.n} a ${dest.n}`,
    description: `Descubra a distância rodoviária, o tempo de viagem e o custo de combustível entre ${origin.n} (${origin.u}) e ${dest.n} (${dest.u}).`,
    totalTime: `PT${Math.floor((road / 80) * 60)}M`,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'BRL',
      value: Math.round(custoCombustivel).toString(),
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Verifique a distância por estrada',
        text: `A distância rodoviária estimada de ${origin.n} a ${dest.n} é de ${road.toLocaleString('pt-BR')} km (${straightLine.toLocaleString('pt-BR')} km em linha reta).`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Calcule o tempo de viagem',
        text: `A uma velocidade média de 80 km/h, o trajeto de carro leva aproximadamente ${formatHoras(road, 80)}. De ônibus (~60 km/h), cerca de ${formatHoras(road, 60)}.`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Estime o consumo de combustível',
        text: `Divida a distância (${road.toLocaleString('pt-BR')} km) pelo consumo do seu veículo (ex: ${consumoPadrao} km/l) para obter os litros necessários: ${litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} litros.`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Calcule o custo total de combustível',
        text: `Multiplique os litros (${litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}) pelo preço do combustível (R$ ${precoPadrao.toFixed(2).replace('.', ',')}). Custo estimado: ${custoCombustivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} só de ida.`,
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Ajuste com o consumo real do seu veículo',
        text: `Para um resultado mais preciso, use a Calculadora de Combustível da BuscaCentral informando o consumo específico do seu carro e o preço atualizado na sua cidade.`,
        url: `https://buscacentral.com.br/utilidades/calculadora-combustivel?distancia=${road}`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

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

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Distância de {origin.n} a {dest.n}
        </h1>
        <p className="text-gray-600 text-lg">
          A distância entre <strong>{origin.n} ({origin.u})</strong> e <strong>{dest.n} ({dest.u})</strong> é de
          aproximadamente <strong>{road.toLocaleString('pt-BR')} km</strong> por estrada.
        </p>
      </header>

      {/* ================================================================= */}
      {/* HERO DATA BLOCK — 3 colunas: distância, tempo, custo              */}
      {/* Resposta imediata à intenção de busca, sem scroll                 */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-blue-700 mb-1">Distância por estrada</p>
          <p className="text-4xl font-bold text-blue-600">
            {road.toLocaleString('pt-BR')} <span className="text-lg font-medium">km</span>
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-emerald-700 mb-1">Tempo de carro (~80 km/h)</p>
          <p className="text-4xl font-bold text-emerald-600">{formatHoras(road, 80)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-amber-700 mb-1">Custo estimado (ida)</p>
          <p className="text-4xl font-bold text-amber-600">
            {custoCombustivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Linha reta: {straightLine.toLocaleString('pt-BR')} km · Ônibus (~60 km/h): {formatHoras(road, 60)} · Consumo base: {consumoPadrao} km/l a R$ {precoPadrao.toFixed(2).replace('.', ',')}
      </p>

      {/* ================================================================= */}
      {/* CTA CONVERSÃO — Widget de Contexto de Viagem (glassmorphism)       */}
      {/* Texto dinâmico com nomes das cidades + ?distancia= prefill         */}
      {/* ================================================================= */}
      <Link
        href={`/utilidades/calculadora-combustivel?distancia=${road}&origem=${encodeURIComponent(origin.n)}&destino=${encodeURIComponent(dest.n)}`}
        className="group relative block w-full mb-10 p-6 rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 overflow-hidden"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Decorative fuel icon background */}
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 select-none pointer-events-none">⛽</div>

        <div className="relative flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-md">
            🚗
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-bold text-gray-900 mb-1">
              Vai viajar de {origin.n} para {dest.n}?
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Calcule o <strong>gasto exato de combustível</strong> e saiba quanto vai gastar na ponta do lápis.
              Informe o consumo do seu carro e o preço na bomba — os <strong>{road.toLocaleString('pt-BR')} km</strong> já estarão preenchidos.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md group-hover:bg-blue-700 group-hover:shadow-lg transition-all">
              Calcular gasto
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* Detalhes adicionais da viagem */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-slate-500 mb-1">Ônibus (~60 km/h)</p>
          <p className="text-xl font-bold text-slate-700">{formatHoras(road, 60)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-slate-500 mb-1">Litros necessários</p>
          <p className="text-xl font-bold text-slate-700">{litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} L</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-slate-500 mb-1">Ida e volta</p>
          <p className="text-xl font-bold text-slate-700">{(road * 2).toLocaleString('pt-BR')} km</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-slate-500 mb-1">Custo ida+volta</p>
          <p className="text-xl font-bold text-slate-700">
            {(custoCombustivel * 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      {/* CTAs secundários */}
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

        <h3>Custo de combustível de {origin.n} a {dest.n}</h3>
        <p>
          Para estimar o gasto de gasolina, usamos valores de referência: consumo médio de {consumoPadrao} km/l
          e preço de R$ {precoPadrao.toFixed(2).replace('.', ',')} por litro. Com esses parâmetros, a viagem
          de {origin.n} a {dest.n} consome aproximadamente{' '}
          <strong>{litros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} litros</strong>, custando{' '}
          <strong>{custoCombustivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> só de ida.
          Para um cálculo personalizado com o consumo real do seu veículo,{' '}
          <Link href={`/utilidades/calculadora-combustivel?distancia=${road}`} className="text-blue-600 hover:underline font-semibold">
            use nossa calculadora de combustível
          </Link>.
        </p>

        <h3>Tempo de viagem</h3>
        <p>
          Os tempos de viagem são estimativas baseadas em velocidades médias e não consideram paradas, trânsito,
          pedágios ou condições da via. De carro a ~80 km/h, a viagem leva cerca de <strong>{formatHoras(road, 80)}</strong>.
          De ônibus a ~60 km/h, espere cerca de <strong>{formatHoras(road, 60)}</strong>. Para a rota exata,
          recomendamos conferir também no Google Maps.
        </p>
      </article>

      {/* ================================================================= */}
      {/* FAQ VISÍVEL — Perguntas Frequentes com <details>                   */}
      {/* ================================================================= */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5 group"
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary className="font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>{item.name}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="text-slate-600 mt-3 leading-relaxed">{item.text}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* FERRAMENTAS RELACIONADAS — Cross-sell / Interlinking               */}
      {/* ================================================================= */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ferramentas úteis para sua viagem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/utilidades/calculadora-combustivel?distancia=${road}`}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">⛽</span>
            <div>
              <p className="font-semibold text-slate-800">Calculadora de Combustível</p>
              <p className="text-xs text-slate-500">Calcule o gasto com seu consumo real</p>
            </div>
          </Link>
          <Link
            href="/localizacao/distancia-cidades"
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="font-semibold text-slate-800">Calcular outra distância</p>
              <p className="text-xs text-slate-500">Qualquer cidade do Brasil</p>
            </div>
          </Link>
          <Link
            href="/financeiro/tabela-fipe"
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🚗</span>
            <div>
              <p className="font-semibold text-slate-800">Tabela FIPE</p>
              <p className="text-xs text-slate-500">Consulte o valor do seu veículo</p>
            </div>
          </Link>
          <Link
            href="/financeiro/financiamento-carro"
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-semibold text-slate-800">Financiamento de Carro</p>
              <p className="text-xs text-slate-500">Simule parcelas e taxas</p>
            </div>
          </Link>
          <Link
            href="/utilidades/conversor-unidades"
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">📐</span>
            <div>
              <p className="font-semibold text-slate-800">Conversor de Unidades</p>
              <p className="text-xs text-slate-500">Km, milhas, litros, galões...</p>
            </div>
          </Link>
          <Link
            href="/utilidades/dias-uteis"
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-slate-800">Dias Úteis</p>
              <p className="text-xs text-slate-500">Calcule prazos de entrega/frete</p>
            </div>
          </Link>
        </div>
      </section>

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
