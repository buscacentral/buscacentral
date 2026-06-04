import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import RemovedorDuplicatasClient from './RemovedorDuplicatasClient';

export const metadata: Metadata = generateToolMetadata(
  'Removedor de Duplicatas',
  'Remova linhas duplicadas de listas e ordene alfabeticamente. Limpe dados rapidamente.',
  '/utilidades/removedor-duplicatas'
);

export default function RemovedorDuplicatas() {
  return (
    <ToolPageLayout
      title="Removedor de Duplicatas"
      description="Remova linhas duplicadas de listas e ordene alfabeticamente. Limpe dados rapidamente."
      ariaLabel="Removedor de duplicatas interativo"
    >
      <RemovedorDuplicatasClient />
    </ToolPageLayout>
  );
}
