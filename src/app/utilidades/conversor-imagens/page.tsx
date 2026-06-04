import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConversorImagensClient from './ConversorImagensClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Imagens',
  'Converta imagens entre WebP, PNG e JPG diretamente no navegador. Sem upload, processamento local.',
  '/utilidades/conversor-imagens'
);

export default function ConversorImagens() {
  return (
    <ToolPageLayout
      title="Conversor de Imagens"
      description="Converta imagens entre WebP, PNG e JPG diretamente no navegador. Sem upload, processamento local."
      ariaLabel="Conversor de imagens interativo"
    >
      <ConversorImagensClient />
    </ToolPageLayout>
  );
}
