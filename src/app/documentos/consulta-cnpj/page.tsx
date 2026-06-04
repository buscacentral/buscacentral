import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConsultaCNPJClient from './ConsultaCNPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Consulta CNPJ',
  'Consulte dados de empresas pela Receita Federal: razão social, situação cadastral, endereço e CNAE.',
  '/documentos/consulta-cnpj'
);

export default function ConsultaCNPJ() {
  return (
    <ToolPageLayout
      title="Consulta CNPJ"
      description="Consulte gratuitamente os dados cadastrais de qualquer empresa brasileira diretamente da base da Receita Federal."
      ariaLabel="Consulta de CNPJ interativa"
    >
      <ConsultaCNPJClient />
    </ToolPageLayout>
  );
}
