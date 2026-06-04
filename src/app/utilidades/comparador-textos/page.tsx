import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ComparadorTextosClient from './ComparadorTextosClient';

export const metadata: Metadata = generateToolMetadata(
  'Comparador de Textos',
  'Compare dois textos e veja as diferenças destacadas. Ideal para revisão de documentos e código.',
  '/utilidades/comparador-textos'
);

export default function ComparadorTextos() {
  return (
    <ToolPageLayout
      title="Comparador de Textos"
      description="Compare dois textos e veja as diferenças destacadas. Ideal para revisão de documentos e código."
      ariaLabel="Comparador de textos interativo"
    >
      <ComparadorTextosClient />
    </ToolPageLayout>
  );
}
