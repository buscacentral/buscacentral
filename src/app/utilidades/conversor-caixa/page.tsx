import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConversorCaixaClient from './ConversorCaixaClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Caixa',
  'Converta texto entre maiúsculo, minúsculo, capitalizado e alternado. Transformação instantânea e gratuita.',
  '/utilidades/conversor-caixa'
);

export default function ConversorCaixa() {
  return (
    <ToolPageLayout
      title="Conversor de Caixa"
      description="Converta texto entre maiúsculo, minúsculo, capitalizado e alternado. Transformação instantânea e gratuita."
      ariaLabel="Conversor de caixa de texto interativo"
    >
      <ConversorCaixaClient />
    </ToolPageLayout>
  );
}
