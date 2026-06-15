import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Artigos e Guias | BuscaCentral',
  description: 'Leia nossos artigos e guias práticos sobre documentos, finanças, produtividade e muito mais.',
};

const artigos = [
  {
    slug: 'o-que-e-uuid-e-por-que-e-seguro',
    title: 'O que é um UUID e por que ele é seguro?',
    excerpt: 'Entenda como funcionam os Identificadores Únicos Universais, por que eles são vitais para o desenvolvimento de software e a probabilidade quase nula de uma colisão.',
    date: '15 de Junho, 2026',
    category: 'Tecnologia'
  },
  {
    slug: 'como-funciona-tabela-fipe',
    title: 'Como funciona a Tabela FIPE na prática?',
    excerpt: 'Descubra como a Fundação Instituto de Pesquisas Econômicas calcula o preço médio dos veículos no Brasil e como usar isso a seu favor na hora da negociação.',
    date: '14 de Junho, 2026',
    category: 'Financeiro'
  },
  {
    slug: 'diferenca-clt-e-pj',
    title: 'CLT vs PJ: Qual vale mais a pena?',
    excerpt: 'Um guia completo e prático sobre os prós e contras de trabalhar com carteira assinada versus abrir a própria empresa e faturar como Pessoa Jurídica.',
    date: '10 de Junho, 2026',
    category: 'Trabalhista'
  },
  {
    slug: 'por-que-empresas-precisam-gerar-cpf-para-testes',
    title: 'Por que empresas precisam gerar CPF para testes?',
    excerpt: 'Descubra por que o uso de CPFs reais em ambientes de teste é um risco de segurança e como os geradores ajudam empresas a validarem seus sistemas de forma ética.',
    date: '15 de Junho, 2026',
    category: 'Desenvolvimento'
  },
  {
    slug: 'juros-compostos-o-segredo-dos-investimentos',
    title: 'Juros Compostos: O segredo para multiplicar seu patrimônio',
    excerpt: 'Entenda como a mágica dos juros sobre juros funciona e como o tempo é o seu maior aliado na construção de riqueza a longo prazo.',
    date: '16 de Junho, 2026',
    category: 'Financeiro'
  },
  {
    slug: 'tamanho-ideal-textos-seo-redes-sociais',
    title: 'SEO e Textos: O tamanho ideal para cada rede social',
    excerpt: 'Saber a quantidade exata de caracteres para o Twitter, Instagram, SEO (Meta Titles) e anúncios faz toda a diferença no seu engajamento.',
    date: '16 de Junho, 2026',
    category: 'Marketing'
  }
];

export default function ArtigosPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Artigos e Guias Práticos</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Aprenda a otimizar sua vida financeira, usar nossos geradores corretamente e entender os bastidores da tecnologia.
          </p>
        </header>

        <div className="grid gap-8">
          {artigos.map((artigo) => (
            <article key={artigo.slug} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {artigo.category}
                </span>
                <time className="text-slate-500 text-sm font-medium">{artigo.date}</time>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                <Link href={`/artigos/${artigo.slug}`} className="hover:text-blue-600 transition-colors">
                  {artigo.title}
                </Link>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {artigo.excerpt}
              </p>
              <Link 
                href={`/artigos/${artigo.slug}`} 
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
              >
                Ler artigo completo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
