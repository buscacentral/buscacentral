import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import PIXCopiaColaClient from './PIXCopiaColaClient';

export const metadata: Metadata = generateToolMetadata(
  'PIX Copia e Cola',
  'Gere códigos PIX no padrão EMV para recebimentos. Copia e cola para qualquer banco.',
  '/utilidades/pix-copia-cola'
);

export default function PIXCopiaCola() {
  return (
    <ToolPageLayout
      title="PIX Copia e Cola"
      description="Gere códigos PIX no padrão EMV para recebimentos. Copia e cola para qualquer banco."
      ariaLabel="Gerador de PIX copia e cola interativo"
    >
      <PIXCopiaColaClient />
    </ToolPageLayout>
  );
}
