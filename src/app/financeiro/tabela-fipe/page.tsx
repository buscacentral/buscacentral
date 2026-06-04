import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import TabelaFipeClient from './TabelaFipeClient';

export const metadata: Metadata = generateToolMetadata(
  'Tabela FIPE',
  'Consulte preços médios de veículos novos e usados pela Tabela FIPE. Carros, motos e caminhonetes.',
  '/financeiro/tabela-fipe'
);

export default function TabelaFIPE() {
  return (
    <ToolPageLayout
      title="Tabela FIPE"
      description="Consulte preços médios de veículos pela Tabela FIPE oficial."
      ariaLabel="Consulta de Tabela FIPE interativa"
    >
      <TabelaFipeClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é a Tabela FIPE?</h2>
        <p>
          A Tabela FIPE é um referencial de preços médios de veículos no Brasil, produzido pela 
          Fundação Instituto de Pesquisas Econômicas (FIPE) da Universidade de São Paulo (USP). 
          É amplamente usada por seguradoras, financiadoras e consumidores para avaliar veículos.
        </p>
        <h2>Como os preços são calculados?</h2>
        <p>
          Os valores são baseados em pesquisas de mercado realizadas mensalmente, considerando 
          veículos zero quilômetro e usados. A tabela é atualizada mensalmente e reflete os 
          preços praticados no mercado brasileiro.
        </p>
      </article>
    </ToolPageLayout>
  );
}
