import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorCNPJClient from './GeradorCNPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de CNPJ',
  'Gere CNPJs válidos e formatados para testes de sistemas e desenvolvimento. CNPJ com dígito verificador correto.',
  '/documentos/gerador-cnpj'
);

export default function GeradorCNPJ() {
  return (
    <ToolPageLayout
      title="Gerador de CNPJ"
      description="Gere CNPJs válidos e formatados para uso em testes e desenvolvimento de sistemas."
      ariaLabel="Gerador de CNPJ interativo"
    >
      <GeradorCNPJClient />
    </ToolPageLayout>
  );
}
