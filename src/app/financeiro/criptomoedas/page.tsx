import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CriptomoedasClient from './CriptomoedasClient';

export const metadata: Metadata = generateToolMetadata(
  'Criptomoedas',
  'Top 50 criptomoedas por valor de mercado com cotação em tempo real, gráficos 7 dias, calculadora de lucro e Fear & Greed Index.',
  '/financeiro/criptomoedas'
);

export default function Criptomoedas() {
  return (
    <ToolPageLayout
      title="Criptomoedas"
      description="Top 50 criptomoedas com cotação em tempo real, gráficos, calculadora de lucro e Fear & Greed Index."
      ariaLabel="Cotação de criptomoedas interativa"
    >
      <CriptomoedasClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre as criptomoedas</h2>
        <p>
          Os dados são obtidos em tempo real através da API do CoinGecko, uma das maiores
          plataformas de dados de criptomoedas do mundo. A tabela mostra as 50 maiores
          criptomoedas por valor de mercado, com preços em Reais (BRL). O Fear &amp; Greed Index
          é fornecido pela Alternative.me e indica o sentimento atual do mercado.
        </p>
      </article>
    </ToolPageLayout>
  );
}
