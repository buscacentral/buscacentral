import type { Metadata } from 'next';
import AdPlaceholder from './AdPlaceholder';

interface ToolPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  ariaLabel?: string;
  showMiddleAd?: boolean;
}

/**
 * ToolPageLayout - Template base para páginas de ferramentas
 * 
 * Estrutura semântica:
 * - <article> como container principal da ferramenta
 * - <section> com aria-label para cada área
 * - Hierarquia de headings correta (h1 único)
 * - Prevenção de CLS para anúncios
 * 
 * Uso:
 * ```tsx
 * export const metadata: Metadata = {
 *   title: 'Gerador de CPF',
 *   description: 'Gere CPFs válidos para testes.',
 *   openGraph: {
 *     title: 'Gerador de CPF | BuscaCentral',
 *     description: 'Gere CPFs válidos para testes.',
 *     url: 'https://buscacentral.com.br/documentos/gerador-cpf',
 *     type: 'website',
 *   },
 * };
 * 
 * export default function GeradorCPF() {
 *   return (
 *     <ToolPageLayout
 *       title="Gerador de CPF"
 *       description="Gere CPFs válidos para testes."
 *       ariaLabel="Gerador de CPF interativo"
 *     >
 *       {/* Seu conteúdo aqui *\/}
 *     </ToolPageLayout>
 *   );
 * }
 * ```
 */
export default function ToolPageLayout({
  children,
  title,
  description,
  ariaLabel,
  showMiddleAd = true,
}: ToolPageLayoutProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Cabeçalho da ferramenta */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </header>

      {/* Área interativa da ferramenta */}
      <section
        id="interactive-tool"
        aria-label={ariaLabel || title}
        className="mb-8"
      >
        {children}
      </section>

      {/* Anúncio do meio da página com prevenção de CLS */}
      {showMiddleAd && (
        <div className="ads-wrapper" style={{ minHeight: '250px' }}>
          <AdPlaceholder position="middle" />
        </div>
      )}

      {/* Seção de conteúdo SEO */}
      <section
        id="seo-content"
        aria-label="Informações sobre a ferramenta"
        className="mt-12"
      >
        {/* O conteúdo SEO específico de cada ferramenta fica aqui */}
      </section>
    </article>
  );
}

/**
 * Gera metadados Open Graph para uma página de ferramenta
 * 
 * @param title - Título da ferramenta
 * @param description - Descrição da ferramenta (150-160 caracteres)
 * @param path - Caminho da página (ex: /documentos/gerador-cpf)
 * @returns Metadata object para Next.js
 */
export function generateToolMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const fullTitle = `${title} | BuscaCentral`;
  const url = `https://buscacentral.com.br${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'BuscaCentral',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
