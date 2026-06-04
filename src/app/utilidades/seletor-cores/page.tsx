import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import SeletorCoresClient from './SeletorCoresClient';

export const metadata: Metadata = generateToolMetadata(
  'Seletor de Cores',
  'Escolha e combine cores em HEX, RGB e HSL. Gere paletas e esquemas para seus projetos.',
  '/utilidades/seletor-cores'
);

export default function SeletorCores() {
  return (
    <ToolPageLayout
      title="Seletor de Cores"
      description="Escolha e combine cores em HEX, RGB e HSL. Gere paletas e esquemas para seus projetos."
      ariaLabel="Seletor de cores interativo"
    >
      <SeletorCoresClient />
    </ToolPageLayout>
  );
}
