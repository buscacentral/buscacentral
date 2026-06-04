import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorCPFClient from './GeradorCPFClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de CPF',
  'Gere CPFs válidos e formatados para testes e desenvolvimento. CPFs fictícios com algoritmo real de dígito verificador.',
  '/documentos/gerador-cpf'
);

export default function GeradorCPF() {
  return (
    <ToolPageLayout
      title="Gerador de CPF"
      description="Gere CPFs válidos e formatados para uso em testes e desenvolvimento de software."
      ariaLabel="Gerador de CPF interativo"
    >
      <GeradorCPFClient />
    </ToolPageLayout>
  );
}
