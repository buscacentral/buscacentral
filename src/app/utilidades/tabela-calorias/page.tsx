import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import TabelaCaloriasClient from './TabelaCaloriasClient';
import AvisoSaude from '@/components/AvisoSaude';

export const metadata: Metadata = {
  title: 'Tabela de Calorias dos Alimentos — Guia de Nutrição Prático | BuscaCentral',
  description: 'Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para planejar refeições e acompanhar seu estilo de vida saudável.',
  keywords: ['tabela calorias', 'calorias alimentos', 'nutrição', 'alimentação saudável', 'bem-estar', 'TACO'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/tabela-calorias' },
  openGraph: {
    title: 'Tabela de Calorias dos Alimentos — Guia de Nutrição Prático | BuscaCentral',
    description: 'Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para estilo de vida saudável.',
    url: 'https://buscacentral.com.br/utilidades/tabela-calorias',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function TabelaCalorias() {
  return (
    <ToolPageLayout
      title="Tabela de Calorias"
      description="Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para planejar refeições."
      ariaLabel="Tabela de calorias interativa"
    >
      <TabelaCaloriasClient />
      <AvisoSaude />
    </ToolPageLayout>
  );
}
