import type { Metadata } from 'next';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { searchTools } from '@/lib/tools';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const title = query
    ? `Busca por "${query}"`
    : 'Buscar ferramentas';

  return {
    title,
    description: query
      ? `Resultados da busca por "${query}" entre as ferramentas gratuitas do BuscaCentral.`
      : 'Busque entre todas as ferramentas online gratuitas do BuscaCentral: geradores, validadores, calculadoras e mais.',
    alternates: {
      canonical: 'https://buscacentral.com.br/buscar',
    },
    // Páginas de resultados de busca não devem ser indexadas (conteúdo dinâmico),
    // mas os links devem ser seguidos.
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const results = searchTools(query);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {query ? `Resultados para "${query}"` : 'Buscar ferramentas'}
        </h1>
        <p className="text-gray-600 text-lg">
          {query
            ? `${results.length} ${results.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}.`
            : 'Digite o nome de uma ferramenta, categoria ou palavra-chave.'}
        </p>
      </header>

      <div className="mb-10">
        <SearchBar placeholder="Buscar ferramenta..." />
      </div>

      {query && results.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-slate-800 mb-2">
            Nenhuma ferramenta encontrada para &quot;{query}&quot;.
          </p>
          <p className="text-slate-600 mb-6">
            Tente outro termo ou explore nossas categorias.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/documentos" className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors">Documentos</Link>
            <Link href="/financeiro" className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors">Financeiro</Link>
            <Link href="/localizacao" className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors">Localização</Link>
            <Link href="/utilidades" className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors">Utilidades</Link>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((tool) => (
            <li key={tool.path}>
              <Link
                href={tool.path}
                className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all h-full"
              >
                <span className="text-xs font-bold text-blue-700 bg-white border border-blue-100 px-3 py-1 rounded-full tracking-wide uppercase whitespace-nowrap">
                  {tool.category}
                </span>
                <span className="font-semibold text-slate-900">{tool.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
