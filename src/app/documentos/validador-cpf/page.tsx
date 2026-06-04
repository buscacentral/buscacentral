import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ValidadorCPFClient from './ValidadorCPFClient';

export const metadata: Metadata = generateToolMetadata(
  'Validador de CPF',
  'Verifique se um CPF é válido usando o algoritmo oficial de dígito verificador da Receita Federal.',
  '/documentos/validador-cpf'
);

export default function ValidadorCPF() {
  return (
    <ToolPageLayout
      title="Validador de CPF"
      description="Verifique se um CPF é válido usando o algoritmo oficial de cálculo dos dígitos verificadores."
      ariaLabel="Validador de CPF interativo"
    >
      <ValidadorCPFClient />
    </ToolPageLayout>
  );
}
