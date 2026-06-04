import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorUUIDClient from './GeradorUUIDClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de UUID',
  'Gere UUIDs v4 aleatórios para identificadores únicos em sistemas e bancos de dados.',
  '/utilidades/gerador-uuid'
);

export default function GeradorUUID() {
  return (
    <ToolPageLayout
      title="Gerador de UUID"
      description="Gere UUIDs v4 aleatórios para identificadores únicos em sistemas e bancos de dados."
      ariaLabel="Gerador de UUID interativo"
    >
      <GeradorUUIDClient />
    </ToolPageLayout>
  );
}
