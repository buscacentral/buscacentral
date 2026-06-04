import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CotacaoClient from './CotacaoClient';

export const metadata: Metadata = generateToolMetadata(
  'Cotação de Moedas',
  'Cotação de moedas em tempo real: dólar, euro, libra, peso argentino e mais. Dados da AwesomeAPI atualizados 24h.',
  '/financeiro/cotacao'
);

export default function Cotacao() {
  return (
    <ToolPageLayout
      title="Cotação de Moedas"
      description="Cotações em tempo real das principais moedas estrangeiras em relação ao Real."
      ariaLabel="Cotação de moedas interativa"
    >
      <CotacaoClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre as cotações</h2>
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
      </article>
    </ToolPageLayout>
  );
}
