import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ContadorCaracteresClient from './ContadorCaracteresClient';

export const metadata: Metadata = generateToolMetadata(
  'Contador de Caracteres',
  'Conte caracteres, palavras, linhas e parágrafos em qualquer texto. Ideal para redação e SEO.',
  '/utilidades/contador-caracteres'
);

export default function ContadorCaracteres() {
  return (
    <ToolPageLayout
      title="Contador de Caracteres"
      description="Conte caracteres, palavras, linhas e parágrafos em qualquer texto. Ideal para redação e SEO."
      ariaLabel="Contador de caracteres interativo"
    >
      <ContadorCaracteresClient />
    </ToolPageLayout>
  );
}
