import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CotacaoClient from './CotacaoClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = {
  title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
  description: 'Cotação do Dólar Comercial, Euro e Libra Esterlina hoje em tempo real em Reais (BRL). Conversor bidirecional gratuito, tabelas de conversão rápida e dados da AwesomeAPI atualizados a cada minuto.',
  keywords: [
    'cotação dólar hoje', 'cotação euro hoje', 'cotação libra hoje',
    'dólar comercial tempo real', 'euro real', 'libra esterlina real',
    'conversor moeda', 'cotação moedas hoje', 'AwesomeAPI',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/financeiro/cotacao' },
  openGraph: {
    title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
    description: 'Cotação do Dólar Comercial, Euro e Libra Esterlina hoje em tempo real. Conversor bidirecional gratuito e dados atualizados a cada minuto.',
    url: 'https://buscacentral.com.br/financeiro/cotacao',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
    description: 'Cotação do Dólar Comercial, Euro e Libra Esterlina hoje em tempo real. Conversor bidirecional gratuito.',
  },
};

export default function Cotacao() {
  return (
    <ToolPageLayout
      title="Cotação do Dólar, Euro e Libra em Tempo Real"
      description="Cotações em tempo real das principais moedas estrangeiras em relação ao Real Brasileiro."
      ariaLabel="Cotação de moedas interativa"
    >
      <CotacaoClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre as cotações de moedas</h2>
        <p>
          As cotações são obtidas em tempo real através da AwesomeAPI, uma das principais APIs
          de economia do Brasil. Os valores representam a cotação de compra (bid) e venda (ask)
          das moedas em relação ao Real Brasileiro (BRL).
        </p>
        <h2>Por que as cotações mudam?</h2>
        <p>
          As cotações de moedas são influenciadas por diversos fatores econômicos, como inflação,
          taxa de juros, balança comercial e cenário político. A atualização automática a cada
          minuto garante que você sempre tenha os valores mais recentes.
        </p>
      </section>

      <LinksRelacionados categoria="financeiro" paginaAtual="/financeiro/cotacao" />
    </ToolPageLayout>
  );
}
