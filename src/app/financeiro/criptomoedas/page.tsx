import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CriptomoedasClient from './CriptomoedasClient';

export const metadata: Metadata = generateToolMetadata(
  'Criptomoedas',
  'Cotação das principais criptomoedas em tempo real: Bitcoin, Ethereum, BNB, Solana e mais. Variação 24h.',
  '/financeiro/criptomoedas'
);

export default function Criptomoedas() {
  return (
    <ToolPageLayout
      title="Criptomoedas"
      description="Top 10 criptomoedas por valor de mercado com cotação em tempo real."
      ariaLabel="Cotação de criptomoedas interativa"
    >
      <CriptomoedasClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre as criptomoedas</h2>
        <p>
          Os dados são obtidos em tempo real através da API do CoinGecko, uma das maiores 
          plataformas de dados de criptomoedas do mundo. A tabela mostra as 10 maiores 
          criptomoedas por valor de mercado, com preços em Reais (BRL).
        </p>
      </article>
    </ToolPageLayout>
  );
}
