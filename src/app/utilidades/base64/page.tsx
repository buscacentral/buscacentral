import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import Base64Client from './Base64Client';

export const metadata: Metadata = generateToolMetadata(
  'Codificador Base64',
  'Codifique ou decodifique textos em Base64. Conversão rápida e gratuita para URLs, emails e APIs.',
  '/utilidades/base64'
);

export default function Base64() {
  return (
    <ToolPageLayout
      title="Codificador Base64"
      description="Codifique ou decodifique textos em Base64. Conversão rápida e gratuita para URLs, emails e APIs."
      ariaLabel="Codificador Base64 interativo"
    >
      <Base64Client />
    </ToolPageLayout>
  );
}
