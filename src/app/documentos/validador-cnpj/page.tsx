import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ValidadorCNPJClient from './ValidadorCNPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Validador de CNPJ',
  'Valide CNPJs com verificação oficial de dígito verificador. Confira se o formato está correto.',
  '/documentos/validador-cnpj'
);

export default function ValidadorCNPJ() {
  return (
    <ToolPageLayout
      title="Validador de CNPJ"
      description="Verifique se um CNPJ é válido usando o algoritmo oficial de cálculo dos dígitos verificadores."
      ariaLabel="Validador de CNPJ interativo"
    >
      <ValidadorCNPJClient />
    </ToolPageLayout>
  );
}
