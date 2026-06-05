import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import TabelaCaloriasClient from './TabelaCaloriasClient';
import AvisoSaude from '@/components/AvisoSaude';

export const metadata: Metadata = generateToolMetadata(
  'Tabela de Calorias',
  'Consulte calorias e nutrientes de 200 alimentos brasileiros baseados na tabela TACO do IBGE.',
  '/utilidades/tabela-calorias'
);

export default function TabelaCalorias() {
  return (
    <ToolPageLayout
      title="Tabela de Calorias"
      description="Consulte calorias e nutrientes de 200 alimentos brasileiros baseados na tabela TACO do IBGE."
      ariaLabel="Tabela de calorias interativa"
    >
      <TabelaCaloriasClient />
      <AvisoSaude />
    </ToolPageLayout>
  );
}
