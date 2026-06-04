import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import TimestampClient from './TimestampClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Timestamp',
  'Converta entre timestamp Unix e data/hora legível. Conversão bidirecional instantânea.',
  '/utilidades/timestamp'
);

export default function Timestamp() {
  return (
    <ToolPageLayout
      title="Conversor de Timestamp"
      description="Converta entre timestamp Unix e data/hora legível. Conversão bidirecional instantânea."
      ariaLabel="Conversor de timestamp interativo"
    >
      <TimestampClient />
    </ToolPageLayout>
  );
}
