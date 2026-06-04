import type { Metadata } from 'next';
import ProdutosClient from './ProdutosClient';

export const metadata: Metadata = {
  title: 'Busca de Produtos - Compare Preços no Mercado Livre',
  description: 'Busque e compare preços de milhões de produtos do Mercado Livre. Encontre as melhores ofertas gratuitamente.',
  openGraph: {
    title: 'Busca de Produtos | BuscaCentral',
    description: 'Busque e compare preços de milhões de produtos do Mercado Livre. Encontre as melhores ofertas gratuitamente.',
    url: 'https://buscacentral.com.br/produtos',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Busca de Produtos | BuscaCentral',
    description: 'Busque e compare preços de milhões de produtos do Mercado Livre.',
  },
  alternates: {
    canonical: 'https://buscacentral.com.br/produtos',
  },
};

export default function ProdutosPage() {
  return <ProdutosClient />;
}
