import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import RastreioClient from './RastreioClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = {
  title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
  description: 'Rastreie suas encomendas e pacotes dos Correios em tempo real. Veja o histórico de entrega completo com atualizações instantâneas e gratuitas.',
  keywords: [
    'rastreio correios', 'rastrear encomenda', 'rastreador pacotes',
    'codigo rastreio', 'rastreamento encomendas', 'onde está meu pacote',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/rastreio' },
  openGraph: {
    title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
    description: 'Rastreie suas encomendas dos Correios em tempo real. Histórico de entrega completo e gratuito.',
    url: 'https://buscacentral.com.br/utilidades/rastreio',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
    description: 'Rastreie suas encomendas dos Correios em tempo real. Histórico de entrega completo e gratuito.',
  },
};

export default function RastreioPage() {
  return (
    <ToolPageLayout
      title="Rastreador de Encomendas"
      description="Acompanhe seus pacotes dos Correios em tempo real com atualizações instantâneas."
      ariaLabel="Rastreador de encomendas interativo"
    >
      <RastreioClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o rastreamento?</h2>
        <p>
          O rastreador do BuscaCentral utiliza a BrasilAPI, que consolida dados logísticos
          dos Correios e outras transportadoras. Basta digitar o código de rastreio (ex: BR123456789BR)
          para ver o histórico completo de movimentações do seu pacote.
        </p>
      </section>

      <LinksRelacionados categoria="utilidades" paginaAtual="/utilidades/rastreio" />
    </ToolPageLayout>
  );
}
