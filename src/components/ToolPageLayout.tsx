import type { Metadata } from 'next';
import Link from 'next/link';
import AdPlaceholder from './AdPlaceholder';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  title: string;
  url: string;
  description: string;
}

interface ToolPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  ariaLabel?: string;
  showMiddleAd?: boolean;
  seoContent?: React.ReactNode;
  faqItems?: FAQItem[];
  relatedTools?: RelatedTool[];
  path?: string;
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
  seoContent,
  faqItems,
  relatedTools,
  path,
}: ToolPageLayoutProps) {
  const url = path ? `https://buscacentral.com.br${path}` : 'https://buscacentral.com.br';
  
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "url": url
  };

  const faqSchema = faqItems && faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
      {seoContent && (
        <section
          id="seo-content"
          aria-label="Informações sobre a ferramenta"
          className="mt-12"
        >
          {seoContent}
        </section>
      )}

      {/* Ferramentas Relacionadas */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, idx) => (
              <Link 
                key={idx} 
                href={tool.url}
                className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
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
